//TODO: dorobić toLowerCase i toUpperCase

const messagePush = (errors, element, type, message) => {
	const checkElement = checkElementExists(errors, element) ? false : errors[element.name] = {};
	const checkType = checkTypeExists(errors, element, type) ? false : errors[element.name][type] = {};
	if (checkElement && checkType) {
		errors[element.name][type] = message;
	}
};

const checkElementExists = (array, element) => {
	return array[element.name] !== undefined;
};

const checkTypeExists = (array, element, type) => {
	return array[element.name][type] !== undefined;
};

/* GET home page. */
const check = (req, validators) => {
	let errors = {};

	const elementsToValidate = [...validators.elements];
	elementsToValidate.forEach(element => {

		var elementValue = null;
		switch (element.source) {
			case "params":
				// element.exists === undefined ? element.exists = true : null ;
				if (req.params[element.name] !== undefined) {
					elementValue = req.params[element.name];
				} else if (element.exists === true && req.params[element.name] === undefined) {
					messagePush(errors, element, "msg", `Missing ${element.fullname} parameter in request params.`);
				}
				break;
			case "body":
				console.log(req.body[element.name])
				if (req.body[element.name] !== undefined) {
					elementValue = req.body[element.name];
				} else if (element.exists === true && req.body[element.name] === undefined) {
					// 
					messagePush(errors, element, "msg", `Missing ${element.fullname} parameter in request body.`);
				}
				break;
			//TODO: cookies and another
		}

		if (elementValue !== null) {
			for (let [key, value] of Object.entries(element)) {
				const validatorValue = value;
				switch (key) {
					case "escape": validatorValue ? elementValue = _escape(elementValue) : null; break;
					case "trim": validatorValue ? elementValue = _trim(elementValue) : null; break;
					case "string":
						if (!_isString(elementValue, validatorValue)) {
							messagePush(errors, element, "msg", `${element.fullname} must be a text`);
						} break;
					case "minLength":
						if (!_minlength(elementValue, validatorValue)) {
							messagePush(errors, element, "msg", `${element.fullname} must be at least ${validatorValue} characters long.`);
							messagePush(errors, element, "minVal", `${validatorValue}`);
						} break;
					case "maxLength":
						if (!_maxlength(elementValue, validatorValue)) {
							messagePush(errors, element, "msg", `${element.fullname} must be at most ${validatorValue} characters long.`);
							messagePush(errors, element, "maxVal", `${validatorValue}`);
						} break;
					case "oneOf":
						if (!_oneOf(elementValue, validatorValue)) {
							const correct = Array(validatorValue).join(",");
							messagePush(errors, element, "msg", `${element.fullname} must be a one of: ${correct}`);
						} break;
					case "notOneOf":
						if (_notOneOf(elementValue, validatorValue)) {
							const notCorrect = Array(validatorValue).join(",");
							messagePush(errors, element, "msg", `${element.fullname} must not be a one of: ${notCorrect}`);
						} break;
					case "isMatch":
						if (_isMatch(elementValue, validatorValue)) {
							const examples = element.examples ? `Examples: ${element.examples}` : "";
							messagePush(errors, element, "msg", `${element.fullname} not contains valid structures. ${examples}`);
						} break;
					case "regexp":
						if (!_regexp(elementValue, validatorValue)) {
							const examples = element.examples ? `Examples: ${element.examples}` : "";
							messagePush(errors, element, "msg", `${element.fullname} has invalid structure. ${examples}`);
						} break;
					case "int":
						if (!_isInteger(elementValue, validatorValue)) {
							messagePush(errors, element, "msg", `${element.fullname} must be a integer`);
						} break;

					case "greatherOrEquall":
						if (!_greatherOrEquallThen(elementValue, validatorValue)) {
							messagePush(errors, element, "msg", `${element.fullname} must be equal to or greater than ${validatorValue}.`);
							messagePush(errors, element, "minVal", validatorValue);
						} break;

					case "lessOrEquall":
						if (!_lessOrEquallThen(elementValue, validatorValue)) {
							messagePush(errors, element, "msg", `${element.fullname} must be equal to or less than ${validatorValue}.`);
							messagePush(errors, element, "maxVal", validatorValue);
						} break;

					case "_greatherThen":
						if (!_greatherThen(elementValue, validatorValue)) {
							messagePush(errors, element, "msg", `${element.fullname} must be greater than ${validatorValue}.`);
							messagePush(errors, element, "greatherThenValue", validatorValue);
						} break;

					case "_lessThen":
						if (!_lessThen(elementValue, validatorValue)) {
							messagePush(errors, element, "msg", `${element.fullname} must be equal to or less than ${validatorValue}.`);
							messagePush(errors, element, "lessThenValue", validatorValue);
						} break;
				}
			}
		}
	});
	console.log(errors)
	return errors;
};

module.exports = {
	check,
};

// korygujące
const _escape = (elementValue) => {
	return escape(elementValue);
}

const _trim = (elementValue) => {
	return elementValue.trim();
};
//logiczne

//-- string -------------------------------------------------
const _isString = (elementValue, boolValue) => {
	return boolValue === (typeof elementValue === "string");
};

const _minlength = (elementValue, validatorValue) => {
	if (_isString(elementValue, true)) {
		const lenght = String(elementValue).toString().length;
		return _greatherOrEquallThen(lenght, validatorValue);
	} return false;
};

const _maxlength = (elementValue, validatorValue) => {
	if (_isString(elementValue, true)) {
		const lenght = String(elementValue).toString().length;
		return _lessOrEquallThen(lenght, validatorValue);
	} return false;
};

//-- numbers -------------------------------------------------

const _oneOf = (str, array) => {
	if (Array.isArray(array)) {
		return array.includes(str);
	} return false;
}

const _notOneOf = (str, array) => {
	if (Array.isArray(array)) {
		return !array.includes(str);
	} return false;
};

const _greatherThen = (elementValue, validatorValue) => {
	if (_isNumber(elementValue, true)) {
		return elementValue > validatorValue;
	} return false;
};

const _lessThen = (elementValue, validatorValue) => {
	if (_isNumber(elementValue, true)) {
		return elementValue < validatorValue;
	} return false;
};

const _greatherOrEquallThen = (elementValue, validatorValue) => {
	const value = Number(elementValue);
	return value >= validatorValue;
};

const _lessOrEquallThen = (elementValue, validatorValue) => {
	const value = Number(elementValue);
	if (_isNumber(value, true)) {
		return value <= validatorValue;
	} return false;
};

const _isNumber = (elementValue, boolValue) => {
	return boolValue === (typeof elementValue === "number");
};

const _isInteger = (elementValue, boolValue) => {
	const value = Number.parseInt(elementValue);
	return (value >= Number.MIN_SAFE_INTEGER && value <= Number.MAX_SAFE_INTEGER) ? boolValue === Number.isInteger(value) : !boolValue;
};

// Wyrażenia regularne -------------------------------------------------
const _isMatch = (elementValue, validatorValue) => {
	return elementValue.match(validatorValue) !== null ? true : false;
};

const _regexp = (elementValue, validatorValue) => {
	const expression = new RegExp(validatorValue);
	const result = expression.exec(elementValue);
	return result !== null ? true : false;
};