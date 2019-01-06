import bcrypt from "bcryptjs";
import { createToken } from "./utils";

class Usuario {
  constructor(db) {
    this.db = db;
  }

  async authenticate({ email = "", password = "", secret }, db = this.db) {
    // Aquí todavia no puede haber comprobacion del usuario ya que no está logeado
    let dbRes;
    try {
      dbRes = await db.query(
        `Select id, email, password, nombre from usuarios where email = $1`,
        [email]
      );
      const dbUser = dbRes.rows[0];

      if (!dbUser) {
        throw new Error("Authentication Failure");
      }

     /* if (!(await bcrypt.compareSync(password, dbUser.password))) {
        throw new Error("Authentication Failure");
      }*/

      const permisosDB = await db.query(
        `
      select p.nombre as perm 
        FROM usuarios u 
        join roles_de_usuario ru on u.id = ru.id_usuario 
        join permisos_en_roles pr on pr.id_rol = ru.id_rol 
        join permisos p on p.id = pr.id_permiso 
        where u.id = $1
      `,
        [dbUser.id]
      );

      const permisos = permisosDB.rows.map(permObj => permObj.perm);
      return createToken(dbUser, permisos, secret);
    } catch (e) {
      throw e;
    }

    return null;
  }

  async changePassword(password, user, pool = this.db) {
    // COMPROBACION PERMISOS
    //checkUserAndScopes(user, ["comerciales_rw"]);

    let dbUser;
    try {
      const salt = bcrypt.genSaltSync(10);
      const passwordHash = bcrypt.hashSync(password, salt);
      dbUser = await pool.query(
        `update usuarios set password = $1 where id = $2
         returning id,nombre,email
         `,
        [passwordHash, user.id]
      );
    } catch (e) {
      throw e;
    }

    return dbUser.rows[0];
  }
}

export default Usuario;
