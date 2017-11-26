var convertor = require('../convertor/convertor.js')
var matcher = require('../matcher/matcher.js')
var eol = require('eol');

var unitDict = {};
var metalDict = {};
var Roman = ['M','D','C','L','X','V','I'];

exports.processInput = function(input, callback) {
    //Make sure value is cleared (one user only)
    if(unitDict || metalDict) {
        unitDict = {};
        metalDict = {};
    }

    //slpit input paragraph to lines
    var inputLines = eol.split(input);
    var outputLines = [];
    var hasQuestion = false;


    const unitDefineRegex = /([a-z]+)\sis\s(\w)/;
    const metalDefineRegex =/(.+[a-zA-Z]+)\sis\s([1-9]?[0-9]+)\sCredits/;
    const valueQRegex = /how much is ([a-z\s]+)\s\?/;
    const creditQRegex = /how many Credits is ([a-zA-Z\s]+)\s\?/;

    console.log("SplitLines: -------------->\n");
    for(var i=0; i<inputLines.length; ++i) {
        var line = inputLines[i].toString();
        var isQuestion = false;
        console.log(line, " (origin line)\n");
        if(/how much/.test(line)) {
            console.log("contains how much")
        }

        if(line.indexOf('?') !== -1
            || (/how much/.test(line)) 
            || (/how many/.test(line)) ){
            isQuestion = true;
            hasQuestion = true;
            console.log("this is a question.");
        }
        
        //check if this line is unit value difinition 
        var unitMatches = matcher.getMatches(unitDefineRegex, line);
        if(unitMatches.length === 3) {
            console.log("This is an unit value defenition.\n");

            var defRes = unitDefineProcess(unitMatches);

            if(defRes === -1) {
                callback({
                    isValid: false,
                    reason: `Duplicated unit definition.`
                });
                return; 
            }  
            if(defRes === -2) {
                callback({
                    isValid: false,
                    reason: `Invalid unit name (should be lower case).`
                });
                return; 
            }  
            if(defRes === -3) {
                callback({
                    isValid: false,
                    reason: `Value is not a Roman.`
                });
                return; 
            }

            continue;     
        } 

        //check if this line is metal value definition
        var metalMatches = matcher.getMatches(metalDefineRegex, line);
        if(metalMatches.length === 3) {
            console.log("This is a metal value definition");

            var defRes = metalDefineProcess(metalMatches);

            if(defRes === -1) {
                callback({
                    isValid: false,
                    reason: `Incomplete expression.`
                });
                return;
            }
            if(defRes === -2) {
                callback({
                    isValid: false,
                    reason: `Invalid metal name, first character should be upper case.`
                });
                return;
            }
            if(defRes === -3) {
                callback({
                    isValid: false,
                    reason: `Credits cannot be 0.`
                });
                return;
            }
            if(defRes === -4) {
                callback({
                    isValid: false,
                    reason: `Duplicated metal definition.`
                });
                return;
            }
            if(defRes === -5) {
                callback({
                    isValid: false,
                    reason: `Undefined unit.`
                });
                return;
            }

            continue;
        }

        if(!isQuestion) {
            //if this line is a definition, then it has to match rather unitDef or metal define
            if(unitMatches.length === 0 && metalMatches.length === 0) {
                console.log("Invalid definition line.");
                callback({
                    isValid: false,
                    reason: `Invalid definition.`
                });
                return;
            }
        }

        //check if this is a value question 
        var valueQMatches = matcher.getMatches(valueQRegex, line);
        if(valueQMatches.length === 2) {
            //group 0:full match, group 1: units
            console.log("valueQMatches: \n", valueQMatches);

            var res = valueQProcess(valueQMatches);
            if(res === -1) {
                callback({
                    isValid: false,
                    reason: `Undefined unit.`
                });
                return;
            }

            console.log("This is a value question, the answer is: \n", res);
            outputLines.push(res);
            continue;
        }

        //check if this line is credit question
        var creditQMatches = matcher.getMatches(creditQRegex, line);
        if(creditQMatches.length === 2) {
            //group 0: full match, group 1: metal units
            console.log("creditQMatches: \n", creditQMatches);

            var res = creditQProcess(creditQMatches);
        
            if(res === -1) {
                callback({
                    isValid: false,
                    reason: `Incomplete expression.`
                });
                return;
            }
            if(res === -2) {
                callback({
                    isValid: false,
                    reason: `Undefined metal.`
                });
                return;
            }
            if(res === -3) {
                callback({
                    isValid: false,
                    reason: `Undefined unit.`
                });
                return;
            }

            console.log("This is a credit question, and the answer is: \n", res);
            outputLines.push(res);
            continue;
        }

        var invalidOp = "I have no idea what you are talking about";
        outputLines.push(invalidOp);
    }

    if(!hasQuestion) {
        callback({
            isValid: false,
            reason: `No question entered.`
        }); 
    }

    callback({
        isValid: true,
        reason: outputLines
    });

    console.log(`validate line output: \n${outputLines.join('\n')}`);
    //return outputLines.join('\n');
};

