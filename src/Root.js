import React, { Component } from 'react';
import { parse } from '@babel/parser';
import JSONTree from 'react-json-tree'
import CodeMirror from 'react-codemirror';
import Highlight from 'react-highlight'
import generateTypes from './transform';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/lib/codemirror.css';
import  'highlight.js/styles/atelier-cave-light.css';

const options = {
	lineNumbers: true,
	mode: 'javascript'
};

class Root extends Component {
	constructor(props) {
		super(props);
		this.state = {
			code: ''
		};
		this.updateCode = this.updateCode.bind(this);
	}

	updateCode(newCode) {	
		this.setState({
			code: newCode
		});
	}

	render() {
		const { code } = this.state;
		let ast = {};
		let error = '';
		try {
			ast = parse(code, { sourceType: 'module' });
		} catch(e) {
			error = e.message;
		}
		const astTypes = error ? '' : generateTypes(ast);

		return (
			<div className="container">
				<div className="content">
					<div className="content-item source">
						<CodeMirror
							value={this.state.code} 
							onChange={this.updateCode} 
							options={options}
						/>
					</div>
					<div className="content-item ast">
						{error ? error : <JSONTree data={ast} />}
					</div>
					<div className="content-item types">
				    <Highlight language="javascript">
				      {astTypes}
				    </Highlight>
					</div>
				</div>
			</div>
		);	
	}
}

export default Root;