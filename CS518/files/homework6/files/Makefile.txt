CC = mpicc
LD = mpecc
OBJ = homework5.o
SRC = homework5.c
EXEC = homework5
CFLAGS = -g
LDFLAGS = -pg -lm -mpilog -lpthread

all: $(EXEC)

$(EXEC): ${OBJ}
	$(LD) $(LDFLAGS) $< -o $(EXEC)

homework5.o: ${SRC}
	$(CC) $(CFLAGS) -c homework5.c

clean:
	rm -rf $(OBJ) $(EXEC)

