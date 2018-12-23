/*
 *  linux/arch/arm/kernel/sys_arm.c
 *
 *  Copyright (C) People who wrote linux/arch/i386/kernel/sys_i386.c
 *  Copyright (C) 1995, 1996 Russell King.
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License version 2 as
 * published by the Free Software Foundation.
 *
 *  This file contains various random system calls that
 *  have a non-standard calling sequence on the Linux/arm
 *  platform.
 */
#include <linux/export.h>
#include <linux/errno.h>
#include <linux/sched.h>
#include <linux/mm.h>
#include <linux/sem.h>
#include <linux/msg.h>
#include <linux/shm.h>
#include <linux/stat.h>
#include <linux/syscalls.h>
#include <linux/mman.h>
#include <linux/fs.h>
#include <linux/file.h>
#include <linux/ipc.h>
#include <linux/uaccess.h>
#include <linux/slab.h>

/* BJ added */
#include <linux/gpio.h>

/* Initialize a pin to either input or output 
 * inOrOut: 1: input, 0: output */
asmlinkage int sys_bj_initpin(const unsigned int pin, int inOrOut)
{
    int ret;
    char pinName[50]; // the label for the pin

    /* Check if the pin is a valid pin number */
    if (unlikely(!gpio_is_valid(pin))) {
        printk(KERN_WARNING "BJ: Invalid GPIO pin: %d\n", pin);
        return -EINVAL;
    }

    printk("BJ: Initializing pin %d as %s\n",
            pin, (inOrOut) ? "input" : "output");

    /* Set the pinname */
    sprintf(pinName, "gpio%d", pin);

    /* Request the pin */
    ret = gpio_request(pin, pinName);
    if (ret < 0) {
        printk(KERN_WARNING "BJ: Bad GPIO request!\n");
        return -EINVAL;
        /* http://www-numi.fnal.gov/offline_software/srt_public_context/WebDocs/Errors/unix_system_errors.html
         */
    }
    
    /* 1/not zero: input */
    if (inOrOut) {
        ret = gpio_direction_input(pin);
    }
    /* Otherwise output */
    else {
        /* 0 means default the pin to `off`, if its
         * 1 then the pin will default to `on` */
        ret = gpio_direction_output(pin, 0);
    }

    /* Test for failure setting direction */
    if (ret < 0) {
        printk(KERN_WARNING "BJ: failed setting direction!\n");
        gpio_free(pin);
        return -EINVAL;
    }

    return 0;
}

/* Initialize pins to either input or output 
 * inOrOut: 1: input, 0: output */
asmlinkage int sys_bj_initpins(const struct gpio *pins, const unsigned int numPins)
{
    int i, ret;

    /* Verify all pins are valid */
    for (i = 0; i < numPins; i++)
    {
        if (unlikely(!gpio_is_valid((pins+i)->gpio))) {
            printk(KERN_WARNING "BJ: Invalid GPIO pin: %d\n", (pins+i)->gpio);
            return -EINVAL;
        }

        printk("BJ: Initializing pin %d with flag %X\n",
                (pins+i)->gpio, (pins+i)->flags);

    }

    /* Request the pins */
    ret = gpio_request_array(pins, numPins);
    if (ret < 0) {
        printk(KERN_WARNING "BJ: Bad GPIOs requests!\n");
        return -EINVAL;
        /* http://www-numi.fnal.gov/offline_software/srt_public_context/WebDocs/Errors/unix_system_errors.html
         */
    }

    return 0;
}

/* Set the value of a pin (assuming its been initialized) */
asmlinkage int sys_bj_setpin(const unsigned int pin, const unsigned int val)
{
    printk("Somebody called bj setpin: %d, val: %d\n", pin, val);
    
    /* Set the value of the pin */
    gpio_set_value(pin, val);

    return 0;
}

asmlinkage int sys_bj_getpin(const unsigned int pin)
{
    printk("Somebody called bj getpin: %d\n", pin);
    
    /* Get the value of the pin 
     * no error checking as its expected that initializing/
     * setting the value above does the error check */
    return gpio_get_value(pin);
}

asmlinkage void sys_bj_freepin(const unsigned int pin)
{
    printk("BJ: Somebody called freepin: %d\n", pin);

    gpio_free(pin);

    return;
}

asmlinkage void sys_bj_freepins(const struct gpio *pins, const unsigned int numPins)
{
    printk("BJ: somebody called freepins!\n");

    gpio_free_array(pins, numPins);

    return;
}

