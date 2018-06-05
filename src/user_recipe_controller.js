import commFunc from '../Modules/commonFunction';
import responses from '../Modules/responses';
import constant from '../Modules/constant';
import RecipeModel from '../Modals/user_recipe_model';
import UserModel from '../Modals/user_model';
import IngredientModel from '../Modals/user_ingredient_model';
import connection from '../Modules/connection.js';
import convertUnit from 'convert-units';
import async from 'async';

import _ from "lodash";
import md5 from 'md5';

exports.createRecipeType = (req, res) => {
    let { access_token } = req.headers;
    let { recipe_type } = req.body;
  
    let condition = { access_token };
    UserModel.selectQuery({ access_token })
        .then(result => {
            if (result == 0) {
                responses.authenticationErrorResponse(res);
            } else {
                if (recipe_type == 0) {
                    let { image } = req.body;
                    for (let i = 0; i < req.files.length; i++) {
                        let image = `/recipe/${req.files[i].filename}`;
                        UserModel.selectQuery(condition)
                            .then(userResult => userResult.length > 0 ? userResult : responses.invalidCredential(res, constant.responseMessages.USER_NOT_FOUND))
                            .then((userResult) => {
                                let user_id = userResult[0].user_id;
                                let recipe_id = md5(new Date());
                                let insertData = { user_id, recipe_id, image, recipe_type, is_image_captured: 1 }
                                RecipeModel.insertQuery(insertData).then((recipeResponse) => {
                                    responses.success_recipe(res, 'image captured successfully', recipeResponse[0])
                                }).catch((error) => responses.sendError(error.message, res));
                            }).catch((error) => responses.sendError(error.message, res));
                    }
                } else if (recipe_type == 1) {
                    let { image } = req.body;
                    for (let i = 0; i < req.files.length; i++) {
                        let image = `/recipe/${req.files[i].filename}`;
                        UserModel.selectQuery(condition)
                            .then(userResult => userResult.length > 0 ? userResult : responses.invalidCredential(res, constant.responseMessages.USER_NOT_FOUND))
                            .then((userResult) => {
                                let user_id = userResult[0].user_id;
                                let recipe_id = md5(new Date());
                                let insertData = { user_id, recipe_id, image, recipe_type, is_image_uploaded: 1 }
                                RecipeModel.insertQuery(insertData).then((recipeResponse) => {
                                    responses.success_recipe(res, 'image uploaded successfully', recipeResponse[0])
                                }).catch((error) => responses.sendError(error.message, res));
                            }).catch((error) => responses.sendError(error.message, res));
                    }
                } else if (recipe_type == 2) {
                    let { paste_recipe } = req.body;
                    let manKeys = ["paste_recipe"];
                    commFunc.checkKeyExist(req.body, manKeys)
                        .then(result => result.length ? new Promise(new Error(responses.parameterMissing(res, result[0]))) : '')
                        .then(result => {
                            UserModel.selectQuery(condition)
                                .then(userResult => userResult.length > 0 ? userResult : responses.invalidCredential(res, constant.responseMessages.USER_NOT_FOUND))
                                .then((userResult) => {
                                    let user_id = userResult[0].user_id;
                                    let recipe_id = md5(new Date());
                                    let insertData = { user_id, recipe_id, paste_recipe, is_recipe_pasted: 1, recipe_type: 2 }
                                    RecipeModel.insertQuery(insertData).then((recipeResponse) => { responses.success_recipe(res, "Recipe Pasted successfully", recipeResponse[0]) })
                                        .catch((error) => responses.sendError(error.message, res));
                                }).catch((error) => responses.sendError(error.message, res));
                        }).catch((error) => responses.sendError(error.message, res));
                } else if (recipe_type == 3) {
                    let ingredient_list = [];
                    ingredient_list = req.body.ingredient_list;
                    console.log(ingredient_list)
                    let list_items = [];
                    UserModel.selectQuery(condition)
                        .then(userResult => userResult.length > 0 ? userResult : responses.invalidCredential(res, constant.responseMessages.USER_NOT_FOUND))
                        .then((userResult) => {
                            let user_id = userResult[0].user_id;
                            let recipe_id = md5(new Date());
                            let insertData = { user_id, recipe_id, recipe_type: 3, is_manual: 1 }
                            RecipeModel.insertQuery(insertData).then((recipeResponse) => {
                                    responses.success_recipe(res, 'Recipe Added Manually', recipeResponse);
                                })
                                .catch((error) => responses.sendError(error.message, res));
                        }).catch((error) => responses.sendError(error.message, res));
                }
            }
        }).catch((error) => responses.sendError(error.message, res));
}
exports.recipeEntry = (req, res) => {
    let { access_token } = req.headers;
    let { recipe_id, recipe_name, cake_size } = req.body;
    UserModel.selectQuery({ access_token })
        .then(result => {
            if (result == 0) {
                responses.authenticationErrorResponse(res);
            } else {
                let updateData = { recipe_name, cake_size };
                RecipeModel.updateQuery(updateData, { recipe_id })
                    .then((recipeResult) => {
                        let recipe_id = recipeResult[0].recipe_id;
                        let recipe_name = recipeResult[0].recipe_name;
                        let cake_size = recipeResult[0].cake_size;
                        let ingredient_list = JSON.parse(recipeResult[0].ingredient_list)
                        responses.success(res, _.merge({ recipe_id, recipe_name, cake_size, ingredient_list }))
                    })
            }
        }).catch((error) => responses.sendError(error.message, res));
}
exports.recipe_delete = (req, res) => {
    let { recipe_id } = req.body;
    let { access_token } = req.headers;
    let manKeys = ["recipe_id"];
    UserModel.selectQuery({ access_token })
        .then(result => {
            if (result == 0) {
                responses.authenticationErrorResponse(res);
            } else {
                commFunc.checkKeyExist(req.body, manKeys)
                    .then((result) => {
                        if (result.length > 0) {
                            responses.parameterMissing(res, result[0]);
                        } else {
                            console.log("comming");
                            RecipeModel.selectQuery({ recipe_id })
                                .then((recipeResponse) => {
                                    console.log(recipeResponse[0]);
                                    if (recipeResponse.length > 0) {
                                        //let recipe_id = recipeResponse[0].recipe_id;
                                        RecipeModel.deleteQuery({ recipe_id })
                                            .then((recipeResponse) => {
                                                responses.success(res, 'Recipe deleted successfully.')
                                            }).catch((error) => responses.sendError(error.message, res));
                                    } else {
                                        responses.invalidCredential(res, 'Recipe not exist.');
                                    }
                                }).catch((error) => responses.sendError(error.message, res));
                        }
                    }).catch((error) => responses.sendError(error.message, res));
            }
        }).catch((error) => responses.sendError(error.message, res));
}
// exports.getRecipe = (req, res) => {
//     let { user_id, recipe_name, cake_size, image } = req.body;
//     let sql = "select * from `tb_myrecipe` where `user_id` = ?";
//     connection.query(sql, [user_id], function(err, result) {
//         if (err) {
//             responses.sendError(err, res);
//         } else {
//             if((result[0].recipe_name != '') && (result[0].ingredient_list != '')){
            
