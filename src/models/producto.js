import { generaWhere, checkUserAndScopes } from "./utils";

class Producto {
  constructor(db) {
    this.db = db;
    this.MAX_QUERY_RECORDS = process.env.MAX_QUERY_RECORDS;
    this.attributes = `id, nombre`;
    this.productoConPrecioAttributes =
      'id_producto "idProducto", nombre, devisa, precio, is_xtraders "isXtraders", id_producto_con_precio "idProductoConPrecio"';
  }

  async findAll(searchParams, user, db = this.db) {
    // COMPROBACION PERMISOS
    checkUserAndScopes(user, ["producto_r"]);

    // COMPROBACION PARAMETROS
    const {
      first = this.MAX_QUERY_RECORDS,
      skip = 0,
      filter = {}
    } = searchParams;

    // ACCIONES EN LA BBDD
    //const where = generaWhere(filter,3);
    let producto;

    try {
      producto = await db.query(
        `Select ${this.attributes} from productos limit $1 offset $2`,
        [first, skip]
      );
    } catch (e) {
      throw e;
    }
    return producto.rows;
  }

  async countAll(searchParams, user, db = this.db) {
    // COMPROBACION PERMISOS
    checkUserAndScopes(user, ["producto_r"]);

    // COMPROBACION PARAMETROS
    const {
      first = this.MAX_QUERY_RECORDS,
      skip = 0,
      filter = {}
    } = searchParams;

    // ACCIONES EN LA BBDD
    //const where = generaWhere(filter,3);
    let producto;
    try {
      productoERPv1 = await db.query(
        `Select count(*) from productos limit $1 offset $2`,
        [first, skip]
      );
    } catch (e) {
      throw e;
    }
    return producto.rows;
  }

  async findProductoWithPrecioById(idProductoConPrecio, user, db = this.db) {
    // COMPROBACION PERMISOS
    checkUserAndScopes(user, ["producto_r"]);

    if (!idProductoConPrecio) {
      throw new Error("productowithprecio cannot be found without id");
    }

    let productoConPrecio;
    try {
      productoConPrecio = await db.query(
        `Select ${this.productoConPrecioAttributes} from productos_con_precios 
        where id_producto_con_precio = $1 `,
        [idProductoConPrecio]
      );
    } catch (e) {
      throw e;
    }

    return productoConPrecio.rows[0];
  }
}

export default Producto;
