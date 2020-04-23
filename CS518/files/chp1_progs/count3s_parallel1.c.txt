/* Try number 1 using pthreads 
 * isn't guranteed to work - race condition on count 
 * compile with:
 *
 * gcc count3s_parallel1.c -o count3s_parallel1 -pthread 
 *
 * */
#include <stdio.h>
#include <stdlib.h>
#include <pthread.h>

int num_threads = 1;

// array to search - contains 9 threes
int arr_length = 32;
int arr[] = {2,3,0,2,3,3,1,0,0,1,3,2,2,3,1,0,
             1,0,0,2,0,3,1,0,3,1,0,2,3,3,1,0};

// total of all threes found (won't necessarily work - race condition)
int count=0;

// args - long id
void count3s_thread(void *id)
{
    int i;

    // compute the portion of the array that this thread should
    // work on
    int length_per_thread = arr_length / num_threads;
    int start = (long)id * length_per_thread;

    //printf("Start from thread %d: %d\n", (long)id, start);

    for(i=start;i<start+length_per_thread;i++)
    {
        //printf("Thread %d: arr[i]: %d\n", (long)id, arr[i]);
        if(arr[i] == 3) {
            count++;
            //printf("Thread %d: Found 3! Count: %d\n", (long)id, count);
        }
    }

    pthread_exit(NULL);
}

int main(int argc, char *argv[])
{
    // get the number of threads
    if(argc != 2){
        printf("Usage: %s [num_threads]\n", argv[0]);
        exit(0);
    }
    sscanf(argv[1], "%d", &num_threads);

    pthread_t threads[num_threads];
    int rc;
    long t;
    for(t=0; t<num_threads; t++)
    {
        // keep the return status and check for error
        rc = pthread_create(&threads[t], NULL, (void*)count3s_thread, (void*)t);
        if(rc){
            fprintf(stderr, "Error: return code from pthread_create is %d\n", rc);
            exit(EXIT_FAILURE);
        }
    }

    // make sure all the threads are finished
    void *status;
    for(t=0; t<num_threads; t++)
    {
        int rc = pthread_join(threads[t], &status);
        if(rc != 0){
            fprintf(stderr, "Return code from pthread join: %d\n", rc);
            exit(EXIT_FAILURE);
        }
    }

    // could be 5, but not necessarily
    printf("Found %d threes\n", count);

    // last thing that main should do
    pthread_exit(NULL);
}


