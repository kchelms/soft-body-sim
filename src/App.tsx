import React, { Component } from 'react';
import './App.css';
import { Circle } from './shapes';

type ViewProps = {
  scaleFactor: number
}

type ViewState = {
  size: {x: number, y: number},
  frames: number
}

class View extends Component < ViewProps, ViewState > {
  private circle: Circle
  private canvasContext: CanvasRenderingContext2D | null = null
  private frames: number = 0  
  
  constructor(props: ViewProps) {
    super(props)

    this.state = {
      size: {x: 500, y: 500},
      frames: 0
    }

    this.circle = new Circle(50, 180)
  }

  componentDidMount(): void {
    const canvas = document.getElementById('canvas') as HTMLCanvasElement

    if(canvas) {
      const canvasContext = canvas.getContext('2d')

      if(canvasContext) {
        this.canvasContext = canvasContext
      }     
    }
    
    this.paint()
  }

  paint() {
      this.canvasContext?.clearRect(0, 0, this.state.size.x, this.state.size.y)

      this.circle.paint(this.canvasContext as CanvasRenderingContext2D)
      
      this.setState({frames: this.state.frames + 1})

      window.requestAnimationFrame(() => {this.paint()})
  }

  render(): React.ReactNode {
    return (
      <div>
        <canvas id={"canvas"} height={"500px"} width={"500px"} />
        <p>{this.state.frames}</p>
      </div>
    )
  }
}

function App() {
  return (
    <div className="App">
      <View scaleFactor={1} />
    </div>
  );
}

export default App;
