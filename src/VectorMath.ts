import {Angle} from './Angle'

const directions = {
  up:     90,
  down:   270,
  left:   180,
  right:  0
}

function velocityFromAcceleration(accVector: Vector, millis: number): Vector {
    return new Vector(
      accVector.magnitude * millis / 1000,
      accVector.angle
    )
}
  
class Vector {
  public magnitude: number
  public angle: number
  public d: number
  
  constructor(magnitude: number, angle: number, d: number = 1) {
    this.magnitude = magnitude
    this.angle = Angle.boundAngle(angle)			
    this.d = d
  }

  static getVectorFromComponents(x: number, y: number, d: number = 1): Vector {
    const magnitude = Math.sqrt(x * x + y * y)
    const angle = Angle.angleFromComponents(y, x)

    return new Vector(magnitude > 1e-10 ? magnitude : 0, angle)
  }

  static combineVectors(vector_a: Vector, vector_b: Vector): Vector {
    const vector_a_components = vector_a.getVectorComponents()
    const vector_b_components = vector_b.getVectorComponents()

    const combinedVectorComponents = {
      x: vector_a_components.x + vector_b_components.x,
      y: vector_a_components.y + vector_b_components.y
    }

    return Vector.getVectorFromComponents(combinedVectorComponents.x, combinedVectorComponents.y)
  }

  getVectorComponents(): {x: number, y: number} {
    const [magnitude, angle] = [this.magnitude, this.angle]

    const xComp = Angle.cos(angle) * magnitude
    const yComp = Angle.sin(angle) * magnitude
    
    return {x: xComp, y: yComp}
  }

  normal(): Vector {
    return new Vector(this.magnitude, this.angle + 90)
  }
}

export { Vector, directions, velocityFromAcceleration }