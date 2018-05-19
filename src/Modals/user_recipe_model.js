import connection from '../Modules/connection.js';
import responses from '../Modules/responses';
import constant from '../Modules/constant';
//import config from '../Config/nodemailer.js';

let selectQuery = (values) => {
	return new Promise((resolve, reject) => { 
		console.log(values)
		let sql = "SELECT * FROM `tb_myrecipe` WHERE ?";
		connection.query(sql, [values], (err, result) => {
			err ? reject(err) : resolve(result);
		});
	});
};
let updateQuery = (values, condition) => {

	return new Promise((resolve, reject) => {
		let sql = "UPDATE `tb_myrecipe` SET ? WHERE ?";
		connection.query(sql, [values, condition], (err, result) => {
			if (err) {
				reject(err);
			} else {

				let sql = "SELECT * FROM `tb_myrecipe` WHERE ?";
				connection.query(sql, [condition], (err, result) => {
					err ? reject(err) : resolve(result);console.log(result)
				});
			}
		});
	});
};
let insertQuery = (values) => {
	return new Promise((resolve, reject) => {
		let sql = "INSERT INTO `tb_myrecipe` SET ?";
		connection.query(sql, [values], (err, result) => {
			if (err) {reject(err);}
			else {
				// message.sendOtp
				// email.sendMail
				let sql = "SELECT * FROM `tb_myrecipe` ORDER BY `row_id` DESC";
				connection.query(sql, [], (err, result) => {
					err ? reject(err) : resolve(result);
				});
			}
		});
	});
}
let deleteQuery = (condition) => {
	return new Promise((resolve, reject) => {
		let sql = "DELETE FROM `tb_myrecipe` WHERE ?";
		connection.query(sql,[condition],(err ,result) => {
			err ? reject(err) : resolve(result);
		})
	})
}
export default {
	selectQuery,
	updateQuery,
	insertQuery,
	deleteQuery
}