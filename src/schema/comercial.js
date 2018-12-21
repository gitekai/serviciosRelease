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
input comercialFilterInput{
  nombre_regex: String 
}

extend type Mutation {
  createComercial(data: createComercialInput! ) : Comercial!
  updateComercial(data: updateComercialInput!, id: ID! ) : Comercial!
  deleteComercial(id:ID!): Boolean! 
}
type Comerciales {
  nodes: [Comercial]
  totalCount: Int 
  pageInfo: PageInfo
}

input createComercialInput {
  username: String!
  email: String!
  password: String!
}

input updateComercialInput {
  nombre: String
  email: String
  password: String
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
