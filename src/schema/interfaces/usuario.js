import { gql } from 'apollo-server-express';

export default `

  interface Usuario {
    correo: String! 
    nombre: String! 
  }
  extend type Query {
    signInUser(email: String!, password: String) : Token! 
  }
`;