import express from "express";
import type { Application, Request, Response } from "express";
import "dotenv/config";
import cors from "cors";
// routes.
import indexRoutes from "./routes/indexRoutes.js";
import {
  bigIntToStringConverter,
  stringToBigIntConverter,
} from "./middlewares/bigInt.middlewares.js";
const app: Application = express();
const PORT = process.env.PORT || 7000;

// * Middleware
app.use(cors());
// app.use(express.json());

app.use(stringToBigIntConverter);

app.use(express.urlencoded({ extended: false }));

app.use(bigIntToStringConverter);
app.get("/", (req: Request, res: Response) => {
  return res.send("It's asfasf 🙌");
});

const a = 3;
console.log(a, "asfhoiasfohi");

// all routes..
app.use(indexRoutes);

app.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`));

// /auth/oauth
