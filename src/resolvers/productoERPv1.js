import { getPageInfo } from "./utils";

const resolvers = {
  ProductoERPv1: {
    precios: async (ProductoERPv1, _, { models, user }) =>
      models.ProductoERPv1.preciosById(ProductoERPv1.id, user)
  },

  Query: {
    productosERPv1: async (_, searchParams, { models, user }) => {
      const productoProm = await models.ProductoERPv1.findAll(
        searchParams,
        user
      );
      const countProm = await models.ProductoERPv1.countAll(searchParams, user);

      const { first, skip } = searchParams;
      const [productos, count] = await Promise.all([productoProm, countProm]);

      return {
        nodes: productos,
        totalCount: count,
        pageInfo: getPageInfo(count, first, skip)
      };
    }
  },
  Mutation: {
    createProductoERPv1: async (_, { data }, { models, user }) =>
      models.ProductoERPv1.create(data, user)
  }
};

export default resolvers;
