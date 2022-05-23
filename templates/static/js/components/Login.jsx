import React, { Component } from 'react';
import { Box, Heading, Text, Form, FormField, TextInput, Button, Grommet, Layer } from 'grommet'; 
import { grommet } from 'grommet/themes';


export default class Login extends Component {
	constructor(props) {
		super(props);
		this.state = {
			email: "",
			emailAgain: "",
			password: "label",
			open: false,
			messageOn: false,
			mesage: "",
			messageColor: "",
			status: 0,
		};

		this.onLogin = this.onLogin.bind(this);
		this.onClose=this.onClose.bind(this);
		this.userAuthentication = this.userAuthentication.bind(this);
		this.onLoginConfirmed = this.onLoginConfirmed.bind(this);
	}


	onLogin(value) {
		var that = this;
		console.log(value);
		if (value.email != value.email_again) {
			that.setState({messageOn: true, message: "Amazon MTurk worker ID input mismatched. Please check it again.", messageColor: "status-error"});
		}else {
			that.setState({email :value.email, emailAgain: value.email_again}, function(){ console.log("state information, email: ", that.state.email, " email again: ", that.state.emailAgain), that.userAuthentication()});
		}
	}


	onClose() {
		var that = this;
		that.setState({open: false});
	}


	userAuthentication(){
		var that = this;

		var d = new Date();
		var timeStamp = d.toString();

		var http = new XMLHttpRequest();
		var url = 'http://label.yijunzhou.xyz/api/v1/log_in';    
		var data = new FormData();


		data.append("userName", that.state.email);
		data.append("timeStamp", timeStamp);
		
		console.log(data.get("userName"));

		http.addEventListener("readystatechange", function() {
			if(this.readyState === 4 ) {
				if(this.status == 200) {
					console.log("Login succeeded!", this.responseText);
					var obj = JSON.parse(http.responseText);
					console.log("Status: ", obj.status);

					that.setState({messageOn: false, message: "Login succeeded!", messageColor: "status-ok", open:true, status: obj.status});
				}else {
					that.setState({messageOn: true, message: "Login failed. Please contacted the operator: yijun-z@g.ecc.u-tokyo.ac.jp. Thanks.", messageColor: "status-error"});
					console.log("Login failed. Please contacted the operator: yijun-z@g.ecc.u-tokyo.ac.jp. Thanks.");
				}
			}
		});

		http.open('POST', url, true);
		http.send(data);
	}


	onLoginConfirmed() {
		var that = this;
		that.onClose();
		that.props.loginSuccess(that.state.email, that.state.password, that.state.status);
	}


	render() {

		return(
			<Grommet theme={grommet}>

				<Box background="#EEEEEE" pad="large" />

				<Box background="light-1" gap="medium" align="center" pad="large">
					
					<Text weight="bold">Log In</Text>
					
					<Form onSubmit={({value}) => {this.onLogin(value)}}>

						<FormField label="Amazon MTurk Worker ID *" name="email" htmlFor="email" required>

							<TextInput placeholder="Your Amazon MTurk ID" name="email" id="email" />

						</FormField>

						<FormField label="Amazon MTurk Worker ID (again)*" name="email_again" htmlFor="email_again" required>

							<TextInput placeholder="Your Amazon MTurk ID" name="email_again" id="email_again" />

						</FormField>

						<Button type="submit" label="Log In" />

						<Text margin={{ left: 'small' }} size="small" color="dark-3">* Required Field</Text>

					</Form>

					{this.state.messageOn && 
					<Box pad={{horizontal: 'small'}}>

						<Text color={this.state.messageColor}>{this.state.message}</Text>

					</Box>}

				</Box>

				{this.state.open &&
				<Layer
					id="loginConfirmation"
					position="center"
					onClickOutside={() => {this.onClose()}}
					onEsc={() => {this.onClose()}}>
			
					<Box pad="medium" gap="small" width="medium">

						<Heading level={3} margin="none">Confirm</Heading>

						<Text>Are you sure you want to log in as <strong>{this.state.email}</strong>?</Text> 
					
						<Text> If you finds errors in your Amazon MTurk Worker ID, please input it again.</Text>
							
						<Box
							as="footer"
							gap="small"
							direction="row"
							align="center"
							justify="end"
							pad={{ top: 'medium', bottom: 'small' }}>
						
							<Button label="Cancel" onClick={() => {this.onClose()}} color="dark-3" />
								
							<Button
								label={<Text color="white"><strong>Log In</strong></Text>}
								onClick={() => {this.onLoginConfirmed()}}
								primary
								color="status-ok"
							/>

						</Box>

					</Box>
			
				</Layer>
				}

			</Grommet>
		)
	}
}
