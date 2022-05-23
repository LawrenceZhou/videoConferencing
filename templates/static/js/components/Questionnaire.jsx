import React, { Component } from 'react';
import {Box, Heading, Text, TextArea, Form, FormField, TextInput, Button, Grommet, Layer, RadioButtonGroup } from 'grommet'; 
import { grommet } from 'grommet/themes';


export default class Questionnaire extends Component {
	constructor(props) {
		super(props);
		this.state = {
			userName: this.props.userName,
			open: false,
			easiness: 5,
			easinessReason: "",
			learning: 5,
			learningReason: "",
			intuitiveness: 5,
			intuitivenessReason: "",
			helpness: 5,
			helpnessReason: "",
			advantage: "",
			disadvantage: "",
			other: "",
			condition: "withHighlight",
			numberOptions: [{ label: '1', value: 1 }, 
							{ label: '2', value: 2 }, 
							{ label: '3', value: 3 },
							{ label: '4', value: 4 }, 
							{ label: '5', value: 5 },],
		};

		this.getCondition=this.getCondition.bind(this);
		this.onClose=this.onClose.bind(this);
		this.onSubmit = this.onSubmit.bind(this); 
		this.onSubmitConfirmed = this.onSubmitConfirmed.bind(this);
	}


	componentDidMount(){
		this.getCondition();
	}


	getCondition(){
		//to change to task
		var that = this;

		var http = new XMLHttpRequest();
		var url = 'http://label.yijunzhou.xyz/api/v1/get_condition';
		var data = new FormData();

		data.append("userName", that.state.userName);
		console.log(data.get("userName"));

		http.addEventListener("readystatechange", function() {
			if(this.readyState === 4 ) {
				if(this.status == 200) {
					console.log("Condition received!", this.responseText);
					var obj = JSON.parse(http.responseText);
					console.log(obj);
					var condition_ = obj.condition;					
					that.setState({ condition : condition_});
				}else {
					alert('There is a problem with retrieving the condition. Please contacted the operator: yijun-z@g.ecc.u-tokyo.ac.jp. Thanks.');
					that.props.finish();
				}
			}
		});

		http.open('POST', url, true);
		http.send(data);
	}


	onClose() {
		var that = this;
		that.setState({open: false});
	}


	onSubmit(value) {
		var that = this;
		console.log(value);
		that.setState({open:true, easiness:value.easiness, easinessReason: value.easinessReason, learning: value.learning, 
						learningReason:value.learningReason, intuitiveness: value.intuitiveness, intuitivenessReason: value.intuitivenessReason, 
						helpness: value.helpness, helpnessReason: value.helpnessReason, advantage:value.advantage, disadvantage:value.disadvantage, other:value.other});
	}


	onSubmitConfirmed() {
		var that = this;
		that.onClose();
		var http = new XMLHttpRequest();
		var url = 'http://label.yijunzhou.xyz/api/v1/save_questionnaire';    
		var data = new FormData();


		data.append("userName", that.props.userName);
		data.append("easiness", that.state.easiness);
		data.append("easinessReason", that.state.easinessReason);
		data.append("learning", that.state.learning);
		data.append("learningReason", that.state.learningReason);
		data.append("intuitiveness", that.state.intuitiveness);
		data.append("intuitivenessReason", that.state.intuitivenessReason);
		data.append("helpness", that.state.helpness);
		data.append("helpnessReason", that.state.helpnessReason);
		data.append("advantageComment", that.state.advantage);
		data.append("disadvantageComment", that.state.disadvantage);
		data.append("otherComment", that.state.other);
				
		console.log(data.get("userName"));

		http.addEventListener("readystatechange", function() {
			if(this.readyState === 4 ) {
				if(this.status == 200) {
					console.log("Submission succeeded!", this.responseText);
					var obj = JSON.parse(http.responseText);
					console.log("Response: ", obj);
					that.onClose();
					that.props.finish();
				}else {
					alert('Submission failed. Please contacted the operator: yijun-z@g.ecc.u-tokyo.ac.jp. Thanks.');
					console.log("Submission failed. Please contacted the operator: yijun-z@g.ecc.u-tokyo.ac.jp. Thanks.");
				}
			}
		});

		http.open('POST', url, true);
		http.send(data);
	}


