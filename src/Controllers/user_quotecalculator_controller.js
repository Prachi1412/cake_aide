import commFunc from '../Modules/commonFunction';
import responses from '../Modules/responses';
import constant from '../Modules/constant';
import QuotecalModel from '../Modals/user_quotecalculator_model';
import UserModel from '../Modals/user_model';
import connection from '../Modules/connection.js';

exports.addQuoteCalculator = (req , res) => {
	let access_token = req.headers;
	let user_id = req.user.user_id;
	let {name , description , amount , enter_time , time_format} = req.body;
	let manKeys = ["name","description","amount","enter_time" ,"time_format"];
	commFunc.checkKeyExist(req.body, manKeys)
	.then(result => result.length ? new Promise  (new Error(responses.parameterMissing(res,result[0]))) : '')
	.then(result => {
		
		QuotecalModel.selectQuery({name})
		.then((quoteResult)=> {
			if(quoteResult.length > 0) {
				responses.invalidCredential(res, constant.responseMessages.NAME_ALREADY_EXISTS);
			} else {
				let insertData = {user_id,name , description , amount , enter_time , time_format};
				QuotecalModel.insertQuery(insertData).then((quoteResponse) =>{ responses.success(res, quoteResponse[0])})
				.catch((error) => responses.sendError(error.message, res));
			}
		}).catch((error) => responses.sendError(error.message, res));
	}).catch((error) => responses.sendError(error.message, res));
}

// exports.editQuoteCalculator = (req, res) => {
// 	let access_token = req.headers;
	
// }