/* Serial version of count3s algorithm 
 * should find 5 threes */
#include <stdio.h>

int main(void)
{
    // array to search
    int length = 16;
    int arr[] = {2,3,0,2,3,3,1,0,0,1,3,2,2,3,1,0};

    int i=0; 
    int count=0;

    for(i=0; i<length; i++)
    {
        if(arr[i] == 3) count++;
    }

    printf("Found %d 3s\n", count);
    return 0;
}