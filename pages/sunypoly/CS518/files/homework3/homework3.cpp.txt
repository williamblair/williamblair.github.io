/* William Blair
 * CS518 - Parallel Computing
 * 02/06/2018 
 *
 * HW 3 - Matrix - Vector multiply program
 *
 * compile with 'mpicxx homework3.cpp -o homework3' 
 * run with 'mpirun ... homework3 ./data.txt' ,
 * or replace data.txt with whatever matrix/vector data file you're using */

#include <iostream>
#include <fstream>
#include <sstream>
#include <string>

#include <cstdio>
#include <cstdlib>

#include <mpi.h>

// matrix data indices
#define ROWS_PER_PROC_INDEX 0
#define NUM_ROWS_INDEX      1
#define NUM_COLS_INDEX      2

// read in matrix and vector data from a given data file
bool readData(const char *fname, int *vecLength, int **sharedVec, int **mat, 
              int matData[3])
{
    int i, start;
    std::string curLine;

    // initialize some variables
    matData[0] = matData[1] = matData[2] = -1;
    *vecLength = -1;

    // open the file
    std::ifstream filestream(fname);
    if(!filestream.is_open()){
        fprintf(stderr, "Failed to open: %s\n", fname);
        return false;
    }

    // keep track of how many matrix rows we've read in
    int matLinesRead = 0;

    // keep track of how many vector entries we've read in
    int vecEntriesRead = 0;

    // read line by line for data
    while(std::getline(filestream, curLine))
    {
        // skip the current line if its empty or starts with a comment
        if(curLine.length() == 0 || curLine[0] == '#') continue;

        std::istringstream s(curLine);

        // matrix size expected first
        if(matData[NUM_ROWS_INDEX] == -1){
            s >> matData[NUM_ROWS_INDEX] >> matData[NUM_COLS_INDEX];
        }

        // then the matrix data
        else if(matLinesRead < matData[NUM_ROWS_INDEX]){
            // allocate memory for our matrix
            *mat = (int*)malloc(sizeof(int)*matData[NUM_ROWS_INDEX] *
                                matData[NUM_COLS_INDEX]);
            // TODO - check for errors
            do{
                // object to read from the current line
                std::istringstream matStream(curLine);

                // check if it's not a comment or empty line
                if(curLine.length() == 0 || curLine[0] == '#') continue;

                // read in a row
                start = matLinesRead*matData[NUM_COLS_INDEX];
                for(i=start; i<start+matData[NUM_COLS_INDEX]; i++){
                    matStream >> (*mat)[i];
                }
                matLinesRead++;

                // read the next line
                std::getline(filestream, curLine);

            } while(matLinesRead < matData[NUM_ROWS_INDEX]);
        }

        // then the vector length
        else if(*vecLength == -1){
            s >> *vecLength;
        }

        // then the vector
        else if(vecEntriesRead < *vecLength){
            // allocate memory for our vector
            *sharedVec = (int*)malloc(sizeof(int)*(*vecLength));
            // TODO - check for error
            do{
                // object to read from the current line
                std::istringstream vecStream(curLine);

                // check if it's not a comment or empty line
                if(curLine.length() == 0 || curLine[0] == '#') continue;

                // read in as many numbers on the current row
                while(vecStream >> (*sharedVec)[vecEntriesRead])
                    vecEntriesRead++;

                // read the next line
                if(vecEntriesRead < *vecLength) 
                    std::getline(filestream, curLine);

            } while(vecEntriesRead < *vecLength);
        }
    }

    // check to see if the matrix/vector are of appropriate size to multiply
    if( *vecLength != matData[NUM_COLS_INDEX]){
        fprintf(stderr, "Cannot multiply! Num cols =/= vector size\n");
        fprintf(stderr, "Matrix: (%d x %d), Vector: %d\n", 
            matData[NUM_ROWS_INDEX], matData[NUM_COLS_INDEX], *vecLength);

        return false;
    }

    filestream.close();
    return true;
}

// distribute matrix rows among the processes to use
bool splitRows(int matData[3], int **mat, int **myRows, int numProcs, 
               int *finalResultSize)
{
    int i;

    // make sure we can evenly split the number of rows among each process
    if(matData[NUM_ROWS_INDEX] % numProcs != 0 || 
       numProcs > matData[NUM_ROWS_INDEX]){
        fprintf(stderr, "Uneven row split between processes!\n");
        fprintf(stderr, "Number of processes must divide %d\n",
                         matData[NUM_ROWS_INDEX]);

        return false;
    }

    // calculate the number of each rows for each process to work with
    // (number of rows / number of processes)
    matData[ROWS_PER_PROC_INDEX] = matData[NUM_ROWS_INDEX] / numProcs;

    // result size is equal to the number of rows
    *finalResultSize = matData[NUM_ROWS_INDEX];

    // calculate how many rows to send to each process
    int amount = matData[NUM_COLS_INDEX]*matData[ROWS_PER_PROC_INDEX];

    // allocate memory to hold our rows to calculate with
    *myRows = (int *)malloc(sizeof(int) *
                           matData[ROWS_PER_PROC_INDEX] *
                           matData[NUM_COLS_INDEX]
    );
    // TODO - check for error

    // split up the matrix rows
    MPI_Scatter(*mat,             // void *send_data
                amount,           // int send_count
                MPI_INT,          // MPI_Datatype send_datatype
                *myRows,          // void *recv_data
                amount,           // int recv_count
                MPI_INT,          // MPI_Datatype recv_datatype
                0,                // int root
                MPI_COMM_WORLD    // MPI_Comm communicator
    );

    return true;
}

