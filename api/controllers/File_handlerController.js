/**
 * File_handlerController
 *
 * @description :: Server-side logic for managing file_handlers
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var fs = require('fs');
var path = require('path');
var pkgcloud = require('pkgcloud');
module.exports = {


    download_proof_file: function(req, res) {

        if (process.env.VCAP_SERVICES) {
            var env = JSON.parse(process.env.VCAP_SERVICES);
            if(env['Object-Storage']){
                var creditionals = env['Object-Storage'][0]['credentials'];
                var config = {
                    provider: 'openstack',
                    useServiceCatalog: true,
                    useInternal: false,
                    keystoneAuthVersion: 'v3',
                    authUrl: creditionals.auth_url,
                    tenantId: creditionals.projectId,    //projectId from credentials
                    domainId: creditionals.domainId,
                    username: creditionals.username,
                    password: creditionals.password,
                    region: creditionals.region   //dallas or london region
                }
            }
        } else {
            console.error('VCAP_SERVICES is undefined please set property in "api/controllers/File_handlerController.js"');
            var config = {
                provider: 'openstack',
                useServiceCatalog: true,
                useInternal: false,
                keystoneAuthVersion: 'v3',
                authUrl: '',
                tenantId: '',    //projectId from credentials
                domainId: '',
                username: '',
                password: '',
                region: ''   //dallas or london region
            }
        }

        var storageClient = pkgcloud.storage.createClient(config);

        storageClient.auth(function(err) {
            if (err) {
                console.error(err);
                return res.json(err);
            }
            else {
                storageClient.download({
                    container: 'proof',
                    remote: req.param('file')
                }).pipe(res);
            }
        });

//        console.log('Servicing an installation file '+req.param('user')+'/'+req.param('file'))
//
//        var file = req.param('file');
//
//        var filePath = path.resolve(sails.config.appPath, "docs/proofFiles/"+req.param('user'), file);
//
//        fs.exists(filePath,function(exists){
//            if (exists) return fs.createReadStream(filePath).pipe(res);
//            return res.json('File does not exist');
//        });
    }


};