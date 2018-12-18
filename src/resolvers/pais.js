import { getPageInfo } from "./utils";

const resolver =  {
  Query: {
    paises: async (_, searchParams, context) => {
      const countProm = context.models.Pais.countAll(searchParams,context.user);
      const paisesProm = context.models.Pais.findAll(
        searchParams,
        context.user
      );

      const [paises, totalCount] = await Promise.all([paisesProm, countProm]);
      const { first, skip } = searchParams;
      return {
        nodes: paises,
        totalCount,
        pageInfo: getPageInfo(totalCount, first, skip)
      };
    },

    pais: (_, { id }, context) => {
      return context.models.Pais.findByID(context.db.pool, id, context.user);
    }
  }
};


export default resolver;