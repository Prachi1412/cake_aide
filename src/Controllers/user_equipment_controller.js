import commFunc from '../Modules/commonFunction';
import responses from '../Modules/responses';
import constant from '../Modules/constant';
import EquipmentModel from '../Modals/user_equipment_model';
import UserModel from '../Modals/user_model';

import md5 from 'md5';

exports.addEquipment = (req , res) => {
	let { equipment_name , brand , price , quantity ,size } = req.body;
	let {access_token} = req.headers;
	let manKeys = ["equipment_name" , "brand" , "price" , "quantity" , "size"];
	let condition = {access_token};
	commFunc.checkKeyExist(req.body, manKeys)
	.then(result => result.length ? new Promise  (new Error(responses.parameterMissing(res,result[0]))) : '')
	.then(result => {
		UserModel.selectQuery(condition)
		.then(userResult => userResult.length < 0 ? responses.userNotExist(res) : userResult )
		.then((userResult) =>{
			EquipmentModel.selectQuery({equipment_name})
			.then(equipmentResult => equipmentResult.length >0 ? new Promise(new Error(responses.invalidCredential(res, constant.responseMessages.EQUIPMENT_ALREADY_EXISTS))):equipmentResult)
			.then((equipmentResult) => {
				let user_id = userResult[0].user_id;
				let condition = {user_id};
				let equipment_id = md5(new Date());
				let insertData = {user_id ,equipment_id,equipment_name , brand , price , quantity , size }
				EquipmentModel.insertQuery(insertData).then((ingredientResponse) =>{ responses.success(res, ingredientResponse)})
				.catch((error) => responses.sendError(error.message, res));
			}) .catch((error) => responses.sendError(error.message, res));

		}).catch((error) => responses.sendError(error.message, res));
	}).catch((error) => responses.sendError(error.message, res));
};

exports.editEquipment = (req ,res) => {
	let {equipment_id,equipment_name , brand , price , quantity , size} = req.body;
	let {access_token} = req.headers;
	let manKeys = ["equipment_id","equipment_name" , "brand" , "price" , "quantity" , "size"];
	let condition = {access_token};
	commFunc.checkKeyExist(req.body, manKeys)
	.then(result => result.length ? new Promise  (new Error(responses.parameterMissing(res,result[0]))) : '')
	.then(result => {
		EquipmentModel.selectQuery({equipment_id})
		.then(equipmentResult => equipmentResult.length > 0 ? equipmentResult : responses.invalidCredential(res, constant.responseMessages.EQUIPMENT_NOT_EXISTS))
		.then((equipmentResult) => { 
			console.log(equipmentResult)
			let updateData = { equipment_name , brand , price , quantity ,size};
			let equipment_id = equipmentResult[0].equipment_id;
			let condition = {equipment_id};
			EquipmentModel.updateQuery(updateData , condition)
			.then((ingredientResponse) =>{ responses.success(res, ingredientResponse)})
			.catch((error) => responses.sendError(error.message, res));
		}) .catch((error) => responses.sendError(error.message, res));

	}).catch((error) => responses.sendError(error.message, res));

};
exports.deleteEquipment = (req ,res) => {
	let {equipment_id} = req.body;
	let manKeys = ["equipment_id"];
	commFunc.checkKeyExist(req.body, manKeys)
	.then(result => result.length ? new Promise  (new Error(responses.parameterMissing(res,result[0]))) : '')
	.then(result => {
		EquipmentModel.selectQuery({equipment_id})
		.then(equipmentResult => equipmentResult.length > 0 ? equipmentResult : responses.invalidCredential(res, constant.responseMessages.EQUIPMENT_NOT_EXISTS))
		.then((equipmentResult) => { 
			let equipment_id = equipmentResult[0].equipment_id;
			let condition = {equipment_id};
			EquipmentModel.deleteQuery(condition)
			.then((ingredientResponse) =>{ 
				responses.invalidCredential(res, constant.responseMessages.EQUIPMENT_DELETED_SUCCESSFULLY)})
			.catch((error) => responses.sendError(error.message, res));
		}) .catch((error) => responses.sendError(error.message, res));

	}).catch((error) => responses.sendError(error.message, res));

};
