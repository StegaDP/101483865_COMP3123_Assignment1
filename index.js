const express = require('express');
const app = express()
const port = process.env.PORT || 3000
const userRouter = require('./routes/user')
const employeeRouter = require('./routes/employee')
const mongoose = require("mongoose");

app.use(express.json())

mongoose.connect("mongodb+srv://root:770088@assignment1.2o8nw8n.mongodb.net/assignment1").then(()=>console.log("Connected to MongoDB")).catch((err)=>console.log(`Error connecting to MongoDB: ${err.message}`));

app.use("/api/v1/user", userRouter)
app.use("/api/v1/emp", employeeRouter)

app.get('/', (req, res) => {
  res.send('hello world')
})


app.listen(port, () => {
  console.log(`Web Server is listening on port ${port}`)
})