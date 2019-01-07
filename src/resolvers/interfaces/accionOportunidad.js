const resolvers = {
  AccionOportunidad: {
    __resolveType: obj => {
      if (obj.hasOwnProperty("subject")) {
        return "MandarEmailOportunidad";
      }
      return "ComentarioOportunidad";
    }
  },
};

export default resolvers;
