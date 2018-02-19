William (BJ) Blair - Homework 4

Compile with:

mpicxx homework4.cpp -o homework4

run with:

mpirun ... ./homework4 [datafile]

where datafile contains the matrix and matrix
in the format given by example in data.txt

-np must have a number that divides the 
number of rows of the first matrix/number of
columns in the second matrix so that the 
work can be distributed evenly among the 
given processes

example run (if the first # of rows is 6):

    mpirun -np 3 -f machines ./homework3 ./data.txt

     or

    mpirun -np 6 -f machines ./homework3 ./data.txt

bad example run (if the vector length is 6):

    mpirun -np 4 -f machines ./homework3 ./data.txt

this will result in an error message then exit.

