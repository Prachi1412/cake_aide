import commFunc from '../Modules/commonFunction';
import responses from '../Modules/responses';
import constant from '../Modules/constant';
import ShoppingModel from '../Modals/user_shopping_model';
import UserModel from '../Modals/user_model';
import IngredientModel from '../Modals/user_ingredient_model';
import connection from '../Modules/connection.js';
import _ from "lodash";
import md5 from 'md5';

exports.createList = (req , res) => {
	let {name ,description ,recipe_name} = req.body;
	let equipment_list =[];
	equipment_list = req.body.equipment_list;
	let stringobj;
	let addonstring;
		let {access_token} = req.headers;
	UserModel.selectQuery({access_token})
	.then(result => {
		if(result==0){
			responses.authenticationErrorResponse(res);
		} else {
			equipment_list.forEach(function(element) {
				stringobj = JSON.stringify(equipment_list);
			})
			    let user_id = result[0].user_id;
			    console.log(user_id);
				let list_id = md5(new Date());
				let insertData = {user_id,list_id,name ,description ,recipe_name, equipment_list : stringobj};
				ShoppingModel.insertQuery(insertData)
				.then((shoppingResponse ) => {
					user_id = shoppingResponse[0].user_id;
					list_id = shoppingResponse[0].list_id;
					equipment_list = JSON.parse(shoppingResponse[0].equipment_list);
					name = shoppingResponse[0].name;
					description = shoppingResponse[0].description;
					recipe_name = shoppingResponse[0].recipe_name;
					
					responses.success(res,_.merge({list_id,user_id,name,description,recipe_name,equipment_list}));
				})
				.catch((error) => responses.sendError(error.message, res));
		

		}
		
	}).catch((error) => responses.sendError(error.message, res));
}

exports.editList = (req , res) => {
	let {list_id,name ,description ,recipe_name} = req.body;
	let equipment_list =[];
	equipment_list = req.body.equipment_list;
	let addon_list = [];
	let stringobj;
	let addonstring;
	addon_list = req.body.addon_list;
	let {access_token} = req.headers;
	UserModel.selectQuery({access_token})
	.then(result => {
		if(result==0){
			responses.authenticationErrorResponse(res);
		} else {
			equipment_list.forEach(function(element) {
				stringobj = JSON.stringify(equipment_list);
			})
			addon_list.forEach(function(result) {
				addonstring = JSON.stringify(addon_list);
			});
				let updateData = {name ,description ,recipe_name, equipment_list : stringobj,addon_list:addonstring};
				ShoppingModel.updateQuery(updateData,{list_id})
				.then((shoppingResponse ) => {
					responses.success(res,"done");
				})
				.catch((error) => responses.sendError(error.message, res));
		

		}
		
	}).catch((error) => responses.sendError(error.message, res));
}
exports.deleteList = (req , res) => {
	let {list_id} = req.body;
	let {access_token} =req.headers;
	UserModel.selectQuery({access_token})
	.then(result => {
		if(result==0){
			responses.authenticationErrorResponse(res);
		} else {
			ShoppingModel.deleteQuery({list_id})
			.then((shoppingResponse)=>{
				if(shoppingResponse.length > 0) {
					responses.success(res,"deleted");
				}else {
					responses.sendError(res);
				}
			
			}).catch((error) => responses.sendError(error.message, res));
		} 
	}).catch((error) => responses.sendError(error.message, res));
}
exports.getList= (req , res) => {
	let {access_token} = req.headers;
	UserModel.selectQuery({access_token})
	.then((result) => {
		if(result==0){
			responses.authenticationErrorResponse(res);
		} else {
			let user_id = result[0].user_id;
			let sql = "select * from `tb_shoppinglist` where `user_id` = ?";
			connection.query(sql , [user_id] ,function(err , result) {
			if(err) {
				responses.sendError(err,res);
			} else {
				let arr = [];
				let equipmentdata = result.map(element => {
					
					

					if(element.equipment_list && element.ingredient_list) {
						arr.push(_.merge(element,{equipment_list :JSON.parse(element.equipment_list),ingredient_list :JSON.parse(element.ingredient_list)}));
						//arr1.push(_.merge(element,{addon_list :JSON.parse(element.addon_list)}))
					
					}
				})
				responses.success(res,arr);
			}
		})

		}
	
	})
	
}
exports.checkIngredient = (req , res) => {
	let {access_token} = req.headers;
	let {list_id} = req.body;
	let stringobj;
	let ingredient_list = req.body.ingredient_list;
	UserModel.selectQuery({access_token})
	.then(result => {
		if(result==0){
			responses.authenticationErrorResponse(res);
		} else {
			ingredient_list.forEach(element => {
				stringobj = JSON.stringify(ingredient_list);
			})
			let updateData = {ingredient_list : stringobj};
			ShoppingModel.updateQuery(updateData,{list_id})
			.then((shoppingResult) => {
				let list_id = shoppingResult[0].list_id;
				let name = shoppingResult[0].name;
				let description = shoppingResult[0].description;
				let recipe_name = shoppingResult[0].recipe_name;
				let equipment_list = JSON.parse(shoppingResult[0].equipment_list)
				let ingredient_list = JSON.parse(shoppingResult[0].ingredient_list)
				responses.success(res,_.merge({list_id,name,description,recipe_name,equipment_list,ingredient_list}))
			}).catch((error) => responses.sendError(error.message, res));

		}
	}).catch((error) => responses.sendError(error.message, res));
}
exports.getaddonlist = (req ,res) => {
	let {access_token} = req.headers;
	let addon_id;
	let addedlist =[];
	UserModel.selectQuery({access_token})
	.then(result => {
		if(result==0){
			responses.authenticationErrorResponse(res);
		} else {

			let sql = "select addon_id, addon_list from `tb_addonlist`";
			connection.query(sql,[],(err, result) =>{
				if(err) {responses.sendError(err,res);}
				else {
					responses.success(res,result);
				}
			})
		}
	}).catch((error) => responses.sendError(error.message, res));

}