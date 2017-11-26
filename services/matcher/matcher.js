exports.getMatches = function(regex, str) {
    let m;
    var matches = [];

    if((m = regex.exec(str)) !== null) {    
        m.forEach((match, groupIndex) => {
            //console.log(`Found match, group ${groupIndex}: ${match}`);
            matches.push(match);
        });
    }
    //must be full match with the line
    if(matches.length > 0) {
        if(matches[0].trim() !== str.trim()) {
            matches = [];
        }
    }
    return matches;
};

exports.getGlobalMatches = function(regex, str) {
    let m;
    var matches = [];
    while ((m = regex.exec(str)) !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (m.index === regex.lastIndex) {
            regex.lastIndex++;
        }

        // The result can be accessed through the `m`-variable.
        m.forEach((match, groupIndex) => {
            console.log(`Found match, group ${groupIndex}: ${match}`);
            matches.push(match)
        });
    }
    return matches
};
