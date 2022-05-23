import React, { Component } from 'react';
import { grommet, Grommet, Box, RangeInput } from 'grommet';
import { deepMerge } from 'grommet/utils';


const customFocus = deepMerge(grommet, {
    global: {
        focus: {
            border: {
                color: '#0000ffff',
            },
            shadow: {
                color: '#0000ffff',
                size: '0px',
            }
        },
    },
});


export default class AudioProgress extends Component{
    constructor(props) {
        super(props);
        this.state = {
            length: 160,
            currentTime: 0,
            audioPath: "http://localhost:8080/" + props.audioPath,
            isPlaying: false,
            isStarted: false,
            speaker: "Male",
            dimension: "Arousal",

        };

        this.audio = new Audio(this.state.audioPath);
        this.tickingTimer = this.tickingTimer.bind(this);
        this.handleKeyPressed = this.handleKeyPressed.bind(this);
    }


    componentDidMount(){
        if(this.props.condition == "slider") {
            document.addEventListener("keydown", this.handleKeyPressed, false);
        }
        this.timerId = setInterval(this.tickingTimer, 30);
        this.audio.volume = this.props.volume;
    }

    
    componentWillUnmount() {
        if(this.props.condition == "slider") {
            document.removeEventListener("keydown", this.handleKeyPressed, false);
        }
        clearInterval(this.timerId);
        this.audio.pause();
        this.audio.currentTime = 0;
    }


    componentWillReceiveProps(nextProps){
        if(nextProps.audioPath !== this.props.audioPath){
            this.setState({audioPath: nextProps.audioPath});
            this.audio = new Audio(nextProps.audioPath);
        }

        if(nextProps.isStarted !== this.props.isStarted){
            this.setState({isStarted: nextProps.isStarted});
        }

        if(nextProps.speaker !== this.props.speaker){
            this.setState({ speaker: nextProps.speaker });
            this.audio.currentTime = 0;
        }

        if(nextProps.length !== this.state.length){
            this.setState({length: nextProps.length});
        }

        if(nextProps.isPlaying !== this.state.isPlaying){
            if(nextProps.isPlaying){
                if(this.audio.readyState >= 2){
                    this.audio.play();
                 }else{
                    alert("audio file not loaded completely. Please wait.");
                }
            }else{
                this.audio.pause();
            }
            this.setState({ isPlaying: nextProps.isPlaying });
        }

        if(nextProps.reset){
            this.audio.currentTime = 0;
        }
    
        if(nextProps.volume !== this.props.volume){
        this.audio.volume = this.props.volume;
        }
    }


    tickingTimer() {
        var that = this;
        that.setState({currentTime: that.audio.currentTime});
        that.props.getCurrentTime(that.audio.currentTime);
    }


    handleKeyPressed(event) {
        var that = this;
        if(event.keyCode === 37 && that.state.isStarted) {
        //Do whatever when left is pressed
            console.log("left pressed.");
            that.audio.currentTime = Math.max(0, that.audio.currentTime - 10);
        }
        if(event.keyCode === 39 && that.state.isStarted) {
        //Do whatever when right is pressed
            console.log("right pressed.");
            that.audio.currentTime = Math.min(that.state.length, that.audio.currentTime + 10);
        }
    }


    render() {
        return (
            <Box justify="center" align="center" style={{ width: "90%", height: "30px", display: "inline-block"}}>
                
                <Grommet theme={customFocus}>

                    <Box width="large" background="light-1" >
            
                        <RangeInput min={0} max={1} step={0.005} value={this.audio.currentTime / this.state.length} />

                    </Box>

                </Grommet>
            
            </Box>
        );
    }
}