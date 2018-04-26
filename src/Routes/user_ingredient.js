import user_ingredient from '../Controllers/user_ingredient_controller';
import auth from '../modules/auth';
//import multer from 'multer';
import md5 from 'md5';
import express from 'express'
import path from 'path';
exports.getRouter = (app) => {
// 	let storage = multer.diskStorage({
// 	destination : function(req,file,callback){
// 		console.log(file)
//         callback(null,'./src/uploads/user');
// 	},
// 	filename : function(req,file,callback){
// 		let fileUniqueName = md5(Date.now());
//         callback(null,fileUniqueName+ path.extname(file.originalname));
//     }
// });
// 	let upload = multer({storage:storage});
	app.route("/user_ingredient/addIngredient").post(auth.requiresLogin, user_ingredient.addIngredient);
	app.route("/user_ingredient/editIngredient").post(user_ingredient.editIngredient);
	app.route("/user_ingredient/deleteIngredient").delete(user_ingredient.deleteIngredient);
	app.route("/user_ingredient/get_ingredient").get(user_ingredient.get_ingredient);
	return app;
}