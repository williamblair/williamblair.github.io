William (BJ) Blair - Homework 3

Compile with:

mpicxx homework3.cpp -o homework3

run with:

mpirun ... ./homework3 [datafile]

where datafile contains the vector and matrix
in the format given by example in data.txt

-np must have a number that divides the 
number of rows/length of the vector
so that the work can be distributed evenly
among the given processes

example run (if the vector length is 6):

    mpirun -np 3 -f machines ./homework3 ./data.txt

     or

    mpirun -np 6 -f machines ./homework3 ./data.txt

bad example run (if the vector length is 6):

    mpirun -np 4 -f machines ./homework3 ./data.txt

this will result in an error message then exit.

