export default `

interface Contactable {
  emails: [ContactoEmail]  
  telefonos: [ContactoTelefono]
  direcciones: [ContactoDireccion]
}

type ContactoEmail {
  id: ID!
  email: String! 
  esFacturable: Boolean!
}

enum TipoTelefono {
  MOVIL
  FAX
  FIJO
}

type Prefijo {
  id: ID!
  "International Dialing Prefix (00)"
  idp: String!
  countryCallingCode: String!
  pais: Pais
}


type ContactoTelefono {
  id: ID!
  prefijo: Prefijo!
  numero: String!
  tipo: TipoTelefono!
  descripcion: String
}

type ContactoDireccion {
  id: ID!
  esFacturable: Boolean!
  direccion: String! 
  ciudad: String!
  codigoPostal: String!
  direccionDetalles: String
  descripcion: String
  provincia: String
  pais: Pais!
}


`;