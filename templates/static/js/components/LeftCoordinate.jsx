import React, { Component } from 'react';
import { Stage, Layer, Rect, Text, Line, Arrow } from 'react-konva';
import Konva from 'konva';
import { Box } from 'grommet';


export default class LeftCoordinate extends Component{
    constructor(props) {
        super(props);
        this.state = {  
            horizontalLines: [50, 100, 150, 200],
            canvasHeight: 250,
        dimension: "Arousal",
        };
    }


    componentWillReceiveProps(nextProps){
        if (nextProps.dimension !== this.props.dimension){
            this.setState({ dimension: nextProps.dimension });
        }
    }


    render() {
        return (
            <Box>
            
                <Stage width={50} height={this.state.canvasHeight} >
            
                    <Layer>
        
                        <Rect x={0} y={0} width={50} fill={'white'} shadowBlur={0} height={this.state.canvasHeight} />
        
                        <Arrow x= {45} y= {this.state.canvasHeight - 2} points={[0, 0, 0, -(this.state.canvasHeight - 6)]}
                            pointerLength ={5} pointerWidth={5} fill={'grey'} stroke={'grey'} strokeWidth={2} />

                        {this.state.horizontalLines.map((line, i) => (
                            <Line key={i} points={[0, line, 50, line]} stroke={'grey'} strokeWidth={1} lineCap="round" />
                        ))}
       
                        <Text x={2} y={2} width={40} height={13} fontSize={12} text={"High"} fill='black' strokeWidth={1} 
                            align="center" />

                        <Text x={2} y={15} width={40} height={11} fontSize={10} text={this.state.dimension} fill='black' 
                            strokeWidth={1} align="center" />

                        <Text x={2} y={this.state.canvasHeight - 24} width={40} height={13} fontSize={12} text={"Low"}
                            fill='black' strokeWidth={1} align="center" />

                        <Text x={2} y={this.state.canvasHeight - 11} width={40} height={11} fontSize={10} text={this.state.dimension}
                            fill='black' strokeWidth={1} align="center" />
      
                    </Layer>
      
                </Stage>
      
            </Box>
        );
    }
}