import commFunc from '../Modules/commonFunction';
import responses from '../Modules/responses';
import constant from '../Modules/constant';
import AdminModel from '../Modals/admin_model';
import UserModel from '../Modals/user_model';
import RecipeModel from '../Modals/user_recipe_model';
import config from '../Config/nodemailer';
import IngredientModel from '../Modals/user_ingredient_model';
import connection from '../Modules/connection.js';
import EquipmentModel from '../Modals/user_equipment_model';

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
exports.editProfile = (req , res) => {
	let { first_name,phone,profile_image } = req.body;
	let {access_token} = req.headers;
	let manKeys = ["first_name","phone"];
	let manValues = { first_name,phone};
	let condition = {access_token};
 	commFunc.checkKeyExist(manValues, manKeys)
	 		.then(result => result.length ? responses.parameterMissing(res, result[0]) : '' )
			.then(result => {
			AdminModel.selectQuery(condition)
			.then(adminResult => adminResult.length >0 ? adminResult : responses.userNotExist(res))
			.then(adminResult => {
				if(phone.length <10){
					responses.invalidmobilenumber(res);
				} else {
				for(let i=0; i< req.files.length ;i++) {
					let profile_image = `/admin/${req.files[i].filename}`;
					let updateData = {first_name,phone,profile_image ,is_profile_created : 1};
					let condition = {access_token};
					AdminModel.updateQuery(updateData , condition)
					.then((adminResponse) => {responses.success(res , adminResponse);console.log(adminResponse)})
					.catch((error) => responses.sendError(error.message, res));
					}
				}

			})
			.catch((error) => responses.sendError(error.message, res));
		})
	.catch((error) => responses.sendError(error.message, res));
}
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
exports.block_user = (req, res) => {

	let {user_id, is_blocked} = req.body ; 
	//let manKeys = ["user_id" , "is_blocked"];
	let updateData = {is_blocked};
	let condition = {user_id}; 
	
    
    
  		UserModel.updateQueryUser (updateData, condition)
  		.then((userResult) =>{
  		responses.success(res, userResult)
  		}).catch((error) => responses.sendError(error.message, res));
}
exports.addAdminIngredient = (req , res) => {
	let { ingredient_name , brand , price ,currency, quantity ,size } = req.body;
	let {access_token} = req.headers;
	console.log(access_token)
	//let user_id = req.user.user_id;
	let manKeys = ["ingredient_name" , "brand" ,"currency","price","quantity" ,"size"];
	commFunc.checkKeyExist(req.body, manKeys)
	.then(result => result.length ? new Promise  (new Error(responses.parameterMissing(res,result[0]))) : '')
	.then(result => {
		AdminModel.selectQuery({access_token})
		.then(adminResult => {
			console.log(adminResult[0]);
			let admin_id = adminResult[0].admin_id;
			IngredientModel.selectQuery({ingredient_name})
			.then(ingredientResult => {
				if(ingredientResult.length >0) {
					throw new Error(responses.invalidCredential(res, constant.responseMessages.INGREDIENT_ALREADY_EXISTS));
				} else {
					let ingredient_id = md5(new Date());
					if(currency == "British Pound") {
						currency = "£";
					} else if(currency == "US Dollar") { 
						currency = "$";
					} else if(currency == "Euro") {
						currency = "€";
					} else if(currency == "Japanese Currency") {
						currency = "¥";
					} else {
						throw new Error(responses.invalidCredential(res , 'Plaese enter right currency parameter'));
					}
					if(req.body.price <= 0 || req.body.quantity <= 0) {
						throw new Error(responses.invalidCredential(res , 'Price and Quantity should not be zero'));
					}
					let insertData = {admin_id ,ingredient_id,ingredient_name , brand ,currency : currency,  price, quantity ,size}
					IngredientModel.insertQuery(insertData).then((ingredientResponse) =>{ responses.success(res, ingredientResponse[0])})
					.catch((error) => responses.sendError(error.message, res));
				}
			}) .catch((error) => responses.sendError(error.message, res));
		}).catch((error) => responses.sendError(error.message, res));

	}).catch((error) => responses.sendError(error.message, res));
};
exports.showIngredientName = (req ,res) => {
	let sql = "select * from `tb_ingredientlist`";
	connection.query(sql , [] ,function(err , result) {
		if(err) {
			responses.sendError(err,res);
		} else {
			responses.success(res , result);
		}
	})
}
exports.adminDeleteIngredient = (req ,res) => {
	let {ingredient_id} = req.params;
	let {access_token} = req.headers;
	let manKeys = ["ingredient_id"];
	commFunc.checkKeyExist(req.params, manKeys)
	.then(result => {
		if(result.length > 0) {
			responses.parameterMissing(res,result[0]);
		} else {
			IngredientModel.deleteQuery({ingredient_id})
			.then((ingredientResponse) =>{ 
			throw new Error(responses.success(res, constant.responseMessages.INGREDIENT_DELETED_SUCCESSFULLY))})
			.catch((error) => responses.sendError(error.message, res));
		}
	
	}).catch((error) => responses.sendError(error.message, res));
};
exports.showequipmentName = (req ,res) => {
	let sql = "select * from `tb_equipmentlist`";
	connection.query(sql , [] ,function(err , result) {
		if(err) {
			responses.sendError(err,res);
		} else {
			console.log(result)
			responses.success(res , result);
		}
	})
}
exports.addAdminEquipment = (req , res) => {
	let { equipment_name , brand , price ,currency, quantity ,size } = req.body;
	let {access_token} = req.headers;
	console.log(access_token)
	//let user_id = req.user.user_id;
	let manKeys = ["equipment_name" , "brand" ,"currency","price","quantity" ,"size"];
	commFunc.checkKeyExist(req.body, manKeys)
	.then(result => {
		if(result.length > 0) {
			responses.parameterMissing(res,result[0]);
		} else {
			AdminModel.selectQuery({access_token})
			.then(adminResult => {
				console.log(adminResult[0]);
				let admin_id = adminResult[0].admin_id;
				EquipmentModel.selectQuery({equipment_name})
				.then(ingredientResult => {
					if(ingredientResult.length >0) {
						throw new Error(responses.invalidCredential(res, constant.responseMessages.INGREDIENT_ALREADY_EXISTS));
					} else {
						let equipment_id = md5(new Date());
						if(currency == "British Pound") {
							currency = "£";
						} else if(currency == "US Dollar") { 
							currency = "$";
						} else if(currency == "Euro") {
							currency = "€";
						} else if(currency == "Japanese Currency") {
							currency = "¥";
						} else {
							throw new Error(responses.invalidCredential(res , 'Plaese enter right currency parameter'));
						}
						if(req.body.price <= 0 || req.body.quantity <= 0) {
							throw new Error(responses.invalidCredential(res , 'Price and Quantity should not be zero'));
						}
						let insertData = {admin_id ,equipment_id,equipment_name , brand ,currency : currency,  price, quantity ,size}
						EquipmentModel.insertQuery(insertData).then((ingredientResponse) =>{ responses.success(res, ingredientResponse[0])})
						.catch((error) => responses.sendError(error.message, res));
					}
				}) .catch((error) => responses.sendError(error.message, res));
			}).catch((error) => responses.sendError(error.message, res));
		}
	}).catch((error) => responses.sendError(error.message, res));
};
exports.adminDeleteEquipment = (req ,res) => {
	let {equipment_id} = req.params;
	let {access_token} = req.headers;
	let manKeys = ["equipment_id"];
	commFunc.checkKeyExist(req.params, manKeys)
	.then(result => {
		if(result.length > 0) {
			responses.parameterMissing(res,result[0]);
		} else {
			EquipmentModel.deleteQuery({equipment_id})
			.then((ingredientResponse) =>{ 
			throw new Error(responses.success(res, constant.responseMessages.EQUIPMENT_DELETED_SUCCESSFULLY))})
			.catch((error) => responses.sendError(error.message, res));
		}
	
	}).catch((error) => responses.sendError(error.message, res));
};
exports.showrecipeDetails = (req ,res) => {
	let sql = "SELECT * from `tb_myrecipe` where recipe_name IS NOT NULL;"
	connection.query(sql,[],(err,result) =>{
		if(err){responses.sendError(err);}
		else{
			responses.success(res,result);
		}
	})
};
exports.adminDeleteRecipe = (req ,res) => {
	let {recipe_id} = req.params;
	let {access_token} = req.headers;
	let manKeys = ["recipe_id"];
	commFunc.checkKeyExist(req.params, manKeys)
	.then(result => {
		if(result.length > 0) {
			responses.parameterMissing(res,result[0]);
		} else {
			RecipeModel.deleteQuery({recipe_id})
			.then((recipeResponse) =>{ 
			throw new Error(responses.success(res, constant.responseMessages.RECIPE_DELETED_SUCCESSFULLY))})
			.catch((error) => responses.sendError(error.message, res));
		}
	
	}).catch((error) => responses.sendError(error.message, res));
};