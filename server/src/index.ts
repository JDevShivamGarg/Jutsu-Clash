import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(cors());
app.get("/", (_req, res) => res.send("Jutsu Clash server"));

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: process.env.CLIENT_ORIGIN ?? "http://localhost:5173" },
});

io.on("connection", (socket) => {
  console.log("socket connected", socket.id);
  socket.emit("ping-from-server", { ts: Date.now() });
  socket.on("client-ping", (d) => console.log("client-ping", d));
  socket.on("disconnect", () => console.log("disconnected", socket.id));
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Server listening ${PORT}`));
