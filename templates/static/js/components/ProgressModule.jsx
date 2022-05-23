import React, { Component } from 'react';
import { Box, Card, CardBody, CardFooter, Text } from 'grommet'; 
import { grommet } from 'grommet/themes';

export default class ProgressModule extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<Card background={this.props.statusColor} key={this.props.key} onClick={() => {this.props.clickModule()}}>

				<CardBody pad="small">

					<Box gap="small" align="center" >
				
						{this.props.children}
				
						<Box>
				
							<Text size="small">{this.props.title}</Text>

							<Text size="small" weight="bold">{this.props.subTitle}</Text>
	
						</Box>

					</Box>

				</CardBody>

				<CardFooter pad={{ horizontal: 'medium', vertical: 'small' }} background='#FFFFFF27'>

					<Text size="xsmall">{this.props.footer}</Text>
			
				</CardFooter>

			</Card>
		)

	}
}