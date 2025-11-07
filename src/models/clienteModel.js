const { pool } = require("../config/db");

const clienteModel = {
  /**
   * Retorna todos os clientes cadastrados na tabela clientes
   * @async
   * @function selectAll
   * @returns {Promise<Array<Object>>} Retorna um array de objetos, cada objeto representa um cliente
   * @example
   * const clientes = await clienteModel.selectAll();
   * console.log(clientes);
   * // Saida esperada
   * {
   *      {coluna1:"valorColuna1", coluna2:"valorColuna2", ...},
   *      {coluna1:"valorColuna1", coluna2:"valorColuna2", ...}
   * }
   */

  selectAll: async () => {
    const sql = "SELECT * FROM clientes;";
    const [rows] = await pool.query(sql);
    return rows;
  },

  selectById: async (pId) => {
    const sql = "SELECT * FROM clientes WHERE id_cliente=?;";
    const values = [pId];
    const [rows] = await pool.query(sql, values);
    return rows;
  },

  /**
   * Insere um cliente na base de dados
   * @param {string} pNomeCli Descrição do nome do cliente que deve ser inserido no banco de dados. Ex.: 'Ana'
   * @param {number} pCpfCli Valor do cliente que deve ser inserido no banco de dados. Ex.: 4800000000
   * @returns {Promise<Object} Retorna um objeto contendo propriedades sobre o resultado da execução da query
   * @example
   * const result = await clienteModel.insert(paramA, paramB);
   *  "result": {
   *      "fieldCount": 0,
   *      "affectedRows": 1,
   *      "insertId": 1,
   *      "info": "",
   *      "serverStatus": 2,
   *      "warningStatus": 0,
   *      "changedRows": 0
   * }
   */

  insert: async (pNomeCli, pCpfCli) => {
    const sql = "INSERT INTO clientes(nome_cliente, cpf_cliente) VALUES (?,?);";
    const values = [pNomeCli, pCpfCli];
    const [rows] = await pool.query(sql, values);
    return rows;
  },

  verificaCpf: async (pCpfCli) => {
    const sql = "SELECT * FROM clientes WHERE cpf_cliente = ?;";
    const values = [pCpfCli];
    const [rows] = await pool.query(sql, values);
    return rows; 
  },

  update: async (pId, pNomeCli, pCpfCli) => {
    const sql =
      "UPDATE clientes SET nome_cliente=?, cpf_cliente=? WHERE id_cliente=?;";
    const values = [pNomeCli, pCpfCli, pId];
    const [rows] = await pool.query(sql, values);
    return rows;
  },

  delete: async (pId) => {
    const sql = "DELETE FROM clientes WHERE id_cliente=?;";
    const values = [pId];
    const [rows] = await pool.query(sql, values);
    return rows;
  },
};

module.exports = { clienteModel };
