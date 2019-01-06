const resolvers = {
  Producto: {
    __resolveType: obj => {
      switch (obj) {
        case obj.isXtraders:
          return "productoERPv1";
          break;
      }
    }
  }
};
