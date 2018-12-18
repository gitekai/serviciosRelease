export default `
type GrupoEmpresarial implements Node & Contactable {
  id: ID!
  idErp: ID!
  nombre: String!
  pais: Pais!
  emails: [ ContactoEmail! ]
  direcciones: [ ContactoDireccion! ]
  telefonos: [ContactoTelefono! ]
  comercial: Comercial !
  personaContactoConnection(
    first: Int, 
    skip: Int, 
    ) : GEPersonaContactoConnection!
}

type GEPersonaContactoEdge {
 node: PersonaContacto
 esPrincipal: Boolean 
 categoriaOcupacion: enumCategoriaOcupacion
 emails: [ ContactoEmail ]
 direcciones: [ ContactoDireccion ]
 telefonos: [ContactoTelefono ]
}

type GEPersonaContactoConnection {
 pageInfo: PageInfo!
 totalCount: Int !
 edges: [GEPersonaContactoEdge]
}

extend type RootQuery {
   gruposEmpresariales(first: Int, skip: Int, showDesactivado: Boolean): GruposEmpresariales
   grupoEmpresarial(id:ID!): GrupoEmpresarial
}

type GruposEmpresariales {
 nodes: [GrupoEmpresarial]
 pageInfo: PageInfo
 totalCount: Int
}

extend type RootMutation {
   createGrupoEmpresarial(data: inputDarAltaGrupoEmpresarial ): GrupoEmpresarial
   updateGrupoEmpresarial(data: cambiaGrupoEmpresarial): GrupoEmpresarial
   deleteGrupoEmpresarial(idGE: String!): ID
}
input inputDarAltaGrupoEmpresarial {
  nombre: String !
  idPais: ID!
  idComercial: ID!
  idErp: ID
  emails: [ inputCreateEmail ]
  direcciones: [ inputCreateDireccion ]
  personasContacto: [inputPersonaContactoGEConnection!]
}

input cambiaGrupoEmpresarial {
idGE: ID!
nombre: String 
idPais: ID
idComercial: ID
emails: [String]
direcciones: [inputCreateDireccion]
telefonos: [inputCreateTelefonoContacto]
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

input inputCambiaNombreGrupoEmpresarial {
id: ID!
nombre: String !
}


`; 