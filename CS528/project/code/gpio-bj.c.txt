#include <linux/init.h>
#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/device.h>
#include <linux/fs.h>
#include <linux/uaccess.h>
#include <linux/mutex.h> // protect the device so it can only be used by
                         // 1 user at a time

#include <linux/gpio.h>

#define DEVICE_NAME "bjrpi" // device will appear at /dev/bjrpi
#define CLASS_NAME  "bj"    // device class name (for /sys/class)

MODULE_LICENSE("GPL");
MODULE_AUTHOR("BJ Blair");
MODULE_DESCRIPTION("Hello World Driver for RPI");
MODULE_VERSION("0.1");

static DEFINE_MUTEX(bjrpi_mutex); // creates a new semaphore variable,
                                  // defaults to 1 (unlocked), to start
                                  // with locked (0) use DEFINE_MUTEX_LOCKED

#define NUM_PINS 5
const unsigned int gpio_pins[] = {
    21, 20, 16, 25, 24
};
    
static struct gpio pins[] = {
    { 21, GPIOF_OUT_INIT_LOW, "BinaryPin1" },
    { 20, GPIOF_OUT_INIT_LOW, "BinaryPin2" },
    { 16, GPIOF_OUT_INIT_LOW, "BinaryPin3" },
    { 25, GPIOF_OUT_INIT_LOW, "BinaryPin4" },
    { 24, GPIOF_OUT_INIT_LOW, "BinaryPin5" },
};

static unsigned int last_num = 0; // the last number to have been written
                                  // to the device

static int major_number;        // device number, determined automatically
static char message[256] = {0}; // store message from userspace
static short message_size;      // how long the message is
static int   num_opens = 0;     // how many times the device has been opened
static struct class  *bjrpi_class  = NULL; // class pointer
static struct device *bjrpi_device = NULL; // device pointer

/* Function prototypes for IO operations */
static int bjrpi_open(struct inode *, struct file *);
static int bjrpi_release(struct inode *, struct file *);
static ssize_t bjrpi_read(struct file *, char *, size_t, loff_t *);
static ssize_t bjrpi_write(struct file *, const char *, size_t, loff_t *);

static int __init bjrpi_init(void);
static void __exit bjrpi_exit(void);

/* Structure defining functions for IO operations */
static struct file_operations fops = {
    .open = bjrpi_open,
    .read = bjrpi_read,
    .write = bjrpi_write,
    .release = bjrpi_release
};

static int __init bjrpi_init(void)
{
    int ret;

    printk(KERN_INFO "BJRPI: Initializing character LKM\n");

    /* Initialize the mutex lock dynamically at runtime */
    mutex_init(&bjrpi_mutex);

    /* Allocate a major driver number */
    major_number = register_chrdev(0, DEVICE_NAME, &fops);
    if (major_number < 0) {
        printk(KERN_ALERT "BJRPI: Failed to register major driver number\n");
        return major_number;
    }
    printk(KERN_INFO "BJRPI: Registered major number %d\n", major_number);

    /* Register the device class */
    bjrpi_class = class_create(THIS_MODULE, CLASS_NAME);
    if (IS_ERR(bjrpi_class)) {
        unregister_chrdev(major_number, DEVICE_NAME);
        printk(KERN_ALERT "BJRPI: Failed to register device class\n");
        return PTR_ERR(bjrpi_class);
    }
    printk(KERN_INFO "BJRPI: Registerd device class\n");


    /* Register the device driver */
    bjrpi_device = device_create(
        bjrpi_class, 
        NULL, 
        MKDEV(major_number, 0), 
        NULL, 
        DEVICE_NAME
    );
    if (IS_ERR(bjrpi_device)) {
        printk(KERN_ALERT "BJRPI: Failed to create device\n");
        class_destroy(bjrpi_class);
        unregister_chrdev(major_number, DEVICE_NAME);
        return PTR_ERR(bjrpi_device);
    }
    printk(KERN_INFO "BJRPI: Device class created correctly\n");

    /* Init the GPIO pins */
    ret = gpio_request_array(pins, NUM_PINS);
    if (ret < 0) {
        printk(KERN_WARNING "BJRPI: Bad GPIO requests!\n");
        return -EINVAL;
    }

    return 0;
}

static void __exit bjrpi_exit(void)
{
    mutex_destroy(&bjrpi_mutex);
    device_destroy(bjrpi_class, MKDEV(major_number, 0));
    class_unregister(bjrpi_class);
    class_destroy(bjrpi_class);
    unregister_chrdev(major_number, DEVICE_NAME);

    /* Free pins */
    gpio_free_array(pins, NUM_PINS);

    printk(KERN_INFO "BJRPI: Goodbye from LKM Device Driver!\n");
}

static int bjrpi_open(struct inode *inodep, struct file *fp)
{
    /* see if the device is available, and if so lock it */
    if (!mutex_trylock(&bjrpi_mutex)) {
        printk(KERN_ALERT "BJRPI: Device busy (checked mutex)\n");
        return -EBUSY;
    }

    num_opens++;
    printk(KERN_INFO "BJRPI: Device has been opened %d times\n", num_opens);
    return 0;
}

static ssize_t bjrpi_read(struct file *fp, char *buffer, size_t len, loff_t *offset)
{
    int error_count = 0;

    /* Copy our last read number to the message */
    sprintf(message, "%d", last_num);
    message_size = strlen(message);

    /* Copy what we've read in so far to the user */
    error_count = copy_to_user(buffer, message, message_size);

    /* Sucess */
    if (error_count == 0) {
        printk(KERN_INFO "BJRPI: Sent %d characters to the user\n", message_size);
        return (message_size = 0); // set the message size to 0 to start overwriting the buffer
    }
    /* Failure */
    else {
        printk(KERN_INFO "BJRPI: Failed to send %d characters to the user\n", error_count);
        return -EFAULT; // failed - return a bad address message
    }
}

static ssize_t bjrpi_write(struct file *fp, const char *buffer, size_t len, loff_t *offset)
{
    unsigned int i, num;

    sprintf(message, "%s", buffer);
    message_size = strlen(message);
    printk(KERN_INFO "BJRPI: Receieved %zu characters from the user\n", len);

    /* Hopefully get a number from the message */
    sscanf(message, "%d", &last_num);
    printk(KERN_INFO "BJRPI: Parsed num from message: %d\n", last_num);
    num = last_num;

    /* output the number to the gpios */
    for (i = 0; i < NUM_PINS; i++)
    {
        if (num & 1) {
            gpio_set_value(gpio_pins[i], 1);
        }
        else {
            gpio_set_value(gpio_pins[i], 0);
        }

        num >>= 1;
    }

    return len;
}

static int bjrpi_release(struct inode *indoep, struct file *filep)
{
    /* make the device available */
    mutex_unlock(&bjrpi_mutex);
    printk(KERN_INFO "BJRPI: Device sucessfully closed\n");
    return 0;
}

/* Register the module */
module_init(bjrpi_init);
module_exit(bjrpi_exit);



