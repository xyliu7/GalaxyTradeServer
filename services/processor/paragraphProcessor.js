var lineProcessor = require('./lineProcessor.js');
var matcher = require('../matcher/matcher.js')

exports.validateParagraph = function(paragraph, callback) {

    //Invalid Characters are not allowed
    let regex = /[^a-zA-Z0-9\?\s]/g;
    let m;
    var invalidCharacters = matcher.getGlobalMatches(regex, paragraph);

    if(invalidCharacters.length !== 0) {
        callback({
            isValid: false,
            reason: `Bad input (illegal character)`
        });
        return;
    }

    //Consecutive new lines are not allowed
    regex = /\r?\n(\s){0,}\r?\n/;
    if(regex.test(paragraph)) {
        callback({
            isValid: false,
            reason: `Input contains empty lines`
        });
        return;
    }

    // Consecutive space are not allowed
    regex = /  (\w|\?)/;
    if(regex.test(paragraph)) {
        callback({
            isValid: false,
            reason: `Input contains consecutive spaces`
        });
        return;
    }

    regex = /[a-zA-Z][0-9]/;
    if(regex.test(paragraph)) {
        callback({
            isValid: false,
            reason: `Word contains number is not allowed`
        });
        return;
    }

    regex = /[0-9][a-zA-Z]/;
    if(regex.test(paragraph)) {
        callback({
            isValid: false,
            reason: `Word contains number is not allowed`
        });
        return;
    }

    callback({
        isValid: true
    });
};
