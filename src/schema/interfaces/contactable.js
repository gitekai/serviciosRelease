export default `

interface Contactable {
  emails: [Email!]
  direcciones: [Direccion!]
  telefonos: [Telefono!]
}

type Email implements Node {
  id: ID!
  email: String! 
  "esFacturable: Boolean!"
  createdAt: Date! 
  deletedAt: Date 
}
input createEmailInput {
  "esFacturable: Boolean"
  email: String!
}



type Telefono implements Node {
  id: ID!
  prefijo: Prefijo!
  numero: String!
  tipo: TipoTelefono!
  descripcion: String
}  
type Prefijo {
  id: ID!
  "International Dialing Prefix (00)"
  idp: String!
  countryCallingCode: String!
  pais: Pais
}
enum TipoTelefono {
  MOVIL
  FAX
  FIJO
}
input createTelefonoInput {
  prefijoID: ID!
  numero: String! 
  tipo: TipoTelefono!
  descripcion: String
}



type Direccion {
  id: ID!
  esFacturable: Boolean!
  createdAt: Date! 
  deletedAt: Date 
  direccion: String! 
  ciudad: String!
  codigoPostal: String!
  direccionDetalles: String
  descripcion: String
  provincia: String
  pais: Pais!
}
input createDireccionInput {
  idPais: ID!
  direccion: String!
  ciudad: String!
  codigoPostal: String!
  direccionDetalles: String
  provincia: String
  descripcion: String
}

`;