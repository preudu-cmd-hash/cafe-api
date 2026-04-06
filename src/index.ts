import express from "express";
import type { Application } from "express";
import { produtoRoutes } from "./routes/produtoRoutes.js";
import { pedidoRoutes } from "./routes/pedidoRoutes.js";

const app: Application = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use("/api/produtos", produtoRoutes);
app.use("/api/pedidos", pedidoRoutes);

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
