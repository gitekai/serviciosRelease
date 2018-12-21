import {GraphQLDateTime} from 'graphql-iso-date';
import usuarioIFResolver from "./interfaces/usuario";
import paisResolvers from "./pais";
import comercialResolver from "./comercial";

const customScalarResolver = {
  Date: GraphQLDateTime, 
};

export default [
  customScalarResolver,
  usuarioIFResolver,
  paisResolvers,
  comercialResolver,
];
