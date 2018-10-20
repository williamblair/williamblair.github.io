#include <mpi.h>
#include <stdio.h>

int main(int argc, char *argv[])
{
    // init MPI
    MPI_Init(NULL,NULL);

    // Get number of processes
    int world_size;
    MPI_Comm_size(MPI_COMM_WORLD, &world_size);

    // get the rank of the process
    int world_rank;
    MPI_Comm_rank(MPI_COMM_WORLD, &world_rank);
    
    // get the name of the processor
    char processor_name[MPI_MAX_PROCESSOR_NAME];
    int name_len;
    MPI_Get_processor_name(processor_name, &name_len);

    // print a hello world message
    printf("Hello from processor %s, rank %d"
           " out of %d processors\n",
           processor_name, world_rank, world_size);

    // finalize the environment
    MPI_Finalize();
}

