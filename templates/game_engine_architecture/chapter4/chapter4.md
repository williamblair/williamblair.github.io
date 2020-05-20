# Chapter 4

## Flynn's Taxonomy (parallel operation types)

* Single Instruction Single Data (SISD)
  * ![SISD Diagram](sisd_diagram.png)
* Multiple Instruction Multiple Data (MIMD)
  * ![MIMD Diagram](mimd_diagram.png)
* Single Instruction Multiple Data (SIMD)
  * ![SIMD Diagram](simd_diagram.png)
* Multiple Instruction Single Data (MISD)
  * ![MISD Diagram](misd_diagram.png)

## Pipelining

* Instruction level parallelism (ILP)
* Non-pipelined CPU execution:
  * ![Non-pipelined CPU](no_pipeline.png)
* Non-pipelined CPU execution:
  * ![Pipelined CPU](pipeline.png)

## Branch Prediction in games consoles

* PS3 Cell prcessor had poor branch prediction
* PS4 and Xbox ONE AMD Jaguar has advanced branch prediction 
  hardware

## Fast branch-avoidant code for safe floating point division 
### (handle divide-by-zero)

```
int SafeFloatDivide_pred(float a, float b, float d)
{
  // convert Boolean (b != 0.0f) into either 1U or 0U
  const unsigned condition = (unsigned)(b != 0.0f);

  // convert 1U -> 0xFFFFFFFFU
  // convert 0U -> 0x00000000U
  const unsigned mask = 0U - condition;

  // calculate quotient (will be QNaN if b == 0.0f)
  const float q = a / b;

  // select quotient when mask is all ones, or default
  // value d when mask is all zeros (NOTE: this won't
  // work as written -- you'd need to use a union to
  // interpret the floats as unsigned for masking)
  const float result = (q & mask) | (d & ~mask);
  return result;
}
```
This technique for selecting one of two possible values is
called predication or a select operation

## Very Long Instruction Word (VLIW) CPU Design

* The CPU is made up of multiple of the same compute element
  (ALU, FPU, etc.)
* Each "instruction" is comprised of 2 or more instructions,
  one for each compute element
* Example of this is PS2: The vector units VU0 and VU1 can
  dispatch two instructions per cycle each

4.3 explicit parallelism

