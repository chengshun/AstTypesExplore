import React, { Component } from 'react';
import { parse } from '@babel/parser';
import JSONTree from 'react-json-tree'
import CodeMirror from 'react-codemirror';
import Highlight from 'react-highlight'
import prettier from 'prettier';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import generateTypes from './transform';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/lib/codemirror.css';
import 'highlight.js/styles/atelier-cave-light.css';

const options = {
	lineNumbers: true,
	mode: 'javascript'
};

class Root extends Component {
	constructor(props) {
		super(props);
		this.state = {
			code: '',
			copied: false
		};
		this.updateCode = this.updateCode.bind(this);
		this.handleCopy = this.handleCopy.bind(this);
		this.timer = null;
	}

	updateCode(newCode) {
		this.setState({
			code: newCode
		});
	}

	handleCopy() {
		if (this.state.copied) return;
		if (this.timer) clearTimeout(this.timer);
		this.setState({ copied: true });
		this.timer = setTimeout(() => {
			this.setState({ copied: false });
		}, 1000);
	}

	render() {
		const { code, copied } = this.state;
		let ast = {};
		let error = '';
		try {
			ast = parse(code, { sourceType: 'module' });
		} catch (e) {
			error = e.message;
		}
		const astTypes = error ? '' : generateTypes(ast);
		const prettierTypes = prettier.format(astTypes, { parser: parse });
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
						{error ? error : <JSONTree data={ast} theme="bright" />}
					</div>
					<div className="content-item types">
						<CopyToClipboard text={prettierTypes}
							onCopy={this.handleCopy}
						>
							<button className="copy-button">{copied ? 'copied!' : 'copy'}</button>
						</CopyToClipboard>
						<Highlight language="javascript">
							{prettierTypes}
						</Highlight>
					</div>
				</div>
			</div>
		);
	}
}

export default Root;