import { gql } from "apollo-server-express";

import nodeIF from "./interfaces/node";
import usuarioIF from "./interfaces/usuario";
import contactableIF from './interfaces/contactable';

import pageInfoSchema from "./pageInfo";
import paisSchema from "./pais";
import comercialSchema from "./comercial";
import tokenSchema from './token';



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
  paisSchema,
  pageInfoSchema,
  comercialSchema,
  tokenSchema,
];
