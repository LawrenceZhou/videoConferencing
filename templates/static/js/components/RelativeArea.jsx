import React, { Component } from 'react';
import { Stage, Layer, Rect, Text, Line, Group, RegularPolygon, Arrow } from 'react-konva';
import Konva from 'konva';
import { Box } from 'grommet';


export default class RelativeArea extends Component{
    constructor(props) {
        super(props);
        this.state = {
            length: 800,
            offsetY: 15,
            horizontalLines: [15, 65],  
            verticalLines: [{x:0, time:"00:00"},
                            {x:150, time:"00:15"},
                            {x:300, time:"00:30"},
                            {x:450, time:"00:45"},
                            {x:600, time:"01:00"},
                            {x:750, time:"01:15"},
                            {x:900, time:"01:30"},
                            {x:1050, time:"01:45"},
                            {x:1200, time:"02:00"},
                            {x:1350, time:"02:15"},
                            {x:1500, time:"02:30"}],
            boxes: props.boxesPassed,
            boxesTimeOrder: props.boxesPassed,
            currentTime: 0,
            audioPath: "http://label.yijunzhou.xyz/" + props.audioPath,
            isPlaying: false,
            isStarted: false,
            speaker: "Male",
            dimension: "Arousal",
            canvasHeight: 80,
            currentSpeakerSentenceNumber: 0,
            boxesHistory: [],
            operationBoxHistory: [],
            rewindTimes: 0,
        };

        this.audio = new Audio(this.state.audioPath);
        this.tickingTimer = this.tickingTimer.bind(this);
        this.handleKeyPressed = this.handleKeyPressed.bind(this);
        this.strPadLeft = this.strPadLeft.bind(this);
    }


