import connection from '../Modules/connection.js';
import responses from '../Modules/responses';
import constant from '../Modules/constant';
import convertUnit from 'convert-units';

//import config from '../Config/nodemailer.js';

let selectQuery = (values) => {
	return new Promise((resolve, reject) => { 
		// console.log(values)
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
					err ? reject(err) : resolve(result);
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
				let sql = "SELECT * FROM `tb_myrecipe` WHERE `recipe_id` = ?";
				connection.query(sql, [values.recipe_id], (err, result) => {
					err ? reject(err) : resolve(result);
				});
			}
		});
	});
}
let insertIngredientQuery = (values) => {
	return new Promise((resolve, reject) => {
		let sql = "INSERT INTO `tb_myrecipe` SET ?";
		connection.query(sql, [values], (err, result) => {
			if (err) {reject(err);}
			else {
				// message.sendOtp
				// email.sendMail
				let sql = "SELECT * FROM `tb_recipeingredient` WHERE `recipe_id` = ?";
				connection.query(sql, [values.recipe_id], (err, result) => {
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
const ingredientList = (result, element) => {
    return new Promise((resolve, reject) => {
        let { size, price, quantity } = result;
        let { unit, need_quantity } = element;
        let perGm;
        if (unit == 'Grams' && size == 'Kilograms') {
            perGm = convertUnit(need_quantity).from('g').to('kg')
        } else if (unit == 'Kilograms' && size == 'Grams') {
            perGm = convertUnit(need_quantity).from('kg').to('g')
        } else if (unit == 'Grams' && size == 'Grams') {
            perGm = convertUnit(need_quantity).from('g').to('g')
        } else if (unit == 'Cups' && size == 'Cups') {
            perGm = convertUnit(need_quantity).from('cup').to('cup')
        } else if (unit == 'Kilograms' && size == 'Kilograms') {
            perGm = convertUnit(need_quantity).from('kg').to('kg')
        } else if (unit == 'Pints' && size == 'Pints') {
            perGm = convertUnit(need_quantity).from('pnt').to('pnt')
        } else if (unit == 'Ounces' && size == 'Ounces') {
            perGm = convertUnit(need_quantity).from('oz').to('oz')
        } else if (unit == 'Gallons' && size == 'Gallons') {
            perGm = convertUnit(need_quantity).from('gal').to('gal')
        } else if (unit == 'Liters' && size == 'Liters') {
            perGm = convertUnit(need_quantity).from('l').to('l')
        } else if (unit == 'Liters' && size == 'Milliliters') {
            perGm = convertUnit(need_quantity).from('l').to('ml')
           // Math.round(perGm * 100) / 100
        } else if (unit == 'Milliliters' && size == 'Milliliters') {
            perGm = convertUnit(need_quantity).from('ml').to('ml')
           // Math.round(perGm * 100) / 100
        } else if (unit == 'Mililiters' && size == 'Liters') {
            perGm = convertUnit(need_quantity).from('ml').to('l')
        } else {
            return reject('invalid conversations');
        }
        let pricePrQuantity = price / quantity;
        let totalPricePrIngredient = perGm * pricePrQuantity;
        resolve(totalPricePrIngredient)
    });
}


export default {
	selectQuery,
	updateQuery,
	insertQuery,
	deleteQuery,
	insertIngredientQuery,
	ingredientList

}