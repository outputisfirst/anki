const fs = require('fs');

const SPELL = 0;
const CLASS1 = 1;
const CLASS2 = 2;
const MEANING1 = 3;
const MEANING2 = 4;
const REMARKS = 5;

let fileContent = fs.readFileSync('./input.csv', 'utf8');
let lines = fileContent.toString().split('\r\n');

let records = [];
for (let i = 0; i < lines.length; i++) {
  records.push(lines[i].split(','));
}

console.log(records[0], records[1], records[2]);

// TODO: 元のCSVファイルに忘却レベル（数値）を保存するための列を作る
/*
 * spell, class1, class2, meaning1, meaning2, remarks
 */
