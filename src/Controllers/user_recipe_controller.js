import commFunc from '../Modules/commonFunction';
import responses from '../Modules/responses';
import constant from '../Modules/constant';
import RecipeModel from '../Modals/user_recipe_model';
import UserModel from '../Modals/user_model';
import IngredientModel from '../Modals/user_ingredient_model';
import connection from '../Modules/connection.js';
import convert from 'node-unit-conversion';
import async from 'async';

import _ from "lodash";
import md5 from 'md5';

exports.createRecipeType = (req , res) => {
	let {recipe_type} = req.body;
	let {access_token} = req.headers;
	let condition = {access_token};
		UserModel.selectQuery({access_token})
		.then(result => {
			if(result==0){
				responses.authenticationErrorResponse(res);
		  	} else {
		  		if(recipe_type == 0){
				let {image} = req.body;
				for(let i =0 ; i<req.files.length ; i++) {
				let image = `/recipe/${req.files[i].filename}`;
				UserModel.selectQuery(condition)
				.then(userResult => userResult.length > 0 ?  userResult : responses.invalidCredential(res , constant.responseMessages.USER_NOT_FOUND))
				.then((userResult) => {
				let user_id = userResult[0].user_id;
				let recipe_id = md5(new Date());
				let insertData = {user_id ,recipe_id, image ,recipe_type,is_image_captured : 1}
				RecipeModel.insertQuery(insertData).then((recipeResponse) =>{
				 responses.success_recipe(res,'image captured successfully',recipeResponse[0])
				}).catch((error) => responses.sendError(error.message, res));
			    }) .catch((error) => responses.sendError(error.message, res));
		    }
			} else if(recipe_type == 1){
			let {image} = req.body;
			for(let i =0 ; i<req.files.length ; i++) {
				let image = `/recipe/${req.files[i].filename}`;
				UserModel.selectQuery(condition)
				.then(userResult => userResult.length > 0 ?  userResult : responses.invalidCredential(res , constant.responseMessages.USER_NOT_FOUND))
				.then((userResult) => {
				let user_id = userResult[0].user_id;
				let recipe_id = md5(new Date());
				let insertData = {user_id ,recipe_id, image ,recipe_type,is_image_uploaded : 1}
				RecipeModel.insertQuery(insertData).then((recipeResponse) =>{
				 responses.success_recipe(res,'image uploaded successfully',recipeResponse[0])
				}).catch((error) => responses.sendError(error.message, res));
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
						let insertData = {user_id ,recipe_id ,paste_recipe ,is_recipe_pasted:1, recipe_type : 2}
						RecipeModel.insertQuery(insertData).then((recipeResponse) =>{ responses.success_recipe(res,"Recipe Pasted successfully",recipeResponse[0])})
						.catch((error) => responses.sendError(error.message, res));
				    }).catch((error) => responses.sendError(error.message, res));
				}).catch((error) => responses.sendError(error.message, res));
			}   
			else if(recipe_type == 3){
				let ingredient_list = [];
			 	ingredient_list = req.body.ingredient_list;
			 	console.log(ingredient_list)
			 	let list_items = [];
			    	UserModel.selectQuery(condition)
					.then(userResult => userResult.length > 0 ?  userResult : responses.invalidCredential(res , constant.responseMessages.USER_NOT_FOUND))
					.then((userResult) => {
						let user_id = userResult[0].user_id;
						let recipe_id = md5(new Date());
						ingredient_list.forEach(function(element){

						})
						let stringobj = JSON.stringify(ingredient_list)
						let insertData = {user_id , recipe_id,ingredient_list:stringobj,recipe_type : 3 ,is_manual :1}
						RecipeModel.insertQuery(insertData).then((recipeResponse) =>{ responses.success_recipe(res,'Recipe Added Manually', recipeResponse[0])})
						.catch((error) => responses.sendError(error.message, res));
					}).catch((error) => responses.sendError(error.message, res));
			}
		}

	}).catch((error) => responses.sendError(error.message, res));
};		

