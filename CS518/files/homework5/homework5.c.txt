/* William Blair
 * CS518 - Parallel Computing
 * 02/21/2018 
 *
 * HW 5 - MPI Tree Broadcast Function
 *
 * compile with 'mpicc homework5.c -o homework5 -lm' 
 *
 * note you must link the math library (-lm) for this code */

#include <stdio.h>
#include <stdlib.h>
#include <math.h>

#include <mpi.h>

// just some example data to test
#define SIZE 5
int *myData=NULL;

void BJ_MPI_Broadcast(int *data, int amount, int rank, int numProcs)
{
    int i,j;

    int startAt;  // which iteration the process will start sending from
    int recvFrom; // which proc we'll get the data from
    int sendTo;   // the process to send the data to

    // figure out the number of levels we need to go for all processes to 
    // receive the data
    int numIters = (int)ceil(log2(numProcs));

    if(rank != 0)
    {
        // calculate which iteration we'll start sending out from
        startAt = (int)log2(rank);

        // calculate which process we'll recieve from
        recvFrom = rank - (int)pow(2, startAt);

        // Wait for our data
        MPI_Recv(data,                 // void *data
                 amount,               // int count
                 MPI_INT,              // MPI_DataType datatype
                 recvFrom,             // int source
                 0,                    // int tag
                 MPI_COMM_WORLD,       // MPI_Comm communicator
                 MPI_STATUS_IGNORE     // MPI_Status *status
        );

        // send our data the appropriate amount of times based on our
        // calculated starting iteration
        for(j=startAt+1; j<numIters; j++) 
        {
            // calculate which process to send to (2^iter + rank)
            sendTo = (int)pow(2,j) + rank;
            
            // if we've reached the total number of processes no need
            // to keep looping
            if(sendTo > numProcs-1) break;

            MPI_Send(data,             // void *data
                     amount,           // int count
                     MPI_INT,          // MPI_DataType datatype
                     sendTo,           // int destination
                     0,                // int tag
                     MPI_COMM_WORLD    // MPI_Comm communicator
            );

        }
    }
    else 
    {
        // for the first process just loop through the number of iterations
        // and don't receive anything
        for(j=0; j<numIters; j++) {
            sendTo = (int)pow(2,j) + rank;

            MPI_Send(data,             // void *data
                     amount,           // int count
                     MPI_INT,          // MPI_DataType datatype
                     sendTo,           // int destination
                     0,                // int tag
                     MPI_COMM_WORLD    // MPI_Comm communicator
            );

        }
    }

    // wait for everyone to catch up
    //MPI_Barrier(MPI_COMM_WORLD);

    return;
}

int main(int argc, char *argv[])
{
    int i;
    int rank, numProcs;

    MPI_Init(0,0);
    MPI_Comm_rank(MPI_COMM_WORLD, &rank);
    MPI_Comm_size(MPI_COMM_WORLD, &numProcs);

    // allocate memory for our array
    myData = (int*)malloc(sizeof(int)*SIZE);
    // TODO - check for error

    // fill our array with 0s to show 'before'
    for(i=0; i<SIZE;i++){
        myData[i] = 0;
    }

    // if we are root fill in our data with values to send
    if(rank==0) {
        for(i=0; i<SIZE; i++){
            myData[i] = (int)rand()%255;
        }
    }

    // print our 'before' values
    printf("Process %d: Before: ", rank);
    for(i=0; i<SIZE; i++) {
        printf("%d, ", myData[i]);
    } printf("\n");

    if(rank == 0) printf("\n");

    // Call our function
    BJ_MPI_Broadcast(myData, SIZE, rank, numProcs);

    // print out to confirm we all got the same data
    printf("After: Process %d: ", rank);
    for(i=0; i<SIZE; i++){
        printf("%d, ", myData[i]);
    } printf("\n");

    MPI_Finalize();

    if(myData) free(myData);
    return 0;
}






