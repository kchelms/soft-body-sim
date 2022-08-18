import { Particle, position } from "./particle";
import { Vector } from "./VectorMath";

export class Bond {
    public particles: {to: Particle, from: Particle}
    
    private normal_length: number
    private rate: number

    constructor(from: Particle, to: Particle, length: number, rate: number) {
        this.particles = {from: from, to: to}
        this.normal_length = length
        this.rate = rate
    }

    private getNormalVector(): Vector {
        const toPos : position = this.particles.to.pos
        const fromPos : position = this.particles.from.pos

        let normalVector : Vector = Vector.getVectorFromComponents(fromPos.x - toPos.x, fromPos.y - toPos.y)

        return normalVector.normal()
    }

    private getBondVector(): Vector {
        let [to, from] = [this.particles.to.pos, this.particles.from.pos]

        const bondVector = Vector.getVectorFromComponents(to.x - from.x, to.y - from.y)

        return bondVector
    }

    public addTensionForce(): void {
        let bondVector = this.getBondVector()

        if(Math.abs(bondVector.magnitude) > this.normal_length) {
            const stretchAmt = bondVector.magnitude - this.normal_length

            let tenionForce = this.rate * (stretchAmt / this.normal_length) / 2
            tenionForce = tenionForce > 0 ? tenionForce : 0

            this.particles.from.addForce(new Vector(tenionForce, bondVector.angle))
            this.particles.to.addForce(new Vector(tenionForce, bondVector.angle + 180))
        }
    }

    public addPressureForce(pressure: number): void {
        const pressureAngle = this.getNormalVector().angle
        const length = this.getBondVector().magnitude

        const pressureForceMagnitude = pressure * length / 2

        this.particles.from.addForce(new Vector(pressureForceMagnitude, pressureAngle))
        this.particles.to.addForce(new Vector(pressureForceMagnitude, pressureAngle))
    }

    public gaussSum(): number {
        const toPos : position = this.particles.to.pos
        const fromPos : position = this.particles.from.pos
        const normalVectorComponents : {x : number, y : number} = this.getNormalVector().getVectorComponents()

        const gaussSum = 0.5 * Math.abs(toPos.x - fromPos.x) * Math.abs(normalVectorComponents.x) * this.getBondVector().magnitude

        return gaussSum
    }

    public paint(canvasContext: CanvasRenderingContext2D): void {
        const [fromPos, toPos] = [this.particles.from.pos, this.particles.to.pos]
        
        canvasContext.beginPath()
        canvasContext.moveTo(fromPos.x, canvasContext.canvas.height - fromPos.y)
        canvasContext.lineTo(toPos.x, canvasContext.canvas.height - toPos.y)
        canvasContext.strokeStyle = "blue"
        canvasContext.stroke()
    }
}
