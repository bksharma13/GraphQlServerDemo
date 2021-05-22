// Imports: Express
import express from 'express';
const APP = express();

// Imports: GraphQL
import SERVER from './Schema.js';
const port = process.env.PORT|| 9000


// Middleware: GraphQL
SERVER.applyMiddleware({
   app: APP
 });

   //register middleware
   //app.use(bodyParser.json() , cors())
   app.listen(port, () =>  console.log(`server is up and running at ${port}`))

   // Exports
export default APP;

   // Adding Type Definitions
const typeDefinition = 
   `type Query  {
      greeting: String
   }`


// Adding resolver
const  resolverObject = {
   Query : {
      greeting: () => 'Hello GraphQL  From TutorialsPoint !!'
   }
}

//const {makeExecutableSchema} = require('graphql-tools')
//const schema = makeExecutableSchema({typeDefs:typeDefinition, resolvers:resolverObject})

//const {graphqlExpress, graphiqlExpress} = require('apollo-server-express')

//create routes for graphql and graphiql
//   app.use('/graphql',graphqlExpress({schema}))
   
//   app.use('/graphiql',graphiqlExpress({endpointURL:'/graphql'}))


   