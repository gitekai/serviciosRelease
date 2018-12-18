import { getPageInfo } from "./utils";

const resolver = {
  Mutation: {
    createComercial: (_,inputData,{user,models}) => 
     models.Comercial.create(inputData,user)
  },

  Query: {
    comercial: (_, { id }, context) =>
      context.models.Comercial.findByID(id, context.user),
    comerciales: async (_, searchParams, context) => {
      const { first, skip, filter } = searchParams;
      const comercialesProm = context.models.Comercial.findAll(
        { first, skip },
        context.user
      );
      const totalCountProm = context.models.Comercial.countAll(
        context.user
      );
      const [comerciales, totalCount] = await Promise.all([
        comercialesProm,
        totalCountProm
      ]);
      return {
        nodes: comerciales,
        totalCount,
        pageInfo: getPageInfo(totalCount, first, skip)
      };
    }
  }
};

export default resolver;