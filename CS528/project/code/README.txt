Device Driver (gpio-bj.c)
-------------------------
To compile this module, copy `gpio-bj.c` to linux/drivers/gpio,
and then add the following line to linux/drivers/gpio/Makefile:

    obj-m += gpio-bj.o

You can then compile the module (assuming the rest of the kernel
has already been built) with

    make ARCH=arm CROSS_COMPILE=arm-linux-gnueabihf- modules

assuming you are cross compiling on your PC for the raspberry PI.
This will give you a file `gpio-bj.ko`, which you can copy
to the RPI and load as a module with

    sudo insmod gpio-bj.ko

Then you can read and write to the device like so (for example):

    echo 5 > /dev/bjrpi

And you can unload the module with:

    sudo rmmod gpio-bj




System calls (bj_gpio.c)
------------------------
To compile the system calls, copy `bj_gpio.c` to 
linux/arch/arm/kernel, then add the following to the end of
linux/arch/arm/tools/syscall.tbl:
    
    398 common  bj_initpin      sys_bj_initpin
    399 common  bj_initpins     sys_bj_initpins
    400 common  bj_setpin       sys_bj_setpin
    401 common  bj_getpin       sys_bj_getpin
    402 common  bj_freepin      sys_bj_freepin
    403 common  bj_freepins     sys_bj_freepins

replaciny the numbers as appropriate (should start
with 1 plus the last entry in the table).

Then, add `bj_gpio.o` to `obj-y` in /linux/arch/arm/kernel/Makefile:

    obj-y    := ... bj_gpio.o

Then you can recompile the kernel which should then contain your
system calls:

    make ARCH=arm CROSS_COMPILE=arm-linux-gnueabihf- zImage modules dtbs

Again, assuming you're cross compiling on your PC.


