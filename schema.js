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
                    for (let lane of args.lanes) {
                        lanes += `"${lane}",`
                    }
                    lanes = lanes.split(0, -1)
                    sql = `SELECT * FROM champions WHERE id_champ IN(SELECT DISTINCT id_champ FROM lanes WHERE lane_name IN(${lanes}))`
                    console.log(sql)
                }
                return await querysql(sql)

            }
        }

    }
})

module.exports = new GraphQLSchema({
    query: RootQuery
})