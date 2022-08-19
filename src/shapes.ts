import { Angle } from "./Angle";
import { Bond } from "./bond";
import { Particle, position } from "./particle";
import { Vector } from "./VectorMath";

export class Circle {
    private _particles: Particle[] = []
    private _bonds: Bond[] = []
    private _forces: Vector[] = []
    private _pressure: number
    private _normalArea: number
    
    constructor(radius: number, particles: number = 36, mass: number = 5, pressure : number = 1, rate : number = 100) {
        this.assembleShape(radius, particles, rate, mass)
        this._normalArea = this.calcShapeArea()
        this._pressure = pressure
    }

    private calcBondLength(radius: number, angle: number): number {
        const cos = Angle.cos(angle / 2)
        const h = radius * cos

        let base = (radius * radius) - (h * h)
        base = Math.sqrt(base)

        return base * 2
    }

    private assembleShape(radius: number, particles: number, rate: number, mass: number): void {
        const bondAngle : number = 360 / particles
        const bondLength : number = this.calcBondLength(radius, bondAngle)
        const particleMass = mass / particles
        
        const center : position = { x : 250, y : 250 }
        let nextParticleVector : Vector = new Vector(radius, 90)

        const startParticle : Particle = new Particle({x: center.x, y: center.y + radius}, particleMass , false)
        let currParticle: Particle = startParticle
        
        for(; particles > 0; particles--) {
            this._particles.push(currParticle)

            nextParticleVector = new Vector(nextParticleVector.magnitude, nextParticleVector.angle + bondAngle)

            const nextParticleVector_Components : { x : number, y: number } = nextParticleVector.getVectorComponents()
            
            let pos = {
                x: center.x + nextParticleVector_Components.x,
                y: center.y + nextParticleVector_Components.y
            }

            const nextParticle : Particle = particles === 1 ? startParticle : new Particle(pos, particleMass)
            
            this._bonds.push(new Bond(currParticle, nextParticle, bondLength, rate))

            currParticle = nextParticle
        }
    }

    public calcShapeArea(): number {
        let area = 0
        
        this._bonds.forEach(bond => {
            area += bond.gaussSum()
        })

        return area
    }

    private getCenter(): position {
        let center = {x: 0, y: 0}
    
        this._particles.forEach(particle => {
            center.x += particle.pos.x
            center.y += particle.pos.y
        })

        center.x /= this._particles.length
        center.y /= this._particles.length

        return center
    }

    private calcPressureForce(): number {
        let currentArea = this.calcShapeArea()
        currentArea = currentArea ? currentArea : Number.MIN_SAFE_INTEGER
        
        const pressure = (this._normalArea * this._pressure) / currentArea

        return pressure
    }

    private addTotalSystemForces(): void {
        let pressure = this.calcPressureForce()

        this._bonds.forEach(bond => {
            bond.addTensionForce()
            bond.addPressureForce(pressure)
        })
    }

    public move(elapsed_sec: number) {
        this.addTotalSystemForces()

        this._particles.forEach(particle => particle.move(elapsed_sec))
    }

    //View Rendering Methods

    private paintArea(canvasContext: CanvasRenderingContext2D): void {
        const startParticlePos = this._particles[0].pos

        canvasContext.moveTo(startParticlePos.x, canvasContext.canvas.height - startParticlePos.y)

        this._particles.forEach((particle, i) => {
            if(i > 0)                
                canvasContext.lineTo(particle.pos.x, canvasContext.canvas.height - particle.pos.y)
        })

        const currentArea = this.calcShapeArea()

        const areaRatio = (currentArea - this._normalArea) / this._normalArea

        const fillColor = {
            r: areaRatio < 0 ? Math.ceil((-areaRatio) * 256) : 0,
            b: areaRatio >= 0 ? Math.ceil((areaRatio / 10) * 255) : 0
        }

        canvasContext.closePath()

        canvasContext.fillStyle = "rgba(" + (255 - fillColor.b) + "," + (255 - fillColor.b - fillColor.r) + "," + (255 - fillColor.r) +",0.5)"
        canvasContext.fill()
    }

    private paintCenter(canvasContext: CanvasRenderingContext2D) : void {
        canvasContext.beginPath()
        const center = this.getCenter()
        canvasContext.arc(center.x, canvasContext.canvas.height - center.y, 5, 0, Angle.degreesToRad(360))
        canvasContext.fillStyle = "green"
        canvasContext.fill()
    }

    public paint(canvasContext: CanvasRenderingContext2D): void {
        

        this.paintArea(canvasContext)
        this.paintCenter(canvasContext)

        this._bonds.forEach(bond => bond.paint(canvasContext))
        this._particles.forEach(particle => particle.paint(canvasContext))        
    }
}
