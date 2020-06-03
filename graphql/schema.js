const graphql = require('graphql');
const _ = require('lodash');
const {GraphQLSchema, GraphQLObjectType, GraphQLList, GraphQLString} = graphql;

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
        "date": "2020-05-12",
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
        state_county: {type: GraphQLString},
        state: {type: GraphQLString},
        county: {type: GraphQLString},
        date: {type: GraphQLString},
        cases: {type: GraphQLString},
        deaths: {type: GraphQLString}
    }),
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        state: {
            type: GraphQLList(StateType),
            args: {state: {type: GraphQLString}},
            resolve(parent, args) {
                let retset = _.filter(statesData, function(o) {return (o.state == args.state)});
                return retset;
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery
})