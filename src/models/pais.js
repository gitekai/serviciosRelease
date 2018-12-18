import {generaWhere,checkUserAndScopes} from './utils'

class Pais {

  constructor(db) {
    this.db = db;
    this.MAX_QUERY_RECORDS = process.env.MAX_QUERY_RECORDS;
  }

  async findAll(searchParams,user,db = this.db) {
    // COMPROBACION PERMISOS
    // // De momento Paises se puede acceder sin restricciones
        
    // COMPROBACION PERMISOS
    checkUserAndScopes(user, [["pais_r","comercial_r"],"comercial_rw"]);

    // COMPROBACION PARAMETROS
    const { first = this.MAX_QUERY_RECORDS, skip = 0, filter={} } = searchParams;

    // ACCIONES EN LA BBDD
    const where = generaWhere(filter,3);
    let paises;
    try {
      paises = await db.query(`Select * from paises ${where.statement} limit $1 offset $2`, [
        first,
        skip,
        ...where.values
      ]);
    } catch (e) {
      throw e;
    }
    return paises.rows;
  }
  async countAll(filter={},user, db = this.db) {
    // COMPROBACION PERMISOS
    // // De momento Paises se puede acceder sin restricciones
    checkUserAndScopes(user, ["pais_r"]);

    // ACCIONES EN LA BBDD
    const where = generaWhere(filter,1);
    let paises;
    try {
      paises = await db.query(`Select count(*) from paises ${where.statement}`,[...where.values]);
    } catch (e) {
      throw e;
    }
    return paises.rows[0].count;
  }

  async findByID(id, user,db = this.db ) {
    // COMPROBACION PERMISOS
    // // De momento Paises se puede acceder sin restricciones
    checkUserAndScopes(user, ["pais_r"]);

    // ACCIONES EN LA BBDD
    let pais;
    try {
      pais = await db.query("Select * from paises where id = $1", [id]);
    } catch (e) {
      throw e;
    }

    return pais.rows[0];
  }

}

export default Pais;
