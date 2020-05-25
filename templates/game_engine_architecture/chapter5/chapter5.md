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

## Row vs Column Vectors

* Row vectors: multiply with matrices left-to-right
  * **v**' = **v****A** * **B** * **C**
* Col vectors: multiply with matrices right-to-left
  * **v**' = **C** * **B** * **A****v**

## Affine transformations and matrix inverse

* All affine transformation matrices have inverses:
  **A** * **A**<sup>-1</sup> = **I**
* Rotate, translate, scale, and shear
* (**A****B****C**)<sup>-1</sup> = **C**<sup>-1</sup>**B**<sup>-1</sup>**A**<sup>-1</sup>

## Matrix transpose

* **M**<sup>T</sup> = values reflected across the diagonal
  * **M**<sub>i,j</sub> = **M**<sub>j,i</sub>
* (**A****B****C**)<sup>T</sup> = **C**<sup>T</sup>**B**<sup>T</sup>**A**<sup>T</sup>


## Homogeneous coordinates

* Point has w component = 1
* Direction has w component = 0
* Homoegeneous transformation matrices have w component = 1
  since they deal with transforming points

## Yaw, pitch, roll
* Pitch: rotation around left/right/x axis
* Yaw: rotation around up/y axis
* Roll: rotation around front/z axis

## Coordinate Spaces
* Model space: origin is at the center of the object/model
* World space: all objects/models are relative to this center
* View space/camera space: origin is center of the camera

## Change of Basis (converting between coordinate spaces)

* Pp = result parent space vector
* Pc = initial child space vector to convert
* i,j,k,t are the unit basis vectors for the child space
  * t is the translation of the child coordinate system
    relative to the parent space
* Mc-&gt;p = change of basis matrix
  ![Change of basis matrix](changeofbasis.png)

* Given any affine 4x4 transform matrix, you can
  extract the child space basis vectors be isolating
  the appropriate row (if in the row format as shown above)
  or column

## transforming normal vectors

* Normals are transformed from space A to B by the
  transpose of the inverse of the matrix shown
  above (given change of basis matrix Ma-&gt;b, the
  normal transformation matrix is 
  (Ma-&gt;b<sup>-1</sup>)<sup>T</sup>)

## Quaternions
* Alternative and simpler way to represent rotations
* Looks like a 4d vector but behaves differently
* q = [qx qy qz qw]
  * alternative representations:
  * q = \[qv qs\] (qv is the vector part, qs is a scalar)
* Unit length quaternions represent 3d rotations
  * qx\*qx + qy\*qy + qz\*qz + qw\*qw = 1

## Quaternion multiplication (grassman product)

* pq = [(ps\*qv + qs\*pv + cross(pv,qv)) (ps\*qs - dot(pv,qv))]
  * the left part results in a vector
  * the right part results in a scalar

## Quaternion inverse/conjugate

* conjugate = q<sup>\*</sup> = [-qv qs]
* inverse = q<sup>-1</sup> = q<sup>\*</sup>/|q|<sup>2</sup>
  * In our case, using unit length quaternions,
    |q|<sup>2</sup> = 1, so inverse = conjugate
* (pq)<sup>\*</sup> = q<sup>\*</sup>p<sup>\*</sup>
* (pq)<sup>-1</sup> = q<sup>-1</sup>p<sup>-1</sup>

## Rotating a vector with a quaternion

* Convert vector v into quaternion form
  * for a 3d vec, add a fourth w component = 0
  * v quaternion = [vx vy vz 0]
* multiply by the quaternion
* multiply by its inverse
* result quaternion v' = qv<sub>quat</sub>q<sup>-1</sup>
  * extract the first 3 components of v' back into vector
    form
* Multiplcations can be concatenated/combined into a single
  quaternion like matrix multiplications
  * e.g. Rnet = R3\*R2\*R1
  * v' = q3q2q1v<sub>quat</sub>q1<sup>-1</sup>q2<sup>-1</sup>q3<sup>-1</sup>

## Quaternions to Rotation matrix

* Can be converted to and from 3d rotation matrix rep:
  ![Quaternion to matrix](quat_to_mat.png)


