import { gql } from "apollo-server-express";

import nodeIF from "./interfaces/node";
import usuarioIF from "./interfaces/usuario";
import contactableIF from "./interfaces/contactable";
import productoIF from "./interfaces/producto";

import pageInfo from "./pageInfo";
import pais from "./pais";
import comercial from "./comercial";
import token from "./token";
import grupoEmpresarial from "./grupoEmpresarial";
import productoERPv1 from "./productoERPv1";
import oportunidad from "./oportunidad";

const stichedSchema = gql`
  scalar Date

  type Query {
    _: Boolean
  }

  type Mutation {
    _: Boolean
  }

  type Subscription {
    _: Boolean
  }
`;

export default [
  stichedSchema,
  nodeIF,
  usuarioIF,
  contactableIF,
  productoIF,
  productoERPv1,
  pais,
  pageInfo,
  comercial,
  token,
  grupoEmpresarial,
  oportunidad,
];
