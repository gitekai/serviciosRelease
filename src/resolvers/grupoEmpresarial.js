import { getPageInfo } from "./utils";

const resolver = {
  GrupoEmpresarial: {
    comercial: (GE, _, { models, user }) =>
      models.Comercial.findByID(GE.idComercial, user),
    pais: (GE,_,{models,user}) => 
      models.Pais.findByID(GE.idPais,user),
  },

  Query: {
    gruposEmpresariales: async (_, searchParams, { models, user }) => {
      const { first, skip, filter } = searchParams;

      const gesProm = models.GrupoEmpresarial.findAll(searchParams, user);
      const gesCountProm = models.GrupoEmpresarial.countAll(filter, user);

      const [ges, gesCount] = await Promise.all([gesProm, gesCountProm]);

      return {
        nodes: ges,
        totalCount: gesCount,
        pageInfo: getPageInfo(gesCount, first, skip)
      };
    }
  },

  Mutation: {
    createGrupoEmpresarial: (_, { data }, { models, user }) =>
      models.GrupoEmpresarial.create(data, user)
  }
};

export default resolver;
