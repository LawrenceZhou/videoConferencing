import React, { Component } from 'react';
import { Box, Heading, Text, Form, FormField, TextInput, Button, Grommet, Layer, CheckBox, Select } from 'grommet'; 
import { grommet } from 'grommet/themes';


export default class Survey extends Component {
	constructor(props) {
		super(props);
		this.state = {
			open: false,
			ageOptions: ["Under 15", "16-20", "21-25", "26-30", "31-35", "36-40", "41-45", "46-50",
							"51-55", "56-60", "61-65", "over 65", "Prefer not to answer"],
			genderOptions: ["Female", "Male", "Prefer not to answer", "Other (Specify below)"],
			ethnicityOptions: ["African-American", "Asian - Eastern", "Asian - Indian", "Caucasian/White", "Hispanic", 
							"Native-American", "Mixed race", "Prefer not to answer", "Other (Specify below)"],
			educationOptions: ["Middle School or lower", "High School", "Bachelor's Degree", "Master's Degree", 
								"Ph.D. or higher", "Prefer not to answer"],
			incomeOptions: ["Less than 10,000 USD", "10,001 USD - 25,000 USD", "25,001 USD - 50,000 USD",
							"50,001 USD - 100,000 USD", "100,001 USD - 200,000 USD", "More than 200,000 USD", "Prefer not to answer"],
			religionOptions: ["No Religion", "Buddhism", "Catholicism/Christianity", "Hinduism", "Islam", "Judaism", "Prefer not to answer", "Other (Specify below)"], 
			comprehensionOptions: ["No", "Yes"],
			comprehensionLevelOptions: ["Excellent", "Average", "Poor"],
			age:"Prefer not to answer",
			gender: "Prefer not to answer",
			ethnicity: "Prefer not to answer",
			nationality: "N/A",
			education: "Prefer not to answer",
			income: "Prefer not to answer",
			religion: "Prefer not to answer",
			comprehension: "No",
			comprehensionLevel: "N/A",
		};

		this.onClose=this.onClose.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
		this.onSubmitConfirmed = this.onSubmitConfirmed.bind(this);
	}


	componentDidMount(){

	}


	onClose() {
		var that = this;
		that.setState({open: false});
	}


	onSubmit(value) {
		var that = this;
		console.log(value);
		
		if (value.gender == "Other (Specify below)") {
			if(value.genderOther === undefined){
				alert("Please specify your gender.");
				return;
			}else {
				that.setState({gender: value.genderOther});
			}
		}else{
			that.setState({gender: value.gender});
		}

		if (value.ethnicity == "Other (Specify below)") {
			if(value.ethnicityOther === undefined){
				alert("Please specify your ethnicity.");
				return;
			}else {
				that.setState({ethnicity: value.ethnicityOther});
			}
		}else{
			that.setState({ethnicity: value.ethnicity});
		}

		if (value.religion == "Other (Specify below)") {
			if(value.religionOther === undefined){
				alert("Please specify your religion.");
				return;
			}else {
				that.setState({religion: value.religionOther});
			}
		}else{
			that.setState({religion: value.religion});
		}


		if (value.comprehension == "Yes") {
			if(value.comprehensionLevel === undefined){
				alert("Please specify your emotion comprehension level.");
				return;
			}else {
				that.setState({comprehensionLevel: value.comprehensionLevel});
			}
		}

		that.setState({open: true, age: value.age, nationality: value.nationality, education: value.education, income: value.income, comprehension: value.comprehension});

	}


	onSubmitConfirmed() {
		var that = this;
		that.onClose();
		var http = new XMLHttpRequest();
		var url = 'http://label.yijunzhou.xyz/api/v1/save_survey';    
		var data = new FormData();


		data.append("userName", that.props.userName);
		data.append("age", that.state.age);
		data.append("gender", that.state.gender);
		data.append("ethnicity", that.state.ethnicity);
		data.append("nationality", that.state.nationality);
		data.append("education", that.state.education);
		data.append("income", that.state.income);
		data.append("religion", that.state.religion);
		data.append("comprehension", that.state.comprehension);
		data.append("comprehensionLevel", that.state.comprehensionLevel);
		
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
		http.send(data)
	}


