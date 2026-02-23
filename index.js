require("dotenv").config({ quiet: true });

const express = require("express");
const mongoose = require("mongoose");
const { graphqlHTTP } = require("express-graphql");
const { graphqlUploadExpress } = require("graphql-upload");
const schema = require("./schema");
const resolvers = require("./resolvers");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(`Error connecting to MongoDB: ${err.message}`));

app.use(
  "/graphql",
  graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }),
  graphqlHTTP((req) => ({
    schema,
    rootValue: resolvers,
    graphiql: true,
  })),
);
app.get("/", (req, res) => {
  res.send("GraphQL API is running. Visit /graphql for GraphiQL.");
});

app.listen(port, () => {
  console.log(`Web Server is listening on port ${port}`);
});
