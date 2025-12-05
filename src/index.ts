import { createServer } from "http";
import express from "express";
import type { Application, Request, Response } from "express";
import "dotenv/config";
import cors from "cors";
// routes.
import indexRoutes from "./routes/indexRoutes.js";

import "./setup/bullMq/bullMq.worker.setup.js";
import SocketIndexSetup from "./setup/socketService/Socket.index.setup.js";
import { registerSocketEvents } from "./setup/socketService/Socket.eventHandler.js";

const app: Application = express();
const PORT = process.env.PORT || 7000;

const httpServer = createServer(app);

SocketIndexSetup.initialize(httpServer)
  .then(() => {
    registerSocketEvents();
  })
  .catch(err => console.log("sacket err", err));
// * Middleware
app.use(cors());
app.use(express.json());

app.use(express.urlencoded({ extended: false }));

app.get("/", (req: Request, res: Response) => {
  return res.send("It's asfasf 🙌");
});

// all routes..
app.use(indexRoutes);

httpServer.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`));

// /auth/oauth
