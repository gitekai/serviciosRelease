import grupoEmpresarial from "../schema/grupoEmpresarial";
import { generaWhere, checkUserAndScopes } from "./utils";
import {pipe, normalizeWhiteSpace, upperCaseFirstLetters, upperCaseHiphenFollowed} from '../utils';
import { format } from "url";


class GruposEmpresarial {
  constructor(db) {
    this.db = db;
    this.MAX_QUERY_RECORDS = process.env.MAX_QUERY_RECORDS;
    this.GEAttributes = `
    id, 
    id_contacto "idContacto", 
    nombre, 
    id_pais "idPais", 
    id_comercial "idComercial", 
    desactivado_desde "desactivadoDesde", 
    id_erp "idErp"`;
  }

  async findAll(searchParams, user, db = this.db) {
    // COMPROBACION PERMISOS
    checkUserAndScopes(user, ["ge_r"]);
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

    const where = generaWhere(filter, 3);

    // ACCIONES EN LA BBDDnormalize
    let gruposEmpresarialesDB;
    try {
      gruposEmpresarialesDB = await db.query(
        `Select 
        ${this.GEAttributes}
        FROM grupos_empresariales
        ${where.statement}
        limit $1
        offset $2
        `,
        [first, skip, ...where.values]
      );
    } catch (e) {
      throw e;
    }
    return gruposEmpresarialesDB.rows;
  }

  async countAll(filter, user, db = this.db) {
    // COMPROBACION PERMISOS
    checkUserAndScopes(user, ["ge_r"]);

    // ACCIONES EN LA BBDD
    let gruposEmpresariales;
    const where = generaWhere(filter);
    try {
      gruposEmpresariales = await db.query(
        `Select count(*) FROM grupos_empresariales ${where.statement}`,
        [...where.values]
      );
    } catch (e) {
      throw e;
    }

    return gruposEmpresariales.rows[0].count;
  }

  async create(data, user, db = this.db) {
    // COMPROBACION PERMISOS
    checkUserAndScopes(user, ["ge_rw"]);
    const { nombre, idPais, idComercial, idErp } = data;
    // COMPROBACION PARAMETROS
    // // Nada que comprobar (all allowed)

    // CREACION DE LOS VALORES PARA LA BBDD A PARTIR DE LOS PARAMETROS
    const formattedNombre = normalizeCompanyName(nombre);
    // ACCIONES EN LA BBDD
    let grupoEmpresarial;
    try {
      grupoEmpresarial = await db.query(
        `insert into grupos_empresariales(nombre,id_pais,id_comercial,id_erp) 
        values($1, $2, $3,$4) 
        RETURNING ${this.GEAttributes}`,
        [formattedNombre, idPais, idComercial, idErp]
      );
    } catch (e) {
      throw e;
    }
    return grupoEmpresarial.rows[0];
  }
}

const normalizeCompanyName = (string) => {
  return pipe(
    normalizeWhiteSpace,
    upperCaseFirstLetters,
    upperCaseHiphenFollowed,
  )(string);
}

export default GruposEmpresarial;
