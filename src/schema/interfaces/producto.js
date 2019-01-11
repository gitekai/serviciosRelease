export default `

interface Producto {
    nombre: String! 
    precios: [PrecioProducto]
}

type PrecioProducto {
    devisa: DevisaProductoEnum! 
    precio: Float!    
}

enum DevisaProductoEnum {
    EUR
    USD
}

interface ProductoConPrecio {
  id: ID!
  nombre: String! 
  precio: Float!
  devisa: DevisaProductoEnum!
}

extend type Query {
  productoConPrecio(idProductoConPrecio: ID!): ProductoConPrecio!
}




`