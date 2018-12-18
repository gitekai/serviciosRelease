import { gql } from 'apollo-server-express';


export default  `
  
type Comercial implements Node & Usuario {
  id: ID!
  correo: String! 
  nombre: String!
}
  
extend type Query {
  comercial(id: ID!): Comercial 
  comerciales(first: Int, skip: Int): Comerciales
}

extend type Mutation {
  createComercial(username: String!, email: String!, password: String! ) : Comercial!
}

type Comerciales {
  nodes: [Comercial]
  totalCount: Int 
  pageInfo: PageInfo
}

input inputComerciales {
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
