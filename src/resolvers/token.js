const resolver = {
  Query: {
    signInUser: (_,{email,password},context) => {
      return context.models.Usuario.authenticate({email,password,secret:context.secret})
    }
  }, 
  Mutation: {
    changePassword: (_,{password},context) => {
    context.models.Usuario.changePassword(password,context.user)
  }
  }
}

export default resolver;