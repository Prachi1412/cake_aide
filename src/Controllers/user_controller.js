import commFunc from '../Modules/commonFunction';
import responses from '../Modules/responses';
import constant from '../Modules/constant';
import UserModel from '../Modals/user_model';
import config from '../Config/nodemailer.js';

import md5 from 'md5';


exports.signup = (req, res) => {
	let { user_name , email_id, password, device_type, device_token, latitude, longitude} = req.body;
	let manKeys = ["user_name","email_id", "password", "device_type", "device_token", "latitude", "longitude"];
	let condition  = {email_id};
	let emailRegex = "^([a-zA-Z0-9_.]+@[a-zA-Z0-9]+[.][.a-zA-Z]+)$";

	commFunc.checkKeyExist(req.body, manKeys)
	.then(result => result.length ? new Promise  (new Error(responses.parameterMissing(res,result[0]))) : '')
	.then(result => {
		if(!email_id.match(emailRegex)) {
			responses.invalidemailformat(res);
		} else {
			if(password.length < 8) {
				responses.invalidCredential(res , constant.responseMessages.INVALID_PASSWORD_FORMAT);
			} else {
				UserModel.selectQuery(condition)
				.then(userResult=> userResult.length > 0 ? responses.invalidCredential(res, constant.responseMessages.EMAIL_ALREADY_EXISTS) : userResult)
				.then(userResult=> {
					let condition = {user_name};
					UserModel.selectQuery(condition)
					.then(userResult=> userResult.length > 0 ? null : userResult)
					.then(userResult=>{
						if(userResult) {
							password = md5(password);
							let access_token = md5(new Date());
							let user_id = md5(new Date());
							let insertData = {user_id, access_token,user_name , email_id, password, device_type, device_token, latitude, longitude};
							
							UserModel.insertQuery(insertData).then((userResponse) =>{ responses.success(res, userResponse)})
							.catch((error) => responses.sendError(error.message, res));
						} else {
							responses.invalidCredential(res , constant.responseMessages.USER_NAME_ALREADY_EXISTS);
						}	
					})
				}).catch((error) => responses.sendError(error.message, res));
			}
		}
	}).catch((error) => responses.sendError(error.message, res));
};

exports.login = (req, res) => {
	let {user_name, password, device_type, device_token, latitude, longitude} = req.body;
	let manKeys = ["user_name", "password", "device_type", "device_token", "latitude", "longitude"];
	let condition  = {user_name};

	let encrypt_password = md5(password);
	let access_token = md5(new Date());
	let updateData = {access_token, device_type, device_token, latitude, longitude};
	
	commFunc.checkKeyExist(req.body, manKeys)
	.then(result => result.length ? responses.parameterMissing(res, result[0]) : '')
	.then(result => {
		UserModel.selectQuery(condition)
		.then(userResult=> userResult.length == 0 ? responses.invalidCredential(res, constant.responseMessages.INVALID_USER_NAME) : userResult)
		.then(userResult=> userResult[0].password != encrypt_password ? responses.invalidCredential(res, constant.responseMessages.INCORRECT_PASSWORD) : userResult)
		.then(userResult=> {
			let user_id = userResult[0].user_id;
			let condition = {user_id}
			UserModel.updateQuery(updateData, condition)
			.then((userResponse) =>{ responses.success(res, userResponse)})
			.catch((error) => responses.sendError(error.message, res));
		})
		.catch((error) => responses.sendError(error.message, res));
	})
	.catch((error) => responses.sendError(error.message, res));
};
exports.createProfile = (req , res) => {
	let { business_name , mobile_number ,address , profile_image } = req.body;
	let {access_token} = req.headers;
	let manKeys = ["business_name" , "mobile_number" ,"address"];
	let manValues = { business_name , mobile_number ,address };
	let condition = {access_token};
 	commFunc.checkKeyExist(manValues, manKeys)
	 		.then(result => result.length ? responses.parameterMissing(res, result[0]) : '' )
			.then(result => {
			console.log(result)
			UserModel.selectQuery(condition)
			.then(userResult => userResult.length >0 ? userResult : responses.userNotExist(res))
			.then(userResult => {
				if(mobile_number.length <10){
					responses.invalidmobilenumber(res);
				} else {
				for(let i=0; i< req.files.length ;i++) {
					let profile_image = `/user/${req.files[i].filename}`;
					let user_id = userResult[0].user_id;
					console.log(user_id)
					let updateData = {business_name , mobile_number ,address , profile_image ,is_profile_create : 1};
					let condition = {user_id};
					UserModel.updateQuery(updateData , condition)
						.then((userResponse) => {responses.success(res , userResponse);})
						.catch((error) => responses.sendError(error.message, res));
					}
				}

			})
			.catch((error) => responses.sendError(error.message, res));
		})
	.catch((error) => responses.sendError(error.message, res));
};

