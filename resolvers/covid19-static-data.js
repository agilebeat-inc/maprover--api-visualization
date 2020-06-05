'use strict';
const fs = require('fs');

const csvFilePath = '../data/us-counties.csv';

try {
  const data = fs.readFileSync(csvFilePath, 'UTF-8');

  let lines = data.split(/\r?\n/);
  let h_line = lines.shift();
  let h = h_line.split(',');
  let rec_list = [];

  lines.forEach((line) => {
    let l = line.split(',');
    let rec_dict = {};
    for (let i = 0; i < h.length; i++) {
      if (h[i] == 'cases' || h[i] == 'deaths') {
        rec_dict[h[i]] = parseInt(l[i]);
      } else {
        rec_dict[h[i]] = l[i];
      }
    }
    rec_list.push(rec_dict);
  });
  console.log(rec_list);
} catch (err) {
  console.error(err);
}