import constants from './constant';
import async from 'async';
import _ from 'lodash';

/*
 * -----------------------
 * GENERATE RANDOM STRING
 * -----------------------
 */
 exports.generateRandomString = () => {
	let text = "";
	let possible = "123456789";

	for (var i = 0; i < 4; i++)
		text += possible.charAt(Math.floor(Math.random() * possible.length));

	return text;
};

/*
 * -----------------------------------------------
 * CHECK EACH ELEMENT OF ARRAY FOR BLANK AND Key
 * -----------------------------------------------
 */

exports.checkKeyExist = (req, arr) => {
	return new Promise((resolve, reject) => {
		var array = [];
		_.map(arr, (item) => {
			if(req.hasOwnProperty(item)) {
				var value = req[item];
				if( value == '' || value == undefined ) { 
					array.push(item+" can not be empty");
				}
				resolve(array);
			} else {
				array.push(item+" key is missing");
				resolve(array);
			}
		});
	}); 
};