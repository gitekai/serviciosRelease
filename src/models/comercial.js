import { checkUserAndScopes, passwordToHash, generaSETPart, generaWhere } from "./utils";

class Comercial {
  constructor(db) {
    this.db = db;
    this.MAX_QUERY_RECORDS = process.env.MAX_QUERY_RECORDS;
    this.comercialAttributes = "id,nombre,email";
  }

  async countAll(filter, user, pool = this.db) {
    // COMPROBACION PERMISOS
    checkUserAndScopes(user, ["comercial_r"]);

    // ACCIONES EN LA BBDD
    let dbComerciales;
    const where = generaWhere(filter);
    try {
      dbComerciales = await pool.query(`Select count(*) from comerciales ${where.statement}`,[...where.values]);
      return dbComerciales.rows[0].count;
    } catch (e) {
      throw new Error("Error in Comerciales");
    }
  }
  async findAll(data, user, pool = this.db) {
    // COMPROBACION PERMISOS
    checkUserAndScopes(user, ["comercial_r"]);

    // COMPROBACION PARAMETROS
    const { filter, first = 10, skip = 0 } = data;

    // ACCIONES EN LA BBDD
    const where = generaWhere(filter,3); 
    let dbComerciales;
    try {
      dbComerciales = await pool.query(
        `Select ${
          this.comercialAttributes
        }  
        from comerciales 
        ${where.statement}
        limit $1 offset $2`,
        [first, skip,...where.values]
      );
      return dbComerciales.rows;
    } catch (e) {
      throw new Error("Error in Comerciales");
    }
  }

  async findByID(id, user, pool = this.db) {
    // COMPROBACION PERMISOS
    checkUserAndScopes(user, ["comercial_r"]);

    // ACCIONES EN LA BBDD
    let dbComercial;
    try {
      dbComercial = await pool.query(
        `Select ${this.comercialAttributes} from comerciales  where id = $1`,
        [id]
      );

      return dbComercial.rows[0];
    } catch (err) {
      throw new Error("Could not query Comerciales");
    }
  }

  async create({ password, username, email }, user, pool = this.db) {
    // COMPROBACION PERMISOS
    checkUserAndScopes(user, ["comercial_rw"]);

    let dbUser;
    try {
      const passwordHash = passwordToHash(password);
      dbUser = await pool.query(
        `INSERT INTO comerciales(email,nombre,password) 
         values($1,$2,$3)
         returning ${tihs.comercialAttributes}
         `,
        [email, username, passwordHash]
      );
    } catch (e) {
      throw e;
    }

    return dbUser.rows[0];
  }

  async update({data,id}, user, db = this.db) {
    // COMPROBACION PERMISOS
    checkUserAndScopes(user, ["comercial_rw"]);
    // COMPROBACION PARAMETROS
    const { password, nombre, email } = data;

    if(!id){
      throw new Error("No id provided for update");
    }

    // CREACION DE LOS VALORES PARA LA BBDD A PARTIR DE LOS PARAMETROS
    const passwordHash = passwordToHash(password);
    const setObj = generaSETPart({email,password:passwordHash,nombre})

    // ACCIONES EN LA BBDD
    
    let dbComercial;
    try {
      dbComercial = await db.query(
        `UPDATE comerciales 
          SET ${setObj.query}
          WHERE id = $1
          RETURNING ${this.comercialAttributes}
      `,
        [id,...setObj.vars]
      );
    } catch (e) {
      throw e;
    }

    return dbComercial.rows[0];
  }
}

export default Comercial;
