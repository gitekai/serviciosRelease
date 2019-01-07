import {GraphQLDateTime} from 'graphql-iso-date';
import usuarioIFResolver from "./interfaces/usuario";
import productoResolver from './interfaces/producto';

import paisResolvers from "./pais";
import comercialResolver from "./comercial";
import grupoEmpresarialResolver from './grupoEmpresarial';
import productoERPv1Resolver from './productoERPv1';
import oportunidadResolver from './oportunidad';
import accionesOportunidadResolver from './interfaces/accionOportunidad';

const customScalarResolver = {
  Date: GraphQLDateTime, 
};

export default [
  customScalarResolver,
  usuarioIFResolver,
  paisResolvers,
  comercialResolver,
  grupoEmpresarialResolver,
  productoERPv1Resolver,
  oportunidadResolver,
  productoResolver,
  accionesOportunidadResolver,
];
