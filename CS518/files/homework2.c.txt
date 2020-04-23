/* William Blair
 * CS518 - Parallel Computing
 * 02/01/2018 
 *
 * HW 2 - Send greeting message from processor
 * to processor in rank order
 *
 * compile with 'mpicc homework2.c -o homework2' */
#include <stdio.h>
#include <stdlib.h>

#include <mpi.h>

int main(int argc, char *argv[])
{
    int dummy = 0; // placeholder data to send to other processes
    int rank, size, i;

    MPI_Init(0,0);
    MPI_Comm_rank(MPI_COMM_WORLD, &rank);
    MPI_Comm_size(MPI_COMM_WORLD, &size);

    // only processes that aren't first need to wait and receieve
    // before sending the next message
    if(rank != 0){
        MPI_Recv(&dummy,               // void *data
                 1,                    // int count
                 MPI_INT,              // MPI_DataType datatype
                 rank-1,               // int source
                 0,                    // int tag
                 MPI_COMM_WORLD,       // MPI_Comm communicator
                 MPI_STATUS_IGNORE     // MPI_Status *status
        );
    }
    // the last process does not need to send a message
    // to the next process since there isn't one
    if(rank != size-1) {
        MPI_Send(&dummy,           // void *data
                 1,                // int count
                 MPI_INT,          // MPI_DataType datatype
                 rank+1,           // int destination
                 0,                // int tag
                 MPI_COMM_WORLD    // MPI_Comm communicator
        );
    }

    printf("Hello World from process %d of %d\n", rank, size);

    MPI_Finalize();
    return 0;
}
