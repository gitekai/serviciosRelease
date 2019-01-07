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
    producto: ProductoConPrecio!
    porcentajeDescuento: Float!
    ajustePrecioEnDevisa: Float!
    comentario: String
}

type MandarEmailOportunidad implements AccionOportunidad & Node{
  id: ID!
  date: Date
  createdBy: Usuario
  subject: String
  cc: String
  bcc: String
  body: String
  comentario: String
}


type ComentarioOportunidad implements AccionOportunidad & Node{
  id: ID!
  date: Date
  createdBy: Usuario
  comentario: String
}

extend type Oportunidad {
  accionesOportunidad(first: Int,skip: Int,filter: accionesOportunidadInput): AccionesOportunidad
}

input accionesOportunidadInput {
  id_equals: ID!
}

type AccionesOportunidad {
  nodes: [AccionOportunidad]
  totalCount: Int
  pageInfo: PageInfo
}

`




;