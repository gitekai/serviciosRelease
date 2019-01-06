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



`