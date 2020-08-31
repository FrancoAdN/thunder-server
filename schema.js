const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLList, GraphQLSchema } = require('graphql')
const querysql = require('./database')

const ChampionType = new GraphQLObjectType({
    name: 'Champions',
    fields: () => ({
        id_champ: { type: GraphQLID },
        champ_name: { type: GraphQLString },
        img: { type: GraphQLString }
    })
})


const RootQuery = new GraphQLObjectType({
    name: 'RootQuery',
    fields: {
        type: new GraphQLList(ChampionType),
        args: {
            lanes: { type: GraphQLList }
        },
        resolve: async (parent, args) => {
            let sql
            if (args.lanes.length === 0) {
                sql = 'SELECT * FROM champions'
            } else {
                sql = 'SELECT * FROM champions'
            }
            return await querysql(sql)

        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery
})