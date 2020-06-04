const graphql = require('graphql');
const _ = require('lodash');
const moment = require('moment');
const { GraphQLSchema, GraphQLObjectType, GraphQLList, GraphQLString, GraphQLInt } = graphql;

//dummy data
var statesData = [
    {
        "cases": "1",
        "county": "Butler",
        "date": "2020-03-28",
        "deaths": "0",
        "fips": "21031",
        "state": "Kentucky",
        "state_county": "Kentucky_Butler"
    },
    {
        "cases": "200",
        "county": "Butler",
        "date": "2020-04-12",
        "deaths": "6",
        "fips": "21031",
        "state": "Kentucky",
        "state_county": "Kentucky_Butler"
    },
    {
        "cases": "200",
        "county": "Butler",
        "date": "2020-05-12",
        "deaths": "6",
        "fips": "21031",
        "state": "Virginia",
        "state_county": "Kentucky_Butler"
    }
];

const StateType = new GraphQLObjectType({
    name: 'State',
    fields: () => ({
        state_county: { type: GraphQLString },
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
                    console.log(o.state, args.state, (o.state == args.state), isAfterStart, isBeofreOrEqualToEnd);
                    return ((o.state == args.state) && isAfterStart && isBeofreOrEqualToEnd)
                });
                return retset;
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery
})