unitDefineProcess = function(unitMatches) {
    //group 0: full match, group 1: unit, group 2: roman
    console.log("unitMatches: \n", unitMatches);  
    console.log("UNITDICT: ", unitDict);  
    if(unitMatches[1] in unitDict) {
        console.log("Unit appeared already.");
        return -1;
    }

    if(!(/[a-z]/.test(unitMatches[1]))) {
        //all lower case
        console.log("Invalid unit name");
        return -2;
    }

    if(Roman.indexOf(unitMatches[2]) === -1) {
        console.log("Undifined Roman.");
        return -3;
    }

    unitDict[unitMatches[1]] = unitMatches[2];
    console.log("unitDict: \n", unitDict);
    return true;
};

metalDefineProcess = function(metalMatches) {
    //group 0: full match, group 1: metal units, group 2: credits
    console.log("metalMatches: \n", metalMatches);
    var values = metalMatches[1].split(" ");
    if(values.length < 2){
        //at least 2 words, metalName and unit
        console.log("Incomplete expression");
        return -1;
    }

    var unitStr = '';
    var units = 0;
    var credits = metalMatches[2]
    var metalName = values[values.length-1];
    if(!(/[A-Z]/.test(metalName[0]))) {
        //metal name first char must be captain
        console.log("Invalid metal name");
        return -2;
    }

    if(credits === '0') {
        console.log("Credits cannot be 0");
        return -3;
    }

    if(metalName in metalDict) {
        console.log("Metal appeared already.");
        return -4;
    } 
          
    for(let i=0; i<values.length-1; ++i) {
        if(!(values[i] in unitDict)){
            console.log("Undefined unit.")
            return -5;
        }else {
            unitStr += unitDict[values[i]];
        }
    }
    units = convertor.ConvertRToA(unitStr);
    var metalPrice = credits/units;
    metalDict[metalName] = metalPrice;
    console.log("metalPrice: " , metalDict);
    return true;
};

valueQProcess = function(valueQMatches) {
    var valueStr = '';
    var value = 0;
    var units = valueQMatches[1].split(" ");
    for(let i=0; i<units.length; ++i) {
        if(!(units[i] in unitDict)) {
            console.log("Undifined unit");
            return -1;
        }
        valueStr += unitDict[units[i]];
    }
    value = convertor.ConvertRToA(valueStr);
    var res = valueQMatches[1] + " is " + value;
    return res;
};

creditQProcess = function (creditQMatches) {
    var unitStr = '';
    var units = 0;
    var credits = 0;
    var values = creditQMatches[1].split(" ");
    var metalName = values[values.length-1]; 

    if(values.length < 2){
        //at least 2 words, metalName and unit
        console.log("Incomplete expression");
        return -1;
    }

    if(!(metalName in metalDict)) {
        console.log("Undefined metal.");
        return -2;
    }           

    for(let i=0; i<values.length-1; ++i) {
        console.log("unit: ", values[i]);
        if(!(values[i] in unitDict)) {
            console.log("Undifined unit");
            return -3;
        }
        unitStr += unitDict[values[i]];
    }

    //convert unit to roman, then convert to arabic 
    units = convertor.ConvertRToA(unitStr);
    credits = units * metalDict[metalName];
    var res = creditQMatches[1] + " is " + credits + " Credits";
    return res;
};

