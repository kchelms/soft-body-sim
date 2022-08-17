export class Angle {
    static degreesToRad(deg: number): number {
        return Angle.boundAngle(deg) * Math.PI / 180
    }

    static radToDegrees(rad: number): number {
        return Angle.boundAngle(rad * 180 / Math.PI)
    }

    static sin(angle_deg: number): number {
        if (angle_deg === 180 || angle_deg === 360)
            return 0
    
        angle_deg = Angle.degreesToRad(angle_deg)
    
        return Math.sin(angle_deg)
    }

    static cos(angle_deg: number): number {
        if (angle_deg === 90 || angle_deg === 270)
            return 0
    
        angle_deg = Angle.degreesToRad(angle_deg)
    
        return Math.cos(angle_deg)
    }

    static angleFromComponents(y: number, x: number): number {
        const rad_result = Math.atan2(y, x)
    
        return Angle.radToDegrees(rad_result)
    }

    static boundAngle(angle_deg: number): number {
        if(angle_deg < 0)
            angle_deg += 360
    
        else if(angle_deg > 360)
            angle_deg -= 360
    
        else if(Object.is(angle_deg, -0))
            angle_deg = 180
    
        return angle_deg
    }
}
