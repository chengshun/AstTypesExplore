const fs = require('fs');
const request = require('request');
const cheerio = require('cheerio');

request('https://babeljs.io/docs/en/next/babel-types.html#callexpression', (err, response, body) => {
	const $ = cheerio.load(body);
	const result = getTypesFormNode($);
	fs.writeFileSync('types.json', JSON.stringify(result, null, 2));
});

function getTypesFormNode($) {
	const childrenNodes = $('.post article div span').children().filter((n, ele) => ele.name);
	const nodeLength = childrenNodes.length;
	let tokens = [];
	let current = 0;	

	while(current < nodeLength) {
		let tagName = childrenNodes[current].name;
		if (tagName === 'h3') {
			const parts = [];
			parts.push(childrenNodes[current++]);
			while(current < nodeLength && tagName !== 'hr') {
				parts.push(childrenNodes[current]);
				tagName = childrenNodes[++current].name;
			}
			tokens.push(parts);
		} else {
			current++;
		}
	}	

	return constructorTypesJson(tokens, $);
}

const fistLetterUpper = (str) => `${str.charAt(0).toUpperCase()}${str.slice(1)}`;

function getParams(code) {
	const pattern = /t\.\w+\(((\w+\,?\s?)+)\)/.exec(code);
	if (pattern) {
		const params = pattern[1].split(',');
		return params.map(param => param.trim());
	}
	return [];
}

function getParamsDefault(node, $) {
	const obj = {};
	if (node.name !== 'ul') return obj;
	$(node).find('li').each((i, ele) => {
		const text = $(ele).text();
		const pattern = /(\w+)\:(.+)\((\w+)\:?\s*(\w+)\)/gi.exec(text);
		if (pattern && (pattern[3] !== 'require')) {
			obj[pattern[1]] = eval(pattern[4].trim());
		}
	});
	return obj;
}

function constructorTypesJson(parts, $) {
	let json = {};
	for (let part of parts) {
		const typeName = fistLetterUpper($(part[0]).text());
		const code  = $(part[1]).find('code').text();
		const params = getParams(code);
		const last = part[part.length - 1];
		const paramsDefault = getParamsDefault(last, $);
		
		json[typeName] = params.map(param => {
			return (typeof paramsDefault[param] !== 'undefined') ? { key: param, default: paramsDefault[param] } : { key: param };
		});
	}
	return json;
}
