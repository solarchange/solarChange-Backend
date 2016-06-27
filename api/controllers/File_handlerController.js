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

        console.log('yo yo this is file file handling yo yo ')
        console.log(req.body)

        // Get the URL of the file to download
        var file = req.param('file');

        console.log(file)

        // Get the file path of the file on disk
        var filePath = path.resolve(sails.config.appPath, "docs/proofFiles/"+req.param('user'), file);

        console.log(filePath)

        // Should check that it exists here, but for demo purposes, assume it does
        // and just pipe a read stream to the response.
        fs.exists(filePath,function(exists){
            console.log('THIS IS THE FILELLLLLLLL')
            if (exists) return fs.createReadStream(filePath).pipe(res);
            console.log('no no no no no')
            console.log(exists)
            return res.json('File does not exist');
        }); 
    }


};