import commFunc from '../Modules/commonFunction';
import responses from '../Modules/responses';
import constant from '../Modules/constant';
import appsettingModel from '../Modals/user_appsetting_model';
import UserModel from '../Modals/user_model';
import md5 from 'md5';
import connection from '../Modules/connection.js';

exports.add_reminder = (req ,res) => {
	let {access_token} = req.headers;
	let {name,description,dear,message} = req.body;
	UserModel.selectQuery({access_token})
	.then((result) => {
		if(result == 0) {responses.authenticationErrorResponse(res);}
		else {
			appsettingModel.selectQuery({name})
			.then((resultResponse) => {
				if(resultResponse.length > 0) {
					responses.invalidCredential(res , constant.responseMessages.REMINDER_ALREADY_EXISTS);
				}else {
					let user_id = result[0].user_id;
					let reminder_id = md5(new Date());
					let insertData = {user_id,reminder_id,name,description,dear,message}
					appsettingModel.insertQuery(insertData).then((appResponse) => { responses.success_recipe(res,"Reminder added successfully.",appResponse[0])})
					.catch((error) => responses.sendError(error.message, res));
				}
			}).catch((error) => responses.sendError(error.message, res));
	
		}
	}).catch((error) => responses.sendError(error.message, res));
}
exports.edit_reminder = (req ,res) => {
	let {access_token} = req.headers;
	let {reminder_id,name,description,dear,message} = req.body; 
	UserModel.selectQuery({access_token})
	.then((result) => {
		if(result == 0) {responses.authenticationErrorResponse(res);}
		else {
			appsettingModel.selectQuery({name})
			.then((resultResponse) => {
				if(resultResponse.length > 0) {
					responses.invalidCredential(res , constant.responseMessages.REMINDER_ALREADY_EXISTS);
				} else {
					let updateData = {name,description,dear,message};
					appsettingModel.updateQuery(updateData,{reminder_id})
					.then((reminderResponse) => {
						responses.success_recipe(res,"Reminder Updated successfully.",reminderResponse[0]);

					}).catch((error) => responses.sendError(error.message, res));
				}
			}).catch((error) => responses.sendError(error.message, res));
		}

	}).catch((error) => responses.sendError(error.message, res));
}	
exports.delete_reminder = (req ,res) => {
	let {access_token} = req.headers;
	let {reminder_id} = req.body; 
	UserModel.selectQuery({access_token})
	.then((result) => {
		if(result == 0) {responses.authenticationErrorResponse(res);}
		else{
			let manKeys = ["reminder_id"];
			commFunc.checkKeyExist(req.body, manKeys)
			.then((resultReminder) => {
				if(resultReminder.length) {responses.parameterMissing(res,result[0]);}
				else{
					appsettingModel.selectQuery({reminder_id})
					.then((reminderResponse) => {
						if(reminderResponse.length > 0) {
							let reminder_id = reminderResponse[0].reminder_id;
					    	let condition = {reminder_id};
						    appsettingModel.deleteQuery(condition)
						    .then((ingredientResponse) =>{ 
							responses.success_recipe(res, constant.responseMessages.REMINDER_DELETED_SUCCESSFULLY)})
							.catch((error) => responses.sendError(error.message, res));
						}else {
							responses.invalidCredential(res, constant.responseMessages.REMINDER_NOT_EXISTS);
						}
					}).catch((error) => responses.sendError(error.message, res));
				}
			}).catch((error) => responses.sendError(error.message, res));

		}
    }).catch((error) => responses.sendError(error.message, res));
}
exports.get_reminder = (req ,res) => {
	let {access_token} = req.headers;
	UserModel.selectQuery({access_token})
	.then((result) => {
		if(result == 0) {responses.authenticationErrorResponse(res);}
		else {
			let user_id = result[0].user_id;
			let sql = "SELECT * FROM `tb_reminder` WHERE `user_id` = ?";
			connection.query(sql,[user_id],(err,result) => {
				if(err){responses.sendError(res);}
				else{
					responses.success(res,result);
				}
			})

		}

   })
}