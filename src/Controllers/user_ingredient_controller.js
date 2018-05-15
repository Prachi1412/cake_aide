import commFunc from '../Modules/commonFunction';
import responses from '../Modules/responses';
import constant from '../Modules/constant';
import IngredientModel from '../Modals/user_ingredient_model';
import UserModel from '../Modals/user_model';
import connection from '../Modules/connection.js';

import md5 from 'md5';


exports.addIngredient = (req , res) => {
	let { ingredient_name , brand , price ,currency, quantity ,size } = req.body;
	let {access_token} = req.headers;
	//let user_id = req.user.user_id;
	let manKeys = ["ingredient_name" , "brand" ,"currency"  , "size"];
	commFunc.checkKeyExist(req.body, manKeys)
	.then(result => result.length ? new Promise  (new Error(responses.parameterMissing(res,result[0]))) : '')
	.then(result => {
		UserModel.selectQuery({access_token})
		.then(userResult => {
			let user_id = userResult[0].user_id;
			IngredientModel.selectQuery({ingredient_name})
			.then(ingredientResult => {
				if(ingredientResult.length >0) {
					throw new Error(responses.invalidCredential(res, constant.responseMessages.INGREDIENT_ALREADY_EXISTS));
				} else {
					let ingredient_id = md5(new Date());
					if(currency == 1) {
						currency = "£";
					} else if(currency == 2) { 
						currency = "$";
					} else if(currency == 3) {
						currency = "€";
					} else if(currency == 4) {
						currency = "¥";
					} else {
						throw new Error(responses.invalidCredential(res , 'Plaese enter right currency parameter'));
					}
					if(req.body.price <= 0 || req.body.quantity <= 0) {
						throw new Error(responses.invalidCredential(res , 'Price and Quantity should not be zero'));
					}
					let insertData = {user_id ,ingredient_id,ingredient_name , brand , price ,currency : currency , quantity ,size}
					IngredientModel.insertQuery(insertData).then((ingredientResponse) =>{ responses.success(res, ingredientResponse[0])})
					.catch((error) => responses.sendError(error.message, res));
				}
			}) .catch((error) => responses.sendError(error.message, res));
		}).catch((error) => responses.sendError(error.message, res));

	}).catch((error) => responses.sendError(error.message, res));
};

exports.editIngredient = (req ,res) => {
	let {ingredient_id,ingredient_name , brand , price ,currency, quantity , size} = req.body;
	let {access_token} = req.headers;
	let manKeys = ["ingredient_id"];
	let condition = {access_token};
	commFunc.checkKeyExist(req.body, manKeys)
	.then(result => result.length ? new Promise  (new Error(responses.parameterMissing(res,result[0]))) : '')
	.then(result => {
		IngredientModel.selectQuery({ingredient_id})
		.then(ingredientResult => {
			if(ingredientResult.length > 0){
				console.log(ingredientResult)
				if(currency == 1) {
						currency = "£";
					} else if(currency == 2) {
						currency = "$";
					} else if(currency == 3) {
						currency = "€";
					} else if(currency == 4) {
						currency = "¥";
					} else {
						throw new Error(responses.invalidCredential(res , 'Plaese enter right currency parameter'));
					}
				let updateData = {ingredient_name , brand , price ,currency : currency, quantity , size}
				let ingredient_id = ingredientResult[0].ingredient_id;
				let condition = {ingredient_id};
				IngredientModel.updateQuery(updateData , condition)
				.then((ingredientResponse) =>{ responses.success(res, ingredientResponse)})
				.catch((error) => responses.sendError(error.message, res));
			} else {
				throw new Error(responses.invalidCredential(res, constant.responseMessages.INGREDIENT_NOT_EXISTS));
			}
		} ) .catch((error) => responses.sendError(error.message, res));


	}).catch((error) => responses.sendError(error.message, res));

};
exports.deleteIngredient = (req ,res) => {
	let {ingredient_id} = req.body;
	let {access_token} = req.headers;
	let manKeys = ["ingredient_id"];
	commFunc.checkKeyExist(req.body, manKeys)
	.then(result => result.length ? new Promise  (new Error(responses.parameterMissing(res,result[0]))) : '')
	.then(result => {
		IngredientModel.selectQuery({ingredient_id})
		.then(ingredientResult => {
			if(ingredientResult.length > 0) {
				let ingredient_id = ingredientResult[0].ingredient_id;
		    	let condition = {ingredient_id};
			    IngredientModel.deleteQuery(condition)
			    .then((ingredientResponse) =>{ 
				throw new Error(responses.success(res, constant.responseMessages.INGREDIENT_DELETED_SUCCESSFULLY))})
			   .catch((error) => responses.sendError(error.message, res));
			} else {
				throw new Error(responses.invalidCredential(res, constant.responseMessages.INGREDIENT_NOT_EXISTS));
			}
		}) .catch((error) => responses.sendError(error.message, res));
	}) .catch((error) => responses.sendError(error.message, res));
};
exports.get_ingredient = (req , res) => {
	let sql = "select * from `tb_ingredientlist`";
	connection.query(sql , [] ,function(err , result) {
		if(err) {
			responses.sendError(err,res);
		} else {
			responses.success(res , result);
		}
	})
}

	



	