exports.forgotPassword = (req , res) => {
	let {email_id} = req.body;
	let manKeys = ["email_id"];
	let condition = {email_id};
	let verification_code = commFunc.generateRandomString();
	let updateData = {verification_code};
	commFunc.checkKeyExist(req.body, manKeys)
	.then(result => result.length ? responses.parameterMissing(res, result[0]) : '')
	.then(result => {
		UserModel.selectQuery(condition)
		.then(userResult => userResult[0].email_id != req.body.email_id ? responses.invalidCredential(res , constant.responseMessages.EMAIL_NOT_FOUND) : userResult)
		.then(userResult =>{
			let user_id = userResult[0].user_id;
			let condition = {user_id};
			UserModel.updateQuery(updateData , condition)
			.then((userResponse) => { responses.success(res , userResponse)
				config.sendMail(verification_code , email_id);
			})
			.catch((error) => responses.sendError(error.message, res));
		})
		.catch((error) => responses.sendError(error.message, res));
	})
	.catch((error) => responses.sendError(error.message, res));
};

exports.resetPassword = (req , res) => {
	let {new_password , verification_code} = req.body;
	let {access_token} = req.headers;
	let manKeys = ["new_password","verification_code"];
	let condition = {access_token};
	let password = md5(new_password);
	let updateData = {password , verification_code : "" , is_otp_verified : 0};
	commFunc.checkKeyExist(req.body, manKeys)
	.then(result => result.length ? responses.parameterMissing(res , result[0]) : '')
	.then(result => {
		UserModel.selectQuery(condition)
		.then(userResult => userResult[0].verification_code != req.body.verification_code ? responses.invalidCredential(res ,constant.responseMessages.OTP_NOT_MATCHED) : userResult )
		.then(userResult => {
			let user_id = userResult[0].user_id;
			let condition = {user_id};
			UserModel.updateQuery(updateData , condition)
			.then((userResponse) => {responses.success(res ,userResponse);})
			.catch((error) => responses.sendError(error.message, res));
		})
		.catch((error) => responses.sendError(error.message, res));
	})
	.catch((error) => responses.sendError(error.message, res));
};
exports.verifyOtp = (req , res) => {
	let {otp} = req.body;
	let {access_token} = req.headers;
	let manKeys = ["otp"];
	let condition = {access_token};
	let updateData = {is_otp_verified : 1}
	commFunc.checkKeyExist(req.body, manKeys)
	.then(result => result.length ? responses.parameterMissing(res, result[0]) : '')
	.then(result =>{
		UserModel.selectQuery(condition)
		.then(userResult => userResult[0].verification_code != req.body.otp ? responses.invalidCredential(res ,constant.responseMessages.OTP_NOT_MATCHED) : userResult)
		.then(userResult => {
			let user_id = userResult[0].user_id;
			let condition = {user_id};
			UserModel.updateQuery(updateData , condition)
			.then((userResponse) => {responses.success( res ,userResponse);})
			.catch((error) => responses.sendError(error.message, res));
		})
			.catch((error) => responses.sendError(error.message, res));
		
	})
		.catch((error) => responses.sendError(error.message, res));
};
exports.logOut = (req, res) => {
	let {access_token} = req.headers;
	let condition = {access_token};
	let manKeys = ["access_token"];
	commFunc.checkKeyExist(req.headers, manKeys)
	.then(result => result.length ? responses.parameterMissing(res, result[0]) : '')
	.then(result => {
		UserModel.selectQuery(condition)
		.then(userResult => {
			 let user_id = userResult[0].user_id;
			 UserModel.updateQuery({access_token:""} , {user_id})
			 .then(userResponse => {responses.success(res , constant.responseMessages.LOGOUT_SUCCESSFULLY)})
			 .catch((error) => responses.sendError(error.message, res));
		}) .catch((error) => responses.sendError(error.message, res));
	}) .catch((error) => responses.sendError(error.message, res));
}






