const express = require("express");
const bodyParser = require('body-parser') ;
const dotenv = require("dotenv");
dotenv.config();
const app = express();
const port = process.env.PORT || 8080;
const APPRouter = require("./src/routes");

app.use(bodyParser.json());

app.get('/', (req, res)=> {res.send('Hello from Homepage.')});

app.use("/ledger", APPRouter);

app.listen(port, ()=> {
  console.log(`Server is running on port: http://localhost:${port}`)
});
