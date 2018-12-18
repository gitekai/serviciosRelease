export default `

type Token {
  token: String! 
}
extend type Mutation {
  changePassword(password: String!): Usuario!
}
extend type Query {
  signInUser(email: String!, password: String) : Token! 
}
`;