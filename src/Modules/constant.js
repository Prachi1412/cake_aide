/**
 * The node-module to hold the constants for the server
 */

let define = (obj, name, value) => {
    Object.defineProperty(obj, name, {
        value: value,
        enumerable: true,
        writable: false,
        configurable: true
    });
}

exports.responseFlags = {};
exports.responseMessages = {};


//FOR MESSAGES
define(exports.responseMessages, 'PARAMETER_MISSING',                     'Some parameter missing.');
define(exports.responseMessages, 'INVALID_ACCESS_TOKEN',                  'Invalid access token.');
define(exports.responseMessages, 'INVALID_MOBILE_NUMBER',                 'Invalid mobile number.');
define(exports.responseMessages, 'INVALID_EMAIL_ID',                      'Invalid email id.');
define(exports.responseMessages, 'INVALID_CREDENTIAL',                    'Invalid credential.');
define(exports.responseMessages, 'INCORRECT_PASSWORD',                    'Incorrect Password.');
define(exports.responseMessages, 'ACTION_COMPLETE',                       'Action complete.');
define(exports.responseMessages, 'LOGIN_SUCCESSFULLY',                    'Logged in successfully.');
define(exports.responseMessages, 'SHOW_ERROR_MESSAGE',                    'Show error message.');
define(exports.responseMessages, 'IMAGE_FILE_MISSING',                    'Image file is missing.');
define(exports.responseMessages, 'ERROR_IN_EXECUTION',                    'Error in execution.');
define(exports.responseMessages, 'UPLOAD_ERROR',                          'Error in uploading.');
define(exports.responseMessages, 'STATUS_CHANGED_SUCCESSFULLY',           'Status changed successfully.');
define(exports.responseMessages, 'USER_NOT_FOUND',                        'User not found.');
define(exports.responseMessages, 'NO_DATA_FOUND',                         'No data found.');
define(exports.responseMessages, 'USER_DELETED_SUCCESSFULLY',             'User deleted successfully.');
define(exports.responseMessages, 'PASSWORD_CHANGED_SUCCESSFULLY',         'Password changed successfully.');
define(exports.responseMessages, 'EMAIL_ALREADY_EXISTS',                  'Email already registered');
define(exports.responseMessages, 'MOBILE_ALREADY_EXISTS',                 'Mobile already registered');
define(exports.responseMessages, 'EXPIRED_TOKEN',                         'This link has been expired.');
define(exports.responseMessages, 'USER_NAME_ALREADY_EXISTS',              'User Name already Exist');
define(exports.responseMessages, 'INVALID_USER_NAME',                     'This username is not exist.');
define(exports.responseMessages, 'EMAIL_NOT_FOUND',                       'Email not found.');
define(exports.responseMessages, 'OTP_NOT_MATCHED',                       'OTP not matched.');
define(exports.responseMessages, 'INVALID_EMAIL_ID_FORMAT',               'Invalid email id format.');
define(exports.responseMessages, 'INVALID_PASSWORD_FORMAT',               'Password Minimum eight characters.');
define(exports.responseMessages, 'INGREDIENT_ALREADY_EXISTS',             'Ingredient already Exist');
define(exports.responseMessages, 'INGREDIENT_DELETED_SUCCESSFULLY',       'Ingredient deleted successfully.');
define(exports.responseMessages, 'EQUIPMENT_ALREADY_EXISTS',              'Equipment already Exist');
define(exports.responseMessages, 'EQUIPMENT_DELETED_SUCCESSFULLY',        'Equipment deleted successfully.');
define(exports.responseMessages, 'EQUIPMENT_NOT_EXISTS',             	  'Equipment not Exist');
define(exports.responseMessages, 'OTP_SENT',             	 			  'OTP Send to your mail id');
define(exports.responseMessages, 'LOGOUT_SUCCESSFULLY',                   'Logout successfully.');
define(exports.responseMessages, 'RECIPE_NOT_EXISTS',             	      'Recipe not Exist');
define(exports.responseMessages, 'RECIPE_ALREADY_EXISTS',                 'Recipe already Exist');
define(exports.responseMessages, 'IMAGE_UPLOADED',                        'Image Uploaded successfully');
define(exports.responseMessages, 'RECIPE_UPLOADED',                       'Paste Recipe successfully');
define(exports.responseMessages, 'MANUAL_ENTRY_LIST',                     'Manual Ingredient added successfully');
define(exports.responseMessages, 'NAME_ALREADY_EXISTS',                   'This name already Exist');
define(exports.responseMessages, 'OTP_VERIFIED',                           'Otp verified : 1');
define(exports.responseMessages, 'QUOTECALCULATOR_NOT_EXISTS',             'Quote Calculator not Exist');
define(exports.responseMessages, 'REMINDER_NOT_EXISTS',                    'This Reminder not Exist');
define(exports.responseMessages, 'QUOTECALCULATOR_DELETED_SUCCESSFULLY',   'Quote Calculator deleted successfully.');
define(exports.responseMessages, 'REMINDER_DELETED_SUCCESSFULLY',          'This Reminder deleted successfully.');
define(exports.responseMessages, 'REMINDER_ALREADY_EXISTS',                'This reminder already Exist');
define(exports.responseMessages, 'RECIPE_DELETED_SUCCESSFULLY',            'Recipe deleted successfully.');
//FOR FLAGS
define(exports.responseFlags, 'ALREADY_EXIST',                       422);
define(exports.responseFlags, 'PARAMETER_MISSING',                   422);
define(exports.responseFlags, 'INVALID_ACCESS_TOKEN',                401);
define(exports.responseFlags, 'INVALID_MOBILE_NUMBER',               403);
define(exports.responseFlags, 'INVALID_CREDENTIAL',                  403);
define(exports.responseFlags, 'INVALID_EMAIL_ID',                    403);
define(exports.responseFlags, 'WRONG_PASSWORD',                      403);
define(exports.responseFlags, 'ACTION_COMPLETE',                     200);
define(exports.responseFlags, 'LOGIN_SUCCESSFULLY',                  200);
define(exports.responseFlags, 'SHOW_ERROR_MESSAGE',                  400);
define(exports.responseFlags, 'IMAGE_FILE_MISSING',                  422);
define(exports.responseFlags, 'ERROR_IN_EXECUTION',                  404);
define(exports.responseFlags, 'STATUS_CHANGED_SUCCESSFULLY',         200);
define(exports.responseFlags, 'USER_NOT_FOUND',                      204);
define(exports.responseFlags, 'NO_DATA_FOUND',                       204);
define(exports.responseFlags, 'USER_DELETED_SUCCESSFULLY',           200);
define(exports.responseFlags, 'PASSWORD_CHANGED_SUCCESSFULLY',       200);
define(exports.responseFlags, 'USER_NAME_ALREADY_EXISTS',            403);
define(exports.responseFlags, 'INVALID_USER_NAME',                   403);
define(exports.responseFlags, 'EMAIL_NOT_FOUND'  ,                   403);
define(exports.responseFlags, 'OTP_NOT_MATCHED',                     400);
define(exports.responseFlags, 'INVALID_EMAIL_ID_FORMAT',             403);
define(exports.responseFlags, 'INVALID_PASSWORD_FORMAT',             403);
define(exports.responseFlags, 'INGREDIENT_ALREADY_EXISTS',           403);
define(exports.responseFlags, 'INGREDIENT_DELETED_SUCCESSFULLY',     200);
define(exports.responseFlags, 'EQUIPMENT_ALREADY_EXISTS',            403);
define(exports.responseFlags, 'EQUIPMENT_DELETED_SUCCESSFULLY',      200);
define(exports.responseFlags, 'EQUIPMENT_NOT_EXISTS',           	 403);
define(exports.responseFlags, 'OTP_SENT',           				 200);
define(exports.responseFlags, 'LOGOUT_SUCCESSFULLY',           	     200);
define(exports.responseFlags, 'RECIPE_NOT_EXISTS',           	     403);
define(exports.responseFlags, 'Recipe_ALREADY_EXISTS',               403);
define(exports.responseFlags, 'IMAGE_UPLOADED',                      200);
define(exports.responseFlags, 'RECIPE_UPLOADED',                     200);
define(exports.responseFlags, 'MANUAL_ENTRY_LIST',                   200);
define(exports.responseFlags, 'NAME_ALREADY_EXISTS',                 403);
define(exports.responseFlags, 'OTP_VERIFIED',                        200);
define(exports.responseFlags, 'QUOTECALCULATOR_NOT_EXISTS',          403);
define(exports.responseFlags, 'REMINDER_NOT_EXISTS',                 403);
define(exports.responseFlags, 'QUOTECALCULATOR_DELETED_SUCCESSFULLY',200);
define(exports.responseFlags, 'REMINDER_ALREADY_EXISTS',             403);
define(exports.responseFlags, 'REMINDER_DELETED_SUCCESSFULLY',       200);
define(exports.responseFlags, 'RECIPE_DELETED_SUCCESSFULLY',         200);



