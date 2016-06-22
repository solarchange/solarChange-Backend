  /**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `api/responses/notFound.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on configuring custom routes, check out:
 * http://sailsjs.org/#!/documentation/concepts/Routes/RouteTargetSyntax.html
 */

module.exports.routes = {

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` (or `views/homepage.jade`, *
  * etc. depending on your default view engine) your home page.              *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/

  '/': {
    view: 'homepage'
  },


  'post /user/initiate_pass_reset': {controller:'user', action:'initiate_pass_reset'},

  'post /user/password_reset':{controller:'user', action:'password_reset'},

  'post /user/add':{controller:'user', action:'add_new_user'},

  'post /user/activate':{controller:'user', action:'activate_user'},

  'post /user/login': {controller:'user', action:'user_login'},

  'post /user/social_share' : {controller:'user', action:'social_share'},

  'get /user/balance_history': {controller:'user', action:'get_balance_history'},

  'get /user/admin_subscribe': {controller:'user', action:'subscribe_and_get'},

  'get /user/social_share': {controller:'user', action:'get_social_shares'},



  'post /solar_device/add': {controller:'granting', action:'register_new_solar_device'},

  'get /solar_device/user_status': {controller:'solar_device', action:'get_user_solar_status'},

  'get /solar_device/solar_status/:solar_id':{controller:'solar_device', action:'get_solar_device_status'},

  'get /solar_device/admin_subscribe':{controller:'solar_device', action:'subscribe_and_get'},



  'post /public_key/add': {controller:'public_key', action:'add_key'},  

  'get /public_key/blockchain_data/:pk': {controller:'public_key', action:'get_blockchain_data'},

  'get /public_key/get_known': {controller:'public_key', action:'get_known'},

  'post /public_key/add_known': {controller:'public_key', action:'add_known'},


  'post /admin/approve_solar': {controller:'granting', action:'approve_and_submit'},

  'post /admin/reject': {controller:'solar_device', action:'reject_locally'},

  'post /admin/login': {controller:'auth', action:'login'},

  'post /admin/get_file':{controller: 'solar_device', action:'access_file'},

  'GET /admin/login': {view: 'admin_login'},

  'get /admin/admin/:page': {controller:'admin', action:'get_to_view'},

  'get /admin/inst_file': {controller:'solar_device', action:'the_file'},


  'post /granting/granting_feedback': {controller:'granting', action:'granting_judgement' },

  'get /granting/installation_file/:user/:file': {controller: 'file_handler', action:'download_proof_file'},


  'post /transaction/block_info' : {controller: 'transaction', action:'block_info'},


  'post /organization/add' : {controller:'organization', action: 'add_new'},

  'get /organization/get_orgs' : {controller: 'organization', action:'get_and_subscribe'},


  'post /mass_input/read_file' : {controller:'mass_input' , action:'read_bulk_from_file'},







  // ------------------------------------ 


  // 'post /trequest/new': { controller: 'trequest', action:'initNew'},

  // 'post /transaction/wtf' :{ controller:'transaction', action:'blockChain_input'},


  //'GET /admin/dashboard_solar':{view:'dashboard_solar'},



  'post /login': { controller: 'auth', action:'login'},


  /// ------- TRYING THINGS

  //'post /trequest/huh':{controller:}


  // 'get /admin/solars': {view: 'dashboard_solar'},

  // 'get /admin/social': {view: 'dashboard_user_social'},

  // 'get /admin/known': {view: 'dashboard_known_addresses'},



  'GET /solar_device/form':{view:'solar_device_form'},

  'GET /exp':{controller:'trequest',action:'exp_start_req' },

  'GET /user_try1':{controller:'user', action:'tryNewUser'},

  'GEt /req_try': {controller: 'trequest', action:'start_req_try'},

  'GET /logintry': { controller: 'auth', action:'trylogin'},


  /***************************************************************************
  *                                                                          *
  * Custom routes here...                                                    *
  *                                                                          *
  * If a request to a URL doesn't match any of the custom routes above, it   *
  * is matched against Sails route blueprints. See `config/blueprints.js`    *
  * for configuration options and examples.                                  *
  *                                                                          *
  ***************************************************************************/

};
