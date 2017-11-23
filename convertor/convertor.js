exports.ConvertRToA = function(roman){
    var r_nums = getRnums();
    var a_nums = getAnums();
    var remainder = roman.toString();
    var arabic = 0, count = 0, test = remainder;

    var len=r_nums.length;
    for ( var i=1;  i<len; ++i ){
        var rCount = 0;
        var numchrs = r_nums[i].length;
        while( remainder.substr(0,numchrs) === r_nums[i]){
            if(rCount >= 3){
                //more than 3 same character is not allowed
                console.log('invalid number, more than 3 same characters');
                return -1;
            } 
            if((count++) > 30){
                //string should not be longer than 30
                console.log("string is longer than 30");
                return -1;
            } 
            arabic += a_nums[i];
            //subtract valid substring
            remainder = remainder.substr(numchrs,remainder.length-numchrs);
            rCount++;
        }
        if(remainder.length <= 0) break;
    }
    if(remainder.length !==0 ){
        console.log("invalid truncating ...")
        console.log(roman + " INVALID truncating to "+test.replace(remainder,'') );
    }
    if( (0 < arabic) && (arabic < 4000) ){
        return arabic;
    }
    else{
        return -1;
    } 
}

function getRnums() {
    var r_nums = Array();
    r_nums[1] = 'M';
    r_nums[2] = 'CM';
    r_nums[3] = 'D';
    r_nums[4] = 'CD';
    r_nums[5] = 'C';
    r_nums[6] = 'XC';
    r_nums[7] = 'L';
    r_nums[8] = 'XL';
    r_nums[9] = 'X';
    r_nums[10] = 'IX';
    r_nums[11] = 'V';
    r_nums[12] = 'IV';
    r_nums[13] = 'I';
    return r_nums;
}

function getAnums() {
    var a_nums = Array();
    a_nums[1] = 1000;
    a_nums[2] = 900;
    a_nums[3] = 500;
    a_nums[4] = 400;
    a_nums[5] = 100;
    a_nums[6] = 90;
    a_nums[7] = 50;
    a_nums[8] = 40;
    a_nums[9] = 10;
    a_nums[10] = 9;
    a_nums[11] = 5;
    a_nums[12] = 4;
    a_nums[13] = 1;
    return a_nums;
}
