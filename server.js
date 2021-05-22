import pg from 'pg';
import { ApolloServer } from 'apollo-server-express';
import { makeSchemaAndPlugin } from 'postgraphile-apollo-server';
import express from 'express';
import expressPlaygroundExpress from 'graphql-playground-middleware-express'

const app = express();
const PORT = 9000;
const basepath =  '/specialUrl'
const graphiqlPath = "/playground"
const expressPlayground = expressPlaygroundExpress.default

const pgPool = new pg.Pool({
      "user": "watuser",
      "database": "YourDatabaseName",
      "password": "YourDatabasePassword",
      "host": "postgresql-server.drscloud.net",
     "port" : 5432
    });

const {schema, plugin} = await makeSchemaAndPlugin(
        pgPool,
        'YourDatabaseSchema',
        { dynamicJson: true }
    );


// Example middleware
function authMiddleware(req, res, next) {  
   var path =  req.path.toLowerCase()
   if(path === graphiqlPath.toLowerCase())
   {
      next()
   }
   else
   {
   if(path !== basepath.toLowerCase())
   {
      return res.status(403).json({
         status: 'error',
         message: 'Bad request on path : ' + path
       });
   }

   if(req === undefined || req.headers === undefined
      || req.headers.user === undefined)
      {
         return res.status(500).json({
            status: 'error',
            message: 'Internal Server Error, possibly header is missing'
          });
      }
   
   console.log("Middleware intercepting a request.");
   console.log(req.headers.user);
   if(req.headers.user === "123")
   {   
      next();
   }
   else
   {
      return res.status(401).json({
         status: 'error',
         message: 'User not authorized to execute query'
       });
   }
}
 }

// Mount middleware on the GraphQL endpoint
app.use("/", authMiddleware);

const server = new ApolloServer({schema, plugins: [plugin], playground: true});
server.applyMiddleware({ app: app, path: basepath });

app.get(graphiqlPath, expressPlayground({ endpoint: basepath }))

app.listen(PORT, () => {
      console.log(`Apollo Server ready at ${PORT}`);
})