const resolver = {
/*  Query: {
    Usuarios: () => {

    } 
  },
  */
  Usuario: {
    __resolveType(obj, context, info ){
      console.log(obj);
      return 'Comercial'; 
    }
  }
}

export default resolver;