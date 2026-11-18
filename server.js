import http from "node:http";
import { server as wisp, logging } from "@mercuryworkshop/wisp-js/server";

const port = Number(process.env.PORT || 5001);

// Basic hardening: do not permit access to private, loopback, or literal-IP
// destinations through this public relay.
wisp.options.allow_private_ips = false;
wisp.options.allow_loopback_ips = false;
wisp.options.allow_direct_ip = false;
wisp.options.wisp_version = 2;
wisp.options.stream_limit_per_host = 16;
wisp.options.stream_limit_total = 128;

logging.set_level(logging.INFO);

const server = http.createServer((req, res) => {
  const pathname = new URL(req.url || "/", "http://localhost").pathname;

  if (pathname === "/" || pathname === "/health") {
    res.writeHead(200, { "content-type": "application/json; charset=utf-8" });
    res.end(JSON.stringify({
      service: "korona-wisp",
      status: "online",
      protocol: "Wisp v2 (v1 compatible)",
      websocket: "/"
    }));
    return;
  }

  res.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
  res.end("Not found");
});

server.on("upgrade", (req, socket, head) => {
  // Wisp-js uses the root websocket path for the standard Wisp transport.
  if (new URL(req.url || "/", "http://localhost").pathname !== "/") {
    socket.destroy();
    return;
  }

  try {
    wisp.routeRequest(req, socket, head);
  } catch (error) {
    console.error("Wisp upgrade failed:", error);
    socket.destroy();
  }
});

server.listen(port, "0.0.0.0", () => {
  console.log(`Korona Wisp relay listening on 0.0.0.0:${port}`);
});
