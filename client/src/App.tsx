import React, { useEffect } from "react";
import { socket } from "./lib/socket";

export default function App() {
  useEffect(() => {
    socket.connect();
    socket.on("connect", () => console.log("connected", socket.id));
    socket.on("ping-from-server", (d) => console.log("ping", d));
    return () => { socket.disconnect(); };
  }, []);
  return <div className="p-6">Jutsu Clash Client POC</div>;
}
