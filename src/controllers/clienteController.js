const { error } = require("console");
const { clienteModel } = require("../models/clienteModel");

const clienteController = {
  /**
   * Retorna os clientes cadastrados
   * Rota GET /clientes
   * @async
   * @function selecionaTodos
   * @param {Request} req Objeto da requisição HTTP
   * @param {Response} res Objeto da resposta HTTP
   * @returns {Promise<Array<Object>>} Objeto contendo o resultado da consulta
   */

  selecionaTodos: async (req, res) => {
    try {
      const { idCliente } = req.query;
      if (idCliente) {
        const resultadoCliente = await clienteModel.selectById(idCliente);
        return res.status(200).json({ data: resultadoCliente });
      }
      const resultado = await clienteModel.selectAll();
      if (resultado.length === 0) {
        return res
          .status(200)
          .json({ message: "A consulta não retornou resultados" });
      }
      return res.status(200).json({ data: resultado });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Ocorreu um erro no servidor",
        errorMessage: error.message,
      });
    }
  },

  incluiRegistro: async (req, res) => {
    try {
      const { descricao, valor } = req.body;
      if (!descricao || !valor || !isNaN(descricao) || isNaN(valor)) {
        return res
          .status(400)
          .json({ message: `Verifique os dados enviados e tente novamente` });
      }

      const existe = await clienteModel.verificaCpf(valor);
      if (existe.length > 0) {
        return res.status(409).json({
          message: "Este CPF já está cadastrado.",
        });
      }

      const resultado = await clienteModel.insert(descricao, valor);
      if (resultado.insertId === 0) {
        throw new Error("Ocorreu um erro ao incluir o cliente.");
      }
      res
        .status(201)
        .json({ message: "Registro incluido com sucesso", data: resultado });
    } catch (error) {
      console.error(error);
      res.status(200).json({
        message: "Ocorreu um erro no servidor",
        errorMessage: error.message,
      });
    }
  },

  alterarCliente: async (req, res) => {
    try {
      const idCliente = Number(req.params.idCliente);
      const { descricao, valor } = req.body;
      const existe = await clienteModel.findByCpf(valor);

      if (
        !idCliente ||
        (!descricao && !valor) ||
        (!isNaN(descricao) && isNaN(valor)) ||
        typeof idCliente != "number"
      ) {
        return res
          .status(400)
          .json({ message: `Verifique os dados enviados e tente novamente` });
      }

      const clienteAtual = await clienteModel.selectById(idCliente);
      if (clienteAtual.length === 0) {
        return res.status(200).json({ message: "Cliente não localizado" });
      }
      
      if (existe.length > 0) {
        return res.status(409).json({
          message: "O novo CPF já está cadastrado. Tente outro valor.",
        });
      }

      const novaDescricao = descricao ?? clienteAtual[0].nome_cliente;
      const novoValor = valor ?? clienteAtual[0].cpf_cliente;

      const resultUpdate = await clienteModel.update(
        idCliente,
        novaDescricao,
        novoValor
      );
      if (resultUpdate.affectedRows === 1 && resultUpdate.changedRows === 0) {
        return res
          .status(200)
          .json({ message: "Não há alterações a serem realizadas" });
      }
      if (resultUpdate.affectedRows === 1 && resultUpdate.changedRows === 1) {
        res.status(200).json({ message: "Registro alterado com sucesso" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Ocorreu um erro no servidor",
        errorMessage: error.message,
      });
    }
  },

  deleteCliente: async (req, res) => {
    try {
      const idCliente = Number(req.params.idCliente);
      if (!idCliente || !Number.isInteger(idCliente)) {
        return res
          .status(400)
          .json({ message: "Forneça um identificador válido" });
      }

      const clienteSelecionado = await clienteModel.selectById(idCliente);
      if (clienteSelecionado.length === 0) {
        return res
          .status(200)
          .json({ message: "Cliente não localizado na base de dados" });
      }

      const resultadoDelete = await clienteModel.delete(idCliente);
      if (resultadoDelete.affectedRows === 0) {
        return res
          .status(200)
          .json({ message: "Ocorreu um erro ao excluir o cliente" });
      }

      res.status(200).json({ message: "Cliente excluido com sucesso" });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Ocorreu um erro no servidor",
        errorMessage: error.message,
      });
    }
  },
};

module.exports = { clienteController };
