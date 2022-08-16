import { Angle } from "./Angle";
import { Bond } from "./bond"
import { Vector } from "./VectorMath";

export type position = {x: number,y: number}
type force = Vector
type velocity = Vector
type acceleration = Vector

export class Particle {
    public pos: position
    private bonds: Bond[] = []
    private forces: force[] = []
    private mass: number
    private velocity : velocity = new Vector(0, 0)
    private lastFrame: number = Date.now()
    
    constructor(pos: position, mass: number = 10) {
        this.pos = pos
        this.mass = mass
    }

    public bondToParticle(target: Particle, distance: number, rate: number): void {
        const newBond: Bond = new Bond(this, target, distance, rate)
        this.bonds.push(newBond)
        target.addBond(newBond)
    }

    public addBond(bond: Bond): void {
        if(!this.bonds.includes(bond)) 
            this.bonds.push(bond)
    }

    private totalAcceleration(): acceleration {
        let totalForce = new Vector(0,0);

        this.forces.forEach(force => totalForce = Vector.combineVectors(totalForce, force))

        let totalAcceleration = new Vector(totalForce.magnitude * this.mass, totalForce.angle)

        return Vector.combineVectors(totalAcceleration, new Vector(9.8, 270))
    }

    private move(): void {
        const acceleration = this.totalAcceleration()
        const timeSinceLastFrame = (Date.now() - this.lastFrame) / 1000

        const dV = new Vector((acceleration.magnitude * timeSinceLastFrame * 0.5), acceleration.angle)

        const resultant_v = Vector.combineVectors(this.velocity, dV)

        const d_components = new Vector(resultant_v.magnitude * timeSinceLastFrame, resultant_v.angle).getVectorComponents()
        
        this.pos.x += d_components.x
        this.pos.y += d_components.y

        this.forces = []
    }

    public addForce(force: force): void {
        this.forces.push(force)
    }

    public calcShapeArea(area: number = 0, addedBonds: Bond[] = []): number {
        this.bonds.forEach(bond => {
            if(!addedBonds.includes(bond)) {
                area += bond.gaussSum()
                addedBonds.push(bond)

                area += bond.particles.to.calcShapeArea(area, addedBonds)
            }
        })

        return area
    }

    private keepInVeiw(canvasDim: {x: number, y: number}): void {
        if(this.pos.x < 0)
            this.pos.x = 0

        if(this.pos.y < 0)
            this.pos.y = 0

        if(this.pos.x > canvasDim.x)
            this.pos.x = canvasDim.y

        if(this.pos.y > canvasDim.y)
            this.pos.y = canvasDim.y
    }

    public paint(canvasContext: CanvasRenderingContext2D): void {
        const canvasDim = {
            x: canvasContext.canvas.width,
            y: canvasContext.canvas.height
        }

        this.move()

        this.keepInVeiw(canvasDim)

        canvasContext.beginPath()     
        
        canvasContext.arc(this.pos.x, canvasDim.y - this.pos.y, 5, 0, Angle.degreesToRad(360))

        canvasContext.fillStyle = "red"
        canvasContext.fill()
    }
}