import { pool } from "../db.js";

export interface IProduto {
  id?: number;
  nome: string;
  preco: number;
  estoque: number;
}

export const ProdutoModel = {
  async listarTodos(): Promise<IProduto[]> {
    const { rows } = await pool.query("SELECT * FROM produtos");
    return rows;
  },
  async criar(dados: IProduto): Promise<IProduto> {
    const query =
      "INSERT INTO produtos (nome, preco, estoque) VALUES ($1, $2, $3) RETURNING *";
    const values = [dados.nome, dados.preco, dados.estoque];
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  async buscarPorID(id: number): Promise<IProduto | null> {
    const query = "SELECT * FROM produtos WHERE id = $1";
    const { rows } = await pool.query(query, [id]);
    return rows[0] || null;
  },

  async atualizar(
    id: number,
    dados: Partial<IProduto>
  ): Promise<IProduto | null> {
    const query =
      "UPDATE produtos SET nome = $1, preco = $2, estoque = $3 WHERE id = $4 RETURNING *";
    const values = [dados.nome, dados.preco, dados.estoque, id];
    const result = await pool.query(query, values);
    return result.rows[0] || null;
  },

  async deletar(id: number): Promise<boolean> {
    const result = await pool.query("DELETE FROM produtos WHERE ID =$1", [id]);
    return (result.rowCount ?? 0) > 0;
  },
};
