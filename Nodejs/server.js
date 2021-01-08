const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const config = require('./config');
const router_admin_v1 = require('./router/router_admin_v1');

const app = express();

app.use(cors());

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// route
router_admin_v1.set(app);

//Database connection
const db = require('./db');
db.sync().then(() => {
	console.log('DB Connection successful.');
}).catch((error) => { console.log(error) });

// simple route
app.get("/", (req, res) => {
  res.json({ message: "node js server start." });
});

// set port, listen for requests
const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});