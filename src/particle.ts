import { Angle } from "./Angle";
import { Vector } from "./VectorMath";

export type position = {x: number,y: number}
type force = Vector
type velocity = Vector
type acceleration = Vector

export class Particle {
    public pos: position
    private forces: force[] = []
    private mass: number
    private velocity : velocity = new Vector(0, 0)
    private lastFrame: number = Date.now()
    private _fixed: boolean
    
    constructor(pos: position, mass: number = 10, fixed: boolean = false) {
        this.pos = pos
        this.mass = mass
        this._fixed = fixed
    }

    private totalAcceleration(): acceleration {
        let totalForce = new Vector(0,0);

        this.forces.forEach(force => totalForce = Vector.combineVectors(totalForce, force))

        let totalAcceleration = new Vector(totalForce.magnitude / this.mass, totalForce.angle)

        totalAcceleration = Vector.combineVectors(totalAcceleration, new Vector(9.8, 270))

        return totalAcceleration
    }

    private move(): void {
        const acceleration = this.totalAcceleration()
        const timeSinceLastFrame = (Date.now() - this.lastFrame) / 100000

        const dV = new Vector((acceleration.magnitude * timeSinceLastFrame * 0.5), acceleration.angle)

        this.velocity = Vector.combineVectors(this.velocity, dV)
        const v_components = this.velocity.getVectorComponents()

        const d_components = {
            x: v_components.x * timeSinceLastFrame,
            y: v_components.y * timeSinceLastFrame
        }
        
        this.pos.x += (d_components.x / 1000)
        this.pos.y += (d_components.y / 1000)

        this.forces = []
    }

    public addForce(force: force): void {
        this.forces.push(force)
    }

    private keepInVeiw(canvasDim: {x: number, y: number}): void {
        if(this.pos.x < 0) {
            this.pos.x = 0
        }

        if(this.pos.y < 0) {
            this.pos.y = 0
        }

        if(this.pos.x > canvasDim.x) {
            this.pos.x = canvasDim.y
        }

        if(this.pos.y > canvasDim.y) {
            this.pos.y = canvasDim.y
        }
    }

    public paint(canvasContext: CanvasRenderingContext2D): void {
        const canvasDim = {
            x: canvasContext.canvas.width,
            y: canvasContext.canvas.height
        }

        if(!this._fixed)
            this.move()

        this.keepInVeiw(canvasDim)

        canvasContext.beginPath()     
        
        canvasContext.arc(this.pos.x, canvasDim.y - this.pos.y, 5, 0, Angle.degreesToRad(360))

        canvasContext.fillStyle = "red"
        //canvasContext.fill()
    }
}