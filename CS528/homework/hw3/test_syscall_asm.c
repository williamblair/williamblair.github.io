#include <stdio.h>

#define SYS_bjfunc 335

int main(int argc, char *argv[])
{   
    /* A system call stores the return value in eax according
     * to the book */
    register int call_return asm("eax");
    printf("Call return before: %d\n", call_return);
    
    /* Call the system call via assembly,
     * howto from here:
     * https://jamesfisher.com/2018/02/19/how-to-syscall-in-c.html */
    register int syscall_no asm("rax") = SYS_bjfunc;
    asm("syscall");

    /* Call return is already linked to $eax so it was
     * updated on the above assembly syscall */
    printf("Thread size: %d\n", call_return);
    
    return 0;
}
