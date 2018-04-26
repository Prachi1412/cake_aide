import commFunc from '../Modules/commonFunction';
import responses from '../Modules/responses';
import constant from '../Modules/constant';
import RecipeModel from '../Modals/user_recipe_model';
import UserModel from '../Modals/user_model';
import IngredientModel from '../Modals/user_ingredient_model';

import md5 from 'md5';

exports.createRecipe = (req , res) => {
	let {recipe_type} = req.body;
	let {access_token} = req.headers;
	let condition = {access_token};
	if(req.body.recipe_type == 1){
		let {image} = req.body;
		for(let i =0 ; i<req.files.length ; i++) {
			let image = `/recipe/${req.files[i].filename}`;
			UserModel.selectQuery(condition)
			.then(userResult => userResult.length > 0 ?  userResult : responses.invalidCredential(res , constant.responseMessages.USER_NOT_FOUND))
			.then((userResult) => {
			let user_id = userResult[0].user_id;
			let insertData = {user_id , image ,recipe_type,is_image_uploaded : 1}
			RecipeModel.insertQuery(insertData)
			.then(recipeResult => recipeResult.length > 0 ? recipeResult : responses.invalidCredential(res , constant.responseMessages.RECIPE_NOT_EXIST))
			.then((recipeResult) => {
				let {recipe_name , cake_size , need_quantity,price } = req.body;
				let manKeys = ["recipe_name" , "cake_size","need_quantity","price"];
				let manValues = {recipe_name , cake_size, need_quantity,price};
				let updateData = {recipe_name,cake_size,need_quantity,price};
				commFunc.checkKeyExist(manValues, manKeys)
		         	.then(result => result.length ? new Promise  (new Error(responses.parameterMissing(res,result[0]))) : '')
			        .then(result => {
			        	let user_id = recipeResult[0].user_id;
						RecipeModel.updateQuery(updateData , {user_id})
						.then((recipeResponse) =>{ responses.success(res, recipeResponse[0])})
						.catch((error) => responses.sendError(error.message, res));
			       }).catch((error) => responses.sendError(error.message, res));
			    }).catch((error) => responses.sendError(error.message, res));
		    }) .catch((error) => responses.sendError(error.message, res));
	    }
	}    
	else if(req.body.recipe_type == 2) { 
		let {paste_recipe} = req.body;
		let manKeys = ["paste_recipe"];
		commFunc.checkKeyExist(req.body, manKeys)
         	.then(result => result.length ? new Promise  (new Error(responses.parameterMissing(res,result[0]))) : '')
	        .then(result => {
				UserModel.selectQuery(condition)
				.then(userResult => userResult.length > 0 ?  userResult : responses.invalidCredential(res , constant.responseMessages.USER_NOT_FOUND))
				.then((userResult) => {
				let user_id = userResult[0].user_id;
				let insertData = {user_id , paste_recipe , recipe_type : 2}
				RecipeModel.insertQuery(insertData)
				.then(recipeResult => recipeResult.length > 0 ? recipeResult :  responses.invalidCredential(res , constant.responseMessages.RECIPE_NOT_EXIST))
				.then((recipeResult) => {
					let {recipe_name , cake_size , need_quantity,price } = req.body;
					let manKeys = ["recipe_name" , "cake_size","need_quantity","price"];
					let updateData = {recipe_name,cake_size,need_quantity,price};
					commFunc.checkKeyExist(req.body, manKeys)
		         	.then(result => result.length ? new Promise  (new Error(responses.parameterMissing(res,result[0]))) : '')
			        .then(result => {
			        	let user_id = recipeResult[0].user_id;
						RecipeModel.updateQuery(updateData , {user_id})
						.then((recipeResponse) =>{ responses.success(res, recipeResponse[0])})
						.catch((error) => responses.sendError(error.message, res));
			       }).catch((error) => responses.sendError(error.message, res));
			    }).catch((error) => responses.sendError(error.message, res));

		}).catch((error) => responses.sendError(error.message, res));
	}).catch((error) => responses.sendError(error.message, res));
}				
         
	 else if(req.body.recipe_type == 3){
	 	let {amount , weight} = req.body;
	 	let manKeys = ["amount" , "weight"];
	 	commFunc.checkKeyExist(req.body, manKeys)
	 	.then(result => result.length ? new Promise  (new Error(responses.parameterMissing(res,result[0]))) : '')
	    .then(result => { 
	    	UserModel.selectQuery(condition)
			.then(userResult => userResult.length > 0 ?  userResult : responses.invalidCredential(res , constant.responseMessages.USER_NOT_FOUND))
			.then((userResult) => {
				let user_id = userResult[0].user_id;
				let insertData = {user_id , amount , recipe_type : 3}
				RecipeModel.insertQuery(insertData)
				.then(recipeResult => recipeResult.length > 0 ? recipeResult :  responses.invalidCredential(res , constant.responseMessages.RECIPE_NOT_EXIST)) 
				.then((recipeResult) => {
					let {recipe_name , cake_size , need_quantity,price } = req.body;
					let manKeys = ["recipe_name" , "cake_size","need_quantity","price"];
					let updateData = {recipe_name,cake_size,need_quantity,price};
					commFunc.checkKeyExist(req.body, manKeys)
		         	.then(result => result.length ? new Promise  (new Error(responses.parameterMissing(res,result[0]))) : '')
			        .then(result => {
			        	let user_id = recipeResult[0].user_id;
						RecipeModel.updateQuery(updateData , {user_id})
						.then((recipeResponse) =>{ responses.success(res, recipeResponse[0])})
						.catch((error) => responses.sendError(error.message, res));
			       }).catch((error) => responses.sendError(error.message, res));
			    }).catch((error) => responses.sendError(error.message, res));
			}).catch((error) => responses.sendError(error.message, res));
		}).catch((error) => responses.sendError(error.message, res));
	}
}


