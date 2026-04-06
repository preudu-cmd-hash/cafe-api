import { pool } from "../db.js";

export interface IItemPedido {
  id: number;
  pedido_id: number;
  produto_id: number;
  quantidade: number;
  preco_un: number;
}

export interface IPedido {
  id: number;
  data_criacao: Date;
  status: string;
  itens: IItemPedido[];
}

export type INovoItemPedido = Pick<IItemPedido, "produto_id" | "quantidade">;

export interface IPedidoRow {
  pedido_id: number
  data_criacao: Date
  status: string
  item_id: number | null
  produto_id: number | null
  quantidade: number | null
  produto_nome: string | null
  produto_preco: number | null
}

export const PedidoModel = {
  async criar(itens: INovoItemPedido[]): Promise<{ id: number }> {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      const pedido = await client.query(
        "INSERT INTO pedidos (status) VALUES ('pendente') RETURNING id"
      );
      const pedidoId = pedido.rows[0].id;
      for (const item of itens) {
        const queryProduto = await client.query(
          "SELECT estoque, nome, preco FROM produtos WHERE  id = $1",
          [item.produto_id]
        );
        const produtoSelecionado = queryProduto.rows[0];
        if (!produtoSelecionado) {
          throw new Error("Produto não encontrado");
        }
        if (produtoSelecionado.estoque < item.quantidade) {
          throw new Error(
            `Estoque insuficiente para o produto: ${produtoSelecionado.nome}!`
          );
        }
        await client.query(
          "UPDATE produtos SET estoque = estoque - $1 WHERE id = $2",
          [item.quantidade, item.produto_id]
        );
        await client.query(
          "INSERT INTO itens_pedido(pedido_id, produto_id, quantidade, preco_un) VALUES ($1,$2,$3,$4)",
          [pedidoId, item.produto_id, item.quantidade, produtoSelecionado.preco]
        );
      }
      await client.query("COMMIT");
      return { id: pedidoId };
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  },

  async listarTodos(): Promise<IPedido[]> {
    const query = 
    `
      select p.id as pedido_id, p.data_criacao, p.status, ip.id as item_id, ip.produto_id, ip.quantidade, pr.nome as produto_nome, pr.preco as produto_preco
      from pedidos p
      left join itens_pedido ip on p.id = ip.pedido_id
      left join produtos pr on ip.produto_id = pr.id
      order by p.data_criacao desc
    `;

    const { rows } = await pool.query<IPedidoRow>(query)
    const listaPedidos: IPedido[] = []

    for (const row of rows) {
      let pedidoExistente = listaPedidos.find(p => p.id === row.pedido_id)
      
      if (!pedidoExistente) {
        pedidoExistente = {
          id: row.pedido_id,
          data_criacao: row.data_criacao,
          status: row.status,
          itens: []
        }
        listaPedidos.push(pedidoExistente)
      }

      if (row.item_id) {
        pedidoExistente.itens.push({
          id: row.item_id,
          produto_id: row.produto_id!,
          pedido_id: row.pedido_id!,
          quantidade: row.quantidade!,
          preco_un: row.produto_preco!
        })
      }
    }

    return listaPedidos
  },
};
