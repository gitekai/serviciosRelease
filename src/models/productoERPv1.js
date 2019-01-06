import { generaWhere, checkUserAndScopes } from "./utils";

class ProductoERPv1 {
  constructor(db) {
    this.db = db;
    this.MAX_QUERY_RECORDS = process.env.MAX_QUERY_RECORDS;
    this.attributes = `id, nombre, is_xtraders "isXtraders"`;
  }

  async findAll(searchParams, user, db = this.db) {
    // COMPROBACION PERMISOS
    //checkUserAndScopes(user, ["productoerpv1_r"]);

    // COMPROBACION PARAMETROS
    const {
      first = this.MAX_QUERY_RECORDS,
      skip = 0,
      filter = {}
    } = searchParams;

    // ACCIONES EN LA BBDD
    //const where = generaWhere(filter,3);
    let productoERPv1;

    try {
      productoERPv1 = await db.query(
        `Select ${this.attributes} from productos_obsoletos limit $1 offset $2`,
        [first, skip]
      );
    } catch (e) {
      throw e;
    }
    return productoERPv1.rows;
  }

  async countAll(searchParams, user, db = this.db) {
    // COMPROBACION PERMISOS
    checkUserAndScopes(user, ["productoerpv1_r"]);

    // COMPROBACION PARAMETROS
    const {
      first = this.MAX_QUERY_RECORDS,
      skip = 0,
      filter = {}
    } = searchParams;

    // ACCIONES EN LA BBDD
    //const where = generaWhere(filter,3);
    let productoERPv1;
    try {
      productoERPv1 = await db.query(
        `Select count(*) from productos_obsoletos limit $1 offset $2`,
        [first, skip]
      );
    } catch (e) {
      throw e;
    }
    return productoERPv1.rows;
  }

  async preciosById(id, user, db = this.db) {
    // COMPROBACION PERMISOS
    checkUserAndScopes(user, ["productoerpv1_r"]);

    // COMPROBACION PARAMETROS
    if (!id) {
      throw new Error("no id was provided");
    }
    // ACCIONES EN LA BBDD
    //const where = generaWhere(filter,3);
    let precios;
    try {
      precios = await db.query(
        `
        Select precio, devisa from productos_obsoletos_con_precios 
        where id = $1`,
        [id]
      );
    } catch (e) {
      throw e;
    }
    return precios.rows;
  }

  async create(data, user, db = this.db) {
    // COMPROBACION PERMISOS
    checkUserAndScopes(user, ["productoerpv1_rw"]);

    // COMPROBACION PARAMETROS
    console.log(data);
    const { nombre, precio, devisa, isXtraders = false } = data;
    // ACCIONES EN LA BBDD
    let productoERPv1;
    try {
      productoERPv1 = await db.query(
        ` insert into 
          productos_obsoletos_con_precios(nombre,is_xtraders,precio,devisa) 
          values($1,$2,$3,$4) returning ${this.attributes}, precio, devisa`,
        [nombre, isXtraders, precio, devisa]
      );
    } catch (e) {
      throw e;
    }

    return productoERPv1.rows[0];
  }
}

export default ProductoERPv1;
  