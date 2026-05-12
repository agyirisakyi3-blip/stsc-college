import { createServer } from "http";
import { createApp } from "./app.js";

const app = createApp();
const server = createServer(app);

const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}/`);
});
