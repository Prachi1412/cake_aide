import commFunc from '../Modules/commonFunction';
import responses from '../Modules/responses';
import constant from '../Modules/constant';
import AdminModel from '../Modals/admin_model';
import SettingModel from '../Modals/user_setting_model'
import UserModel from '../Modals/user_model';
import md5 from 'md5';
import connection from '../Modules/connection.js';

exports.addthemes = (req,res) => {
	let {access_token} = req.headers;
	let {theme_image} = req,body;
	AdminModel.selectQuery({access_token})
	.then((result) => {
		if(result == 0) {responses.authenticationErrorResponse(res);} 
		else {
			
			for(let i=0; i< req.files.length ;i++) {
				let profile_image = `/images/${req.files[i].filename}`;
				let admin_id = result[0].admin_id;
				let image_id = md5(new Date());
				let insertData = {admin_id,image_id,theme_image : profile_image}
				SettingModel.insertQuery(insertData)
				.then((settingResult) => {
					responses.success(res,settingResult);
				}).catch((error) => responses.sendError(error.message, res));
			}
		}
	}).catch((error) => responses.sendError(error.message, res));
}
exports.addwallpaper = (req,res) => {
	let {access_token} = req.headers;
	let {wallpaper_image} = req,body;
	AdminModel.selectQuery({access_token})
	.then((result) => {
		if(result == 0) {responses.authenticationErrorResponse(res);} 
		else {
			
			for(let i=0; i< req.files.length ;i++) {
				let profile_image = `/images/${req.files[i].filename}`;
				let admin_id = result[0].admin_id;
				let image_id = md5(new Date());
				let insertData = {admin_id,image_id,wallpaper_image : profile_image}
				SettingModel.insertQuery(insertData)
				.then((settingResult) => {
					responses.success(res,settingResult);
				}).catch((error) => responses.sendError(error.message, res));
			}
		}
	}).catch((error) => responses.sendError(error.message, res));
}
exports.getthemes = (req,res) => {
	let {access_token} = req.headers;
	let images = [];
	UserModel.selectQuery({access_token})
	.then((result) => {
		if(result == 0) {responses.authenticationErrorResponse(res);}
		else {
			let sql = "select * from `tb_settings` where `wallpaper_image` Is NUll";
			connection.query(sql,[],(err, result) =>{
				if(err) {responses.sendError(err,res);}
				else {
					result.forEach(function(element) {
						console.log(images.push(element.theme_image))
					})
					responses.success(res,images);
				}
			})
		}
	}).catch((error) => responses.sendError(error.message, res));
}
exports.getwallpaper = (req,res) => {
	let {access_token} = req.headers;
	let images = [];
	UserModel.selectQuery({access_token})
	.then((result) => {
		if(result == 0) {responses.authenticationErrorResponse(res);}
		else {
			let sql = "select * from `tb_settings` where `theme_image` Is NUll ";
			connection.query(sql,[],(err, result) =>{
				if(err) {responses.sendError(err,res);}
				else {
					result.forEach(function(element) {
						console.log(images.push(element.wallpaper_image))
					})
					responses.success(res,images);
				}
			})
		}
	}).catch((error) => responses.sendError(error.message, res));
}