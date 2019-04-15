import { parse } from '@babel/parser';
import * as t from '@babel/types';
import generator from '@babel/generator';
import typeApis from './types.json';

const typeMap = {
  string: t.StringLiteral,
  boolean: t.booleanLiteral,
  null: t.NullLiteral,
  array: t.ArrayExpression,
  number: t.NumericLiteral
};

const isObject = value => {
  return Object.prototype.toString.call(value) === "[object Object]";
}

const getTypeByString = value => {
  const type = Object.prototype.toString.call(value);
  const pattern = /\s?(\w+)\]/.exec(type);
  return type ? pattern[1].toLowerCase() : 'string';  
}


const astNode = (node) =>{
  const nodeType = node.type;
  if (nodeType && typeApis[nodeType]) {
    const params = typeApis[nodeType];
    const nodeArgs = [];
    for (let param of params) {
      const paramValue = node[param.key];
      if (Array.isArray(paramValue)) {
        const values = [];
        for (let value of paramValue) {
          values.push(astNode(value));
        }
        nodeArgs.push(t.ArrayExpression(values));        
      } else if (isObject(paramValue)) {
        nodeArgs.push(astNode(paramValue));
      } else {
        let fixValue = paramValue;
        if (typeof fixValue === 'undefined') {
          fixValue = param.default;
        }
        let valueType = getTypeByString(fixValue);
        if (`${fixValue}` === 'null') {
          nodeArgs.push(typeMap[valueType]());
        } else {
          nodeArgs.push(typeMap[valueType](fixValue));
        }        
      }
    }
    return t.CallExpression(
      t.MemberExpression(
        t.Identifier('t'),
        t.Identifier(nodeType),
      ),
      nodeArgs
    )    
  }
}

const traverse = (bodies) => {
  let result = [];
  for (let body of bodies) {
    const bodyAst = t.ExpressionStatement(astNode(body));
    result.push(bodyAst);
  }
  return result;  
}

const generateTypes = (ast) => {
  if (!ast.program) return '';
  const transformAst = traverse(ast.program.body);
  ast.program.body = transformAst;
  return generator(ast).code;
}

export default generateTypes;


