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
    productoConPrecio: async (_,{idProductoConPrecio},{models,user}) => {
      const productoPromERPv1 =  models.Producto.findProductoERPv1WithPrecioById(idProductoConPrecio,user); 

      const [productoConPrecioERPv1] = await Promise.all([productoPromERPv1]);

      return {...productoConPrecioERPv1}; 
    }
    
  }
};

export default resolvers;
