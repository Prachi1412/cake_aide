import connection from '../Modules/connection.js';
import responses from '../Modules/responses';
import constant from '../Modules/constant';
import config from '../Config/nodemailer.js';

let selectQuery = (values) => {
	console.log("values"+values)
	return new Promise((resolve, reject) => { 
		console.log(values)
		let sql = "SELECT * FROM `tb_user` WHERE ?";
		connection.query(sql, [values], (err, result) => {
			err ? reject(err) : resolve(result);//console.log(result)
		});
	});
};

let updateQuery = (values, condition) => {
	return new Promise((resolve, reject) => {
		let sql = "UPDATE `tb_user` SET ? WHERE ?";
		connection.query(sql, [values, condition], (err, result) => {
			if (err) {
				reject(err);
			} else {
				let sql = "SELECT * FROM `tb_user` WHERE ?";
				connection.query(sql, [condition], (err, result) => {
					let {password, ...output} = result[0];
					err ? reject(err) : resolve(output);
				});
			}
		});
	});
};
let updateQueryUser = (values, condition) => {
	return new Promise((resolve, reject) => {
		let sql = "UPDATE `tb_user` SET ? WHERE ?";
		connection.query(sql, [values, condition], (err, result) => {
			if (err) {
				reject(err);
			} else {
				let sql = "SELECT * FROM `tb_user` WHERE ?";
				connection.query(sql, [condition], (err, result) => {
					err ? reject(err) : resolve(result);
				});
			}
		});
	});
};

let updateQueryemail = (values, condition) => {
	return new Promise((resolve, reject) => {
		let sql = "UPDATE `tb_user` SET ? WHERE ?";
		connection.query(sql, [values, condition], (err, result) => {
			if (err) {
				reject(err);
			} else {
				resolve(result);
			}
		});
	});
};

let sendOtp = (res, mobile_number) => {
	let sql = "SELECT * FROM `tb_user` WHERE `mobile_number`=?";
	connection.query(sql, [mobile_number], (err, result) =>{
		if (err) {
			responses.sendError(error.message, res);
		} else {
			if (result.length > 0 ) {
				//Twillo.sendOTP(res,result[0].mobile_number)
				config.sendMobile(res, mobile_number);
			} else {
				res.send("Number not found"); 
			}
		}
	});
};

let sendMail = (res, mobile_number) => {
	let sql = "SELECT * FROM `tb_user` WHERE `mobile_number`=?";
	connection.query(sql, [mobile_number], (err, result) =>{
		if (err) {
			responses.sendError(error.message, res);
		} else {
			if (result.length > 0 ) {
				// Twillo.sendOTP()
			} else {
				// Number not found 
			}
		}
	});
};

let insertQuery = (values) => {
	return new Promise((resolve, reject) => {
		let sql = "INSERT INTO `tb_user` SET ?";
		connection.query(sql, [values], (err, result) => {
			if (err) {reject(err);}
			else {
				// message.sendOtp
				// email.sendMail
				let sql = "SELECT * FROM `tb_user` WHERE user_id=?";
				connection.query(sql, [values.user_id], (err, result) => {
					let {password, ...output} = result[0];
					err ? reject(err) : resolve(output);
				});
			}
		});
	});
}
let insertQueryFeedback = (values) => {
	return new Promise((resolve, reject) => {
		let sql = "INSERT INTO `tb_user_feedback` SET ?";
		connection.query(sql, [values], (err, result) => {
			if (err) {reject(err);}
			else {
				// message.sendOtp
				// email.sendMail
				let sql = "SELECT * FROM `tb_user_feedback` WHERE user_id=?";
				connection.query(sql, [values.user_id], (err, result) => {
					err ? reject(err) : resolve(result);
				});
			}
		});
	});
}

export default {
	selectQuery,
	updateQuery,
	updateQueryUser,
	sendOtp,
	sendMail,
	insertQuery,
	updateQueryemail,
	insertQueryFeedback
}