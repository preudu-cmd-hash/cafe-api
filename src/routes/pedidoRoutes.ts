import { Router } from "express";
import { getPedidos, postPedido } from "../controllers/pedidoController.js";

const router = Router();

router.get('/', getPedidos)
router.post("/", postPedido);

export const pedidoRoutes = router;
