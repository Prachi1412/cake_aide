import commFunc from '../Modules/commonFunction';
import responses from '../Modules/responses';
import constant from '../Modules/constant';
import AdminModel from '../Modals/admin_model';
import config from '../Config/nodemailer';

import md5 from 'md5';

exports.login = (req, res) => {
	let {email, password} = req.body;
	let manKeys = ["email", "password"];
	let condition  = {email}
	let encrypt_password = md5(password);
	let access_token = md5(new Date());
	let updateData = {access_token , verification_code:""};
	commFunc.checkKeyExist(req.body, manKeys)
	.then(result => result.length ? responses.parameterMissing(res, result[0]) : '')
	.then(result => {
		AdminModel.selectQuery(condition)
		.then(adminResult=> {
			if(adminResult.length == 0) {
				responses.invalidCredential(res, constant.responseMessages.INVALID_EMAIL_ID);
			}else if(adminResult[0].password != encrypt_password) {
				responses.invalidCredential(res, constant.responseMessages.INCORRECT_PASSWORD);
			} else {
				let admin_id = adminResult[0].admin_id;
				let condition = {admin_id}
				AdminModel.updateQuery(updateData, condition)
				.then((adminResponse) =>{ responses.success(res, adminResponse)})
				.catch((error) => responses.sendError(error.message, res));
			}
		}).catch((error) => responses.sendError(error.message, res));
	}).catch((error) => responses.sendError(error.message, res));
};
exports.forgotPassword = (req , res) => {
	let {email} = req.body;
	let manKeys = ["email"];
	let condition = {email};
	let verification_code = commFunc.generateRandomString();
	let updateData = {verification_code};
	commFunc.checkKeyExist(req.body, manKeys)
	.then(result => result.length ? responses.parameterMissing(res, result[0]) : '')
	.then(result => {
		AdminModel.selectQuery(condition)
		.then(adminResult => adminResult[0].email != req.body.email ? responses.invalidCredential(res , constant.responseMessages.EMAIL_NOT_FOUND) : adminResult)
		.then(adminResult =>{
			let admin_id = adminResult[0].admin_id;
			let condition = {admin_id};
			AdminModel.updateQuery(updateData , condition)
			.then((adminResponse) => { responses.successOtp(res , constant.responseMessages.OTP_SENT)
				config.sendMail(verification_code , email);
			})
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
		AdminModel.selectQuery(condition)
		.then(adminResult => adminResult[0].verification_code != req.body.otp ? responses.invalidCredential(res ,constant.responseMessages.OTP_NOT_MATCHED) : adminResult)
		.then(adminResult => {
			let admin_id = adminResult[0].admin_id;
			let condition = {admin_id};
			AdminModel.updateQuery(updateData , condition)
			.then((adminResponse) => {responses.success( res ,adminResponse);})
			.catch((error) => responses.sendError(error.message, res));
		})
			.catch((error) => responses.sendError(error.message, res));
		
	})
		.catch((error) => responses.sendError(error.message, res));
};
exports.resetPassword = (req , res) => {
	let {new_password , verification_code} = req.body;
	let {access_token} = req.headers;
	let manKeys = ["new_password"];
	let condition = {access_token};
	let password = md5(new_password);
	let updateData = {password , verification_code : "" ,is_otp_verified : 0};
	commFunc.checkKeyExist(req.body, manKeys)
	.then(result => result.length ? responses.parameterMissing(res , result[0]) : '')
	.then(result => {
		if(new_password.length < 8) {
			responses.invalidCredential(res , constant.responseMessages.INVALID_PASSWORD_FORMAT);
		} else {
		AdminModel.selectQuery(condition)
			.then(adminResult => {
			let admin_id = adminResult[0].admin_id;
			let condition = {admin_id};
			AdminModel.updateQuery(updateData , condition)
			.then((adminResponse) => {responses.success(res ,constant.responseMessages.RESETPASSWORD_SUCCESSFULLY);})
			.catch((error) => responses.sendError(error.message, res));
		})
		.catch((error) => responses.sendError(error.message, res));
		}
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
		AdminModel.selectQuery(condition)
		.then(userResult => {
			 let admin_id = userResult[0].admin_id;
			 AdminModel.updateQuery({access_token:""} , {admin_id})
			 .then(userResponse => {responses.success(res , constant.responseMessages.LOGOUT_SUCCESSFULLY)})
			 .catch((error) => responses.sendError(error.message, res));
		}) .catch((error) => responses.sendError(error.message, res));
	}) .catch((error) => responses.sendError(error.message, res));
}