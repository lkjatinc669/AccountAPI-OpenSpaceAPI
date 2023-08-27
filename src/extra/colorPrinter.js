var colors = require('colors');

colors.enable()

function warningLine(val) {
    console.log(val.underline.red);
}

function warning(val){
    console.log(val.red);
}

function info(val){
    console.log(val.green);
}

function infoLine(val){
    console.log(val.underline.green);
}

module.exports = {warningLine, warning, infoLine, info}