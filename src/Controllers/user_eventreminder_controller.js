import commFunc from '../Modules/commonFunction';
import responses from '../Modules/responses';
import constant from '../Modules/constant';
import EventModel from '../Modals/user_eventreminder_model.js';
import UserModel from '../Modals/user_model';
import connection from '../Modules/connection.js';
import async from 'async';
import _ from "lodash";
import md5 from 'md5';

exports.addReminder = ( req , res) => {
	let {access_token} = req.headers;
	let {celebrant_name , mobile_number , email ,date_of_event ,day_before ,send_reminder_as ,is_notify ,msg_template} = req.body;
	UserModel.selectQuery({ access_token })
    .then(result => {
        if (result == 0) {
            responses.authenticationErrorResponse(res);
        } else {
        	let manKeys = ["celebrant_name","mobile_number","email","date_of_event","day_before","send_reminder_as","is_notify","msg_template"];
        	commFunc.checkKeyExist(req.body, manKeys)
        	.then((eventResult) => {
        		if(eventResult.length) {responses.parameterMissing(res,eventResult[0])}
        			else {
        				EventModel.selectQuery({email})
        				.then((eventresult) => {
        					if(eventresult.length >0) {
								responses.invalidCredential(res , constant.responseMessages.EMAIL_ALREADY_EXISTS);
							} else {
									let user_id = result[0].user_id;
			        				let  date = new Date(date_of_event * 1000);
			        				let celebrant_id = md5(new Date());
			        				let insertDate = {user_id,celebrant_id,celebrant_name,mobile_number,email,date_of_event : date,day_before,send_reminder_as,is_notify,msg_template};
			        				EventModel.insertQuery(insertDate)
			        				.then((eventResponse) =>{
			        					// Fetching data of all events of this employee. 

			       						$sql = `SELECT date_FORMAT(date(Date_of_event), '%M %Y') date, date_FORMAT(Date_of_event, '%a %c') week_Day, `celebrant_name` FROM `tb_eventreminder` WHERE 1
										-- AND date_sub(date(Date_of_event), INTERVAL day_before DAY) = CURDATE() 
										-- AND user_id = @curuser
										ORDER BY Date_of_event desc`; 

			        					console.log(day_before)
			        					let sql = "SELECT DATE_SUB( 'date', INTERVAL 7 DAY )";
			        					connection.query(sql,(err,result) => {
			        						if(err) {console.log(err)}
			        							else {
			        								console.log(result)
			        							}
			        					})
			        			}).catch((error) => responses.sendError(error.message, res));
							}
        				}).catch((error) => responses.sendError(error.message, res));
        			}
        	}).catch((error) => responses.sendError(error.message, res));
        }
    }).catch((error) => responses.sendError(error.message, res));
}