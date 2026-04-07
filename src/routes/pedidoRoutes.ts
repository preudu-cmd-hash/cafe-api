import { Router } from "express";
import {
  deletePedido,
  getPedidos,
  patchStatus,
  postPedido,
  putPedido,
} from "../controllers/pedidoController.js";

const router = Router();

router.get("/", getPedidos);
router.post("/", postPedido);
router.delete("/:id", deletePedido);
router.patch("/:id", patchStatus);
router.put("/:id", putPedido);

export const pedidoRoutes = router;
