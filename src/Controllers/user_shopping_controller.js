import commFunc from '../Modules/commonFunction';
import responses from '../Modules/responses';
import constant from '../Modules/constant';
import ShoppingModel from '../Modals/user_shopping_model';
import UserModel from '../Modals/user_model';
import connection from '../Modules/connection.js';

import md5 from 'md5';

exports.createList = (req , res) => {
	let {cake_name , cake_description , amount} = req.body;
	let {access_token} = req.headers;
	UserModel.selectQuery({access_token})
	.then(result => {
		if(result==0){
			responses.authenticationErrorResponse(res);
		} else {
			let user_id = req.user.user_id;
			console.log(user_id);
			let manKeys = ["cake_name","cake_description","amount"];
			commFunc.checkKeyExist(req.body, manKeys)
			.then(result => result.length ? new Promise  (new Error(responses.parameterMissing(res,result[0]))) : result)
			.then(result => {
				ShoppingModel.selectQuery({cake_name})
				.then((shoppingResult) => {
					if(shoppingResult.length > 0) {
					throw new Error(responses.invalidCredential(res,'This cake name already exist'));
				} else {
				let cake_id = md5(new Date());
				let insertData = {user_id,cake_id,cake_name , cake_description , amount};
				ShoppingModel.insertQuery(insertData)
				.then((shoppingResponse ) => {
					responses.success(res , shoppingResponse);
				})
				.catch((error) => responses.sendError(error.message, res));
				}
			}).catch((error) => responses.sendError(error.message, res));
	
		}).catch((error) => responses.sendError(error.message, res));

		}
		
	}).catch((error) => responses.sendError(error.message, res));

}
exports.addShoppingList = (req , res) => {
	let {cake_id,softend_butter , Large_3_eggs , baking_paper ,pinch_of_salt,baking_powder,vanilla_extract} = req.body;
	let {access_token} = req.headers;
		UserModel.selectQuery({access_token})
		.then(result => {
		if(result==0){
			responses.authenticationErrorResponse(res);
		} else {
			let manKeys = ["cake_id"];
			commFunc.checkKeyExist(req.body,manKeys)
			.then((result) => {
				if(result.length > 0) {
					responses.parameterMissing(res,result[0]);
			} else { 
				let updateData = req.body; 
				ShoppingModel.updateQuery(updateData, {cake_id})
				.then((shoppingResponse) => {
					responses.success(res , shoppingResponse);
				}).catch((error) => responses.sendError(error.message, res));

				}
	    	}) .catch((error) => responses.sendError(error.message, res));
		}
	
	}).catch((error) => responses.sendError(error.message, res));
};
exports.editShoppingList = (req , res) => {
	let {cake_id,cake_name , cake_description , amount,softend_butter , Large_3_eggs , baking_paper ,pinch_of_salt,baking_powder,vanilla_extract} = req.body;
	let {access_token} = req.headers;
		UserModel.selectQuery({access_token})
		.then(result => {
		if(result==0){
			responses.authenticationErrorResponse(res);
		} else {
			let manKeys = ["cake_id"];
			commFunc.checkKeyExist(req.body,manKeys)
			.then((result) => {
				if(result.length > 0) {
					responses.parameterMissing(res,result[0]);
			} else { 
				let updateData = req.body; 
				ShoppingModel.updateQuery(updateData, {cake_id})
				.then((shoppingResponse) => {
					responses.success(res , shoppingResponse);
				}).catch((error) => responses.sendError(error.message, res));

				}
	    	}) .catch((error) => responses.sendError(error.message, res));
		}
	
	}).catch((error) => responses.sendError(error.message, res));

}