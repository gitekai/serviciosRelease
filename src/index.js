import 'dotenv/config';
import cors from 'cors'
import express from 'express'; 
import {ApolloServer, AuthenticationError} from 'apollo-server-express';
import jwt from 'jsonwebtoken'

import schema from './schema';
import resolvers from './resolvers';
import models from './models';



const app = express();
app.use(cors());

const getUserFromToken = async req => {
  const token = req.headers['x-token']; 
  let verifiedToken; 
  if(token){
    try{
      verifiedToken = await jwt.verify(token, process.env.SECRET)
    } catch(e){
      throw new AuthenticationError('Your token is not valid. Maybe it has expired');
    }
    return verifiedToken;
  }
}; 

const server = new ApolloServer({
  typeDefs: schema,
  resolvers, 
  context: async({req}) => {
    const user = await getUserFromToken(req);

    return {
      models, 
      secret: process.env.SECRET,
      user,
    }
  }
})

server.applyMiddleware({app, path: '/graphql'}); 

app.listen({port: process.env.DEFAULT_PORT}, () => {
  console.log(`Server is listening on http://localhost:${process.env.DEFAULT_PORT}/graphql`)
})