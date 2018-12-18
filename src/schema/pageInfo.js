import { gql } from 'apollo-server-express';

export default gql`

type PageInfo {
  endCursor: String
  hasNextPage: Boolean!
  hasPreviousPage: Boolean! 
  startCursor: String 
}
`;
