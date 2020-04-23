/* Try number 4 using pthreads 
 * best performance as we now know each private
 * count will have its own cache line
 *
 * compile with:
 * gcc count3s_parallel4.c -o count3s_parallel4 -pthread 
 * 
 * */
#include <stdio.h>
#include <stdlib.h>
#include <pthread.h>

// changed by command line arg
int num_threads = 1;

// array to search - contains 9 threes
#define arr_length 32
int arr[] = {2,3,0,2,3,3,1,0,0,1,3,2,2,3,1,0,
             1,0,0,2,0,3,1,0,3,1,0,2,3,3,1,0};

// total of all threes found
int count=0;

// a private 3s counter for each thread
// this time contains padding so that each
// entry has its own cache line
#define MAX_THREADS arr_length
struct padded_int
{
    int value;
    char padding[60];
} private_count[MAX_THREADS];

pthread_mutex_t m; // mutex to lock count while in use

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
            private_count[(long)id].value++;
            //printf("Thread %d: Found 3! Count: %d\n", (long)id, count);
        }
    }

    // add our number of threes to the total count
    pthread_mutex_lock(&m);
    count += private_count[(long)id].value;
    pthread_mutex_unlock(&m);

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

    // restrain the number of threads now that we have
    // a max amount of them
    if(num_threads > MAX_THREADS){
        printf("Entered number > MAX_THREADS (%d),"
               "Defaulting to %d\n", MAX_THREADS, MAX_THREADS);
        num_threads = MAX_THREADS;
    }

    pthread_t threads[num_threads];
    int rc;
    long t;

    
    // init the mutex
    if(pthread_mutex_init(&m, NULL) != 0) exit(EXIT_FAILURE);

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

    // destroy our mutex
    pthread_mutex_destroy(&m);

    printf("Found %d threes\n", count);
    
    // last thing that main should do
    pthread_exit(NULL);
}


