const fs = require('fs');

const SPELL = 0;
const CLASS1 = 1;
const CLASS2 = 2;
const MEANING1 = 3;
const MEANING2 = 4;
const REMARKS = 5;

let fileContent = fs.readFileSync('./anki.csv', 'utf8');
let lines = fileContent.toString().split('\r\n');

let records = [];
for (let i = 0; i < lines.length; i++) {
  records.push(lines[i].split(','));
}

const now = new Date();
records_addcolumn = records.map((record) => {
  record.push(now.getTime());
  record.push(1);
});


let readlineSync = require('readline-sync');

let memoryLevels = {
  1: 1200000,
  2: 3600000,
  3: 8640000,
  4: 25920000,
  5: 172800000
};

function hinshiaruka(head, hinshi) {
  let ret = hinshi ? `${head}:${hinshi} ` : '';
  return ret;
}

let stopFlg = false;
let newRecords = records.map((record) => {
  if(stopFlg){
    return record;
  }
  
  console.log(record[0]);
  let _ = readlineSync.question();
  console.log(`品詞1:${record[1]} 意味1:${record[3]} ${hinshiaruka('品詞2', record[2])} ${hinshiaruka('意味2', record[4])}`);
  let input = readlineSync.question('y: 分かった n: 分からない s: やめる >> ');
  if(input === 's'){
    stopFlg = true;
    return record;
  }

  if(input === 'y') {
    // 記憶レベルがマックス以外の時
    if(Number(record[7]) !== 5){
      record[7] = Number(record[7]) + 1; // レベルを1上げる
    }
    record[6] = Number(record[6]) + memoryLevels[record[7]];
  }
  else {
    // レベルがミニマム以外の時
    if(Number(record[7]) !== 1){
      record[7] = Number(record[7]) - 1; // レベルを1下げる
    }
    record[6] = Number(record[6]) + memoryLevels[record[7]];
  }

  return record;
});

// 新規ファイル作成
fs.writeFileSync('./anki.csv', '', (err) => {
  if(err) {
    console.log(err);
  }
});

// 記憶レベルが高いほど後へソート
newRecords.sort((a, b) => {
  return(Number(a[7]) - Number(b[7]));
});

// ごり押しでCSVへ追加
for(let record of newRecords){
  fs.appendFileSync('./anki.csv', `${record[0]},${record[1]},${record[2]},${record[3]},${record[4]},${record[5]},${record[6]},${record[7]}\r\n`, (err) => {
    if(err) {
      console.log(err);
    }
  });
}


// level.1 20m (1200000ミリ秒)
// level.2 1h (3600000 ミリ秒)
// level.3 1day (8640000 ミリ秒)
// level.4 3days (25920000 ミリ秒)
// level.5 20days (172800000 ミリ秒)
//
// TODO:  特に時間の概念は必要ではないのではないか説
//        もし必要あるなら，時間がマッチした単語だけを表示するほうが良いのではないか
// 
// TODO:  Notionで単語リストに変更がかかった場合，CSVのヘッダーが付加される
//        更新された単語リストにこれまでの記憶レベルを対応させなければいけない
// 
// TODO:  記憶レベルの足し算が文字列連結になっている
//        その結果，秒数に undefined が連結されてしまう
//
// TODO:  anki.csvの最後にゴミが入る
/*
 * spell, class1,lskdjf;lkj class2, meaning1, meaning2, remarks
 */
