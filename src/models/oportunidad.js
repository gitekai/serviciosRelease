import { generaWhere, checkUserAndScopes } from "./utils";

class Oportunidad {
  constructor(db) {
    this.db = db;
    this.MAX_QUERY_RECORDS = process.env.MAX_QUERY_RECORDS;
    this.attributes = `
        id,
        fecha_proxima_accion "fechaProximaAccion",
        id_grupo_empresarial "idGrupoEmpresarial",
        id_razon_social,
        fase_negociacion "faseNegociacion",
        estado,
        prioridad,
        modo_contacto "modoContacto",
        fecha_prevista_cierre "fechaPrevistaCierre",
        probalidad_ganado "probalidadGanado",
        linea_producto_devisa "devisaLineasProducto",
        linea_producto_porcentaje_descuento "porcentajeDescuentoTotal"

      `;
  }

  async findAll(searchParams, user, db = this.db) {
    // COMPROBACION PERMISOS
    checkUserAndScopes(user, ["oportunidad_r"]);
    // COMPROBACION PARAMETROS
    const { first = this.MAX_QUERY_RECORDS, skip = 0, filter } = searchParams;

    if (first > this.MAX_QUERY_RECORDS) {
      throw new Error(
        `It is not possible to return more than ${
          this.MAX_QUERY_RECORDS
        } records`
      );
    }

    // CREACION DE LOS VALORES PARA LA BBDD A PARTIR DE LOS PARAMETROS
    //const where = generaWhere(filter, 3);

    // ACCIONES EN LA BBDDnormalize
    let oportunidadesDB;
    try {
      oportunidadesDB = await db.query(
        `Select 
          ${this.attributes}
          FROM oportunidades
          limit $1
          offset $2
          `,
        [first, skip]
      );
    } catch (e) {
      throw e;
    }

    return oportunidadesDB.rows;
  }

  async countAll(filter, user, db = this.db) {
    // COMPROBACION PERMISOS
    checkUserAndScopes(user, ["oportunidad_r"]);

    // ACCIONES EN LA BBDD
    let oportunidades;
    try {
      oportunidades = await db.query(`Select count(*) FROM oportunidades `);
    } catch (e) {
      throw e;
    }

    return oportunidades.rows[0].count;
  }

  async findLineasProductoById(idOportunidad, user, db = this.db) {
    // COMPROBACION PERMISOS
    checkUserAndScopes(user, ["oportunidad_r"]);

     // ACCIONES EN LA BBDDnormalize
     let lineasProducto;
     try {
       lineasProducto = await db.query(
         `Select id_producto_con_precio, porcentaje_descuento "porcentajeDescuento", cuota "ajustePrecioEnDevisa", comentario
           FROM oportunidad_productos 
           where id_oportunidad = $1
           `,
         [idOportunidad]
       );
     } catch (e) {
       throw e;
     }
     console.log(lineasProducto.rows)
     return lineasProducto.rows;

  }
}

const oportunidadReducer = oportunidad => {
  return;
};

export default Oportunidad;
