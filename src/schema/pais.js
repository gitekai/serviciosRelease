import { gql } from 'apollo-server-express';


export default gql`
type Pais {
  id: ID!
  nombre: String!
  codigo: String
}

extend type Query {
  pais(id: ID!): Pais
  paises(filter: inputFilterPaises, first: Int, skip: Int): Paises
}

type Paises {
nodes: [Pais]
totalCount: Int 
pageInfo: PageInfo
}

input inputFilterPaises{
AND: [inputFilterPaises!]
OR: [inputFilterPaises!]

nombre_regex: String
nombre_not: String 
codigo_equals: String
}
`;
