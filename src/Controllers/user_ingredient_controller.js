import commFunc from '../Modules/commonFunction';
import responses from '../Modules/responses';
import constant from '../Modules/constant';
import IngredientModel from '../Modals/user_ingredient_model';
import UserModel from '../Modals/user_model';
import connection from '../Modules/connection.js';

import md5 from 'md5';

exports.addIngredient = (req , res) => {
	let { ingredient_name , brand , price , quantity ,size } = req.body;
	let {access_token} = req.headers;
	let manKeys = ["ingredient_name" , "brand" , "price" , "quantity" , "size"];
	let condition = {access_token};
	commFunc.checkKeyExist(req.body, manKeys)
	.then(result => result.length ? new Promise  (new Error(responses.parameterMissing(res,result[0]))) : '')
	.then(result => {
		UserModel.selectQuery(condition)
		.then(userResult => userResult.length < 0 ? responses.userNotExist(res) : userResult )
		.then((userResult) =>{
			IngredientModel.selectQuery({ingredient_name})
			.then(ingredientResult => ingredientResult.length >0 ? new Promise(new (responses.invalidCredential(res, constant.responseMessages.INGREDIENT_ALREADY_EXISTS))):ingredientResult)
			.then((ingredientResult) => {
				let user_id = userResult[0].user_id;
				let condition = {user_id};
				let ingredient_id = md5(new Date());
				let insertData = {user_id ,ingredient_id,ingredient_name , brand , price , quantity ,size}
				IngredientModel.insertQuery(insertData).then((ingredientResponse) =>{ responses.success(res, ingredientResponse)})
				.catch((error) => responses.sendError(error.message, res));
			}) .catch((error) => responses.sendError(error.message, res));

		}).catch((error) => responses.sendError(error.message, res));
	}).catch((error) => responses.sendError(error.message, res));
};

exports.editIngredient = (req ,res) => {
	let {ingredient_id,ingredient_name , brand , price , quantity , size} = req.body;
	let {access_token} = req.headers;
	let manKeys = ["ingredient_id","ingredient_name" , "brand" , "price" , "quantity" , "size"];
	let condition = {access_token};
	commFunc.checkKeyExist(req.body, manKeys)
	.then(result => result.length ? new Promise  (new Error(responses.parameterMissing(res,result[0]))) : '')
	.then(result => {
		IngredientModel.selectQuery({ingredient_id})
		.then(ingredientResult => ingredientResult.length > 0 ? ingredientResult : responses.ingredientNotExist(res))
		.then((ingredientResult) => { 
			console.log(ingredientResult)
			let updateData = { ingredient_name , brand , price , quantity , size};
			let ingredient_id = ingredientResult[0].ingredient_id;
			let condition = {ingredient_id};
			IngredientModel.updateQuery(updateData , condition)
			.then((ingredientResponse) =>{ responses.success(res, ingredientResponse)})
			.catch((error) => responses.sendError(error.message, res));
		}) .catch((error) => responses.sendError(error.message, res));

	}).catch((error) => responses.sendError(error.message, res));

};
exports.deleteIngredient = (req ,res) => {
	let {ingredient_id} = req.body;
	let manKeys = ["ingredient_id"];
	commFunc.checkKeyExist(req.body, manKeys)
	.then(result => result.length ? new Promise  (new Error(responses.parameterMissing(res,result[0]))) : '')
	.then(result => {
		IngredientModel.selectQuery({ingredient_id})
		.then(ingredientResult => ingredientResult.length > 0 ? ingredientResult : responses.ingredientNotExist(res))
		.then((ingredientResult) => { 
			let ingredient_id = ingredientResult[0].ingredient_id;
			let condition = {ingredient_id};
			IngredientModel.deleteQuery(condition)
			.then((ingredientResponse) =>{ 
				responses.deletedIngredient(res)})
			.catch((error) => responses.sendError(error.message, res));
		}) .catch((error) => responses.sendError(error.message, res));

	}).catch((error) => responses.sendError(error.message, res));

};
	
exports.get_ingredient = (req , res) => {
	let sql = "select `ingredient_name` from `tb_ingredientlist`";
	connection.query(sql , [] ,function(err , result) {
		if(err) {
			responses.sendError(err,res);
		} else {
			responses.success(res , result);
		}
	})
}


	