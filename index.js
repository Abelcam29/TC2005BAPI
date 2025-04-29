import "dotenv/config";
import express from "express";
import indexRoutes from "./routes/index.routes.js";
import usersRoutes from "./routes/users.routes.js";

//import {pool} from "./controllers/db.js";

//console.log(process.env.USER);

const app = express();

app.use(usersRoutes);
app.use(indexRoutes);

const port = 5000;


app.listen(port, console.log("http://Localhost:"+port));