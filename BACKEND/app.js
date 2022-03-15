import express from "express";
import bodyParser from "body-parser";
import placesRoutes from "./routes/place-routes.js";

const app = express();

app.use(placesRoutes);

app.listen(5000);
