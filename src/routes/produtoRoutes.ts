import { Router } from "express";
import {
  atualizarProduto,
  criarProduto,
  deletarProduto,
  getProdutoPorId,
  getProdutos,
} from "../controllers/produtoController.js";

const router = Router();

router.get("/", getProdutos);
router.get("/:id", getProdutoPorId);
router.post("/", criarProduto);
router.patch("/:id", atualizarProduto);
router.delete("/:id", deletarProduto);

export const produtoRoutes = router;
