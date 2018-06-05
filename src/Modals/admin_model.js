import connection from '../Modules/connection.js';
import responses from '../Modules/responses';
import constant from '../Modules/constant';
import config from '../Config/nodemailer.js';

let selectQuery = (values) => {
	console.log(values)
	return new Promise((resolve, reject) => { 
		let sql = "SELECT * FROM `tb_admin` WHERE ?";
		connection.query(sql, [values], (err, result) => {
			err ? reject(err) : resolve(result); console.log(result)
		});
	});
};
let updateQuery = (values, condition) => {
	return new Promise((resolve, reject) => {
		let sql = "UPDATE `tb_admin` SET ? WHERE ?";
		connection.query(sql, [values, condition], (err, result) => {
			if (err) {
				reject(err);
			} else {
				let sql = "SELECT * FROM `tb_admin` WHERE ?";
				connection.query(sql, [condition], (err, result) => {
					let {password, ...output} = result[0];
					err ? reject(err) : resolve(output);
				});
			}
		});
	});
};
export default {
	selectQuery,
	updateQuery,

}