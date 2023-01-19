/* William Blair
 * CS518 - Parallel Computing
 * 02/18/2018 
 *
 * HW 4 - Matrix - Matrix multiply program
 *
 * compile with 'mpicxx homework4.cpp -o homework4' 
 * run with 'mpirun ... homework4 ./data.txt' ,
 * or replace data.txt with whatever matrix/vector data file you're using */

#include <iostream>
#include <fstream>
#include <sstream>
#include <string>

#include <cstdio>
#include <cstdlib>
#include <cstring>

#include <mpi.h>

// matrix data indices
#define ROWS_PER_PROC_INDEX 0
#define NUM_ROWS_INDEX      1
#define NUM_COLS_INDEX      2

// read in matrix and vector data from a given data file
bool readData(const char *fname, int **sharedMat, int sharedMatData[3], 
              int **mat1, int mat1Data[3])
{
    int i, start;
    std::string curLine;

    // initialize some variables
    mat1Data[0] = mat1Data[1] = mat1Data[2] = -1;
    sharedMatData[0] = sharedMatData[1] = sharedMatData[2] = -1;

    // open the file
    std::ifstream filestream(fname);
    if(!filestream.is_open()){
        fprintf(stderr, "Failed to open: %s\n", fname);
        return false;
    }

    // keep track of how many matrix rows we've read in
    int mat1LinesRead = 0;

    // keep track of how many vector entries we've read in
    int mat2LinesRead = 0;

    // read line by line for data
    while(std::getline(filestream, curLine))
    {
        // skip the current line if its empty or starts with a comment
        if(curLine.length() == 0 || curLine[0] == '#') continue;

        std::istringstream s(curLine);

        // matrix size expected first
        if(mat1Data[NUM_ROWS_INDEX] == -1){
            s >> mat1Data[NUM_ROWS_INDEX] >> mat1Data[NUM_COLS_INDEX];
        }

        // then the matrix data
        else if(mat1LinesRead < mat1Data[NUM_ROWS_INDEX]){
            // allocate memory for our matrix
            *mat1 = (int*)malloc(sizeof(int)*mat1Data[NUM_ROWS_INDEX] *
                                mat1Data[NUM_COLS_INDEX]);
            // TODO - check for errors
            do{
                // object to read from the current line
                std::istringstream mat1Stream(curLine);

                // check if it's not a comment or empty line
                if(curLine.length() == 0 || curLine[0] == '#') continue;

                // read in a row
                start = mat1LinesRead*mat1Data[NUM_COLS_INDEX];
                for(i=start; i<start+mat1Data[NUM_COLS_INDEX]; i++){
                    mat1Stream >> (*mat1)[i];
                }
                mat1LinesRead++;

                // read the next line
                std::getline(filestream, curLine);

            } while(mat1LinesRead < mat1Data[NUM_ROWS_INDEX]);
        }

        // then the second vector data
        else if(sharedMatData[NUM_ROWS_INDEX] == -1){
            s >> sharedMatData[NUM_ROWS_INDEX] >> sharedMatData[NUM_COLS_INDEX];
        }

        // then the vector
        else if(mat2LinesRead < sharedMatData[NUM_ROWS_INDEX]){
            // allocate memory for our matrix
            *sharedMat = (int*)malloc(sizeof(int)*sharedMatData[NUM_ROWS_INDEX]*
                                sharedMatData[NUM_COLS_INDEX]);
            // TODO - check for errors
            do{
                // object to read from the current line
                std::istringstream sharedMatStream(curLine);

                // check if it's not a comment or empty line
                if(curLine.length() == 0 || curLine[0] == '#') continue;

                // read in a row
                start = mat2LinesRead*sharedMatData[NUM_COLS_INDEX];
                for(i=start; i<start+sharedMatData[NUM_COLS_INDEX]; i++){
                    sharedMatStream >> (*sharedMat)[i];
                }
                mat2LinesRead++;

                // read the next line
                std::getline(filestream, curLine);

            } while(mat2LinesRead < sharedMatData[NUM_ROWS_INDEX]);
        }
    }

    // check to see if the matrix/vector are of appropriate size to multiply
    if( sharedMatData[NUM_ROWS_INDEX] != mat1Data[NUM_COLS_INDEX]){
        fprintf(stderr, "Cannot multiply! Num cols mat1 =/= Num rows mat2\n");
        fprintf(stderr, "Matrix 1: (%d x %d), Matrix 2: (%d x %d)\n", 
            mat1Data[NUM_ROWS_INDEX], mat1Data[NUM_COLS_INDEX], 
            sharedMatData[NUM_ROWS_INDEX], sharedMatData[NUM_COLS_INDEX]);

        return false;
    }

    filestream.close();
    return true;
}

