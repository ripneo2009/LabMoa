import http from "node:http";

const PORT = Number(process.env.PORT || 3000);
const HOST = "0.0.0.0";
const UPSTREAM = process.env.LABMOA_UPSTREAM || "https://labmoa-direct-2.vercel.app";

function sendJson(response, status, body) {
  response.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "access-control-allow-origin": "*",
    "access-control-allow-methods": "GET,POST,OPTIONS",
    "access-control-allow-headers": "content-type",
  });
  response.end(JSON.stringify(body));
}

const server = http.createServer(async (request, response) => {
  if (request.method === "OPTIONS") {
    response.writeHead(204, {
      "access-control-allow-origin": "*",
      "access-control-allow-methods": "GET,POST,OPTIONS",
      "access-control-allow-headers": "content-type",
    });
    response.end();
    return;
  }

  if (request.method === "GET" && (request.url === "/" || request.url === "/health")) {
    sendJson(response, 200, { ok: true, service: "LabMoa API" });
    return;
  }

  if (!request.url?.startsWith("/api/")) {
    sendJson(response, 404, { error: "Not found" });
    return;
  }

  try {
    const chunks = [];
    for await (const chunk of request) chunks.push(chunk);
    const body = Buffer.concat(chunks);
    const upstreamResponse = await fetch(new URL(request.url, UPSTREAM), {
      method: request.method,
      headers: { "content-type": request.headers["content-type"] || "application/json" },
      body: request.method === "GET" || request.method === "HEAD" ? undefined : body,
    });
    const content = Buffer.from(await upstreamResponse.arrayBuffer());
    response.writeHead(upstreamResponse.status, {
      "content-type": upstreamResponse.headers.get("content-type") || "application/json; charset=utf-8",
      "access-control-allow-origin": "*",
      "access-control-allow-methods": "GET,POST,OPTIONS",
      "access-control-allow-headers": "content-type",
    });
    response.end(content);
  } catch (error) {
    console.error(error);
    sendJson(response, 502, { error: "Upstream API connection failed" });
  }
});

server.listen(PORT, HOST, () => {
  console.log(`LabMoa API listening on http://${HOST}:${PORT}`);
});