    componentDidMount(){
        //if(this.props.condition != "slider") {
            document.addEventListener("keydown", this.handleKeyPressed, false);
        //}
        this.timerId = setInterval(this.tickingTimer, 30);
        var boxes_ = this.props.boxesPassed;
        var boxes_top = boxes_.filter(box => box.speaker == this.state.speaker[0]);
        var boxes_btm = boxes_.filter(box => box.speaker != this.state.speaker[0]);
        var _boxes = boxes_btm.concat(boxes_top);
        this.setState({length: this.props.length, speaker: this.props.speaker, dimension: this.props.dimension, boxes: _boxes, boxesTimeOrder: this.props.boxesPassed, currentSpeakerSentenceNumber: boxes_top.length, boxesHistory: [JSON.parse(JSON.stringify(_boxes))], operationBoxHistory: []});
        this.audio.volume = this.props.volume;
    }

    
    componentWillUnmount() {
        //if(this.props.condition != "slider") {
            document.removeEventListener("keydown", this.handleKeyPressed, false);
        //}
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

        if(nextProps.length !== this.props.length){
            var verticalLines_ = [];
            for (var x_ = 0; x_ < Math.max(nextProps.length, 900) ; x_ += 150) {
                var minutes = Math.floor(x_ / 10 / 60);
                var seconds = Math.floor(x_ / 10 - minutes * 60);
                verticalLines_.push({x: x_, time: this.strPadLeft(minutes, '0', 2) + ':' + this.strPadLeft(seconds, '0', 2)})
            }
            this.setState({length: Math.max(800, nextProps.length), verticalLines: verticalLines_});
        }

        if(nextProps.boxesPassed !== this.props.boxesPassed){
            var boxes_ = JSON.parse(JSON.stringify(nextProps.boxesPassed));
            var boxes_top = boxes_.filter(box => box.speaker == nextProps.speaker[0]);
            var boxes_btm = boxes_.filter(box => box.speaker != nextProps.speaker[0]);
            var _boxes = boxes_btm.concat(boxes_top);
            this.setState({rewindTimes: 0, boxes: _boxes, boxesTimeOrder: nextProps.boxesPassed, currentSpeakerSentenceNumber: boxes_top.length, boxesHistory: [JSON.parse(JSON.stringify(_boxes))], operationBoxHistory: []});
        }

        if(nextProps.speaker !== this.props.speaker){
            this.setState({ speaker: nextProps.speaker });
            var boxes_ = JSON.parse(JSON.stringify(nextProps.boxesPassed));
            var boxes_top = boxes_.filter(box => box.speaker == nextProps.speaker[0]);
            var boxes_btm = boxes_.filter(box => box.speaker != nextProps.speaker[0]);
            var _boxes = boxes_btm.concat(boxes_top);
            this.setState({rewindTimes: 0, boxes: _boxes, currentSpeakerSentenceNumber: boxes_top.length, boxesHistory: [JSON.parse(JSON.stringify(_boxes))], operationBoxHistory: []});
            this.audio.currentTime = 0;
        }

        if(nextProps.dimension !== this.props.dimension){
            this.setState({ dimension: nextProps.dimension });
            var boxes_ = JSON.parse(JSON.stringify(nextProps.boxesPassed));
            var boxes_top = boxes_.filter(box => box.speaker == nextProps.speaker[0]);
            var boxes_btm = boxes_.filter(box => box.speaker != nextProps.speaker[0]);
            var _boxes = boxes_btm.concat(boxes_top);
            this.setState({rewindTimes: 0, boxes: _boxes, currentSpeakerSentenceNumber: boxes_top.length, boxesHistory: [JSON.parse(JSON.stringify(_boxes))], operationBoxHistory: []});
            this.audio.currentTime = 0;
        }

        if(nextProps.isPlaying !== this.state.isPlaying){
            if(nextProps.isPlaying){
                this.audio.play();
            }else{
                this.audio.pause();
            }
            this.setState({ isPlaying: nextProps.isPlaying });
        }

        if(nextProps.reset){
            this.setState({rewindTimes: 0, boxes: JSON.parse(JSON.stringify(this.state.boxesHistory[0])), boxesHistory: [JSON.parse(JSON.stringify(this.state.boxesHistory[0]))], operationBoxHistory: []});
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
        if(event.keyCode === 27 && that.state.isStarted) {
        //Do whatever when esc is pressed

        }

        if(event.keyCode === 32 && that.state.isStarted) {
        //Do whatever when space is pressed

        }

        if(event.keyCode === 38 && that.state.isStarted) {
        //Do whatever when up is pressed
            console.log("up pressed.");
            if(that.props.condition != 'slider'){
                var boxes_ = that.state.boxes;
                var boxes__ = JSON.parse(JSON.stringify(that.state.boxes));
                var boxesHistory_ = that.state.boxesHistory;
                boxesHistory_.push(boxes__);

                for (var i = 0; i < boxes_.length; i++) {
                    if (that.state.currentTime * 10 >= boxes_[i].x && that.state.currentTime * 10 <= boxes_[i].end && that.state.speaker[0] == boxes_[i].speaker) {
                        var operationBoxHistory_ = that.state.operationBoxHistory;
                        operationBoxHistory_.push(i);
                        that.setState({boxesHistory: boxesHistory_, operationBoxHistory: operationBoxHistory_});
                        if (boxes_[i].relative < 2){
                            boxes_[i].relative++;
                        }
                        break;
                    }
                }

                that.setState({boxes: boxes_});
            }
            else{
                that.props.handleKeyPressedForSlider(event);
            }
        }

        if(event.keyCode === 40 && that.state.isStarted) {
        //Do whatever when down is pressed
            console.log("down pressed.");
            if(that.props.condition != 'slider' ){
                var boxes_ = that.state.boxes;
                var boxes__ = JSON.parse(JSON.stringify(that.state.boxes));
                var boxesHistory_ = that.state.boxesHistory;
                boxesHistory_.push(boxes__);

                for (var i = 0; i < boxes_.length; i++) {
                    if (that.state.currentTime * 10 >= boxes_[i].x && that.state.currentTime * 10 <= boxes_[i].end && that.state.speaker[0] == boxes_[i].speaker) {
                        var operationBoxHistory_ = that.state.operationBoxHistory;
                        operationBoxHistory_.push(i);
                        that.setState({boxesHistory: boxesHistory_, operationBoxHistory: operationBoxHistory_});
                        if (boxes_[i].relative > -2){
                            boxes_[i].relative--;
                        }
                        break;
                    }
                }

                that.setState({boxes: boxes_});
            }
            else{
                that.props.handleKeyPressedForSlider(event);
            }
        }

        if(event.keyCode === 37 && that.state.isStarted) {
        //Do whatever when left is pressed
            console.log("left pressed.");
            boxes_ = that.state.boxes;
            console.log("rewind times: ", that.state.rewindTimes + 1);
            that.setState({rewindTimes: that.state.rewindTimes + 1});

            for (var i = boxes_.length - 1; i > boxes_.length - that.state.currentSpeakerSentenceNumber; i--) {
                if (that.state.currentTime * 10 >= boxes_[i].x) {
                    if (that.audio.currentTime * 10 - boxes_[i].x < 5) {
                        that.props.updateScrollPosition(boxes_[i - 1].y );
                        that.audio.currentTime = boxes_[i - 1].x / 10;
                    }else {
                        that.props.updateScrollPosition(boxes_[i].y );
                        that.audio.currentTime = boxes_[i].x / 10;
                    }
        
                    break;
                }
            }
        }

        if(event.keyCode === 39 && that.state.isStarted) {
        //Do whatever when right is pressed
            console.log("right pressed.");
            var boxes_ = that.state.boxes;

            if (that.audio.currentTime * 10 < that.state.boxesTimeOrder[0].x) {
                that.audio.currentTime = that.state.boxesTimeOrder[0].x / 10;
                return;
            }else if (that.audio.currentTime * 10 < boxes_[boxes_.length - that.state.currentSpeakerSentenceNumber].x) {
                that.audio.currentTime = boxes_[boxes_.length - that.state.currentSpeakerSentenceNumber].x / 10;
                return;
            }

            for (var i = boxes_.length - 2; i >= boxes_.length - that.state.currentSpeakerSentenceNumber; i--) {
                if (that.state.currentTime * 10 >= boxes_[i].x) {
                    that.audio.currentTime = boxes_[i + 1].x / 10;
                    that.props.updateScrollPosition(boxes_[i + 1].y );
                    break;
                }
            }
        }
    }


    strPadLeft(string, pad, length) {
        return (new Array(length + 1).join(pad) + string).slice(-length);
    }


    render() {
        return (
            <Box>
                
                <Stage width={this.state.length} height={this.state.canvasHeight} >
      
                    <Layer >
          
                        <Rect x={0} y={0} width={this.state.length} height={this.state.canvasHeight} fill={'white'} shadowBlur={0} />

                        {this.props.condition == 'withHighlight' && this.state.boxes.map((box, i) => (

                            <Rect x={box.x} y={0} width={box.end - box.x} height={this.state.offsetY}
                                fill={(box.speaker == this.state.speaker[0] && (this.state.dimension == "Arousal"? box.highlightA : box.highlightP))? '#F8FF95C0' : '#F8FF9500'} />
                        ))}

                        {this.state.horizontalLines.map((line, i) => (
                            <Line key={i} points={[0, line, this.state.length, line]} stroke={'grey'} strokeWidth={1} lineCap="round" />
                        ))}

                        {this.state.verticalLines.map((line, i) => (
                            <Group x={line.x} y={0}>
                                
                                <Line key={i} points={[0, this.state.offsetY, 0, this.state.canvasHeight]} stroke={'grey'} strokeWidth={0.25} lineCap="round" />
               
                                <Text x={1} y={this.state.canvasHeight - this.state.offsetY + 2} width={60} height={this.state.offsetY - 2 } fontSize={this.state.offsetY - 3} text={line.time} fill='grey' strokeWidth={0.5} />
                                
                            </Group>
                        ))}

                        {this.state.boxes.map((box, i) => (

                            <Group x={box.x} y={box.y}>
                                
                                <Rect x={0} y={0} width={box.end - box.x} height={48} shadowBlur={box.speaker == this.state.speaker[0]? 1 : 0} cornerRadius={[3, 3, 3, 3]}
                                    fill={box.speaker == 'M'? (this.state.speaker == "Male"? this.props.maleColor : '#CCCCCC') : (this.state.speaker == "Female"? this.props.femaleColor : '#CCCCCC')} />
              
                                {this.props.condition == 'slider' && <Text x={1} y={18} width={29} height={this.state.offsetY} fontSize={14} text={this.props.sliderResults[box.sentenceID]} fill='white' strokeWidth={1} align="start" visible={box.sentenceID in this.props.sliderResults} />}

                                {false && <Text x={1} y={18} width={29} height={this.state.offsetY} fontSize={14} text={box.indexS + 1} fill='white' strokeWidth={1} align="start" visible={box.speaker == this.state.speaker[0]} />}
                                
                                {this.props.condition != 'slider' && [...Array(Math.abs(box.relative))].map((e, r_i) => { return <Arrow x= {7 * r_i + 4/*(box.indexS < 9 ? 14 : 22)*/} y= {31} points={[0, (box.relative < 0 ? -1 : 0) * 14, 0, (box.relative > 0 ? -1 : 0) * 14]}
                                    pointerLength ={4} pointerWidth={4} fill={'white'} stroke={'white'} strokeWidth={2} /> })}

                                {(this.props.condition != 'slider'&& box.relative == 0 && this.props.seenSentences.has(box.sentenceID))  && <Line points={[4, 25, 14, 25]} stroke={'white'} strokeWidth={2} />}

                            </Group>
                        ))}

                        <Rect x={this.state.currentTime * 10} y={0} width={2} height={this.state.canvasHeight} fill={'#9A0680'} />

                        {this.state.isPlaying? 
                            <RegularPolygon x={this.state.currentTime * 10 + 10} y={this.props.scrollTop + this.state.canvasHeight - 8} sides={3} radius={8} scaleY={1.0} fill={'green'}rotation={90} />:
                            <Rect x={this.state.currentTime * 10 + 5} y={this.props.scrollTop + this.state.canvasHeight - 13} width={11} height={11} fill={'red'} />
                        }

                    </Layer>

                </Stage>

            </Box>
        );
    }
}