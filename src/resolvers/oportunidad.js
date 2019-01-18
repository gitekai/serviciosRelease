import { getPageInfo } from "./utils";
import { toCursorHash } from "../utils";

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
    createOportunidad: async (
      _,
      { input },
      { models, user, database: { erp2d2 } }
    ) => {
      const { lineasProducto = [], ...oportuindadInput } = input;

      let trans;
      let oportunidad;
      try {
        trans = erp2d2.connect();
        oportunidad = await models.Oportunidad.create(
          oportuindadInput,
          user,
          trans
        );
        const lineasProductosProm = lineasProducto.map(lineaP =>
          models.Oportunidad.addLineaProducto(
            oportunidad.id,
            lineaP,
            user,
            trans
          )
        );

        await Promise.all(lineasProductosProm);
      } catch (e) {
        trans.query("ROLLBACK");
        throw e;
      } finally {
        trans.release();
      }

      return oportunidad;
    },
    createOportunidadWithGrupoEmpresarial: async (
      _,
      { input },
      { models, user, database: { erp2d2 } }
    ) => {
      const {
        grupoEmpresarial = {},
        lineasProducto = [],
        ...oportunidadInput
      } = input;

      let trans;
      let oportunidad;
      try {
        trans = await erp2d2.connect();
        trans.query("BEGIN");
        const ge = await models.GrupoEmpresarial.create(
          grupoEmpresarial,
          user,
          trans
        );

        oportunidad = await models.Oportunidad.create(
          { ...oportunidadInput, idGrupoEmpresarial: ge.id },
          user,
          trans
        );

        const lineasProductosProm = lineasProducto.map(lineaP =>
          models.Oportunidad.addLineaProducto(
            oportunidad.id,
            lineaP,
            user,
            trans
          )
        );

        await Promise.all(lineasProductosProm);

        trans.query("COMMIT");
      } catch (e) {
        trans.query("ROLLBACK");
        throw e;
      } finally {
        trans.release();
      }

      return oportunidad;
    },

    addMandarEmailToOportunidad: async (_, input, { models, user }) => {
      const { idOportunidad, data } = input;
      return models.Oportunidad.addEmailMandado(idOportunidad, data, user);
    },
    addComentarioToOportunidad: async (_, input, { models, user }) => {
      const { idOportunidad, comentario } = input;
      return models.Oportunidad.addComentario(idOportunidad, comentario, user);
    },
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

    removeLineasProductoOportunidad: async (
      _,
      { idsLineaProducto = [] },
      { models, user, database: { erp2d2 } }
    ) => {

      let trans;
      
      try {
        trans = erp2d2.connect();
        trans.query("BEGIN");
        const removeProms = idsLineaProducto.map(idLineaP =>
          models.Oportunidad.removeLineaProducto(idLineaP, user, trans)
        );

        await Promise.all(removeProms);
      } catch (e) {
        trans.query("ROLLBACK");
        throw e;
      } finally {
        trans.release();
      }
    }
  }
};

export default resolver;
