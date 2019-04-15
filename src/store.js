import { observable } from 'mobx';

class CodeExplore {
	@observable code = '';

	updateCode(newCode) {
		this.code = newCode;
	}
}

const codeExplore = new CodeExplore();

export default codeExplore;