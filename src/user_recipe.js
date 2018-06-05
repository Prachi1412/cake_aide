import user_recipe from '../Controllers/user_recipe_controller';
import multer from 'multer';
import md5 from 'md5';
import express from 'express'
import path from 'path';
exports.getRouter = (app) => {
	let storage = multer.diskStorage({
	destination : function(req,file,callback){
        callback(null,'./src/uploads/recipe');
	},
	filename : function(req,file,callback){
		let fileUniqueName = md5(Date.now());
        callback(null,fileUniqueName+ path.extname(file.originalname));
    }
});
	let upload = multer({storage:storage});
	app.route("/user_recipe/createRecipeType").post(upload.any(),user_recipe.createRecipeType);
	app.route("/user_recipe/ingredientEntry").post(user_recipe.ingredientEntry);
	app.route("/user_recipe/recipeEntry").put(user_recipe.recipeEntry);
	app.route("/user_recipe/getRecipe").post(user_recipe.getRecipe);
	app.route("/user_recipe/recipe_delete").delete(user_recipe.recipe_delete);
	return app;
}