/**
 * UserController
 *
 * @description :: Server-side logic for managing google api
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var fs = require('fs');
var readline = require('readline');
var google = require('googleapis');
var googleAuth = require('google-auth-library');
var SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
var TOKEN_PATH = 'config/google/sheets.googleapis.com-nodejs-quickstart.json';

var AUTH;


module.exports = {

    /**
     * Create an OAuth2 client with the given credentials, and then execute the
     * given callback function.
     *
     * @param {Object} credentials The authorization client credentials.
     * @param {function} callback The callback to call with the authorized client.
     */
    authorize: function(credentials){
        if(credentials.web){
            var clientSecret = credentials.web.client_secret;
            var clientId = credentials.web.client_id;
            var redirectUrl = credentials.web.redirect_uris[0];
        } else {
            var clientSecret = credentials.client_secret;
            var clientId = credentials.client_id;
            console.log(oauth2Client);
        }
        var auth = new googleAuth();
        var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

        // Check if we have previously stored a token.
        fs.readFile(TOKEN_PATH, function(err, token) {
            if (err) {
                sails.controllers.googleapi.getNewToken(oauth2Client);
            } else {
                oauth2Client.credentials = JSON.parse(token);
                AUTH = oauth2Client;
            }
        });
    },
    /**
     * Get and store new token after prompting for user authorization, and then
     * execute the given callback with the authorized OAuth2 client.
     *
     * @param {google.auth.OAuth2} oauth2Client The OAuth2 client to get token for.
     * @param {getEventsCallback} callback The callback to call with the authorized
     *     client.
     */
    getNewToken: function(oauth2Client) {
        var authUrl = oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: SCOPES
        });
        console.log('Authorize this app by visiting this url: ', authUrl);
        var rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        rl.question('Enter the code from that page here: ', function(code) {
            rl.close();
            oauth2Client.getToken(code, function(err, token) {
                if (err) {
                    console.log('Error while trying to retrieve access token', err);
                    return;
                }
                oauth2Client.credentials = token;
                sails.controllers.googleapi.storeToken(token);
                sails.controllers.googleapi.authorize(oauth2Client);
            });
        });
    },

    /**
     * Store token to disk be used in later program executions.
     *
     * @param {Object} token The token to store to disk.
     */
    storeToken: function(token) {
//        fs.writeFile(TOKEN_PATH, JSON.stringify(token));
        console.log('Token stored to ' + TOKEN_PATH);
    },

    export_devices: function(req,res){
        async.waterfall([
            function(cb){
                //authorize in google
                fs.readFile('config/google/client_secret.json', function processClientSecrets(err, content) {
                    if (err) {
                        console.log('Error loading client secret file: ' + err);
                        return;
                    }
                    // Authorize a client with the loaded credentials, then call the
                    // Google Sheets API.
                    sails.controllers.googleapi.authorize(JSON.parse(content));
                    return cb(null);
                });
            }, function(cb){
                console.log('start');
                Solar_device.find({},function(err,devices){
                    if(err) return cb(err);
                    console.log('devices done');
                    return cb(null,devices);
                });
            }, function(all_devices,cb){
                User.find({},function(err,users){
                    if(err) return cb(err);
                    console.log('users done');
                    return cb(null,all_devices,users);
                });
            }, function(all_devices,all_users,cb){
                var sheets = google.sheets('v4');
                sheets.spreadsheets.values.get({
                    auth: AUTH,
                    spreadsheetId: '1p2TOkAO92FW2EbVOSotmxI7wLLSIHJpndP3TgWcbrHA',
                    range: "list1!A2:M"
                }, function(err, response) {
                    if (err) {
                        console.log('The API returned an error: ' + err);
                        res.json({status:"error", value: 'The API returned an error: ' + err});
                        return cb(err);
                    }
                    var rows = response.values;
                    if (rows.length == 0) {
                        console.log('No data found.');
                    } else {
                        return cb(null,all_devices,all_users,rows.length);
                    }
                });
            }, function(all_devices,all_users,count_items,cb){
                var req_devices = req.body.devices;
                var data_array = new Array();
                var device;
                var currentDate = new Date();
                var year = currentDate.getFullYear();
                var month = currentDate.getMonth() + 1;
                var day = currentDate.getDate();
                if(month.toString().length == 1) {
                    var month = '0'+month;
                }
                if(day.toString().length == 1) {
                    var day = '0'+day;
                }
                var date = day + "/" + month + "/" + year;
                for(var i = 0; i < req_devices.length;i++){
                    for(var j = 0; j < all_devices.length; j++){
                        if(req_devices[i] == all_devices[j].id){
                            var found_device = all_devices[j];
                            for(var z = 0; z < all_users.length; z++){
                                if(found_device.user == all_users[z].id){
                                    var found_user = all_users[z];
                                    var date_of_installation = new Date(found_device.date_of_installation).getTime() / 1000;
                                    var location = 'http://backend-solarchange-dev.eu-gb.mybluemix.net/granting/installation_file'+found_device.file_info.location.split('/proofFiles')[1];
                                    var first_data_array = [date,count_items + i,found_device.firstName,found_device.lastName,found_user.email,date_of_installation,'=TO_DATE('+date_of_installation+'/(60*60*24)+"1/1/1970")',found_device.address,found_device.city,found_device.state,found_device.country,found_device.zipcode,found_device.nameplate,location,found_device.public_key];
                                    data_array.push(first_data_array);
                                    device = found_device;
                                }
                            }
                        }
                    }
                    if(i == (req_devices.length - 1)){
                        return cb(null,data_array,all_devices);
                    }
                }
                console.log('info done');
            }, function(data_array,all_devices,cb){
                var sheets = google.sheets('v4');
                sheets.spreadsheets.values.append({
                    auth: AUTH,
                    spreadsheetId: '1p2TOkAO92FW2EbVOSotmxI7wLLSIHJpndP3TgWcbrHA',
//                    spreadsheetId: '1zq8giHbRIvGs3zqQzka6Vlx0TZxsyVvMuOyczPg78qw',
                   // range: "גיליון1!A2:M",
                    range: "list1!A2:M",
                    valueInputOption: 'USER_ENTERED',
                    resource: {
                        "values": data_array
                    }
                },function (err, response){
                    if(err) {
                        console.log(err);
                        res.json({status:"error", value: 'The API returned an error: ' + err});
                        return cb(err);
                    }
                    return cb(null, all_devices);
                });
            }, function(all_devices,cb){
                var req_devices = req.body.devices;
                for(var i = 0; i < req_devices.length;i++){
                    for(var j = 0; j < all_devices.length; j++){
                        if(req_devices[i] == all_devices[j].id){
                            var found_device = all_devices[j];
                            found_device.exported = true;
                            found_device.save();
                        }
                    }
                    if(i == (req_devices.length - 1)){
                        res.json({status:"ok"});
                        return cb(null);
                    }
                }
            }
        ]);
    }
}