	render() {

		return(
			<Grommet theme={grommet}>
		
				<Box background="light-1" align="center" justify="center" pad="medium">

					<Box width="large">

						<Text weight="bold">Background Survey</Text>

						<Form onSubmit={({value}) => {this.onSubmit(value)}}>

							<FormField label="1. What is your age?*" name="age" required>

								<Select name="age" options={this.state.ageOptions} />

							</FormField>

							<FormField label="2. How would you describe your gender?*" name="gender" required>

								<Select name="gender" options={this.state.genderOptions} />

							</FormField>

							<FormField label="3. If you select 'Other' in question 2, please specify it here." name="genderOther" >

								<TextInput name="genderOther" placeholder="Your Answer" />

							</FormField>

							<FormField label="4. Please specify your ethnicity.*" name="ethnicity" required>

								<Select name="ethnicity" options={this.state.ethnicityOptions} />

							</FormField>

							<FormField label="5. If you select 'Other' in question 4, please specify it here." name="ethnicityOther">

								<TextInput name="ethnicityOther" placeholder="Your Answer" />

							</FormField>

							<FormField label="6. What is your nationality?*" name="nationality" required>

								<TextInput name="nationality" placeholder="Your Answer" />

							</FormField>

							<FormField label="7. What is the highest degree or level of education you have completed?*" name="education" required>

								<Select name="education" options={this.state.educationOptions} />

							</FormField>

							<FormField label="8. What is your annual household income?*" name="income" required>

								<Select name="income" options={this.state.incomeOptions} />

							</FormField>

							<FormField label="9. If applicable, please specify your religion.*" name="religion" required>

								<Select name="religion" options={this.state.religionOptions} />

							</FormField>

							<FormField label="10. If you select 'Other' in question 9, please specify it here." name="religionOther">

								<TextInput name="religionOther" placeholder="Your Answer" />

							</FormField>

							<FormField label="11. Have you ever trained with emotion comprehension?*" name="comprehension" required>

								<Select name="comprehension" options={this.state.comprehensionOptions} />

							</FormField>

							<FormField label="12. If you select 'Yes' in question 11, How would you rate your emotion comprehension skills?" name="comprehensionLevel">

								<Select name="comprehensionLevel" options={this.state.comprehensionLevelOptions} />

							</FormField>

							<Box direction="row" justify="between" margin={{ top: 'medium' }}>

								<Button label="Back" onClick={()=>{this.props.back()}} />

								<Button type="reset" label="Reset" />

								<Button type="submit" label="Submit" primary />

							</Box>

						</Form>

					</Box>

				</Box>

				{this.state.open && 
				<Layer
					id="surveyConfirmation"
					position="center"
					onClickOutside={() => {this.onClose()}}
					onEsc={() => {this.onClose()}}>
						
					<Box pad="medium" gap="small" width="medium">
							
						<Heading level={3} margin="none">Confirm</Heading>

						<Text>Please double check the backround information input.</Text>

						<Text>Age: <strong>{this.state.age}</strong></Text> 

						<Text>Gender: <strong>{this.state.gender}</strong></Text> 

						<Text>Ethnicity: <strong>{this.state.ethnicity}</strong></Text> 

						<Text>Nationality: <strong>{this.state.nationality}</strong></Text> 

						<Text>Education Level: <strong>{this.state.education}</strong></Text> 

						<Text>Income Level: <strong>{this.state.income}</strong></Text> 

						<Text>Religion: <strong>{this.state.religion}</strong></Text> 

						<Text>Emotion Comprehension Training: <strong>{this.state.comprehension}</strong></Text> 

						{this.state.comprehension == "Yes" &&
						<Text>Emotion Comprehension Level: <strong>{this.state.comprehensionLevel}</strong></Text> 
						}
							
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