bool shareVector(int **sharedVec, int *vecLength, int rank)
{
    // get the vector size to everyone
    MPI_Bcast(vecLength,      // void *data
              1,              // int count
              MPI_INT,        // MPI_Datatype datatype
              0,              // int root
              MPI_COMM_WORLD  // MPI_Comm communicator
    );

    // if we aren't root we need to allocate memory for our vector
    if(rank != 0){
        *sharedVec = (int*)malloc(sizeof(int)*(*vecLength));
        // TODO - error check
    }

    // send the vector to everyone
    MPI_Bcast(*sharedVec,     // void *data
              *vecLength,     // int count
              MPI_INT,        // MPI_Datatype datatype
              0,              // int root
              MPI_COMM_WORLD  // MPI_Comm communicator
    );

    return true;
}

// calculate the dot product between the given row(s) and our shared vector
bool calcDotProduct(int **myResults, int **myRows, int matData[3], 
                    int *sharedVec, int vecLength)
{
    int i,j;

    *myResults = (int *)malloc(sizeof(int)*matData[ROWS_PER_PROC_INDEX]);
    // TODO - check for error

    // calculate the dot product of each assigned row in the current proc
    for(i=0; i<matData[ROWS_PER_PROC_INDEX]; i++){
        (*myResults)[i] = 0;
        for(j=0; j<vecLength; j++){
            (*myResults)[i] += (*myRows)[i*matData[NUM_COLS_INDEX]+j] *
                                sharedVec[j];
        }
    }

    return true;
}

// have the first process recieve each calculated dot product
// and store them in our final vector
bool calcFinalResult(int **finalResult, int *myResults, int matData[3], 
                     int vecLength, int rank)
{
    int i,j;
    int index=0;

    // allocate memory for our final vector
    if(rank == 0) {
        *finalResult = (int*)malloc(sizeof(int)*vecLength);
    }
    // TODO - check for error

    MPI_Gather(myResults,                     // void *send_data
               matData[ROWS_PER_PROC_INDEX],  // int send_count
               MPI_INT,                       // MPI_Datatype send_datatype
               *finalResult,                  // void *recv_data
               matData[ROWS_PER_PROC_INDEX],  // int recv_count
               MPI_INT,                       // MPI_Datatype send_datatype
               0,                             // int root
               MPI_COMM_WORLD                 // MPI_Comm communicator
    );

    return true;
}

int main(int argc, char *argv[])
{
    int rank, numProcs, i, j;

    // the shared vector and its size to be broadcasted between all procs
    int *sharedVec = NULL;
    int  vecLength;

    // the matrix to be read in by the first process
    int *mat = NULL;

    // shared matrix info between all procs
    int matData[3]; // 0 - rowsPerProc
                    // 1 - numRows
                    // 2 - numCols

    // the row(s) for each specific process to calculate with and the number
    // of them
    int *myRows = NULL;

    // the calculated values from each specific process
    int *myResults = NULL;

    // the resulting vector stored by the first process
    int *finalResult = NULL;
    int  finalResultSize;

    MPI_Init(0,0);
    MPI_Comm_rank(MPI_COMM_WORLD, &rank);
    MPI_Comm_size(MPI_COMM_WORLD, &numProcs);

    // read the vector from the first process
    if(rank == 0)
    {
        // read our matrix and vector data from the arg file
        if(argc != 2){
            printf("Usage: %s [data file]\n", argv[0]);
            return 0;
        }
        if(!readData(argv[1], &vecLength, &sharedVec, &mat, matData)) {
            if(sharedVec) free(sharedVec);
            if(mat)     free(mat);
            MPI_Finalize();
            return -1;
        }
        matData[ROWS_PER_PROC_INDEX]=0; // initialize the variable

    }

    // share matrix info data with everybody
    MPI_Bcast(matData,        // void *data
              3,              // int count
              MPI_INT,        // MPI_Datatype datatype
              0,              // int root
              MPI_COMM_WORLD  // MPI_Comm communicator
    );

    // split up the matrix rows and distribute them between the processes
    if(!splitRows(matData, &mat, &myRows, numProcs, &finalResultSize)){
        if(sharedVec) free(sharedVec);
        if(mat)     free(mat);
        MPI_Finalize();
        return -1;
    }

    // give every process the vector to dot product with
    shareVector(&sharedVec, &vecLength, rank);

    // calculate the dot product for each row
    calcDotProduct(&myResults, &myRows, matData, sharedVec, vecLength);

    // gather all of the calculated dot products and assign them to
    // our final result vector
    calcFinalResult(&finalResult, myResults, matData, vecLength, rank);

    if(rank == 0) {
        printf("Input matrix:\n");
        for(i=0; i<matData[NUM_ROWS_INDEX]; i++) {
            for(j=0; j<matData[NUM_COLS_INDEX]; j++) {
                printf("%d, ", mat[i*matData[NUM_COLS_INDEX] + j]);
            }
            printf("\n");
        }

        printf("\nInput Vector:\n");
        for(i=0; i<vecLength; i++) {
            printf("%d, ", sharedVec[i]);
        }
        printf("\n");

        printf("\nFinal result: ");
        for(i=0; i<finalResultSize; i++){
            printf("%d, ", finalResult[i]);
        } printf("\n");
    }


    MPI_Finalize();

    // free our allocated data
    if(sharedVec)     free(sharedVec);
    if(myRows)      free(myRows);
    if(mat)         free(mat);
    if(myResults)   free(myResults);
    if(finalResult) free(finalResult);
    return 0;
}



