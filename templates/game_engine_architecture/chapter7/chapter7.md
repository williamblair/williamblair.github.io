For example,
the Red Alert 3 team at Electronic Arts observed that writing data into log files
was causing significant performance degradation. They changed the logging
system so that it accumulated its output into a memory buffer, writing the
buffer out to disk only when it was filled. Then they moved the buffer dump
routine out into a separate thread to avoid stalling the main game loop.

## Asynchronous File I/O

Streaming refers to the act of loading data in the background while the main
program continues to run. Many games provide the player with a seam-
less, load-screen-free playing experience by streaming data for upcoming lev-
els from the DVD-ROM, Blu-ray disk or hard drive while the game is being
played. Audio and texture data are probably the most commonly streamed
types of data, but any type of data can be streamed, including geometry, level
layouts and animation clips.

* Can write yourself by calling the blocking I/O on a separate thread then signaling/
  semaphoring when its complete
  
## Resource Management/Revision Control

* For games with alot of and large assets, revision control is important for managing
  different versions of data; however this can create huge space requirements and be 
  slow/inefficient
* Naughty dog uses a custom tool that uses UNIX symbolic links w/ version control,
  so the user doesnt have to have the entire set of assets on disk - just the ones
  they need to work on, then the symbolic links are updated afterwords
* Resource Database: contains metadata and list for all assets (e.g. how its interpreted or 
  converted by the engine)
  * Should have ability to add and delete resources, change resource location, revision history,
    etc.
>It should be pretty obvious from looking at the above list that creating a
reliable and robust resource database is no small task. When designed well
and implemented properly, the resource database can quite literally make the
difference between a team that ships a hit game and a team that spins its wheels
for 18 months before being forced by management to abandon the project (or
worse). I know this to be true, because I’ve personally experienced both.

## Asset conditioning pipeline

* Converts assets to the appropriate format for the engine
* Resource Linking - combining multiple assets into a single
  file/package
  
left off on 7.2.2.1 runtime resource manager