exports.newRecipeEntry = (req , res) => {
	 let {recipe_id ,recipe_name,cake_size,ingredient_name,quantity,size} = req.body;
	 let {access_token} = req.headers;
	 let ingredient_list = [];
	 let list_items = [];
	 ingredient_list = req.body.ingredient_list;
	 UserModel.selectQuery({access_token})
		.then(result => {
			if(result == 0) {
				responses.authenticationErrorResponse(res);
			} else {
				console.log(ingredient_list);
				ingredient_list.forEach(function(element){
					 	let ingredient_name = element.ingredient_name;
					 	let need_quantity = element.need_quantity;
					 	let unit = element.unit;
						let sql = "select * from `tb_ingredientlist` where `ingredient_name` in (?)";
						connection.query(sql , [ingredient_name] , function(err,result) {
							if(err) {
								console.log(err);
							} else {
								console.log(result[0])
								let currency = result[0].currency;
								let quantity = result[0].quantity;
								let size = result[0].size;
								let new_price = result[0].price;
									if(unit == "Grams") {
									switch(size) {
										case "Kilograms" : 
										let value = quantity/need_quantity;
										if(quantity >= value) {
											let priceperkilogram = new_price /quantity;
											let price = priceperkilogram*value;
											let kgarray = {ingredient_name,need_quantity,unit,currency,price}
											console.log(list_items.push(kgarray));
											let stringobj = JSON.stringify(list_items);
											let kgupdaterecipe = {recipe_name,cake_size,ingredient_list:stringobj}
										    RecipeModel.updateQuery(kgupdaterecipe,{recipe_id})
										    .then((recipeResponse) => {
										    	responses.success(res,recipeResponse);
										    }).catch((error) => responses.sendError(error.message, res));
											
											
										} else {
											responses.invalidCredential(res,'This quantity is not available');
										}
										
										
										
										break;
										case "Grams" :

										if(quantity >= need_quantity) {
											let pricepergram = new_price/quantity;
											let price = pricepergram * need_quantity;
										    let gmarray = {ingredient_name,need_quantity,unit,currency,price}
											console.log(list_items.push(gmarray));
											let stringobj = JSON.stringify(list_items);
											let gmupdaterecipe = {recipe_name,cake_size,ingredient_list:stringobj}
											RecipeModel.updateQuery(gmupdaterecipe,{recipe_id})
											 .then((recipe_response) => {
										    	responses.success(res,recipe_response);
										    }).catch((error) => responses.sendError(error.message, res));
										}else {
											responses.invalidCredential(res,'This quantity is not available.');
										}
										break;
										default :
										console.log("kilo and gram only");
									}
								   
								} else if(unit == "Kilograms") {
									switch(size) {
										case "Grams" :
										let value = convert(need_quantity).from('kilogram').to('gram');
										if(quantity >= value) {
											let gramperprice = new_price/quantity;
			 								let price = value*gramperprice;
			 								let gramArray = {ingredient_name,need_quantity,unit,currency,price}
			 								console.log(list_items.push(gramArray));
											let stringobj1 = JSON.stringify(list_items);
											let updatekg = {recipe_name,cake_size,ingredient_list:stringobj1}
											RecipeModel.updateQuery(updatekg,{recipe_id})
											.then((recipekgtogmresponse) => {
												responses.success(res,recipekgtogmresponse);
											}).catch((error) => responses.sendError(error.message, res));
										} else {
											responses.invalidCredential(res,'This quantity is not available.');
										}
										
										break;
										case "Kilograms" :
										if(quantity >= need_quantity) {
											let priceperkilo = new_price/quantity;
									        let price = need_quantity*priceperkilo;
									        let kiloArray = {ingredient_name,need_quantity,unit,currency,price}
									        console.log(list_items.push(kiloArray));
											let stringobj = JSON.stringify(list_items);
											let updatekg = {recipe_name,cake_size,ingredient_list:stringobj}
											RecipeModel.updateQuery(updatekg,{recipe_id})
											.then((recipekgtokgresponse) => {
												responses.success(res,recipekgtokgresponse)
											}).catch((error) => responses.sendError(error.message, res));

										} else {
											responses.invalidCredential(res,'This quantity is not available.');
										}
										break;
										default :
										console.log("kilo and gram only");
									}
								} else if(unit == "Cups") {
									if(quantity >= need_quantity) {
										let percupprice = new_price/quantity;
										let price = need_quantity*percupprice;
										console.log("cup ki value "  +percupprice);
										console.log("per cup price" +cupprice);
										let cupArray = {ingredient_name,need_quantity,unit,currency,price};
										console.log(list_items.push(Object.values(cupArray)));
										console.log(list_items)
										let stringobj = JSON.stringify(list_items);
										let condition = {recipe_id};
										let cupupdatedata = {recipe_name,cake_size,list_items :stringobj};
											RecipeModel.updateQuery(cupupdatedata , condition)
											.then((recipecuptocupResponse) => {
												responses.success(res,recipecuptocupResponse);
											}) .catch((error) => responses.sendError(error.message, res));
											
									} else {
										responses.invalidCredential(res,'This quantity is not available.');
									}
									
								} else if(unit == "Ounces") {
									if(quantity >= need_quantity) {
										let perounceprice = new_price/quantity;
										let price = need_quantity*perounceprice;
										
										let ouncesArray = {ingredient_name,need_quantity,unit,currency,price};
										console.log(list_items.push(Object.values(ouncesArray)));
										console.log(list_items)
										let stringobj = JSON.stringify(list_items);
										let condition = {recipe_id};
										let ouncesupdatedata = {recipe_name,cake_size,list_items :stringobj};
											RecipeModel.updateQuery(ouncesupdatedata , condition)
											.then((recipeouncetoounce) => {
												responses.success(res,recipeouncetoounce);
											}) .catch((error) => responses.sendError(error.message, res));
											
									} else {
										responses.invalidCredential(res,'This quantity is not available.');
									}
									
								}  else if(unit == "Liters") {
									switch(size) {
										case "Liters" :
										if(quantity >= need_quantity) {
										let perliterprice = new_price/quantity;
										let price = need_quantity*perliterprice;
										console.log("liter ki value "  +perliterprice);
										console.log("per liter price" +price);
										let literArray = {ingredient_name,need_quantity,unit,currency,price};
										console.log(list_items.push(Object.values(literArray)));
										console.log(list_items)
										let stringobj = JSON.stringify(list_items);
										let condition = {recipe_id};
										let literupdatedata = {recipe_name,cake_size,list_items :stringobj};
											RecipeModel.updateQuery(literupdatedata , condition)
											.then((recipelitertoliterResponse) => {
												responses.success(res,recipelitertoliterResponse);
											}) .catch((error) => responses.sendError(error.message, res));
											
									} else {
										responses.invalidCredential(res,'This quantity is not available.');
									}
										
										break;
										case "Milliliters" :
										let value = need_quantity * 1000;
										if(quantity >= value){
											console.log("value l to m" +value)
											let perlmprice = new_price /quantity;
											console.log(perlmprice);
											let price = value*perlmprice;
											console.log(lmprice)
											let lmArray = {ingredient_name,need_quantity,qty_type,currency,price};
											console.log(list_items.push(Object.values(lmArray)));
											console.log(list_items)
											let stringobj = JSON.stringify(list_items);
											let condition = {recipe_id};
											let lmupdateData = {recipe_name,cake_size,list_items:stringobj};
											RecipeModel.updateQuery(lmupdateData , condition)
											.then((recipelmresponse) => {
												responses.success(res,recipelmresponse);
											}).catch((error) => responses.sendError(error.message, res));
										
										} else {
											responses.invalidCredential(res,'This quantity is not available.')
										}
										break;
										default:
										console.log("only liter to mililiters and liter to liter");
									}
								}else if (unit == "Milliliters") {
									switch(size) {
										case "Liters" :
											let value = need_quantity / 1000;
											if(quantity >=value) {
												let permlprice = new_price /quantity;
												console.log(permlprice);
												let price = value*permlprice;
												console.log(mlprice)
												let mlarray = {ingredient_name,need_quantity,qty_type,currency,price};
												console.log(list_items.push(Object.values(mlarray)));
												console.log(list_items)
												let stringobj = JSON.stringify(list_items);
												let condition = {recipe_id};
												let mlupdateData = {recipe_name,cake_size,list_items:stringobj};
												RecipeModel.updateQuery(mlupdateData , condition)
													.then((recipemlResponse) => {
														responses.success(res,recipemlResponse);
													}).catch((error) => responses.sendError(error.message, res));
													
												} else {
												responses.invalidCredential(res,'This quantity is not available.')
											}
										break;
										case "Milliliters" :
										if(quantity >= need_quantity) {
										let permililiterprice = new_price/quantity;
										let price = need_quantity*permililiterprice;
										let mililitersArray = {ingredient_name,need_quantity,unit,currency,price};
										console.log(list_items.push(Object.values(mililitersArray)));
										console.log(list_items)
										let stringobj = JSON.stringify(list_items);
										let condition = {recipe_id};
										let mililitersupdatedata = {recipe_name,cake_size,list_items :stringobj};
											RecipeModel.updateQuery(mililitersupdatedata , condition)
											.then((recipemililiterstomililitersResponse) => {
												responses.success(res,recipemililiterstomililitersResponse);
											}).catch((error) => responses.sendError(error.message, res)); 
											
									} else {
										responses.invalidCredential(res,'This quantity is not available.');
									} 
									break;
									default:
										console.log("only mililiters to mililiters and mililiters to liter");
									}
								} else if(unit == "Pints") {
									if(quantity >= need_quantity) {
										let perpintsprice = new_price/quantity;
										let price = need_quantity*perpintsprice;
										let pintsArray = {ingredient_name,need_quantity,unit,currency,price};
										console.log(list_items.push(Object.values(ouncesArray)));
										console.log(list_items)
										let stringobj = JSON.stringify(list_items);
										let condition = {recipe_id};
										let pintsupdatedata = {recipe_name,cake_size,list_items :stringobj};
											RecipeModel.updateQuery(pintsupdatedata , condition)
											.then((recipepintstopintsresponse) => {
												responses.success(res,recipepintstopintsresponse);
											}).catch((error) => responses.sendError(error.message, res)); 
											
									} else {
										responses.invalidCredential(res,'This quantity is not available.');
									}
									
								}  else if(unit == "Gallons") {
									if(quantity >= need_quantity) {
										let perGallonsprice = new_price/quantity;
										let price = need_quantity*perGallonsprice;
										let GallonsArray = {ingredient_name,need_quantity,unit,currency,price};
										console.log(list_items.push(Object.values(GallonsArray)));
										console.log(list_items)
										let stringobj = JSON.stringify(list_items);
										let condition = {recipe_id};
										let Gallonsupdatedata = {recipe_name,cake_size,ingredient_list :stringobj};
											RecipeModel.updateQuery(Gallonsupdatedata , condition)
											.then((recipegallonsresponse) => {
												responses.success(res,recipegallonsresponse)
											}).catch((error) => responses.sendError(error.message, res));
									} else {
										responses.invalidCredential(res,'This quantity is not available.');
									}
									
								}
							}
 
						})
					})
				}
		}).catch((error) => responses.sendError(error.message, res)); 
}		
exports.recipe_delete = (req , res) => {
	let {recipe_id} = req.body;
	let {access_token} = req.headers;
	let manKeys = ["recipe_id"];
	UserModel.selectQuery({access_token})
	.then(result => {
		if(result == 0) {
			responses.authenticationErrorResponse(res);
		}else {
			commFunc.checkKeyExist(req.body, manKeys)
			.then((result) => {
				if(result.length > 0) {
					responses.parameterMissing(res,result[0]);
				} else {
					console.log("comming");
					RecipeModel.selectQuery({recipe_id})
					.then((recipeResponse) => {
					console.log(recipeResponse[0]);
					if(recipeResponse.length > 0) {
					//let recipe_id = recipeResponse[0].recipe_id;
				   		RecipeModel.deleteQuery({recipe_id})
				    	.then((recipeResponse) =>{ 
						responses.success(res, 'Recipe deleted successfully.')}).catch((error) => responses.sendError(error.message, res));
					} else {
							responses.invalidCredential(res, 'Recipe not exist.');
						}
					}) .catch((error) => responses.sendError(error.message, res));
				}
			}) .catch((error) => responses.sendError(error.message, res));
		}
	}).catch((error) => responses.sendError(error.message, res));
}

exports.getRecipe = (req , res) => {
	let sql = "select * from `tb_myrecipe`";
	connection.query(sql , [] ,function(err , result) {
		if(err) {
			responses.sendError(err,res);
		} else {
			responses.success(res , result);
		}
	})
}
