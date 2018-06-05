import commFunc from '../Modules/commonFunction';
import responses from '../Modules/responses';
import constant from '../Modules/constant';
import QuotecalModel from '../Modals/user_quotecalculator_model';
import UserModel from '../Modals/user_model';
import connection from '../Modules/connection.js';
import EquipmentModel from '../Modals/user_equipment_model';
import md5 from 'md5';
import _ from "lodash";

exports.addQuoteCalculator = (req , res) => {
	let {access_token} = req.headers;
	let {name , description ,recipe_name, total_time , time_format,margin,equipment_name,price,quantity} = req.body;
	let equipment_list =[];
	let stringobj;
	equipment_list = req.body.equipment_list;
	console.log(Object.values(equipment_list))
	console.log(equipment_list)
	UserModel.selectQuery({access_token})
	.then((result) => {
		if(result == 0) {
			responses.authenticationErrorResponse(res);
		} else {
			let user_id = result[0].user_id;
			let quotecalId = md5(new Date());
			equipment_list.forEach(function(element) {
				stringobj = JSON.stringify(equipment_list);
			})
			
			let insertData = {user_id,quotecalId,name , description ,recipe_name,equipment_list:stringobj, total_time , time_format,margin};
			QuotecalModel.insertQuery(insertData).then((quoteResponse) =>{
				user_id = quoteResponse[0].user_id;
				quotecalId = quoteResponse[0].quotecalId;
				equipment_list = JSON.parse(quoteResponse[0].equipment_list)
				name = quoteResponse[0].name;
				description = quoteResponse[0].description;
				recipe_name = quoteResponse[0].recipe_name;
				total_time = quoteResponse[0].total_time;
				time_format = quoteResponse[0].time_format;
				margin = quoteResponse[0].margin;
				responses.success(res,_.merge({quotecalId,user_id,name,description,recipe_name,equipment_list,total_time,time_format,margin}));
		 //responses.success(res, quoteResponse[0])
		})
		.catch((error) => responses.sendError(error.message, res));
		}
		
	}).catch((error) => responses.sendError(error.message, res));
}
exports.editQuoteCalculator = (req ,res) => {
	let {quotecalId,name , description ,recipe_name,price,quantity, total_time , time_format,margin} = req.body;
	let equipment_list = [];
	equipment_list = req.body.equipment_list;
	let stringobj;
	let access_token = req.headers.access_token;
	let manKeys = ["quotecalId"];
	//let condition = {access_token};
	UserModel.selectQuery({access_token})
		.then(result => {
			console.log(result)
			if(result==0){
				responses.authenticationErrorResponse(res);
		  	} else {
		  		
		  		commFunc.checkKeyExist(req.body, manKeys)
			.then(result => {
				if(result.length > 0) {
					responses.parameterMissing(res,result[0]);
				} else {
					QuotecalModel.selectQuery({quotecalId})
					.then(quoteResult => {
						if(quoteResult.length > 0){
							console.log("kdjcnkjcnkjdsnckjdcn"+equipment_list)
							equipment_list.forEach(function(element) {
								stringobj = JSON.stringify(equipment_list);
							})
							console.log(quoteResult)
							let updateData = {name , description ,recipe_name,equipment_list:stringobj, total_time , time_format,margin};
							let quotecalId = quoteResult[0].quotecalId;
							let condition = {quotecalId};
							QuotecalModel.updateQuery(updateData , condition)
							.then((quoteResponse) =>{ 
								console.log("========================")
								console.log(quoteResponse)
								console.log("========================")
								//responses.success_recipe(res,"Quote Calculator is updated successfully.");
								quotecalId = quoteResponse[0].quotecalId;
								equipment_list = JSON.parse(quoteResponse[0].equipment_list)
								name = quoteResponse[0].name;
								description = quoteResponse[0].description;
								recipe_name = quoteResponse[0].recipe_name;
								total_time = quoteResponse[0].total_time;
								time_format = quoteResponse[0].total_time;
								margin = quoteResponse[0].margin;
								responses.success(res,_.merge({quotecalId,name,description,recipe_name,equipment_list,total_time,margin}));
							}).catch((error) => responses.sendError(error.message, res));
						} else {
						responses.invalidCredential(res, constant.responseMessages.QUOTECALCULATOR_NOT_EXISTS)
					}
				} ) .catch((error) => responses.sendError(error.message, res));
			}
		}) .catch((error) => responses.sendError(error.message, res));
	}
	}).catch((error) => responses.sendError(error.message, res));
};
exports.deleteQuoteCalculator = (req ,res) => {
	let {access_token} = req.headers;
	let quotecalId = req.body.quotecalId;
	let manKeys = ["quotecalId"];
	UserModel.selectQuery({access_token}) 
	.then((result) => {
		if(result == 0) {
			responses.authenticationErrorResponse(res);
		} else {
			commFunc.checkKeyExist(req.body, manKeys)
		.then(result => {
			if(result.length > 0 ) {
				responses.parameterMissing(res,result[0]);
			} else {
				QuotecalModel.selectQuery({quotecalId})
				.then(quoteResult => {
				if(quoteResult.length > 0) {
					let quotecalId = quoteResult[0].quotecalId;
			    	let condition = {quotecalId};
				    QuotecalModel.deleteQuery(condition)
				    .then((quoteResponse) =>{ 
					responses.success(res, constant.responseMessages.QUOTECALCULATOR_DELETED_SUCCESSFULLY)})
				   .catch((error) => responses.sendError(error.message, res));
				} else {
					responses.invalidCredential(res, constant.responseMessages.QUOTECALCULATOR_NOT_EXISTS);
					}
				}) .catch((error) => responses.sendError(error.message, res));
			}
		}).catch((error) => responses.sendError(error.message, res));
	    }
		
	}).catch((error) => responses.sendError(error.message, res));
}
exports.getQuoteCalculator = (req , res) => {
	let user_id = req.body.user_id;
	let sql = "select * from `tb_quotcalculator` where `user_id`= ? and name IS NOT NULL";
	connection.query(sql , [user_id] ,function(err , result) {
		if(err) {
			responses.sendError(err,res);
		} else {
			let data = result.map(element=>_.merge(element,{equipment_list :JSON.parse(element.equipment_list)}))
				responses.success(res,data);
		}
	})
}
exports.total_cost = (req , res) => {
	let {access_token} = req.headers;
	let {quotecalId} = req.body;
	let {total_cost} = req.body;
	UserModel.selectQuery({access_token}) 
	.then((result) => {
		if(result == 0) {
			responses.authenticationErrorResponse(res);
		} else {
			let updateData = {total_cost};
			QuotecalModel.updateQuery(updateData,{quotecalId})
			.then((updateResponse) => {
				let data = updateResponse.map(element=>_.merge(element,{equipment_list :JSON.parse(element.equipment_list)}))
				responses.success(res,data);
				//responses.success(res,updateResponse);
			}).catch((error) => responses.sendError(error.message, res));
		}
	}).catch((error) => responses.sendError(error.message, res));
}