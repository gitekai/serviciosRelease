import { getPageInfo } from "./utils";
import { toCursorHash } from "../utils";
import { pipeResolvers } from "graphql-resolvers";

const grupoEmpresarialWTrans = (_, params, { models, user }) => {
  console.log("asdfffffffffffffffffffffffffffffffffffffffffffparams");
  const { trans, grupoEmpresarial } = params;
  return models.grupoEmpresarial.create(grupoEmpresarial, user, trans);
};

const oportunidadWTrans = (ge, params, { models, user }) => {
  console.log("asdfffffffffffffffffffffffffffffffffffffffffffparams");

  const { trans, ...Oportunidad } = params;
  return models.Oportunidad.create(Oportunidad, user, trans);
};

const addLineasProductoWTrans = async (
  Oportunidad,
  params,
  { models, user }
) => {
  console.log("asdfffffffffffffffffffffffffffffffffffffffffffparams");
  const { trans, lineasProducto } = params;
  const lineasProductoDB = await models.Oportunidad.addLineaProductoToOportunidad(
    Oportunidad.id,
    lineasProducto,
    user,
    trans
  );
  return { Oportunidad, lineasProductoDB };
};

const oportunidadWGrupoEmpresarialWLineaProductos = async (
  _,
  { input },
  { database: { erp2d2 } }
) => {
  let trans;
  let geWithOportunidadWProductos;
  try {
    const geWithOportunidadWProductosResolver = pipeResolvers(
      grupoEmpresarialWTrans,
      oportunidadWTrans,
      addLineasProductoWTrans
    );
    trans = await erp2d2.connect();
    trans.query("BEGIN");
    geWithOportunidadWProductos = await geWithOportunidadWProductosResolver(
      _,
      input
    );
    trans.query("COMMIT");
  } catch (e) {
    trans.query("ROLLBACK");
    throw new Error("error when creating ge with oportunidad");
  } finally {
    trans.release();
  }
  return geWithOportunidadWProductos;
};

