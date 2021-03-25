Notes from [Linear Algebra for Game Developers Part 1](http://blog.wolfire.com/2009/07/linear-algebra-for-game-developers-part-1/)

## Vector examples:

![Vector examples](http://cdn.wolfire.com/blog/linear/grid.jpg)

* position
* velocity
* direction
* acceleration
* ...

Important:

* keep track of units
  * velocity is in meters/second or in pixels/frame
* remember the context of the vector
  * `(0, 1)` is a velocity or a direction?
  * Same vector, different meanings

Example: `(3, 5, 2) `is a position in meters

![Positional vector example](http://cdn.wolfire.com/blog/linear/3D.jpg)

1. east (3 methers east from the origin)
2. up (z axis)
3. north

Negative numbers represent opposite directions (west, down south).

## Vector addition

    (0,1,4) + (3,-2,5) = (0+3, 1-2, 4+5) = (3,-1,9)

Addition is a component-wise operation.

Useful for: physics integration

    loop:
        position += velocity
        velocity += acceleration

## Vector subtraction

Useful for getting a vector that points from one position to another.

    Distance vector = destination - origin

![Vector subtraction example](http://cdn.wolfire.com/blog/linear/laser.jpg)

    V1 = rifleman position
    V2 = robot position
    v3 = laser beam = V2 - V1
