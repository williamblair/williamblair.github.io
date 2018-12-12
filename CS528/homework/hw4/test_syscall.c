#define _GNU_SOURCE
#include <unistd.h>
#include <sys/syscall.h>
#include <stdio.h>

/* The system call entry number added to the table */
#define SYS_bjfunc 335

int main(int argc, char *argv[])
{
    /* syscall(long number, ...) */
    int thread_size = syscall(SYS_bjfunc);

    printf("Thread size: %d\n", thread_size);

    return 0;
}
