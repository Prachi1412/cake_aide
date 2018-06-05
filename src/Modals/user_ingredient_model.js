import connection from '../Modules/connection.js';
import responses from '../Modules/responses';
import constant from '../Modules/constant';
//import config from '../Config/nodemailer.js';

let selectQuery = (values) => {
	console.log(values)
	return new Promise((resolve, reject) => { 
		let sql = "SELECT * FROM `tb_ingredientlist` WHERE ?";
		connection.query(sql, [values], (err, result) => {
			err ? reject(err) : resolve(result);
		});
	});
};
let updateQuery = (values, condition) => {
	console.log("model "+ values)
	console.log("model cond" +condition)
	return new Promise((resolve, reject) => {
		let sql = "UPDATE `tb_ingredientlist` SET ? WHERE ?";
		connection.query(sql, [values, condition], (err, result) => {
			if (err) {
				reject(err);
			} else {
				let sql = "SELECT * FROM `tb_ingredientlist` WHERE ?";
				connection.query(sql, [condition], (err, result) => {
					err ? reject(err) : resolve(result);
				});
			}
		});
	});
};
let selectIngredientQuery = (values) => {
	return new Promise((resolve, reject) => { 
		console.log(values)
		let sql = "SELECT * FROM `tb_ingredientlist` WHERE ingredient_name=? AND brand=?";
		connection.query(sql, [values.ingredient_name, values.brand], (err, result) => {
			err ? reject(err) : resolve(result);
		});
	});
};
let insertQuery = (values) => {
	return new Promise((resolve, reject) => {
		let sql = "INSERT INTO `tb_ingredientlist` SET ?";
		connection.query(sql, [values], (err, result) => {
			if (err) {reject(err);}
			else {
				// message.sendOtp
				// email.sendMail
				let sql = "SELECT * FROM `tb_ingredientlist` WHERE ingredient_id = ?";
				connection.query(sql, [values.ingredient_id], (err, result) => {
					err ? reject(err) : resolve(result);
				});
			}
		});
	});
}
let deleteQuery = (condition) => {
	return new Promise((resolve, reject) => {
		let sql = "DELETE FROM `tb_ingredientlist` WHERE ?";
		connection.query(sql,[condition],(err ,result) => {
			err ? reject(err) : resolve(result);
		})
	})
}
export default {
	selectQuery,
	updateQuery,
	insertQuery,
	deleteQuery,
	selectIngredientQuery
}