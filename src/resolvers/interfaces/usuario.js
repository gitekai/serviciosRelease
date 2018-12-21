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
  }, 
  Query: {
    signInUser: (_, { email, password }, context) => {
      return context.models.Usuario.authenticate({
        email,
        password,
        secret: context.secret
      });
    }
  },
}

export default resolver;