# Chapter 5

## Left handed vs. Right Handed Coordinate Systems

![Left vs. Right Coordinate System](coordinatesystem.gif)

* To switch between the two, switch the direction of one of the axes
* More common in 3d graphics to use left handed coordinate system
  (z axis points away; larger Z = further away)

## Vector magnitude

* magnitude = length = |**v**| = 
  = &sqrt;(**v** * **v**) = &sqrt;(vx\*vx + vy\*vy + vz\*vz)

## Normalizing a vector

* normal vector **u** = **v**/|**v**|

## Vector projection

* **u** = unit vector (|**u**| = 1)
* dot product **a** * **u** = the length of the projection
  of **a** onto direction **u**
  
## Dot Product Applications

![dot product diagrams](dotproduct.png)

## Cross product

* **a** x **b** = \[(aybz - azby), (azbx - axbz), (axby - aybx)\]

## Cross product to find the normal vector of a plane

* Given points **P**1, **P**2, **P**3
* normal vector **n** = normalize((**P**2 - **P**1)x(**P**3 - **P**1))

## Linear Interpolation (LERP)

* Finds an intermediate point between 2 other points
* LERP(**A**,**B**,&Beta;) = (1-&Beta;)**A** + &Beta;**B**
* = \[(1-&Beta;)Ax + &Beta;x, (1-&Beta;)Ay + &Beta;y, (1-&Beta;)Az + &Beta;z\]

5.3 Matrices
