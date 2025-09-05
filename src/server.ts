import dotenv from "dotenv";
dotenv.config();

import http from "http";
import app from "./app";

const PORT = process.env.PORT || 3001;

const server = http.createServer(app);

server.listen(PORT, () => {
    console.log(`server listening on port http://localhost:${PORT}`);
});
