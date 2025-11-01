2. Monorepo Structure

We use a monorepo layout for maintainability and scalability:

jutsu-clash/
├─ client/        # React frontend
├─ server/        # Node.js backend
├─ shared/        # Shared TypeScript types
├─ docs/          # Documentation
├─ .gitignore
├─ .editorconfig
├─ .prettierrc
└─ README.md

3. Initialize Repository
mkdir jutsu-clash && cd jutsu-clash
git init
echo "node_modules/" > .gitignore
echo ".env" >> .gitignore
mkdir client server shared docs

Editor and Formatting Configuration
cat > .editorconfig <<'EOF'
root = true
[*]
indent_style = space
indent_size = 2
end_of_line = lf
charset = utf-8
trim_trailing_whitespace = true
insert_final_newline = true
EOF

cat > .prettierrc <<'EOF'
{"semi":true,"singleQuote":true,"printWidth":100}
EOF

4. Shared Module Setup

This module stores shared TypeScript interfaces and types.

cd shared
npm init -y
npm i -D typescript
npx tsc --init --rootDir src --outDir dist --declaration
mkdir src


Create a file:

// shared/src/index.ts
export type UID = string;

export interface PlayerState {
  id: UID;
  hp: number;
  chakra: number;
}


Add build script:

npm pkg set scripts.build="tsc"


Return to root:

cd ..

5. Client Setup (React + Vite + TypeScript + Tailwind + Socket.io)
cd client
npm create vite@latest . -- --template react-ts
npm install
npm install socket.io-client @mediapipe/hands @mediapipe/camera_utils
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p


tailwind.config.cjs

module.exports = {
  content: ["./index.html","./src/**/*.{ts,tsx}"],
  theme: { extend: {} },
  plugins: [],
};


src/index.css

@tailwind base;
@tailwind components;
@tailwind utilities;


Add shared dependency:

npm install ../shared

Example Socket Connection

src/lib/socket.ts

import { io, Socket } from "socket.io-client";
const URL = import.meta.env.VITE_SERVER_URL ?? "http://localhost:4000";
export const socket: Socket = io(URL, { autoConnect: false });


src/App.tsx

import React, { useEffect } from "react";
import { socket } from "./lib/socket";

export default function App() {
  useEffect(() => {
    socket.connect();
    socket.on("connect", () => console.log("Connected", socket.id));
    socket.on("ping-from-server", (d) => console.log("Ping", d));
    return () => socket.disconnect();
  }, []);

  return <div className="p-6 text-xl font-bold">Jutsu Clash Client POC</div>;
}


Environment Variable

# client/.env.example
VITE_SERVER_URL=http://localhost:4000

6. Server Setup (Express + Socket.io + TypeScript + Prisma-ready)
cd ../server
npm init -y
npm i express socket.io cors dotenv
npm i -D typescript ts-node-dev @types/node @types/express @types/cors
npx tsc --init --rootDir src --outDir dist --esModuleInterop --resolveJsonModule --skipLibCheck

Convert to ECMAScript Module (Recommended)

Edit package.json:

{
  "type": "module",
  "scripts": {
    "dev": "ts-node-dev --respawn --transpile-only src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js"
  }
}

Example Server

src/index.ts

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
  console.log("Socket connected", socket.id);
  socket.emit("ping-from-server", { ts: Date.now() });
  socket.on("client-ping", (d) => console.log("Client ping", d));
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Server listening on ${PORT}`));

Server Environment
# server/.env.example
PORT=4000
CLIENT_ORIGIN=http://localhost:5173