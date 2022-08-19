import React, { ChangeEvent, Component } from 'react';
import './App.css';
import { Circle } from './shapes';
import { Timer } from './Timer';

type ViewProps = {
  scaleFactor: number
  timer: Timer
}

type ViewState = {
  size: {x: number, y: number}
}

class View extends Component < ViewProps, ViewState > {
  private circle: Circle
  private canvasContext: CanvasRenderingContext2D | null = null
  
  constructor(props: ViewProps) {
    super(props)

    this.state = {
      size: {x: 500, y: 500}
    }

    this.circle = new Circle(50, 45)
  }

  componentDidMount(): void {
    const canvas = document.getElementById('canvas') as HTMLCanvasElement

    if(canvas) {
      const canvasContext = canvas.getContext('2d')

      if(canvasContext) {
        this.canvasContext = canvasContext
      }     
    }
    
    this.renderFrame()
  }

  private renderFrame(): void {
    if(this.props.timer.isPlaying()) {
      const elapsed_sec = this.props.timer.timeElapsed()

      this.circle.move(elapsed_sec)

      this.paint()
    }

     window.requestAnimationFrame(() => {this.renderFrame()})
  }

  private paint() {
      this.canvasContext?.clearRect(0, 0, this.state.size.x, this.state.size.y)

      this.circle.paint(this.canvasContext as CanvasRenderingContext2D)
  }

  render(): React.ReactNode {
    return (
      <div>
        <canvas id={"canvas"} height={"500px"} width={"500px"} />
      </div>
    )
  }
}

type ControlsProps = {
  timer: Timer
}

type ControlsState = {
  paused: boolean
}

class Controls extends Component < ControlsProps, ControlsState > {
  constructor(props: ControlsProps) {
    super(props)

    this.state = {
      paused : false
    }
  }

  private play_pause = (): void => {
    this.state.paused ? this.props.timer.play() : this.props.timer.pause()

    this.setState({paused: !this.state.paused})
  }

  private setPlaySpeed = (evt: ChangeEvent<HTMLInputElement>): void => {
    const val = parseInt(evt.currentTarget.value, 10)

    this.props.timer.setPlaySpeed(Math.pow((val / 80), 2))
  }

  render(): React.ReactNode {
    return(
      <div>
        <button onClick={this.play_pause}>Play/Pause</button>
        <p>Step Frame Button</p>
        <label htmlFor='playspeed'>Play Speed</label>
        <input name="playspeed" type={"range"} defaultValue={80} onChange={this.setPlaySpeed} />
        <p>Zoom</p>
        <p>Gravity Controls</p>
      </div>     
    )
  }
}

class Sim extends Component {
  t: Timer = new Timer()

  render(): React.ReactNode {
    return (
      <div>
        <View scaleFactor={1} timer={this.t} />
        <Controls timer={this.t} />
      </div> 
    )
  }
}

function App() {
  return (
    <div className="App">
      <Sim />
    </div>
  );
}

export default App;
