import React, { Component } from 'react';
import { Stage, Layer, Rect, Text, Line, Group, RegularPolygon } from 'react-konva';
import Konva from 'konva';
import { Box } from 'grommet';


export default class ComparisonArea extends Component{
    constructor(props) {
        super(props);
        this.state = {
            length: 800,  
            horizontalLines: [50, 100, 150, 200],
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
            canvasHeight: 250,
            currentSpeakerSentenceNumber: 0,
            boxesHistory: [],
            operationBoxHistory: [],
        };

        this.audio = new Audio(this.state.audioPath);
        this.tickingTimer = this.tickingTimer.bind(this);
        this.handleKeyPressed = this.handleKeyPressed.bind(this);
        this.strPadLeft = this.strPadLeft.bind(this);
    }


    componentDidMount(){
        if(this.props.condition != "slider") {
            document.addEventListener("keydown", this.handleKeyPressed, false);
        }
        this.timerId = setInterval(this.tickingTimer, 30);
        var boxes_ = this.props.boxesPassed;
        var boxes_top = boxes_.filter(box => box.speaker == this.state.speaker[0]);
        var boxes_btm = boxes_.filter(box => box.speaker != this.state.speaker[0]);
        var _boxes = boxes_btm.concat(boxes_top);
        this.setState({length: this.props.length, speaker: this.props.speaker, dimension: this.props.dimension, boxes: _boxes, boxesTimeOrder: this.props.boxesPassed, currentSpeakerSentenceNumber: boxes_top.length, boxesHistory: [JSON.parse(JSON.stringify(_boxes))], operationBoxHistory: []});
        this.audio.volume = this.props.volume;
    }

    
    componentWillUnmount() {
        if(this.props.condition != "slider") {
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

        if(nextProps.length !== this.props.length){
            var verticalLines_ = [];
            for (var x_ = 0; x_ < nextProps.length ; x_ += 150) {
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
            this.setState({boxes: _boxes, boxesTimeOrder: nextProps.boxesPassed, currentSpeakerSentenceNumber: boxes_top.length, boxesHistory: [JSON.parse(JSON.stringify(_boxes))], operationBoxHistory: []});
        }

        if(nextProps.speaker !== this.props.speaker){
            this.setState({ speaker: nextProps.speaker });
            var boxes_ = JSON.parse(JSON.stringify(nextProps.boxesPassed));
            var boxes_top = boxes_.filter(box => box.speaker == nextProps.speaker[0]);
            var boxes_btm = boxes_.filter(box => box.speaker != nextProps.speaker[0]);
            var _boxes = boxes_btm.concat(boxes_top);
            this.setState({boxes: _boxes, canvasHeight: 250, currentSpeakerSentenceNumber: boxes_top.length, boxesHistory: [JSON.parse(JSON.stringify(_boxes))], operationBoxHistory: []});
            this.audio.currentTime = 0;
        }

        if(nextProps.dimension !== this.props.dimension){
            this.setState({ dimension: nextProps.dimension });
            var boxes_ = JSON.parse(JSON.stringify(nextProps.boxesPassed));
            var boxes_top = boxes_.filter(box => box.speaker == nextProps.speaker[0]);
            var boxes_btm = boxes_.filter(box => box.speaker != nextProps.speaker[0]);
            var _boxes = boxes_btm.concat(boxes_top);
            this.setState({boxes: _boxes, canvasHeight: 250, currentSpeakerSentenceNumber: boxes_top.length, boxesHistory: [JSON.parse(JSON.stringify(_boxes))], operationBoxHistory: []});
            this.audio.currentTime = 0;
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
            this.setState({boxes: JSON.parse(JSON.stringify(this.state.boxesHistory[0])), boxesHistory: [JSON.parse(JSON.stringify(this.state.boxesHistory[0]))], operationBoxHistory: []});
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
        /*
            if(that.props.condition != 'slider'){
                var boxesHistory_  = that.state.boxesHistory;
                var operationBoxHistory_  = that.state.operationBoxHistory;

                if(boxesHistory_.length == 1){
                    that.setState({boxes: JSON.parse(JSON.stringify(boxesHistory_[0]))});
                }else{
                    that.props.stopPlay();
                    var boxesState = boxesHistory_.pop();
                    var lastIndex = operationBoxHistory_.pop();

                    console.log(boxesState, lastIndex);
                    that.setState({boxes: boxesState, boxesHistory: boxesHistory_, operationBoxHistory: operationBoxHistory_});
                    that.audio.currentTime = boxesState[lastIndex].x / 10;
                }
            }
        */
        }

        if(event.keyCode === 32 && that.state.isStarted) {
        //Do whatever when space is pressed
        /*
            that.props.togglePlay();
        */
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

                        if (boxes_[i].y < 50) {
                            //flex slot number
                            //var horizontalLines_ = that.state.horizontalLines;
                            //horizontalLines_.push(horizontalLines_[horizontalLines_.length - 1] + 50);
                            //that.setState({canvasHeight: that.state.canvasHeight + 50, horizontalLines: horizontalLines_});
                    
                            //for (var j = 0; j < boxes_.length; j++) {
                            //    if (that.state.currentTime * 10 > boxes_[j].end && that.state.speaker[0] == boxes_[j].speaker) {
                            //        boxes_[j].y += 50;
                            //    }else if (that.state.speaker[0] != boxes_[j].speaker) {
                            //        boxes_[j].y += 50;
                            //    }
                            //}

                        }else{
                            that.props.updateScrollPosition(boxes_[i].y - 50);
                            for (var j = 0; j < boxes_.length; j++) {
                                if (that.state.currentTime * 10 < boxes_[j].end && that.state.speaker[0] == boxes_[j].speaker && boxes_[j].y >= 50) {
                                    boxes_[j].y -= 50;
                                }
                            }
                        }
        
                        break;
                    }
                }

                that.setState({boxes: boxes_});
            }
        }

