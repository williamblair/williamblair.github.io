/* William Blair
 * CS518 - Parallel Computing
 * Homework 7 - Matrix/Matrix multiply with pthreads 
 * 03/24/18
 * 
 * compile with 
 *     g++ homework7.cpp -o homework7 -pthread 
 * 
 * Usage: homework7 <data file> <number of threads>
 * ex) ./homework7 data.txt 9
 * 
 * number of threads must evenly split up the number of rows
 * in the first matrix. E.G. if the first matrix has 9 rows
 * <number of threads> must be 1,3, or 9 */
 
#include <iostream>
#include <fstream>
#include <sstream>
#include <string>

#include <pthread.h>
#include <cstdlib>
#include <cstdio>
#include <unistd.h>

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

// argument to be passed to a thread
struct thread_data
{
	int *rows; // my part of the matrix to calculate with
	int id;    // which thread I am
	int *mat1Data; // my part of the matrix info
	int *mat2; // pointer to the shared matrix
	int *mat2Data; // shared matrix info
	int *resultMat; // my part of the final matrix to put my answer in
};

// our function to be run by each thread calculating their
// part of the result
void *CalcDotProduct(void *threadarg)
{
	int i,j,k;
	
	// pointer to our typecasted arg
	struct thread_data *d;
	
	d = (struct thread_data *)threadarg;
	
	// loop through the number of rows per process
	for(k=0; k<d->mat1Data[ROWS_PER_PROC_INDEX]; k++)
	{
		// loop through the specified row in our cut of the first matrix
		for(i=0; i<d->mat2Data[NUM_COLS_INDEX]; i++)
		{
			// initialize our result variable to 0
			d->resultMat[k*d->mat2Data[NUM_COLS_INDEX]+i] = 0;
			
			// loop through the specified column in the shared matrix
			for(j=0; j<d->mat1Data[NUM_COLS_INDEX]; j++)
			{
				d->resultMat[k*d->mat2Data[NUM_COLS_INDEX]+i] +=
				
				d->rows[j+ k*d->mat1Data[NUM_COLS_INDEX]] *
				d->mat2[j* d->mat2Data[NUM_COLS_INDEX]+i];
			}
			
		}
	}
	
	pthread_exit(NULL);
}

int main(int argc, char *argv[])
{	
	// pthread data
	int       n_threads=0;
	pthread_t *threads;
	int       *task_ids;
	int       rc, t;
	int       i,j;
	
	struct thread_data *thread_data_array = NULL;
	
	// matrix data
	int *mat2 = NULL; // the shared matrix each thread is going to use
	int mat2Data[3];
	int *mat1 = NULL; // the matrix to be split up between threads
	int mat1Data[3];
	int *resultMat = NULL; // the final resulting matrix
	
	// read in the matrix data from our file
	if(argc != 3) {
		printf("Usage: %s [data_file] [num_threads]\n", argv[0]);
		exit(0);
	}
	if(!readData(argv[1], &mat2, mat2Data, &mat1, mat1Data)) {
		exit(-1);
	}
	
	// allocate thread data
	n_threads = atoi(argv[2]);
	if(n_threads <= 0 || mat1Data[NUM_ROWS_INDEX] % n_threads != 0) {
		fprintf(stderr, "Invalid number of threads: %d\n", n_threads);
		fprintf(stderr, "Number of threads must evenly divide "
		                "the number of rows (%d)\n", 
		                mat1Data[NUM_ROWS_INDEX]);
		if(mat1) free(mat1);
		if(mat2) free(mat2);
		exit(-1);
	}
	threads = (pthread_t *)malloc(sizeof(pthread_t)*n_threads);
	task_ids = (int*)malloc(sizeof(int)*n_threads);
	thread_data_array = (struct thread_data *)malloc(sizeof(struct thread_data)*n_threads);
	
	// calculate how much data to give each thread
	mat1Data[ROWS_PER_PROC_INDEX] = mat1Data[NUM_ROWS_INDEX] / n_threads;
	
	// allocate memory for our final result
	resultMat = (int*)malloc(sizeof(int)*mat1Data[NUM_ROWS_INDEX]*mat2Data[NUM_COLS_INDEX]);
	
	// spawn each thread
	for(t=0; t<n_threads; t++) {
		
		// Set our specific args for this thread
		thread_data_array[t].id = t;
		// send rows as a pointer to the start of this threads section of the first matrix
		thread_data_array[t].rows = mat1 + (mat1Data[ROWS_PER_PROC_INDEX]*mat1Data[NUM_COLS_INDEX]*t);
		thread_data_array[t].mat1Data = mat1Data;
		thread_data_array[t].mat2 = mat2;
		thread_data_array[t].mat2Data = mat2Data;
		// send resultMat as a pointer to the start of this threads section of the result matrix
		thread_data_array[t].resultMat = resultMat + (mat1Data[ROWS_PER_PROC_INDEX]*mat2Data[NUM_COLS_INDEX]*t);
		
		// create the thread
		rc = pthread_create(&threads[t], NULL, CalcDotProduct, 
		                   (void*)&thread_data_array[t]);
		                   
		if(rc) {
			printf("ERROR; return code from pthread_create() is %d\n", rc);
			exit(-1);
		}
		
	}
	
	// wait for each thread to finish
	for(t=0; t<n_threads; t++) {
		pthread_join(threads[t], NULL);
	}
	
	// print out the first matrix
	printf("Mat1:\n");
	for(i=0; i<mat1Data[NUM_ROWS_INDEX]; i++) {
		for(j=0; j<mat1Data[NUM_COLS_INDEX]; j++) {
			printf("%3d, ", mat1[i*mat1Data[NUM_COLS_INDEX]+j]);
		}
		printf("\n");
	}printf("\n");
	
	// print out the second matrix
	printf("Mat2:\n");
	for(i=0; i<mat2Data[NUM_ROWS_INDEX]; i++) {
		for(j=0; j<mat2Data[NUM_COLS_INDEX]; j++) {
			printf("%3d, ", mat2[i*mat2Data[NUM_COLS_INDEX]+j]);
		}
		printf("\n");
	}printf("\n");
	
	// print out the final answer
	printf("Result:\n");
	for(i=0; i<mat1Data[NUM_ROWS_INDEX]; i++) {
		for(j=0; j<mat2Data[NUM_COLS_INDEX]; j++) {
			printf("%3d, ", resultMat[i*mat2Data[NUM_COLS_INDEX]+j]);
		}
		printf("\n");
	}printf("\n");
	
	pthread_exit(NULL);
	
	// free memory
	if(mat1) free(mat1);
	if(mat2) free(mat2);
	if(threads) free(threads);
	if(thread_data_array) free(thread_data_array);
	if(task_ids) free(task_ids);
	if(resultMat) free(resultMat);
	
	return 0;
}