// distribute matrix rows among the processes to use
bool splitRows(int mat1Data[3], int **mat1, int **myRows, int numProcs, 
               int *finalResultSize)
{
    int i;

    // make sure we can evenly split the number of rows among each process
    if(mat1Data[NUM_ROWS_INDEX] % numProcs != 0 || 
       numProcs > mat1Data[NUM_ROWS_INDEX]){
        fprintf(stderr, "Uneven row split between processes!\n");
        fprintf(stderr, "Number of processes must divide %d\n",
                         mat1Data[NUM_ROWS_INDEX]);

        return false;
    }

    // calculate the number of each rows for each process to work with
    // (number of rows / number of processes)
    mat1Data[ROWS_PER_PROC_INDEX] = mat1Data[NUM_ROWS_INDEX] / numProcs;

    // result size is equal to the number of rows
    *finalResultSize = mat1Data[NUM_ROWS_INDEX];

    // calculate how many rows to send to each process
    int amount = mat1Data[NUM_COLS_INDEX]*mat1Data[ROWS_PER_PROC_INDEX];

    // allocate memory to hold our rows to calculate with
    *myRows = (int *)malloc(sizeof(int) *
                           mat1Data[ROWS_PER_PROC_INDEX] *
                           mat1Data[NUM_COLS_INDEX]
    );
    // TODO - check for error

    // split up the matrix rows
    MPI_Scatter(*mat1,            // void *send_data
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

// broadcast the second matrix to each process
bool shareMat(int **sharedMat, int sharedMatData[3], int rank)
{
    // the number of matrix entries to share
    int amount;

    // share matrix info data with everybody
    MPI_Bcast(sharedMatData,        // void *data
              3,              // int count
              MPI_INT,        // MPI_Datatype datatype
              0,              // int root
              MPI_COMM_WORLD  // MPI_Comm communicator
    );

    // calculate the size of the shared matrix
    amount = sharedMatData[NUM_ROWS_INDEX]*sharedMatData[NUM_COLS_INDEX];

    // if we aren't root we need to allocate memory for our vector
    if(rank != 0){
        *sharedMat = (int*)malloc(sizeof(int) * 
                                  sharedMatData[NUM_ROWS_INDEX] *
                                  sharedMatData[NUM_COLS_INDEX]
        );
        // TODO - error check
    }

    // send the vector to everyone
    MPI_Bcast(*sharedMat,     // void *data
              amount,         // int count
              MPI_INT,        // MPI_Datatype datatype
              0,              // int root
              MPI_COMM_WORLD  // MPI_Comm communicator
    );

    return true;
}

// calculate the dot product between the given row(s) and our shared vector
bool calcDotProduct(int **myResults, int **myRows, int mat1Data[3], 
                    int *sharedMat, int sharedMatData[3])
{
    int i,j,k;

    *myResults = (int *)malloc(sizeof(int) * 
                                mat1Data[ROWS_PER_PROC_INDEX] *
                                sharedMatData[NUM_COLS_INDEX]
    );
    // TODO - check for error


    // loop through the number of rows per process
    for(k=0; k<mat1Data[ROWS_PER_PROC_INDEX]; k++) {

        // loop through the specified row in our cut of the first matrix
        for(i=0; i<sharedMatData[NUM_COLS_INDEX]; i++) {

            // initialize our result variable to 0
            (*myResults)[k*sharedMatData[NUM_COLS_INDEX]+i]=0;

            // loop through the specified column in the shared matrix
            for(j=0; j<mat1Data[NUM_COLS_INDEX];j++) {

                // calculate the dot product (multiply the two entries
                // and add them to the current result entry)
                (*myResults)[k*sharedMatData[NUM_COLS_INDEX]+i] +=
                    (*myRows)[j+ k*mat1Data[NUM_COLS_INDEX]] *
                    sharedMat[j* sharedMatData[NUM_COLS_INDEX]+i];
            }
        }
    }

    return true;
}

// have the first process recieve each calculated dot product
// and store them in our final vector
bool calcFinalResult(int **finalResult, int *myResults, int mat1Data[3], 
                     int sharedMatData[3], int rank)
{
    int i,j;
    int index=0;

    // allocate memory for our final vector
    if(rank == 0) {
        *finalResult = (int*)malloc(sizeof(int)*mat1Data[NUM_ROWS_INDEX]*sharedMatData[NUM_COLS_INDEX]);
    }
    // TODO - check for error

    MPI_Gather(myResults,                     // void *send_data
               mat1Data[ROWS_PER_PROC_INDEX]*sharedMatData[NUM_COLS_INDEX],  // int send_count
               MPI_INT,                       // MPI_Datatype send_datatype
               *finalResult,                  // void *recv_data
               mat1Data[ROWS_PER_PROC_INDEX]*sharedMatData[NUM_COLS_INDEX],  // int recv_count
               MPI_INT,                       // MPI_Datatype send_datatype
               0,                             // int root
               MPI_COMM_WORLD                 // MPI_Comm communicator
    );

    return true;
}

int main(int argc, char *argv[])
{
    int rank, numProcs, i, j;

    // the shared matrix broadcasted between all procs
    int *sharedMat = NULL;

    // the matrix to be read in by the first process
    int *mat1 = NULL;

    // shared matrix info between all procs
    int mat1Data[3]; // 0 - rowsPerProc
                    // 1 - numRows
                    // 2 - numCols

    int sharedMatData[3]; // same structure as mat1Data

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
        if(!readData(argv[1], &sharedMat, sharedMatData, &mat1, mat1Data)) {
            if(sharedMat) free(sharedMat);
            if(mat1)     free(mat1);
            MPI_Finalize();
            return -1;
        }
        mat1Data[ROWS_PER_PROC_INDEX]=0; // initialize the variable

    }

    // share matrix info data with everybody
    MPI_Bcast(mat1Data,        // void *data
              3,              // int count
              MPI_INT,        // MPI_Datatype datatype
              0,              // int root
              MPI_COMM_WORLD  // MPI_Comm communicator
    );

    // split up the matrix rows and distribute them between the processes
    if(!splitRows(mat1Data, &mat1, &myRows, numProcs, &finalResultSize)){
        if(sharedMat) free(sharedMat);
        if(mat1)     free(mat1);
        MPI_Finalize();
        return -1;
    }

    // give every process the vector to dot product with
    shareMat(&sharedMat, sharedMatData, rank);

    // calculate the dot product for each row
    calcDotProduct(&myResults, &myRows, mat1Data, sharedMat, sharedMatData);

    // gather all of the calculated dot products and assign them to
    // our final result vector
    calcFinalResult(&finalResult, myResults, mat1Data, sharedMatData, rank);

    // print out our input matrices and results
    if(rank == 0) {
        printf("Matrix 1:\n");
        for(i=0; i<mat1Data[NUM_ROWS_INDEX]; i++) {
            for(j=0; j<mat1Data[NUM_COLS_INDEX]; j++){
                printf("%3d, ", mat1[i*mat1Data[NUM_COLS_INDEX]+j]);
            }
            printf("\n");
        }printf("\n");

        printf("Matrix 2:\n");
        for(i=0; i<sharedMatData[NUM_ROWS_INDEX]; i++) {
            for(j=0; j<sharedMatData[NUM_COLS_INDEX]; j++){
                printf("%3d, ", sharedMat[i*sharedMatData[NUM_COLS_INDEX]+j]);
            }
            printf("\n");
        }printf("\n");

        printf("Final result:\n");
        for(i=0; i<mat1Data[NUM_ROWS_INDEX]; i++) {
            for(j=0; j<sharedMatData[NUM_COLS_INDEX]; j++){
                printf("%3d, ", finalResult[i*sharedMatData[NUM_COLS_INDEX]+j]);
            }
            printf("\n");
        }
    } printf("\n");


    MPI_Finalize();

    // free our allocated data
    if(sharedMat)     free(sharedMat);
    if(myRows)      free(myRows);
    if(mat1)         free(mat1);
    if(myResults)   free(myResults);
    if(finalResult) free(finalResult);
    return 0;
}



