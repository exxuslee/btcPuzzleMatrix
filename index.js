const secp256k1 = require("./secp256k1.js");
const crypto = require('crypto');
const fs = require('fs');

const target_hash160 = '2f396b29b27324300d0c59b17c3abc1835bd3dbb';

let i,j;

function time(){
    let x = new Date(Date.now());
    return x.toString();
}

function save(data, i) {
    fs.writeFile(data.privk+i+'.txt', JSON.stringify(data.privk), function (err) {
        if (err) return console.log(err);
    });
}


function newTask() {
    // const low = BigInt('0x8000000000000000');
    // const hig = BigInt('0xffffffffffffffff');
    // const all_variable = '140 737 488 355 327';
    // const address = "16jY7qLJnxb7CHZyqBP8qca9d51gAjyXQN";
    // const address2 = '00 3ee4133d991f52fdf6a25c9834e0745ac74248a4 41544743';

    let abc = "fecdba9876543210".split("");
    let token = "000000000000000000000000000000000000000000000000";
    token += abc[Math.floor(Math.random() * 8)];
    for (let i = 49; i < 58; i++) token += abc[Math.floor(Math.random() * abc.length)];
    token += '000000';
    return token; //Will return a 32 bit "hash"

}

let msg = {};
msg.privk = newTask();
console.log("New task: "+time()+" "+ msg.privk);


function terminal_cursor(inp_str, i) {
    let out = '';
    for (let ii in inp_str) {
        if (inp_str[ii] === '0') out += '\x1b[32m0';    //green
        if (inp_str[ii] === '1') out += '\x1b[34m1';    //blue
        if (inp_str[ii] === ' ') out += '\x1b[0m ';     //reset
    }
    console.log(i.toString(16).padStart(6, '0')+': '+out);
    // console.log('        '+convert('3ee4133d991f52fdf6a25c9834e0745ac74248a4'));
}

function terminal_cursor2(inp_str) {
    let original = convert(target_hash160);
    let out = '';
    for (let ii in inp_str) {
        if (inp_str[ii] === original[ii]) out += '\x1b[32m'+inp_str[ii];    //green
        if (inp_str[ii] !== original[ii]) out += '\x1b[31m'+inp_str[ii];    //red
        //if (inp_str[ii] === ' ') out += '\x1b[0m ';     //reset
    }
    out+='\x1b[0m';
    console.log(i.toString(16).padStart(6, '0')+': '+out);
}

function convert(input) {
    function hex2bin(hex){
        return (parseInt(hex, 16).toString(2)).padStart(4, '0');
    }
    let output = "";
    for (let i = 0; i < input.length; i++) {
        output += hex2bin(input.charAt(i))+'';
    }
    return output
}

let pubk = secp256k1.getPublicKey(msg.privk, false);
//console.log('pubk\t\t'+pubk);
let pointX = '';
let pointY = '';
let pubk_comrress ='';

if (parseInt(pubk.substr(128),16) % 2) pubk_comrress = '03'+ pubk.substr(2, 64);
else pubk_comrress = '02'+ pubk.substr(2, 64);
//console.log('pubk_comrress\t\t'+pubk_comrress);

for (i=0; i < 16777216; i++){
//    console.log('pubk\t\t\t\t'+pubk);
    let sha = crypto.createHash('sha256').update(Buffer.from(pubk_comrress, 'hex')).digest('hex');
    let hash160 = crypto.createHash('ripemd160').update(Buffer.from(sha, 'hex')).digest('hex');
//    console.log('hash160\t\t\t\t'+hash160);
//                console.log(chalk.green(' '+convert(hash160)));
//                terminal_cursor(convert(hash160), i);
    terminal_cursor2(convert(hash160));

    if (hash160 === target_hash160) {
//        console.log("Worker found! %s", hash160);
        save(msg,i);
    }
    pointX = '0x'+pubk.substr(2, 64);
    pointY = '0x'+pubk.substr(66);
    let point = new secp256k1.Point(BigInt(pointX),BigInt(pointY));
    point = point.add(secp256k1.Point.BASE);
//        console.log('pointX\t\t\t\t'+point.x.toString(16));
//        console.log('pointY\t\t\t\t'+point.y.toString(16));
    let newX ='';
    let newY ='';
    for (j=point.x.toString(16).length; j<64;j++) newX += '0';
    for (j=point.y.toString(16).length; j<64;j++) newY += '0';
    newX += point.x.toString(16);
    newY += point.y.toString(16);
    pubk = '04'+ newX + newY;
//        console.log('pubk\t\t\t\t'+pubk);
    if (parseInt(pubk.substr(128),16) % 2) pubk_comrress = '03'+ pubk.substr(2, 64);
    else pubk_comrress = '02'+ pubk.substr(2, 64);
//        console.log('pubk_comrress\t\t'+pubk_comrress);

}
console.log('Need new task');