		render() {
			return(
				<Grommet theme={grommet}>

					<Box background="light-1" align="center" justify="center" pad="medium">

						<Box width="large">

							<Text weight="bold">Questionnaire on labeling experience</Text>

							<Form onSubmit={({value}) => {this.onSubmit(value)}}>

								<FormField label="1. Do you think this interface is easy to use?*" name="easiness" required>

							 		<Box direction="row" align="center" justify="center" gap="small" pad={{top:"medium", bottom: "medium"}}>

										<Text>Strongly Disagree</Text>

										<RadioButtonGroup
											pad={{top:"small"}}
											name="easiness"
											direction="row"
											gap="xsmall"
											options={this.state.numberOptions}/>

										<Text>Strongly Agree</Text>

									</Box>

								</FormField>

								<FormField label="2. According to question 1, why do you think so?*" name="easinessReason" required>

									<TextInput name="easinessReason" placeholder="Your Answer" />

								</FormField>

								<FormField label="3. Do you think this interface is easy to learn to use?*" name="learning" required>

									<Box direction="row" align="center" justify="center" gap="small" pad={{top:"medium", bottom: "medium"}}>

										<Text>Strongly Disagree</Text>

										<RadioButtonGroup
											pad={{top:"small"}}
											name="learning"
											direction="row"
											gap="xsmall"
											options={this.state.numberOptions}/>

										<Text>Strongly Agree</Text>

									</Box>

								</FormField>

								<FormField label="4. According to question 3, why do you think so?*" name="learningReason" required>

									<TextInput name="learningReason" placeholder="Your Answer" />

								</FormField>

								<FormField label="5. Do you think this interface is intuitive for the emotion labeling task?*" name="intuitiveness" required>

									<Box direction="row" align="center" justify="center" gap="small" pad={{top:"medium", bottom: "medium"}}>

										<Text>Strongly Disagree</Text>

										<RadioButtonGroup
											pad={{top:"small"}}
											name="intuitiveness"
											direction="row"
											gap="xsmall"
											options={this.state.numberOptions}/>

										<Text>Strongly Agree</Text>

									</Box>

								</FormField>

								<FormField label="6. According to question 5, why do you think so?*" name="intuitivenessReason" required>

									<TextInput name="intuitivenessReason" placeholder="Your Answer" />

								</FormField>

								<FormField label={this.state.condition == "withHighlight"?"7. Do you think the highlight help you label the emotion?*":"7. Do you think this interface help you label the emotion?*"} name="helpness" required>

									<Box direction="row" align="center" justify="center" gap="small" pad={{top:"medium", bottom: "medium"}}>

										<Text>Strongly Disagree</Text>

										<RadioButtonGroup
											pad={{top:"small"}}
											name="helpness"
											direction="row"
											gap="xsmall"
											options={this.state.numberOptions}/>

										<Text>Strongly Agree</Text>

									</Box>

								</FormField>

								<FormField label="8. According to question 7, why do you think so?*" name="helpnessReason" required>

									<TextInput name="helpnessReason" placeholder="Your Answer" />

								</FormField>

								<FormField label="9. What do you think will be advantages of this interface?*" name="advantage" required>

									<TextInput name="advantage" placeholder="Tell us about the advantage..." />

								</FormField>

								<FormField label="10. What do you think will be disadvantages of this interface?*" name="disadvantage" required>

									<TextInput name="disadvantage" placeholder="Tell us about the disadvantage..." />

								</FormField>

								<FormField label="11. If there are any other comments, please tell us." name="other" >

									<TextInput name="other" placeholder="Other comments..." />

								</FormField>


								<Box direction="row" justify="between" margin={{ top: 'medium' }}>

									<Button label="Back" onClick={()=>{this.props.back()}}/>

									<Button type="reset" label="Reset" />

									<Button type="submit" label="Submit" primary />

								</Box>

							</Form>

						</Box>

					</Box>
			
					{this.state.open && 
					<Layer
						id="questionnaireConfirmation"
						position="center"
						onClickOutside={() => {this.onClose()}}
						onEsc={() => {this.onClose()}}>

						<Box pad="medium" gap="small" width="medium">
							
							<Heading level={3} margin="none">Confirm</Heading>

							<Text>Please double check the questionnaire input.</Text>
														
							<Text>Easy to use: <strong>{this.state.easiness}</strong></Text> 
							
							<Text>Reason: <strong>{this.state.easinessReason}</strong></Text> 
														
							<Text>Easy to get used to : <strong>{this.state.learning}</strong></Text> 

							<Text>Reason: <strong>{this.state.learningReason}</strong></Text> 
														
							<Text>Intuitiveness: <strong>{this.state.intuitiveness}</strong></Text> 

							<Text>Reason: <strong>{this.state.intuitivenessReason}</strong></Text> 

							<Text>Helpness: <strong>{this.state.helpness}</strong></Text> 

							<Text>Reason: <strong>{this.state.helpnessReason}</strong></Text> 
														
							<Text>Comments on advantage: <strong>{this.state.advantage}</strong></Text> 
														
							<Text>Comments on disadvantage: <strong>{this.state.disadvantage}</strong></Text> 
														
							<Text>Other comments: <strong>{this.state.other}</strong></Text> 
													
							<Box
								as="footer"
								gap="small"
								direction="row"
								align="center"
								justify="end"
								pad={{ top: 'medium', bottom: 'small' }}>

								<Button label="Cancel" onClick={() => {this.onClose()}} color="dark-3" />
																
								<Button 
									label={<Text color="white"><strong>Submit</strong></Text>}
									onClick={() => {this.onSubmitConfirmed()}}
									primary
									color="status-ok"/>

							</Box>
							
						</Box>
					
					</Layer>
					}
					
					<Box background="#EEEEEE" pad="large" />

			</Grommet>
		)
	}
}
