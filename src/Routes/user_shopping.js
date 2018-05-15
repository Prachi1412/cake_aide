import user_shopping from '../Controllers/user_shopping_controller';
import auth from '../modules/auth';
//import multer from 'multer';
import md5 from 'md5';
import express from 'express'
import path from 'path';
exports.getRouter = (app) => {
	app.route("/user_shopping/createList").post(auth.requiresLogin, user_shopping.createList);
	app.route("/user_shopping/addShoppingList").put(user_shopping.addShoppingList);
	app.route("/user_shopping/editShoppingList").put(user_shopping.editShoppingList);


	return app;
}