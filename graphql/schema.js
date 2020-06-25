'use strict';
const graphql = require('graphql');
const _ = require('lodash');
const moment = require('moment');
const { GraphQLSchema, GraphQLObjectType, GraphQLList, GraphQLString, GraphQLInt, GraphQLBoolean, GraphQLFloat } = graphql;
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

const csvFilePath = './data/covid_significant_events.csv';
const statesData = dataLoader.getData(csvFilePath);

const StateType = new GraphQLObjectType({
  name: 'State',
  fields: () => ({
    state: { type: GraphQLString },
    county: { type: GraphQLString },
    date: { type: GraphQLString },
    cases: { type: GraphQLInt },
    deaths: { type: GraphQLInt },
    rolling_new_cases_std: { type: GraphQLInt },
    rolling_new_cases_extreme_high: { type: GraphQLFloat },
    rolling_new_cases_extreme_low: { type: GraphQLFloat },
    new_cases_significance: { type: GraphQLString },
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
        ncs_filter: { type: GraphQLString },
        start: { type: GraphQLString },
        end: { type: GraphQLString }
      },
      resolve(parent, args) {
        if ('state' in args || 'county' in args || 'start' in args || 'end' in args || 'ncs_filter' in args) {
          let retset = _.filter(statesData, function (o) {
            let finalIsKept = true
            let odate = moment(o.date);
            let start = moment(args.start);
            let end = moment(args.end);
            let isAfterStart = (start < odate);
            let isBeofreOrEqualToEnd = (odate <= end);
            let is_true_ncs_filter = (o.ncs_filter == "True")
            //console.log(isBeofreOrEqualToEnd);
            for (let arg in args) {
              if (arg == "county")
                finalIsKept = finalIsKept && (o.county == args.county);
              if (arg == "state")
                finalIsKept = finalIsKept && (o.state == args.state);
              if (arg == "start")
                finalIsKept = finalIsKept && isAfterStart;
              if (arg == "end")
                finalIsKept = finalIsKept && isBeofreOrEqualToEnd;
              if (arg == "ncs_filter")
                  finalIsKept = finalIsKept && (args.ncs_filter == o.new_cases_significance);
            }
            return finalIsKept;
          });
          return retset;
        } 
        return statesData
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery
})