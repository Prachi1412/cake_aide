import commFunc from '../Modules/commonFunction';
import responses from '../Modules/responses';
import constant from '../Modules/constant';
import ShoppingModel from '../Modals/user_shopping_model';
import UserModel from '../Modals/user_model';
import AdminModel from '../Modals/admin_model';
import connection from '../Modules/connection.js';
import _ from "lodash";
import md5 from 'md5';

exports.createList = (req , res) => {
	let {name ,description ,recipe_name} = req.body;
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
			})
			    let user_id = result[0].user_id;
			    console.log(user_id);
				let list_id = md5(new Date());
				let insertData = {user_id,list_id,name ,description ,recipe_name, equipment_list : stringobj,addon_list:addonstring};
				ShoppingModel.insertQuery(insertData)
				.then((shoppingResponse ) => {
					user_id = shoppingResponse[0].user_id;
					list_id = shoppingResponse[0].list_id;
					equipment_list = JSON.parse(shoppingResponse[0].equipment_list)
					addon_list = JSON.parse(shoppingResponse[0].addon_list)
					name = shoppingResponse[0].name;
					description = shoppingResponse[0].description;
					recipe_name = shoppingResponse[0].recipe_name;
					
					responses.success(res,_.merge({list_id,user_id,name,description,recipe_name,equipment_list,addon_list}));
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
		let user_id = result[0].user_id;
		let sql = "select * from `tb_shoppinglist` where `user_id` = ?";
		connection.query(sql , [user_id] ,function(err , result) {
		if(err) {
			responses.sendError(err,res);
		} else {
			console.log("result"+result)
			let equipmentData = result.map(element=>_.merge(element,{equipment_list :JSON.parse(element.equipment_list)}))
			let data = equipmentData.map(element=>_.merge(element,{addon_list :JSON.parse(element.addon_list)}))
			responses.success(res,data);
		}
	})
	})
	
}
exports.addonlist = (req , res) => {
	let {access_token} = req.headers;
	
	let addon_list = req.body.addon_list;
	AdminModel.selectQuery({access_token})
	.then(result => {
		if(result==0){
			responses.authenticationErrorResponse(res);
		} else {
			let admin_id = result[0].admin_id;
			let insertData = {admin_id,addon_list};
			ShoppingModel.insertlist(insertData)
			.then((adminResult) => {
				responses.success(res,adminResult)
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