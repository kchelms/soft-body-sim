import { Angle } from "./Angle";
import { Bond } from "./bond";
import { Particle, position } from "./particle";
import { Vector } from "./VectorMath";

export class Circle {
    private _particles : Particle[] = []
    private _bonds : Bond[] = []
    private _forces : Vector[] = []
    
    constructor(radius: number, particles: number = 36, mass: number = 5, pressure : number = 10, rate : number = 10) {
        this.assembleShape(radius, particles, rate)
    }

    private assembleShape(radius: number, particles: number, rate: number): void {
        const bondAngle : number = 360 / particles
        const bondLength : number = Angle.tan(bondAngle) * radius
        
        const center : position = { x : 250, y : 250 }
        let nextParticleVector : Vector = new Vector(radius, 90)

        const startParticle : Particle = new Particle(Object.assign({}, {x: center.x, y: center.y + radius}))
        let currParticle: Particle = startParticle
        
        for(; particles > 0; particles--) {
            this._particles.push(currParticle)

            nextParticleVector = new Vector(nextParticleVector.magnitude, nextParticleVector.angle + bondAngle)

            const nextParticleVector_Components : { x : number, y: number } = nextParticleVector.getVectorComponents()
            
            let pos = {
                x: center.x + nextParticleVector_Components.x,
                y: center.y + nextParticleVector_Components.y
            }

            const nextParticle : Particle = particles === 1 ? startParticle : new Particle(pos)
            
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

    public paint(canvasContext: CanvasRenderingContext2D): void {
        this._particles.forEach(particle => {
            particle.paint(canvasContext)
        })
    }
}
