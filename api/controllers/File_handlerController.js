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

        // Get the URL of the file to download
        var file = req.param('file');

        // Get the file path of the file on disk
        var filePath = path.resolve(sails.config.appPath, "docs/proofFiles/"+req.param('user'), file);

        // Should check that it exists here, but for demo purposes, assume it does
        // and just pipe a read stream to the response.
        fs.exists(file,function(exists){
            if (exists) return fs.createReadStream(filePath).pipe(res);
            return res.json('File does not exist');
        }); 
    }


};