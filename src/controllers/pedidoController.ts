import type { Request, Response } from "express";
import { PedidoModel, type INovoItemPedido } from "../models/Pedido.js";

export const postPedido = async (req: Request, res: Response) => {
  const itens: INovoItemPedido[] = req.body.itens;
  if (!itens || !Array.isArray(itens)) {
    return res.status(400).json({ error: "Formato de itens inválido" });
  }
  try {
    const novoPedido = await PedidoModel.criar(itens);
    res.status(201).json(novoPedido);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(400).json({ error: error.message });
    }
    return res
      .status(500)
      .json({ error: "Ocorreu um erro inesperado ao processar o pedido." });
  }
};
