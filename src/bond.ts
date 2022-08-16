import { Particle, position } from "./particle";
import { Vector } from "./VectorMath";

export class Bond {
    public particles: {to: Particle, from: Particle}
    
    private normal_length: number
    private length: number
    private rate: number

    constructor(from: Particle, to: Particle, length: number, rate: number) {
        this.particles = {from: from, to: to}
        this.normal_length = length
        this.length = length
        this.rate = rate
    }

    private getNormalVector(): Vector {
        const toPos : position = this.particles.to.pos
        const fromPos : position = this.particles.from.pos

        let normalVector : Vector = Vector.getVectorFromComponents(fromPos.x - toPos.x, fromPos.y - toPos.y)

        return normalVector.normal()
    }

    public gaussSum(): number {
        const toPos : position = this.particles.to.pos
        const fromPos : position = this.particles.from.pos
        const normalVectorComponents : {x : number, y : number} = this.getNormalVector().getVectorComponents()


        return 0.5 * Math.abs(toPos.x - fromPos.x) * normalVectorComponents.x * this.length
    }
}
