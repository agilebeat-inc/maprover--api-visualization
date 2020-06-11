'use strict';
const graphql = require('graphql');
const _ = require('lodash');
const moment = require('moment');
const { GraphQLSchema, GraphQLObjectType, GraphQLList, GraphQLString, GraphQLInt } = graphql;
const fs = require('fs');

const dataLoader = (function () {
  var rec_list = [];

  function loadDataFromFs(data_path) {
    try {
      const data = fs.readFileSync(data_path, 'UTF-8');

      let lines = data.split(/\r?\n/);
      let h_line = lines.shift();
      let h = h_line.split(',');
      var rec_list = [];

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
    getData: function (URI) {
      if (rec_list.length == 0) {
        rec_list = loadData(URI);
      }
      return rec_list;
    }
  }
})();

const csvFilePath = './data/us-counties.csv';
const statesData = dataLoader.getData(csvFilePath);

const StateType = new GraphQLObjectType({
    name: 'State',
    fields: () => ({
        state: { type: GraphQLString },
        county: { type: GraphQLString },
        date: { type: GraphQLString },
        cases: { type: GraphQLInt },
        deaths: { type: GraphQLInt }
    }),
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        query: {
            type: GraphQLList(StateType),
            args: {
                state: { type: GraphQLString },
                county: { type: GraphQLString },
                start: { type: GraphQLString },
                end: { type: GraphQLString }
            },
            resolve(parent, args) {
                let retset = _.filter(statesData, function (o) {
                  let odate = moment(o.date);
                  let start = moment(args.start);
                  let end = moment(args.end);
                  let isAfterStart = (start < odate);
                  let isBeofreOrEqualToEnd = (odate <= end);
                  if ('county' in o) {
                    return ((o.state == args.state) && (o.county == args.county) && isAfterStart && isBeofreOrEqualToEnd);
                  } 
                  return ((o.state == args.state) && isAfterStart && isBeofreOrEqualToEnd);
                });
                return retset;
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery
})