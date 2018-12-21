import {GraphQLDateTime} from 'graphql-iso-date';
import usuarioIFResolver from "./interfaces/usuario";
import paisResolvers from "./pais";
import comercialResolver from "./comercial";
import grupoEmpresarialResolver from './grupoEmpresarial';

const customScalarResolver = {
  Date: GraphQLDateTime, 
};

export default [
  customScalarResolver,
  usuarioIFResolver,
  paisResolvers,
  comercialResolver,
  grupoEmpresarialResolver,
];
