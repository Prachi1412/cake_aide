import commFunc from '../Modules/commonFunction';
import responses from '../Modules/responses';
import constant from '../Modules/constant';
import RecipeModel from '../Modals/user_recipe_model';
import UserModel from '../Modals/user_model';
import IngredientModel from '../Modals/user_ingredient_model';
import connection from '../Modules/connection.js';

import md5 from 'md5';

exports.createRecipeType = (req , res) => {
	let {recipe_type} = req.body;
	let {access_token} = req.headers;
	let condition = {access_token};
	if(recipe_type == 1){
		let {image} = req.body;
		for(let i =0 ; i<req.files.length ; i++) {
			let image = `/recipe/${req.files[i].filename}`;
			UserModel.selectQuery(condition)
			.then(userResult => userResult.length > 0 ?  userResult : responses.invalidCredential(res , constant.responseMessages.USER_NOT_FOUND))
			.then((userResult) => {
			let user_id = userResult[0].user_id;
			let recipe_id = md5(new Date());
			let insertData = {user_id ,recipe_id, image ,recipe_type,is_image_uploaded : 1}
			RecipeModel.insertQuery(insertData).then((recipeResponse) =>{ responses.success(res, constant.responseMessages.IMAGE_UPLOADED)})
			.catch((error) => responses.sendError(error.message, res));
		    }) .catch((error) => responses.sendError(error.message, res));
	    }
	}    
	else if(recipe_type == 2) { 
		let {paste_recipe} = req.body;
		let manKeys = ["paste_recipe"];
		commFunc.checkKeyExist(req.body, manKeys)
         	.then(result => result.length ? new Promise  (new Error(responses.parameterMissing(res,result[0]))) : '')
	        .then(result => {
				UserModel.selectQuery(condition)
				.then(userResult => userResult.length > 0 ?  userResult : responses.invalidCredential(res , constant.responseMessages.USER_NOT_FOUND))
				.then((userResult) => {
				let user_id = userResult[0].user_id;
				let recipe_id = md5(new Date());
				let insertData = {user_id ,recipe_id ,paste_recipe , recipe_type : 2}
				RecipeModel.insertQuery(insertData).then((recipeResponse) =>{ responses.success(res, constant.responseMessages.RECIPE_UPLOADED)})
				.catch((error) => responses.sendError(error.message, res));
		    }).catch((error) => responses.sendError(error.message, res));
		}).catch((error) => responses.sendError(error.message, res));
	}   
	else if(recipe_type == 3){
	 	let {amount , weight} = req.body;
	 	let manKeys = ["amount" , "weight"];
	 	commFunc.checkKeyExist(req.body, manKeys)
	 	.then(result => result.length ? new Promise  (new Error(responses.parameterMissing(res,result[0]))) : '')
	    .then(result => { 
	    	UserModel.selectQuery(condition)
			.then(userResult => userResult.length > 0 ?  userResult : responses.invalidCredential(res , constant.responseMessages.USER_NOT_FOUND))
			.then((userResult) => {
				let user_id = userResult[0].user_id;
				let recipe_id = md5(new Date());
				let insertData = {user_id , recipe_id,amount , recipe_type : 3 ,is_manual :1}
				RecipeModel.insertQuery(insertData).then((recipeResponse) =>{ responses.success(res, constant.responseMessages.MANUAL_ENTRY_LIST)})
				.catch((error) => responses.sendError(error.message, res));
			}).catch((error) => responses.sendError(error.message, res));
		}).catch((error) => responses.sendError(error.message, res));
	}
}

exports.newRecipeEntry = (req , res) => {
	let {recipe_id} = req.body;
	let condition = {recipe_id};
	console.log(condition)
	let {recipe_name , cake_size , need_quantity , price } = req.body;
	let manKeys = ["recipe_name","cake_size" , "need_quantity","price"];
	commFunc.checkKeyExist(req.body , manKeys)
	.then(result => result.length ? new Promise  (new Error(responses.parameterMissing(res,result[0]))) : '')
	.then((result) => {
	    let condition = {recipe_id};
		let updateData = {recipe_name,cake_size,need_quantity,price};
		RecipeModel.updateQuery(updateData , condition)
		.then(recipeResponse => responses.success(res , recipeResponse))
		.catch((error) => responses.sendError(error.message, res));
	}).catch((error) => responses.sendError(error.message, res));
}

exports.getRecipe = (req , res) => {
	let sql = "select `recipe_name` from `tb_myrecipe`";
	connection.query(sql , [] ,function(err , result) {
		if(err) {
			responses.sendError(err,res);
		} else {
			responses.success(res , result);
		}
	})
}
