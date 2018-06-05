import commFunc from '../Modules/commonFunction';
import responses from '../Modules/responses';
import constant from '../Modules/constant';
import IngredientModel from '../Modals/user_ingredient_model';
import UserModel from '../Modals/user_model';
import connection from '../Modules/connection.js';

import md5 from 'md5';

exports.addIngredient = (req , res) => {
	let {access_token} = req.headers;
	let { ingredient_name, brand, price, currency, quantity, size } = req.body;

	let manKeys = ["ingredient_name", "currency", "size"];
	let manValues = {ingredient_name, currency, size };

	commFunc.checkKeyExist(manValues, manKeys)
	.then(result => {
		if (result.length) {
			new Error(responses.parameterMissing(res,result[0]));
		} 
		return UserModel.selectQuery({access_token});
	})
	.then(userResult => {
		if (!userResult) {
			throw new Error(responses.authenticationErrorResponse(res));
		} else {

			let user_id = userResult[0].user_id;
			let condition = {ingredient_name, brand}
			IngredientModel.selectIngredientQuery(condition)
			.then(ingredientResult => {
				console.log(ingredientResult.length);
				if(ingredientResult.length) {
					console.log("==================")
					console.log(ingredientResult);
					if (ingredientResult[0].brand == "") {

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

						if(price <= 0 || quantity <= 0) {
							throw new Error(responses.invalidCredential(res , 'Price and Quantity should not be zero'));
						}

						let insertData = {user_id, ingredient_id, ingredient_name, brand, price, quantity, size};
						insertData.currency = currency;

						IngredientModel.insertQuery(insertData)
						.then((ingredientResponse) =>{ responses.success(res, ingredientResponse[0])})
						.catch((error) => responses.sendError(error.message, res));

					} else if (ingredient_name == ingredientResult[0].ingredient_name && brand == ingredientResult[0].brand) {
						responses.invalidCredential(res , 'This ingredient with this brand is already exist.');
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
							responses.invalidCredential(res , 'Plaese enter right currency parameter');
						}

						if(price <= 0 || quantity <= 0) {
							responses.invalidCredential(res , 'Price and Quantity should not be zero');
						}

						let insertData = {user_id, ingredient_id, ingredient_name, brand, price, quantity, size};
						insertData.currency = currency;

						IngredientModel.insertQuery(insertData)
						.then((ingredientResponse) =>{ responses.success(res, ingredientResponse[0])})
						.catch((error) => responses.sendError(error.message, res));
					}

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

					if(price <= 0 || quantity <= 0) {
						throw new Error(responses.invalidCredential(res , 'Price and Quantity should not be zero'));
					}

					let insertData = {user_id, ingredient_id, ingredient_name, brand, price, quantity, size};
					insertData.currency = currency;

					IngredientModel.insertQuery(insertData)
					.then((ingredientResponse) =>{ responses.success(res, ingredientResponse[0])})
					.catch((error) => responses.sendError(error.message, res));
				} 

			}) .catch((error) => responses.sendError(error.message, res));
			}
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
				.then((ingredientResponse) =>{ 
					console.log("=================================")
					console.log(ingredientResponse);
					responses.success(res, ingredientResponse)})
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
	let {access_token} = req.headers;
	UserModel.selectQuery({access_token})
	.then((result) => {
		let user_id = result[0].user_id;
		let sql = "select * from `tb_ingredientlist` where `user_id` = ?";
		connection.query(sql , [user_id] ,function(err , result) {
		if(err) {
			responses.sendError(err,res);
		} else {
			console.log("result"+result)
			responses.success(res , result);
		}
	})
	})
	
}

	



	