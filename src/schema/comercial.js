import { gql } from 'apollo-server-express';


export default  `
  
type Comercial implements Node & Usuario {
  id: ID!
  correo: String! 
  nombre: String!
}
  
extend type Query {
  comercial(id: ID!): Comercial 
  comerciales(first: Int, skip: Int, filter: comercialFilterInput): Comerciales
}

extend type Mutation {
  createComercial(username: String!, email: String!, password: String! ) : Comercial!
  updateComercial(data: comercialInput! ): Comercial!
}


type Comerciales {
  nodes: [Comercial]
  totalCount: Int 
  pageInfo: PageInfo
}

input comercialInput {
  id: ID!
  nombre: String
  email: String
  password: String
}

input comercialFilterInput{
  nombre_regex: String 
}

`;


/*
extend type Comercial {
   grupoEmpresarialConnection(
    first: Int
    skip: Int
  ): ComercialGEConnection
}

type ComercialGEConnection {
  edges: [ ComercialGEEdge ]
  totalCount: Int
  pageInfo: PageInfo!
}

type ComercialGEEdge {
  node: GrupoEmpresarial 
}
`;*/
