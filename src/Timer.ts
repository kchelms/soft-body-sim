export class Timer {    
    private _tickLen: number = 17
    private _prevFrame: number = Date.now()
    private _frame: number = 0
    private _play: boolean = true
    private _playspeed: number = 1

    public timeElapsed(): number {
        this._frame++

        const elapsed_millis = this._play ? (Date.now() - this._prevFrame) : this._tickLen
        const elapsed_sec = elapsed_millis / 1000

        return elapsed_sec * this._playspeed                
    }

    public setPlaySpeed(speed: number) {
        speed = speed < 10 ? speed : 10
        speed = speed > 0.001 ? speed : 0.001

        this._playspeed = speed
    }

    public play(): void {
        this._play = true
    }

    public pause(): void {
        this._play = false
    }

    public getFrameNum(): number {
        return this._frame
    }

    public isPlaying(): boolean {
        return this._play
    }
}