import commFunc from '../Modules/commonFunction';
import responses from '../Modules/responses';
import constant from '../Modules/constant';
import QuotecalModel from '../Modals/user_quotecalculator_model';
import UserModel from '../Modals/user_model';
import connection from '../Modules/connection.js';
import md5 from 'md5';

exports.addQuoteCalculator = (req , res) => {
	let {access_token} = req.headers;
	let {name , description ,recipe_name, enter_time , time_format,margin,equipment_name,price} = req.body;
	let equipment_list =[];
	equipment_list = req.body.equipment_list;
	console.log(Object.values(equipment_list))
	console.log(equipment_list)
	UserModel.selectQuery({access_token})
	.then((result) => {
		let user_id = result[0].user_id;
		equipment_list.forEach(function(element) {
			equipment_name = element.equipment_name;
			price = element.price;
			//let array = {equipment_name,price};
			
			//console.log(JSON.stringify(element.equipment_list))
			console.log("array",equipment_list)
		})
	}).catch((error) => responses.sendError(error.message, res));
	let manKeys = ["name","description","amount","enter_time" ,"time_format"];
	commFunc.checkKeyExist(req.body, manKeys)
	.then(result => result.length ? new Promise  (new Error(responses.parameterMissing(res,result[0]))) : '')
	.then(result => {
		
		QuotecalModel.selectQuery({name})
		.then((quoteResult)=> {
			if(quoteResult.length > 0) {
				responses.invalidCredential(res, constant.responseMessages.NAME_ALREADY_EXISTS);
			} else {
				let quotecalId = md5(new Date());
				let insertData = {user_id,quotecalId,name , description , amount , enter_time , time_format};
				QuotecalModel.insertQuery(insertData).then((quoteResponse) =>{ responses.success(res, quoteResponse[0])})
				.catch((error) => responses.sendError(error.message, res));
			}
		}).catch((error) => responses.sendError(error.message, res));
	}).catch((error) => responses.sendError(error.message, res));
}

exports.editQuoteCalculator = (req ,res) => {
	let {quotecalId,name , description , amount , enter_time , time_format} = req.body;
	let {access_token} = req.headers;
	let manKeys = ["quotecalId"];
	let condition = {access_token};
	commFunc.checkKeyExist(req.body, manKeys)
	.then(result => result.length ? new Promise  (new Error(responses.parameterMissing(res,result[0]))) : '')
	.then(result => {
		QuotecalModel.selectQuery({quotecalId})
		.then(quoteResult => {
			if(quoteResult.length > 0){
				console.log(quoteResult)
				let updateData = req.body;
				let quotecalId = quoteResult[0].quotecalId;
				let condition = {quotecalId};
				QuotecalModel.updateQuery(updateData , condition)
				.then((quoteResponse) =>{ responses.success(res, quoteResponse)})
				.catch((error) => responses.sendError(error.message, res));
			} else {
				responses.invalidCredential(res, constant.responseMessages.QUOTECALCULATOR_NOT_EXISTS)
			}
		} ) .catch((error) => responses.sendError(error.message, res));


	}).catch((error) => responses.sendError(error.message, res));

};
exports.deleteQuoteCalculator = (req ,res) => {
	let {quotecalId} = req.body;
	let manKeys = ["quotecalId"];
	commFunc.checkKeyExist(req.body, manKeys)
	.then(result => result.length ? new Promise  (new Error(responses.parameterMissing(res,result[0]))) : '')
	.then(result => {
		QuotecalModel.selectQuery({quotecalId})
		.then(quoteResult => {
			if(quoteResult.length > 0) {
				let quotecalId = quoteResult[0].quotecalId;
		    	let condition = {quotecalId};
			    QuotecalModel.deleteQuery(condition)
			    .then((quoteResponse) =>{ 
				responses.invalidCredential(res, constant.responseMessages.QUOTECALCULATOR_DELETED_SUCCESSFULLY)})
			   .catch((error) => responses.sendError(error.message, res));
			} else {
				responses.invalidCredential(res, constant.responseMessages.QUOTECALCULATOR_NOT_EXISTS);
			}
		}) .catch((error) => responses.sendError(error.message, res));
	}) .catch((error) => responses.sendError(error.message, res));
};
exports.getQuoteCalculator = (req , res) => {
	let sql = "select `name` from `tb_quotcalculator`";
	connection.query(sql , [] ,function(err , result) {
		if(err) {
			responses.sendError(err,res);
		} else {
			responses.success(res , result);
		}
	})
}
