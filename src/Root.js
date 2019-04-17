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
import 'highlight.js/styles/atom-one-light.css';

const options = {
	lineNumbers: true,
	mode: 'javascript' 
};

class Root extends Component {
	constructor(props) {
		super(props);
		this.state = {
			code: '',
			copied: false,
			activeTab: ['source', 'types']
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

	handleBtnClick(type) {
		if (type === 'source') return;
		this.setState((prev) => {
			const prevActive = prev.activeTab.slice();
			const index = prevActive.indexOf(type);
			if (index > -1) {
				prevActive.splice(index, 1);
			} else {
				prevActive.push(type);
			}
			return { activeTab: prevActive };
		});
	}

	generateBtns() {
		const { activeTab } = this.state;
		return ['source', 'ast', 'types'].map((btn, i) => {
			const active = activeTab.indexOf(btn) > -1;
			const className = active ? 'btn btn-active' : 'btn';
			return (<button 
					className={className} 
					key={btn}
					onClick={this.handleBtnClick.bind(this, btn)}
				>{btn}</button>
			);
		});
	}

	render() {
		const { code, copied, activeTab } = this.state;
		let ast = {};
		let error = '';
		try {
			ast = parse(code, { sourceType: 'module' });
		} catch (e) {
			error = e.message; 
		}
		const astTypes = error ? '' : generateTypes(ast);
		const prettierTypes = prettier.format(astTypes, { parser: parse });
		const contentItemStyle = { width: `${(100 % activeTab.length).toFixed(3)}%` };

		return (
			<div className="container">
				<div className="button-group">
					{this.generateBtns()}
				</div>
				<div className="content">
					{activeTab.indexOf('source') > -1 && <div className="content-item source" style={contentItemStyle}>
						<CodeMirror
							value={this.state.code}
							onChange={this.updateCode}
							options={options}
						/>
					</div>}
					{activeTab.indexOf('ast') > -1 && <div className="content-item ast" style={contentItemStyle}>
						{error ? error : <JSONTree data={ast} theme="bright" />}
					</div>}
					{activeTab.indexOf('types') > -1 && <div className="content-item types" style={contentItemStyle}>
						<CopyToClipboard text={prettierTypes}
							onCopy={this.handleCopy}
						>
							<button className="copy-button">{copied ? 'copied!' : 'copy'}</button>
						</CopyToClipboard>
						<Highlight language="javascript">
							{prettierTypes}
						</Highlight>
					</div>}
				</div>
			</div>
		);
	}
}

export default Root;