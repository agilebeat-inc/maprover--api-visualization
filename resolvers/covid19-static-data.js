'use strict';
const fs = require('fs');

const dataLoader = (function () {
  const csvFilePath = '../data/us-counties.csv';
  var rec_list = [];

  function loadDataFromFs(data_path) {
    try {
      const data = fs.readFileSync(data_path, 'UTF-8');

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
      return [];
    }
    return rec_list;
  }

  function loadData(URI) {
    return loadDataFromFs(URI);
  };

  return {
    getData: function (model_name) {
      if (rec_list.length == 0) {
        rec_list = loadData(csvFilePath);
      }
      return rec_list;
    }
  }
})();

const csvFilePath = '../data/us-counties.csv';
let statesData = dataLoader.getData(csvFilePath);
console.log(statesData);