        if(event.keyCode === 40 && that.state.isStarted) {
        //Do whatever when down is pressed
            console.log("down pressed.");
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

                        if (boxes_[i].y > that.state.canvasHeight - 50) {
                            //flex slot number
                            //var horizontalLines_ = that.state.horizontalLines;
                            //horizontalLines_.push(horizontalLines_[horizontalLines_.length - 1] + 50);
          
                            //that.setState({canvasHeight: that.state.canvasHeight + 50, horizontalLines: horizontalLines_});
                            //for (var j = 0; j < boxes_.length; j++) {
                            //    if ( that.state.currentTime * 10 < boxes_[j].end && that.state.speaker[0] == boxes_[j].speaker) {
                            //        boxes_[j].y += 50;
                            //    }
                            //}
                        }else{
                            that.props.updateScrollPosition(boxes_[i].y + 50);
                            for (var j = 0; j < boxes_.length; j++) {
                                if (that.state.currentTime * 10 < boxes_[j].end && that.state.speaker[0] == boxes_[j].speaker && boxes_[j].y <= 200) {
                                    boxes_[j].y += 50;
                                }
                            }
                        }
                        
                        break;
                    }
                }

                that.setState({boxes: boxes_});
            }
        }

        if(event.keyCode === 37 && that.state.isStarted) {
        //Do whatever when left is pressed
            console.log("left pressed.");
            if(that.props.condition != 'slider'){
                 boxes_ = that.state.boxes;

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
        }

        if(event.keyCode === 39 && that.state.isStarted) {
        //Do whatever when right is pressed
            console.log("right pressed.");
            if(that.props.condition != 'slider'){
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

                            <Rect x={box.x} y={0} width={box.end - box.x} height={this.state.canvasHeight}
                                fill={(box.speaker == this.state.speaker[0] && (this.state.dimension == "Arousal"? box.highlightA : box.highlightP))? '#F8FF9580' : '#F8FF9500'} />
                        ))}

                        {this.state.horizontalLines.map((line, i) => (
                            <Line key={i} points={[0, line, this.state.length, line]} stroke={'grey'} strokeWidth={1} lineCap="round" />
                        ))}

                        {this.state.verticalLines.map((line, i) => (
                            <Group x={line.x} y={0}>
                                
                                <Line key={i} points={[0, 0, 0, this.state.canvasHeight]} stroke={'grey'} strokeWidth={0.5} lineCap="round" />
               
                                <Text x={1} y={this.state.canvasHeight - 13} width={60} height={13} fontSize={12} text={line.time} fill='grey' strokeWidth={0.5} />
                            
                            </Group>
                        ))}

                        {this.state.boxes.map((box, i) => (

                            <Group x={box.x} y={box.y}>
                                
                                <Rect x={0} y={0} width={box.end - box.x} height={48} shadowBlur={box.speaker == this.state.speaker[0]? 1 : 0} cornerRadius={[3, 3, 3, 3]}
                                    fill={box.speaker == 'M'? (this.state.speaker == "Male"? this.props.maleColor : '#CCCCCC') : (this.state.speaker == "Female"? this.props.femaleColor : '#CCCCCC')} />
              
                                <Text x={1} y={18} width={29} height={15} fontSize={14} text={box.indexS + 1} fill='white' strokeWidth={1} align="start" visible={box.speaker == this.state.speaker[0]} />
                            
                            </Group>
                        ))}

                        <Rect x={this.state.currentTime * 10} y={0} width={2} height={this.state.canvasHeight} fill={'#9A0680'} />

                        {this.state.isPlaying? 
                            <RegularPolygon x={this.state.currentTime * 10 + 10} y={this.props.scrollTop + this.state.canvasHeight - 10} sides={3} radius={10} scaleY={1.0} fill={'green'}rotation={90} />:
                            <Rect x={this.state.currentTime * 10 + 5} y={this.props.scrollTop + this.state.canvasHeight - 17} width={15} height={15} fill={'red'} />
                        }

                    </Layer>

                </Stage>

            </Box>
        );
    }
}