//                     let data = result.map(element => _.merge(element, { ingredient_list: JSON.parse(element.ingredient_list) }))
//                     responses.success(res, data);

//                 } else {
//                     console.log("ingredient list blank");
//                 }
//             }
          
//         })
//     }
exports.getRecipe = (req , res) => {
    let {user_id,recipe_name,cake_size,image} = req.body;
    let sql = "select * from `tb_myrecipe` where `user_id` = ? and recipe_name IS NOT NULL";
    connection.query(sql ,[user_id],function(err , result) {
        if(err) {
            responses.sendError(err,res);
        } else {
            let data = result.map(element=>_.merge(element,{ingredient_list :JSON.parse(element.ingredient_list)}))
                responses.success(res,data);
        }       
    })
}

exports.delete_recipe_ingredient = (req, res) => {
    let { access_token } = req.headers;
    let { ingredient_id } = req.body;
    let { recipe_id } = req.body;
    UserModel.selectQuery({ access_token })
        .then(result => {
            if (result == 0) {
                responses.authenticationErrorResponse(res);
            } else {
                RecipeModel.selectQuery({ recipe_id })
                    .then((recipeResult) => {
                        let ingredient_list = JSON.parse(recipeResult[0].ingredient_list);
                        let checkValue = commFunc.checkValueExist(ingredient_list, ingredient_id);
                        if (checkValue == 0) {
                            let response = {
                                response: {},
                                message: "Ingredient not found."
                            };
                            res.status(constant.responseFlags.ACTION_COMPLETE).json(response);
                        } else {
                            let listArr = ingredient_list.splice({ ingredient_id }, 1);
                            let condition = { recipe_id };
                            let updateData = { ingredient_list: JSON.stringify(ingredient_list) };

                            RecipeModel.updateQuery(updateData, condition)
                                .then((recipeListResponse) => {
                                    // responses.success(res,(recipeListResponse))
                                    let list = [];
                                    async.eachSeries(recipeListResponse, get_recipe_list, (results) => {
                                        let response = {
                                            response: list,
                                            message: "Ingredient deleted successfully."
                                        };
                                        res.status(constant.responseFlags.ACTION_COMPLETE).json(response);
                                        list = [];
                                    });

                                    function get_recipe_list(item, callback) {
                                        item.ingredient_list = JSON.parse(item.ingredient_list);
                                        console.log(item)
                                        list.push(item);
                                        callback();
                                    }

                                }).catch((error) => responses.sendError(error.message, res));
                        }

                    }).catch((error) => responses.sendError(error.message, res));
            }

        }).catch((error) => responses.sendError(error.message, res));
}

