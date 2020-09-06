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
        champions: {
            type: new GraphQLList(ChampionType),
            args: {
                lanes: { type: new GraphQLList(GraphQLString) }
            },
            resolve: async (parent, args) => {
                let sql
                if (args.lanes.length === 0) {
                    sql = 'SELECT * FROM champions'
                } else {
                    let lanes = ''
                    for (let index = 0; index < args.lanes.length; index++) {
                        const lane = args.lanes[index];
                        if (index !== args.lanes.length - 1)
                            lanes += `"${lane}",`
                        else
                            lanes += `"${lane}"`
                    }
                    sql = `SELECT * FROM champions WHERE id_champ IN(SELECT DISTINCT id_champ FROM lanes WHERE lane_name IN(${lanes}))`

                }
                return await querysql(sql)

            }
        }

    }
})

module.exports = new GraphQLSchema({
    query: RootQuery
})