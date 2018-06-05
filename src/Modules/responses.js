import constants from './constant';

exports.parameterMissing = (res, result) => {
	let response = {
		"message": result,
		"response" : {}
	};
	res.status(constants.responseFlags.PARAMETER_MISSING).json(response);
};

exports.parameterMissingResponse = (res) => {
	let response = {
		"message": constants.responseMessages.PARAMETER_MISSING,
		"response" : {}
	};
	res.status(constants.responseFlags.PARAMETER_MISSING).json(response);
};
exports.invalidemailformat = (res) => {
	let response = {
		"message": constants.responseMessages.INVALID_EMAIL_ID_FORMAT,
		"response" : {}
	};
	res.status(constants.responseFlags.INVALID_EMAIL_ID_FORMAT).json(response);
};
exports.success_recipe = (res,msg, result) => {
	var response = {
		"message": msg,
		"result" : result,
		
	};
	res.status(constants.responseFlags.ACTION_COMPLETE).json(response);
};
exports.invalidpasswordformat = (res) => {
	let response = {
		"message": constants.responseMessages.INVALID_PASSWORD_FORMAT,
		"response" : {}
	};
	res.status(constants.responseFlags.INVALID_PASSWORD_FORMAT).json(response);
};

exports.invalidCredential = function (res, msg) {
	var response = {
		"message": msg,
		"response" : {}
	};
	res.status(constants.responseFlags.INVALID_CREDENTIAL).json(response);
	return false;
};

exports.authenticationErrorResponse =  (res) => {
	var response = {
		"message": constants.responseMessages.INVALID_ACCESS_TOKEN,
		"response" : {}
	};
	res.status(constants.responseFlags.INVALID_ACCESS_TOKEN).json(response);
};

exports.sendError = (error, res) => {
	var response = {
		"message": constants.responseMessages.ERROR_IN_EXECUTION,
		"response" : {},
		"error": error
	};
	res.status(constants.responseFlags.ERROR_IN_EXECUTION).json(response);
};

// exports.success = (res, result) => {
// 	var response = {
// 		"message": "",
// 		"response" : result,
// 	};
// 	res.status(constants.responseFlags.ACTION_COMPLETE).json(response);
// };

exports.success = (res, result, message = constants.responseMessages.ACTION_COMPLETE) => {
	var response = {
		message,
		"response" : result
	};
	res.status(constants.responseFlags.ACTION_COMPLETE).json(response);
};

exports.successemail = (res,msg, result) => {
	var response = {
		"message": msg,
		"response" : result,
	};
	res.status(constants.responseFlags.ACTION_COMPLETE).json(response);
};
exports.successOtp = (res, result) => {
	var response = {
		"message": result,
		
	};
	res.status(constants.responseFlags.ACTION_COMPLETE).json(response);
};
exports.success_otp = (res,{access_token}, result) => {
	var response = {
		"message": result,
		"access_token" : access_token,
		
	};
	res.status(constants.responseFlags.ACTION_COMPLETE).json(response);
};
exports.success_recipe = (res,msg, result) => {
	var response = {
		"message": msg,
		"result" : result,
		
	};
	res.status(constants.responseFlags.ACTION_COMPLETE).json(response);
};

exports.userNotExist = (res) => {
	var response = {
		"message": "User not found.",
		"response" : {}
	};
	res.status(constants.responseFlags.ACTION_COMPLETE).json(response);	
}
exports.invalidmobilenumber = (res) => {
	var response = {
		"message": "mobile number should be at least 10 digits",
		"response" : {}
	};
	res.status(constants.responseFlags.ACTION_COMPLETE).json(response);	
}
exports.ingredientNotExist = (res) => {
	var response = {
		"message": "Ingredient not found.",
		"response" : {}
	};
	res.status(constants.responseFlags.ACTION_COMPLETE).json(response);	
}
exports.deletedIngredient =  (res) => {
	var response = {
		"message": constants.responseMessages.INGREDIENT_DELETED_SUCCESSFULLY,
		"response" : {}
	};
	res.status(constants.responseFlags.INGREDIENT_DELETED_SUCCESSFULLY).json(response);
};
