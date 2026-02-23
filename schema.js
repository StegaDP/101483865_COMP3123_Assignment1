const { makeExecutableSchema } = require("@graphql-tools/schema");
const { GraphQLUpload } = require("graphql-upload");

const typeDefs = `
  scalar Upload

  type User {
    id: ID!
    username: String!
    email: String!
    created_at: String!
    updated_at: String!
  }

  type Employee {
    id: ID!
    first_name: String!
    last_name: String!
    email: String!
    gender: String!
    designation: String!
    salary: Float!
    date_of_joining: String!
    department: String!
    employee_photo: String
    created_at: String!
    updated_at: String!
  }

  input EmployeeInput {
    first_name: String!
    last_name: String!
    email: String!
    gender: String!
    designation: String!
    salary: Float!
    date_of_joining: String!
    department: String!
    photo: Upload
  }

  input UpdateEmployeeInput {
    first_name: String
    last_name: String
    email: String
    gender: String
    designation: String
    salary: Float
    date_of_joining: String
    department: String
    photo: Upload
  }

  input LoginInput {
    email: String!
    password: String!
  }

  input SignupInput {
    username: String!
    email: String!
    password: String!
  }

  type AuthPayload {
    message: String!
    token: String
    user: User
  }

  type Mutation {
    signup(input: SignupInput!): User
    addEmployee(employee: EmployeeInput!): Employee!
    updateEmployee(eid: ID!, employee: UpdateEmployeeInput!): Employee!
    deleteEmployee(eid: ID!): String!
  }

  type Query {
    login(input: LoginInput!): AuthPayload!
    getAllEmployees: [Employee!]!
    getEmployeeById(eid: ID!): Employee
    searchEmployees(designation: String, department: String): [Employee!]!
  }
`;

const resolvers = {
  Upload: GraphQLUpload,
};

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

module.exports = schema;
