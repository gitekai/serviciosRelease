import {
  generaWhere,
  checkUserAndScopes,
  checkAllowedItemsReturnedByQuery,
  generaInsertPart
} from "./utils";
import { fromCursorHash } from "../utils";

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
    this.productosAttributes = `
      id,
      id_producto_con_precio "idProductoConPrecio", 
      porcentaje_descuento "porcentajeDescuento", 
      ajuste_precio "ajustePrecioEnDevisa", 
      comentario
      `;

    this.comentariosAttributes = `
      id, id_usuario "idUsuario", created_at "createdAt", comentario
      `;

    this.mandarEmailAttributes = `
      id, created_at "createdAt", id_usuario "idUsuario", subject, comentario, id_to_recepient, cc, bcc, body
      `;
  }

  async findAll(searchParams, user, db = this.db) {
    // COMPROBACION PERMISOS
    checkUserAndScopes(user, ["oportunidad_r"]);
    // COMPROBACION PARAMETROS
    const { first = this.MAX_QUERY_RECORDS, skip = 0, filter } = searchParams;

    checkAllowedItemsReturnedByQuery(
      this.MAX_QUERY_RECORDS,
      first,
      "Oportunidades"
    );

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

  async findAllLineasProducto(idOportunidad, user, db = this.db) {
    // COMPROBACION PERMISOS
    checkUserAndScopes(user, ["oportunidad_r"]);

    // ACCIONES EN LA BBDDnormalize
    let lineasProducto;
    try {
      lineasProducto = await db.query(
        `Select ${this.productosAttributes}
           FROM oportunidad_productos 
           where id_oportunidad = $1
           `,
        [idOportunidad]
      );
    } catch (e) {
      throw e;
    }
    return lineasProducto.rows;
  }

  async findAllComentarios(idOportunidad, searchParams, user, db = this.db) {
    // COMPROBACION PERMISOS
    checkUserAndScopes(user, ["oportunidad_r"]);

    const { first = this.MAX_QUERY_RECORDS, after } = searchParams;
    checkAllowedItemsReturnedByQuery(
      this.MAX_QUERY_RECORDS,
      first,
      "Comentarios Oportunidad"
    );

    let afterQuery = "";
    if (after) {
      afterQuery = `AND created_at < to_timestamp(${fromCursorHash(after)})`;
    }

    // ACCIONES EN LA BBDDn
    let comentarios;
    try {
      comentarios = await db.query(
        `Select ${this.comentariosAttributes}
                FROM comentario_oportunidad 
                where id_oportunidad = $1
                ${afterQuery}
                order by created_at DESC
                limit $2
                `,
        [idOportunidad, first]
      );
    } catch (e) {
      throw e;
    }
    return comentarios.rows;
  }

  async findAllEmailsMandados(idOportunidad, searchParams, user, db = this.db) {
    // COMPROBACION PERMISOS
    checkUserAndScopes(user, ["oportunidad_r"]);

    const { first = this.MAX_QUERY_RECORDS, after } = searchParams;
    checkAllowedItemsReturnedByQuery(
      this.MAX_QUERY_RECORDS,
      first,
      "Emaiils mandados Oportunidad"
    );

    let afterQuery = "";
    if (after) {
      afterQuery = `AND created_at < to_timestamp(${fromCursorHash(after)})`;
    }

    // ACCIONES EN LA BBDDn
    let emailsMandados;
    try {
      emailsMandados = await db.query(
        `Select ${this.mandarEmailAttributes}
               FROM mandar_email_oportunidad 
               where id_oportunidad = $1
               ${afterQuery}
               order by created_at DESC
               limit $2
               `,
        [idOportunidad, first]
      );
    } catch (e) {
      throw e;
    }
    return emailsMandados.rows;
  }

  async create(data, user, db = this.db) {
    //Comprobacion de los permisos
    checkUserAndScopes(user, ["oportunidad_rw"]);

    const {
      fechaProximaAccion,
      idGrupoEmpresarial,
      modoContacto,
      idRazonSocial,
      faseNegociacion,
      estado,
      prioridad,
      fechaPrevistaCierre,
      probalidadGanado,
      porcentajeDescuentoTotal,
      devisaLineasProducto
    } = data;

    const queryHelper = generaInsertPart([
      { fecha_proxima_accion: fechaProximaAccion },
      { id_grupo_empresarial: idGrupoEmpresarial },
      { modo_contacto: modoContacto },
      { id_razon_social: idRazonSocial },
      { fase_negociacion: faseNegociacion },
      { estado },
      { prioridad },
      { fecha_prevista_cierre: fechaPrevistaCierre },
      { probalidad_ganado: probalidadGanado },
      { linea_producto_porcentaje_descuento: porcentajeDescuentoTotal },
      { linea_producto_devisa: devisaLineasProducto }
    ]);

    let oportunidad;
    try {
      oportunidad = await db.query(
        `
        insert into 
          oportunidades(${queryHelper.statement.columnNames})
          values(${queryHelper.statement.questionMarks})
        returning ${this.attributes}
      `,
        [...queryHelper.vars]
      );
    } catch (e) {
      throw e;
    }

    return oportunidad.rows[0];
  }

  async addEmailMandado(idOportunidad, data, user, db = this.db) {
    checkUserAndScopes(user, ["oportunidad_rw"]);

    const { comentario, subject, idToRecepient, cc, bcc, body } = data;

    let mandarCorreo;
    try {
      mandarCorreo = await db.query(
        `
        insert into mandar_email_oportunidad(id_usuario,id_oportunidad,comentario,subject,id_to_recepient,cc,bcc,body)
        values($1,$2,$3,$4,$5,$6,$7,$8)
        returning ${this.mandarEmailAttributes}
      `,
        [
          user.id,
          idOportunidad,
          comentario,
          subject,
          idToRecepient,
          cc,
          bcc,
          body
        ]
      );
    } catch (e) {
      throw e;
    }

    return mandarCorreo.rows[0];
  }

  async addComentario(idOportunidad, comentario, user, db = this.db) {
    checkUserAndScopes(user, ["oportunidad_rw"]);

    let comentarioDB;
    try {
      comentarioDB = await db.query(
        `
        insert into comentario_oportunidad(id_usuario,id_oportunidad,comentario)
        values($1,$2,$3)
        returning ${this.comentariosAttributes}
      `,
        [user.id, idOportunidad, comentario]
      );
    } catch (e) {
      throw e;
    }

    return comentarioDB.rows[0];
  }

  async addLineaProducto(idOportunidad, input, user, db = this.db) {
    checkUserAndScopes(user, ["oportunidad_rw"]);

    const {
      idProductoConPrecio,
      porcentajeDescuento,
      ajustPrecioEnDevisa,
      comentario
    } = input;

    const queryHelper = generaInsertPart([
      { id_oportunidad: idOportunidad },
      { id_producto_con_precio: idProductoConPrecio },
      { porcentaje_descuento: porcentajeDescuento },
      { ajuste_precio: ajustPrecioEnDevisa },
      { comentario }
    ]);

    let productoConPrecio;
    try {
      productoConPrecio = await db.query(
        `
        insert into oportunidad_productos(${queryHelper.statement.columnNames})
        values(${queryHelper.statement.questionMarks})
        returning ${this.productosAttributes}
      `,
        [...queryHelper.vars]
      );
    } catch (e) {
      throw e;
    }

    return productoConPrecio.rows[0];
  }

  async removeLineaProducto(idLineaProducto, user, db = this.db) {
    checkUserAndScopes(user, ["oportunidad_rw"]);

    let count = 0;
    try {
      count = await db.query(
        `delete from oportunidad_productos where id = $1`,
        [idLineaProducto]
      );
    } catch (e) {
      throw e;
    }
    return count === 0 ? false : true;
  }
}

const oportunidadReducer = oportunidad => {
  return;
};

export default Oportunidad;
