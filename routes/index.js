var express = require('express');
var router = express.Router();

var paragraphProcessor = require('../services/processor/paragraphProcessor.js');

router.post('/', function(req, res, next) {
	var inputParagraph = req.body.paragraph;
    console.log("-------------------------------------\n", inputParagraph);

	processResult(inputParagraph, function(result){
		console.log(`output is ${result}`)
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
            //process input line by line
            
        } else {
            console.log("invalid")
            callback(result);
        }
        
    });
};

module.exports = router;
