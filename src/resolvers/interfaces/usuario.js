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
  Mutation: {
    changePassword: (_, { password }, context) => {
      context.models.Usuario.changePassword(password, context.user);
    }
  }
}

export default resolver;