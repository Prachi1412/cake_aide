import user_shopping from '../Controllers/user_shopping_controller';
import auth from '../modules/auth';
//import multer from 'multer';
import md5 from 'md5';
import express from 'express'
import path from 'path';
exports.getRouter = (app) => {
	app.route("/user_shopping/createList").post(auth.requiresLogin, user_shopping.createList);
	app.route("/user_shopping/editList").put(user_shopping.editList);
	app.route("/user_shopping/deleteList").delete(user_shopping.deleteList);
	app.route("/user_shopping/getList").get(user_shopping.getList);
	app.route("/user_shopping/addonlist").post(user_shopping.addonlist);
	app.route("/user_shopping/getaddonlist").get(user_shopping.getaddonlist);
	return app;
}