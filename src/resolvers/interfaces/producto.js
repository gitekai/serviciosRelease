const resolvers = {
  Producto: {
    __resolveType: obj => {
      switch (obj) {
        case obj.isXtraders:
          return "productoERPv1";
          break;
      }
    }
  },
  ProductoConPrecio: {
    __resolveType: obj => {
       if (obj.hasOwnProperty('isXtraders')){
         return "ProductoERPv1ConPrecio";
       }
    },


  }, 
  Query: {
    productoConPrecio: (_,serachParams,{models,user}) => 
      models.Producto.findProductoWithPrecioById(serachParams,user),
    
  }
};

export default resolvers;
