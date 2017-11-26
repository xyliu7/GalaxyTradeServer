var express = require('express');
var router = express.Router();

var paragraphProcessor = require('../services/processor/paragraphProcessor.js');
var lineProcessor = require('../services/processor/lineProcessor.js');

/* GET home page. */
router.post('/', function(req, res, next) {
    var inputParagraph = req.body.paragraph;
    console.log("-------------------------------------\n", inputParagraph);

    processResult(inputParagraph, function(result){
        console.log(`last output is ${result}`)
        res.setHeader('Access-Control-Allow-Credentials', true);
        console.log(JSON.stringify(result))
        res.send(JSON.stringify(result));
    })

  //res.render('index', { title: 'Galaxy Trade' });
});

function processResult(inputParagraph, callback) {
    var output;
    console.log("Input: --->\n", inputParagraph);

    //Do paragraph valitation first
    paragraphProcessor.validateParagraph(inputParagraph, function(result){

        if(result.isValid) {
            console.log("This paragraph is valid");
            lineProcessor.processInput(inputParagraph, function(result){
                callback(result);
            });
            
        } else {
            console.log("invalid")
            callback(result);
        }
        
    });
};

module.exports = router;
