import commFunc from '../Modules/commonFunction';
import responses from '../Modules/responses';
import constant from '../Modules/constant';
import EquipmentModel from '../Modals/user_equipment_model';
import UserModel from '../Modals/user_model';
import connection from '../Modules/connection.js';


import md5 from 'md5';

// exports.addEquipment = (req , res) => {
// 	let { equipment_name , brand , price ,currency, quantity ,size } = req.body;
// 	let {access_token} = req.headers;
// 	let user_id = req.user.user_id;
// 	console.log(user_id)
// 	let manKeys = ["equipment_name" , "brand" , "price" ,"currency", "quantity" , "size"];
// 	commFunc.checkKeyExist(req.body, manKeys)
// 	.then(result => result.length ? new Promise  (new Error(responses.parameterMissing(res,result[0]))) : '')
// 	.then(result => {
// 			EquipmentModel.selectQuery({equipment_name})
// 			.then(equipmentResult => {
// 				if(equipmentResult.length >0 ) {
// 					throw new Error(responses.invalidCredential(res, constant.responseMessages.EQUIPMENT_ALREADY_EXISTS));
// 				} else {
// 					let equipment_id = md5(new Date());
// 					if(currency == 1) {
// 						currency = "£";
// 					} else if(currency == 2) {
// 						currency = "$";
// 					} else if(currency == 3) {
// 						currency = "€";
// 					} else if(currency == 4) {
// 						currency = "¥";
// 					} else {
// 						throw new Error(responses.invalidCredential(res , 'Plaese enter right currency parameter'));
// 					}
// 				    let insertData = {user_id ,equipment_id,equipment_name , brand , price ,currency : currency, quantity , size }
// 				    EquipmentModel.insertQuery(insertData).then((ingredientResponse) =>{ responses.success(res, ingredientResponse[0])})
// 				   .catch((error) => responses.sendError(error.message, res));
// 				}
// 			}).catch((error) => responses.sendError(error.message, res));
// 		}).catch((error) => responses.sendError(error.message, res));
// }
exports.addEquipment = (req , res) => {
	let {access_token} = req.headers;
	let { equipment_name , brand , price ,currency, quantity ,size } = req.body;
	
	// let user_id = req.user.user_id;
	// console.log(user_id)
	UserModel.selectQuery({access_token})
	.then((Userresult) => {
		if(Userresult == 0) {
			responses.authenticationErrorResponse(res);
		} else {
			let manKeys = ["equipment_name" , "price" ,"currency", "quantity" , "size"];
			commFunc.checkKeyExist(req.body, manKeys)
			.then(result => result.length ? new Promise  (new Error(responses.parameterMissing(res,result[0]))) : '')
			.then(result => {
					EquipmentModel.selectQuery({equipment_name})
					.then(equipmentResult => {
						if(equipmentResult.length >0 ) {
							throw new Error(responses.invalidCredential(res, constant.responseMessages.EQUIPMENT_ALREADY_EXISTS));
						} else {
							let equipment_id = md5(new Date());
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
							let user_id = Userresult[0].user_id; 
						    let insertData = {user_id ,equipment_id,equipment_name , brand , price ,currency : currency, quantity , size }
						    EquipmentModel.insertQuery(insertData).then((ingredientResponse) =>{ responses.success(res, ingredientResponse[0])})
						   .catch((error) => responses.sendError(error.message, res));
						}
					}).catch((error) => responses.sendError(error.message, res));
				}).catch((error) => responses.sendError(error.message, res));

		}
		
	}).catch((error) => responses.sendError(error.message, res));
}

exports.editEquipment = (req ,res) => {
	let {equipment_id,equipment_name , brand , price ,currency, quantity , size} = req.body;
	let {access_token} = req.headers;
	let manKeys = ["equipment_id"];
	let condition = {access_token};
	commFunc.checkKeyExist(req.body, manKeys)
	.then(result => result.length ? new Promise  (new Error(responses.parameterMissing(res,result[0]))) : '')
	.then(result => {
		EquipmentModel.selectQuery({equipment_id})
		.then(equipmentResult => {
			if(equipmentResult.length > 0){
				console.log(equipmentResult)
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
				let updateData = {equipment_name , brand , price ,currency : currency, quantity , size};
				let equipment_id = equipmentResult[0].equipment_id;
				let condition = {equipment_id};
				EquipmentModel.updateQuery(updateData , condition)
				.then((ingredientResponse) =>{ responses.success(res, ingredientResponse)})
				.catch((error) => responses.sendError(error.message, res));
			} else {
				throw new Error(responses.invalidCredential(res, constant.responseMessages.EQUIPMENT_NOT_EXISTS))
			}
		} ) .catch((error) => responses.sendError(error.message, res));


	}).catch((error) => responses.sendError(error.message, res));

};
exports.deleteEquipment = (req ,res) => {
	let {equipment_id} = req.body;
	let {access_token} = req.headers;
	let manKeys = ["equipment_id"];
	commFunc.checkKeyExist(req.body, manKeys)
	.then(result => result.length ? new Promise  (new Error(responses.parameterMissing(res,result[0]))) : '')
	.then(result => {
		EquipmentModel.selectQuery({equipment_id})
		.then(equipmentResult => {
			if(equipmentResult.length > 0) {
				let equipment_id = equipmentResult[0].equipment_id;
		    	let condition = {equipment_id};
			    EquipmentModel.deleteQuery(condition)
			    .then((ingredientResponse) =>{ 
				responses.success(res, constant.responseMessages.EQUIPMENT_DELETED_SUCCESSFULLY)})
			   .catch((error) => responses.sendError(error.message, res));
			} else {
				throw new Error(responses.invalidCredential(res, constant.responseMessages.EQUIPMENT_NOT_EXISTS));
			}
		}) .catch((error) => responses.sendError(error.message, res));
	}) .catch((error) => responses.sendError(error.message, res));
};
exports.getEquipment = (req , res) => {
	let {access_token} = req.headers;
	UserModel.selectQuery({access_token})
	.then((result) => {
		let user_id = result[0].user_id;
		let sql = "select * from `tb_equipmentlist` where `user_id` = ?";
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