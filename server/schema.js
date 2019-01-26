const {
    GraphQLSchema,
    GraphQLObjectType
} = require('graphql');

const RootQuery = new GraphQLObjectType({
    name: "RootQuery",
    fields: {}
});

const RootMutation = new GraphQLObjectType({
    name: "RootMutation",
    fields: {}
});

const RootSubscription = new GraphQLObjectType({
    name: "RootSubscription",
    fields: {}
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: RootMutation,
    subscription: RootSubscription
});