const resolver = {
  Oportunidad: {
    grupoEmpresarial: ({ idGrupoEmpresarial }, _, { models, user }) =>
      models.GrupoEmpresarial.findById(idGrupoEmpresarial, user),

    lineasProducto: ({ id }, _, { models, user }) => {
      return models.Oportunidad.findAllLineasProducto(id, user);
    },
    accionesOportunidad: async ({ id }, searchParams, { models, user }) => {
      const comentarioProm = models.Oportunidad.findAllComentarios(
        id,
        searchParams,
        user
      );
      const emailsMandadosProm = models.Oportunidad.findAllEmailsMandados(
        id,
        searchParams,
        user
      );
      const [comentarios, emailsMandados] = await Promise.all([
        comentarioProm,
        emailsMandadosProm
      ]);

      const { first } = searchParams;
      const allActions = [...comentarios, ...emailsMandados];
      if (allActions.length === 0) {
        return [];
      }

      const orderedNodes = allActions
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, first);

      return {
        nodes: orderedNodes,
        totalCount: orderedNodes.length,
        pageInfo: {
          hasNextPage: allActions.length > orderedNodes.length ? true : false,
          endCursor: toCursorHash(
            orderedNodes[orderedNodes.length - 1].createdAt.toString()
          )
        }
      };
    }
  },

  LineaProductoOportunidadItem: {
    producto: async ({ idProductoConPrecio }, _, { models, user }) => {
      const productoPromERPv1 = models.Producto.findProductoERPv1WithPrecioById(
        idProductoConPrecio,
        user
      );

      const [productoConPrecioERPv1] = await Promise.all([productoPromERPv1]);

      return { ...productoConPrecioERPv1 };
    }
  },
  Query: {
    oportunidades: async (_, searchParams, { models, user }) => {
      const { first, skip, filter } = searchParams;

      const oportunidadesProm = models.Oportunidad.findAll(searchParams, user);
      const countProm = models.Oportunidad.countAll(filter, user);

      const [oportunidades, count] = await Promise.all([
        oportunidadesProm,
        countProm
      ]);
      return {
        nodes: oportunidades,
        count: count,
        pageInfo: getPageInfo(count, first, skip)
      };
    }
  },
  Mutation: {
    createOportunidad: async (_, { data }, { database: { erp2d2 } }) => {
      let trans;
      let geWithOportunidadWProductos;
      try {
        const geWithOportunidadWProductosResolver = pipeResolvers(
          grupoEmpresarialWTrans,
          oportunidadWTrans,
          addLineasProductoWTrans
        );
        trans = await erp2d2.connect();
        trans.query("BEGIN");
        
        console.log("WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWww")
        
        geWithOportunidadWProductos = await geWithOportunidadWProductosResolver(
          _,
          {trans,...data}
          );
        trans.query("COMMIT");
      } catch (e) {
        trans.query("ROLLBACK");
        throw new Error("error when creating ge with oportunidad");
      } finally {
        trans.release();
      }
      return geWithOportunidadWProductos;
    },

    addMandarEmailToOportunidad: async (_, input, { models, user }) => {
      const { idOportunidad, data } = input;
      return models.Oportunidad.addEmailMandado(idOportunidad, data, user);
    },
    addComentarioToOportunidad: async (_, input, { models, user }) => {
      const { idOportunidad, comentario } = input;
      return models.Oportunidad.addComentario(idOportunidad, comentario, user);
    },
    addLineaProductoToOportunidad: async (
      _,
      { idOportunidad, input },
      { models, user }
    ) => models.Oportunidad.addLineaProducto(idOportunidad, input, user),

    addLineasProductoToOportunidad: async (
      _,
      { idOportunidad, inputs },
      { models, user, database: { erp2d2 } }
    ) => {
      let trans;
      let allAddedProducts;
      try {
        trans = await erp2d2.connect();
        trans.query("BEGIN");
        const addProductProms = inputs.map(input =>
          models.Oportunidad.addLineaProducto(idOportunidad, input, user, trans)
        );
        allAddedProducts = await Promise.all(addProductProms);
        trans.query("COMMIT");
      } catch (e) {
        trans.query("ROLLBACK");
        throw new Error("Error adding Products");
      } finally {
        trans.release();
      }

      return allAddedProducts;
    },

    removeLineaProductoOportunidad: async (
      _,
      { idLineaProducto },
      { models, user }
    ) => models.Oportunidad.removeLineaProducto(idLineaProducto, user)
  }
};

export default resolver;

/*

async (
      _,
      { data },
      { models, user, database: { erp2d2 } }
    ) => {
      const { grupoEmpresarial, ...rest } = data;
      
      if(grupoEmpresarial && Object.keys(grupoEmpresarial.grupoEmpresarial) !== 0 && ! grupoEmpresarial.idGrupoEmpresarial ){
        throw new Error("Cannot create Oportunity with existing and non existing GE")
      }

      let idGrupoEmpresarial;
      if (
        grupoEmpresarial &&
        grupoEmpresarial.grupoEmpresarial &&
        Object.keys(grupoEmpresarial.grupoEmpresarial) !== 0
      ) {
        let trans;
        let grupoEmpresarialDB;
        try {
          trans = await erp2d2.connect();
          trans.query("BEGIN");
          const ge = await models.GrupoEmpresarial.create(
            grupoEmpresarial.grupoEmpresarial,
            user,
            trans
          );
          idGrupoEmpresarial = ge.id;
          console.log({ idGrupoEmpresarial: ge.id, ...rest });
          grupoEmpresarialDB = await models.Oportunidad.create(
            { idGrupoEmpresarial: ge.id, ...rest },
            user,
            trans
          );
          trans.query("COMMIT");
        } catch (e) {
          trans.query("ROLLBACK");
          throw new Error("could not create GE with oportunity");
        } finally {
          if (trans) {
            trans.release();
          }
        }

        return grupoEmpresarialDB;
      }

      return models.Oportunidad.create(
        { idGrupoEmpresarial: grupoEmpresarial.idGrupoEmpresarial, ...rest },
        user
      );
    },


*/
