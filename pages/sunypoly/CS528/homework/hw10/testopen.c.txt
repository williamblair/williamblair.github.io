#include <stdio.h>
#include <stdlib.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <fcntl.h>

int main(void)
{
    char buffer[200];

    int fd = open("test.txt", O_RDONLY);
    if (fd < 0) {
        perror("Failed to open test.txt\n");
        return -1;
    }

    int amount_read = read(fd, buffer, 200);
    printf("Read %d bytes: %s\n", amount_read, buffer);

    close(fd);

    return 0;
}

