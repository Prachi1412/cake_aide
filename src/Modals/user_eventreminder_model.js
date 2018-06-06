import connection from '../Modules/connection.js';
import responses from '../Modules/responses';
import constant from '../Modules/constant';
import config from '../Config/nodemailer.js';

let selectQuery = (values) => {
	console.log("values"+values)
	return new Promise((resolve, reject) => { 
		console.log(values)
		let sql = "SELECT * FROM `tb_eventreminder` WHERE ?";
		connection.query(sql, [values], (err, result) => {
			err ? reject(err) : resolve(result);//console.log(result)
		});
	});
};

let updateQuery = (values, condition) => {
	return new Promise((resolve, reject) => {
		let sql = "UPDATE `tb_eventreminder` SET ? WHERE ?";
		connection.query(sql, [values, condition], (err, result) => {
			if (err) {
				reject(err);
			} else {
				let sql = "SELECT * FROM `tb_eventreminder` WHERE ?";
				connection.query(sql, [condition], (err, result) => {
					let {password, ...output} = result[0];
					err ? reject(err) : resolve(output);
				});
			}
		});
	});
};

let sendOtp = (res, mobile_number) => {
	let sql = "SELECT * FROM `tb_eventreminder` WHERE `mobile_number`=?";
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
	let sql = "SELECT * FROM `tb_eventreminder` WHERE `mobile_number`=?";
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
		let sql = "INSERT INTO `tb_eventreminder` SET ?";
		connection.query(sql, [values], (err, result) => {
			if (err) {reject(err);}
			else {
				// message.sendOtp
				// email.sendMail
				let sql = "SELECT * FROM `tb_eventreminder` WHERE celebrant_id=?";
				connection.query(sql, [values.celebrant_id], (err, result) => {
					err ? reject(err) : resolve(result);
				});
			}
		});
	});
}


export default {
	selectQuery,
	updateQuery,
	insertQuery,
	sendOtp,
	sendMail
}