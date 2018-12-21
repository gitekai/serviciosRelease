export default `
type GrupoEmpresarial implements Node & Contactable {
  id: ID!
  idErp: ID
  nombre: String!
  "esto realmente puede y debe ser una zona"
  pais: Pais!
  emails: [ Email!]
  direcciones: [ Direccion!]
  telefonos: [Telefono!]
}

extend type Query {
  grupoEmpresarial(id:ID!): GrupoEmpresarial
  gruposEmpresariales(filter: grupoEmpresarialFilterInput, first: Int, skip: Int): GruposEmpresariales
}
type GruposEmpresariales {
  nodes: [GrupoEmpresarial]
  pageInfo: PageInfo
  totalCount: Int
 }
 input grupoEmpresarialFilterInput{
   nombre_regex: String
 }


extend type Mutation {
  createGrupoEmpresarial(data: createGrupoEmpresarialInput ): GrupoEmpresarial!
  updateGrupoEmpresarial(data: updateGrupoEmpresarialInput, id: ID!): GrupoEmpresarial!
  deleteGrupoEmpresarial(id: ID!): Boolean
}
input createGrupoEmpresarialInput {
  nombre: String !
  idPais: ID!
  idErp: ID
  emails: [createEmailInput]
  direcciones: [createDireccionInput]
  telefonos: [createTelefonoInput]
  idComercial: ID! 
}
input updateGrupoEmpresarialInput {
  idGE: ID!
  nombre: String 
  idPais: ID
  idComercial: ID
  emails: [String]
  direcciones: [createDireccionInput]
  telefonos: [createTelefonoInput]
  }

  extend type GrupoEmpresarial {
    comercial: Comercial !
  }

`

/*









extend type GrupoEmpresarial {
  personaContactoConnection(
    first: Int, 
    skip: Int, 
    ) : GEPersonaContactoConnection!
}

type GEPersonaContactoConnection {
  pageInfo: PageInfo!
  totalCount: Int !
  edges: [GEPersonaContactoEdge]
 }

type GEPersonaContactoEdge {
 node: PersonaContacto
 esPrincipal: Boolean 
 categoriaOcupacion: enumCategoriaOcupacion
 emails: [ ContactoEmail ]
 direcciones: [ ContactoDireccion ]
 telefonos: [ContactoTelefono ]
}











input inputPersonaContactoGEConnection{
personaContacto: inputCreatePersonaContacto!
esPrincipal: Boolean!
categoriaOcupacion: enumCategoriaOcupacion!
descripcion: String
emails: [ inputCreateEmail ]
direcciones: [inputCreateDireccion]
}

enum enumCategoriaOcupacion {
ANALISTA
TRADER
COMERCIAL
TECNICO
}




`; 

*/