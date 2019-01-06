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
    porcentajeDescuentoTotal: Float

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
    producto: Producto!
    porcentajeDescuento: Float!
    ajustePrecioEnDevisa: Float!
    comentario: String
}

`
/*
    acciones: AccionesOportunidad
type AccionesOportunidad {
    nodes: [Accion]
    totalCount: Int
    pageInfo: pageInfo
}
*/


;