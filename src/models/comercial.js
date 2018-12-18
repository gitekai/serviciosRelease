import bcrypt from 'bcryptjs'; 

import {checkUserAndScopes} from './utils';

class Comercial {
  constructor(db) {
    this.db = db;
    this.MAX_QUERY_RECORDS = process.env.MAX_QUERY_RECORDS;
  }

  async countAll(user, pool = this.db) {
    // COMPROBACION PERMISOS
    checkUserAndScopes(user, ["comercial_r"]);

    // ACCIONES EN LA BBDD
    let dbComerciales;
    try {
      dbComerciales = await pool.query("Select count(*) from comerciales");
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
    let dbComerciales;
    try {
      dbComerciales = await pool.query(
        "Select *  from comerciales limit $1 offset $2",
        [first, skip]
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
        "Select * from comerciales  where id = $1",
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
    try{
      const salt =  bcrypt.genSaltSync(10);
      const passwordHash = bcrypt.hashSync(password, salt);
      dbUser = await pool.query(
        `INSERT INTO comerciales(email,nombre,password) 
         values($1,$2,$3)
         returning id,nombre,email
         `,
        [email, username, passwordHash]
      );
    } catch(e){
      throw e ; 
    }

    return dbUser.rows[0]; 
  }

  
}

export default Comercial;
