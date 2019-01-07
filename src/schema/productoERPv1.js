export default `

type ProductoERPv1 implements Producto & Node {
    id: ID!
    nombre: String!
    precios: [PrecioProducto!]!
    isXtraders: Boolean!
}

type ProductoERPv1ConPrecio implements Node & ProductoConPrecio {
  id: ID!
  nombre: String!
  precio: Float!
  devisa: DevisaProductoEnum!
  isXtraders: Boolean!
}

extend type Query {
    productosERPv1(filter: productoERPv1FilterInput, first: Int, skip: Int): ProductosERPv1! 
}

type ProductosERPv1 {
    nodes: [ProductoERPv1]
    totalCount: Int!
    pageInfo: PageInfo! 
}

input productoERPv1FilterInput {
    nombre_regex: String!
}

extend type Mutation {
    createProductoERPv1(data: createProductoERPv1Input! ): ProductoERPv1!
    updateProductoERPv1(data: updateProductoERPv1Input): ProductoERPv1!
    deleteProductoERPv1(id:ID!): Int!
}

input createProductoERPv1Input {
    nombre:String!
    isXtraders: Boolean
    precio: Float! 
    devisa: DevisaProductoEnum!
}

input updateProductoERPv1Input {
    nombre:String
    isXtraders: Boolean
}

`;