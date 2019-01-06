import { getPageInfo } from "./utils";

const resolver = {
  Oportunidad: {
    grupoEmpresarial: ({ idGrupoEmpresarial }, _, { models, user }) =>
      models.GrupoEmpresarial.findById(idGrupoEmpresarial, user),

    lineasProducto: ({id},_,{models,user}) => {
        return models.Oportunidad.findLineasProductoById(id,user)
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
  }
};

export default resolver;
