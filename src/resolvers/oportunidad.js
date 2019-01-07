import { getPageInfo } from "./utils";

const resolver = {
  Oportunidad: {
    grupoEmpresarial: ({ idGrupoEmpresarial }, _, { models, user }) =>
      models.GrupoEmpresarial.findById(idGrupoEmpresarial, user),

    lineasProducto: ({ id }, _, { models, user }) => {
      return models.Oportunidad.findLineasProductoById(id, user);
    }, 
    accionesOportunidad: async ({id},searchParams,{models, user}) => {
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

      return {
        nodes: [...comentarios, ...emailsMandados].sort( (a,b) => new Date(b.date) - new Date(a.date) ),
        totalCount: [...comentarios,...emailsMandados].length,
        pageInfo: {hasNextPage: true }
      }

    }
  },

  LineaProductoOportunidadItem: {
    producto: ({ idProductoConPrecio }, _, { models, user }) =>
      models.Producto.findProductoWithPrecioById(idProductoConPrecio, user)
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
  }
};

export default resolver;
