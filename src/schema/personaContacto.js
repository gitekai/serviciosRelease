export default `

type PersonaContacto {
  id: ID!
  nombre: String!
  apellidos: String!
  linkedin: String
  cargo: String
  departamento: String
  recibeRegaloNavidad: Boolean
}

extend type RootQuery {
  personasContacto(first: Int!, skip: Int): [PersonaContacto!]
  personaContacto(id:ID!): PersonaContacto
}

extend type RootMutation {
  createPersonaContacto(data: inputCreatePersonaContacto): PersonaContacto
  updatePersonaContacto(data: updatePersonaContactoInput): PersonaContacto
  deletePersonaConctactos(ids: [ID!] ): Boolean
  
}


`;