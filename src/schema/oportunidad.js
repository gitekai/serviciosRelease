export default `

type Oportunidad {
    id: ID!
    fechaProximaAccion: Date!
    grupoEmpresarial: GrupoEmpresarial!
        
    faseNegociacion: faseOportunidadEnum!
    estado: estadoOportunidadEnum! 
    prioridad: prioridadOportunidadEnum!
    modoContacto: modoContactoEnum!

    fechaPrevistaCierre: Date
    probalidadGanado: Float
    seguidores: [Usuario]

    devisaLineasProducto: DevisaProductoEnum
    porcentajeDescuentoTotal: Float!

}


extend type Query {
    oportunidades(first:Int, skip: Int, filter: oportunidadFilterInput ): Oportunidades!
}

input oportunidadFilterInput {
    nombre_regex: String
}

type Oportunidades  {
    nodes: [Oportunidad]
    totalCount: Int!
    pageInfo: PageInfo
}

enum faseOportunidadEnum {
    PENDIENTE_CONTACTO
    PRIMER_CONTACTO
    INTERESADO
    PRUEBA
    OFERTA
}

enum estadoOportunidadEnum {
    ABIERTA
    GANADA
    PERDIDA
}

enum prioridadOportunidadEnum {
    NORMAL
    ALTA
    BAJA
}

enum modoContactoEnum {
    CONTACTO_COMERCIAL
    RECOMENDADO_POR_OTRO_COMERCIAL
    INTERNET 
    PETICION_DEL_CLIENTE 
    PROPUESTA_AMPLIACION
}


extend type Oportunidad {
    lineasProducto: [LineaProductoOportunidadItem]
}

type LineaProductoOportunidadItem {
    id: ID!
    producto: ProductoConPrecio!
    porcentajeDescuento: Float!
    ajustePrecioEnDevisa: Float!
    comentario: String
}

type MandarEmailOportunidad implements AccionOportunidad & Node{
  id: ID!
  createdAt: Date
  createdBy: Usuario
  subject: String
  cc: String
  bcc: String
  body: String
  comentario: String
}


type ComentarioOportunidad implements AccionOportunidad & Node{
  id: ID!
  createdAt: Date
  createdBy: Usuario
  comentario: String
}

extend type Oportunidad {
  accionesOportunidad(first: Int,after: String): AccionesOportunidad
}

type AccionesOportunidad {
  nodes: [AccionOportunidad]
  totalCount: Int
  pageInfo: PageInfo
}


extend type Mutation {
  createOportunidad(data: createOportunidadInput) : Oportunidad!  
  updateOportunidad(input: updateOportunidadInput) : Oportunidad! 
}

input grupoEmpresarialInOportunidadInput {
  idGrupoEmpresarial: ID
  grupoEmpresarial: createGrupoEmpresarialInput
}

input createOportunidadInput {
  
  fechaProximaAccion: Date!
  grupoEmpresarial: grupoEmpresarialInOportunidadInput!
  modoContacto: modoContactoEnum!
  idRazonSocial: ID
  
  faseNegociacion: faseOportunidadEnum
  estado: estadoOportunidadEnum
  prioridad: prioridadOportunidadEnum
  
  fechaPrevistaCierre: Date
  probalidadGanado: Float
  
  porcentajeDescuentoTotal: Float
  devisaLineasProducto: DevisaProductoEnum
  productosConPrecios: [ID]
  
}

input updateOportunidadInput {
  
  fechaProximaAccion: Date
  idGrupoEmpresarial: ID!
  grupoEmprearial: grupoEmpresarialInOportunidadInput!
  modoContacto: modoContactoEnum!
  idRazonSocial: ID
  
  faseNegociacion: faseOportunidadEnum
  estado: estadoOportunidadEnum
  prioridad: prioridadOportunidadEnum
  
  fechaPrevistaCierre: Date
  probalidadGanado: Float
  
  porcentajeDescuentoTotal: Float
  devisaLineasProducto: DevisaProductoEnum
  productosConPrecios: [ID]
  
}

extend type Mutation {
  addMandarEmailToOportunidad(idOportunidad: ID!, data: createMandarEmailInput): MandarEmailOportunidad!
}

input createMandarEmailInput {
  subject: String!
  idToRecepient: ID!
  body: String!
  comentario: String
  cc: String
  bcc: String
}

extend type Mutation {
  addComentarioToOportunidad(idOportunidad: ID!, comentario: String): ComentarioOportunidad!
}

extend type Mutation {
  addLineaProductoToOportunidad(idOportunidad: ID!, input: createLineaProductoOInput ): LineaProductoOportunidadItem!
  addLineasProductoToOportunidad(idOportunidad: ID!, inputs: [createLineaProductoOInput] ): [LineaProductoOportunidadItem]!
  updateLineaProductoOportunidad(idLineaProducto: ID!, input: updateLineaProductoOInput ): LineaProductoOportunidadItem!
  removeLineaProductoOportunidad(idLineaProducto: ID!): Boolean
}

input createLineaProductoOInput {
  idProductoConPrecio: ID!
  porcentajeDescuento: Float
  ajustePrecioEnDevisa: Float
  comentario: String
}

input updateLineaProductoOInput {
  idProductoConPrecio: ID
  porcentajeDescuento: Float
  ajustePrecioEnDevisa: Float
  comentario: String
}

`




;