/**
 * File_handlerController
 *
 * @description :: Server-side logic for managing file_handlers
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var fs = require('fs');
var path = require('path');
module.exports = {

    download_proof_file: function(req, res) {

        console.log('Servicing an installation file '+req.param('user')+'/'+req.param('file'))

        var file = req.param('file');

        var filePath = path.resolve(sails.config.appPath, "docs/proofFiles/"+req.param('user'), file);

        fs.exists(filePath,function(exists){
            if (exists) return fs.createReadStream(filePath).pipe(res);
            return res.json('File does not exist');
        }); 
    }


};