exports.updateRecipeIngredient = (req, res) => {
    let { access_token } = req.headers;
    let { recipe_id } = req.body;
    let { addingredient_list } = req.body;
    let data = [];
    UserModel.selectQuery({ access_token })
        .then(result => {
            if (result == 0) {
                responses.authenticationErrorResponse(res);
            } else {
                let arr = [];
                RecipeModel.selectQuery({ recipe_id })
                    .then((recipeResult) => {
                        let ingredient_list = recipeResult[0].ingredient_list;
                        async.each(addingredient_list, (element, cb) => {
                            let { ingredient_id, need_quantity, unit } = element;
                            let sql = "select * from `tb_ingredientlist` where `ingredient_id` in (?)";
                            return connection.query(sql, [ingredient_id], (err, result) => {
                                if (err) {
                                    return cb(err);
                                } else {
                                    if (result && result[0]) {
                                     let   {ingredient_name,currency} = result[0];
                                        RecipeModel.ingredientList(result[0], element).then(totalPricePrIngredient => {
                                            arr.push({ingredient_name,currency,unit,need_quantity,ingredient_id, totalPricePrIngredient })
                                            return cb();
                                        }).catch(err => cb())
                                    } else {
                                        console.log("invalid ingredient_id")
                                        return cb();
                                    }
                                }
                            })
                        }, (err) => {
                            if (err) {
                                responses.sendError(err, res)
                            } else {
                                {}
                                let updateData = { ingredient_list: JSON.stringify(arr) }
                                RecipeModel.updateQuery(updateData, { recipe_id })
                                    .then((recipeResponse) => responses.success(res, { recipe_id, ingredient_list: arr }))
                                    .catch(error => responses.sendError(error.message, res));
                            }
                        })
                    }).catch((error) => responses.sendError(error.message, res));
            }
        }).catch((error) => responses.sendError(error.message, res));

}

exports.clickAddRcipe = (req, res) => {
    let { access_token } = req.headers;
    let { recipe_id } = req.body;
    let { addmoreingredient } = req.body;
    let data = [];
    UserModel.selectQuery({ access_token })
        .then(result => {
            if (result == 0) {
                responses.authenticationErrorResponse(res);
            } else {
                let arr = [];
                RecipeModel.selectQuery({ recipe_id })
                    .then((recipeResult) => {
                        let ingredient_list = recipeResult[0].ingredient_list;
                        async.each(addmoreingredient, (element, cb) => {
                            let { ingredient_id, need_quantity, unit } = element;
                           
                            let sql = "select * from `tb_ingredientlist` where `ingredient_id` in (?)";
                            return connection.query(sql, [ingredient_id], (err, result) => {
                                if (err) {
                                    return cb(err);
                                } else {
                                    if (result && result[0]) {
                                     let   {ingredient_name,currency} = result[0];
                                        RecipeModel.ingredientList(result[0], element).then(totalPricePrIngredient => {
                                            arr.push({ingredient_name,currency,unit,need_quantity,ingredient_id, totalPricePrIngredient })
                                        ingredient_list = JSON.parse(ingredient_list);
                                            return cb();
                                        }).catch(err => cb())
                                    } else {
                                        console.log("invalid ingredient_id")
                                        return cb();
                                    }
                                }
                            })
                        }, (err) => {
                            if (err) {
                                responses.sendError(err, res)
                            } else {
                                
                                data = ingredient_list.concat(arr);
                                       
                                console.log("===============================")
                                    console.log(data)
                                console.log('===============================')
                                 let updateData = { ingredient_list: JSON.stringify(data)}
                                    // console.log("===============================")
                                    // console.log(updateData)
                                RecipeModel.updateQuery(updateData, { recipe_id })
                                    .then((recipeResponse) => {
                                        console.log(recipeResponse[0].recipe_id)
                                        let recipe_id = recipeResponse[0].recipe_id;
                                        let ingredient_list = JSON.parse(recipeResponse[0].ingredient_list);
                                        console.log("+++++++++++++")
                                        console.log(ingredient_list)
                                        responses.success(res, _.merge({ recipe_id, ingredient_list }))
                                    }).catch(error => responses.sendError(error.message, res));
                                        
                         
                                    
                            }
                        })
                    }).catch((error) => responses.sendError(error.message, res));
            }
        }).catch((error) => responses.sendError(error.message, res));

}