import { Router } from "express";
import { postPedido } from "../controllers/pedidoController.js";

const router = Router();

router.post("/", postPedido);

export const pedidoRoutes = router;
