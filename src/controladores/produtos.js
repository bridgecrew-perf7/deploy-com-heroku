const knex = require('../conexao');

const listarProdutos = async (req, res) => {
    const { usuario } = req;
    const { categoria } = req.query;

    try {
        if (categoria) {
            const produtos = await knex('produtos')
            .where('usuario_id', usuario.id)
            .andWhere('categoria', 'ilike', `%${categoria}%`); 

            return res.status(200).json(produtos);
        }

        //const query = `select * from produtos where usuario_id = $1 ${condicao}`;
        //const { rows: produtos } = await conexao.query(query, [usuario.id, ...params]);
        const produtos = await knex('produtos')
            .where('usuario_id', usuario.id);

        return res.status(200).json(produtos);
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const obterProduto = async (req, res) => {
    const { usuario } = req;
    const { id: idProduto } = req.params;

    try {
        //const query = `select * from produtos where usuario_id = $1 and id = $2`;
        //const { rows, rowCount } = await conexao.query(query, [usuario.id, id]);
        const produto = await knex('produtos')
            .where({ usuario_id: usuario.id, id: idProduto })
            .first();
            

        if (!produto) {
            return res.status(404).json("Produto não encontrado");
        }

        return res.status(200).json(produto);
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const cadastrarProduto = async (req, res) => {
    const { usuario } = req;
    const { nome, estoque, preco, categoria, descricao, imagem } = req.body;

    if (!nome) {
        return res.status(404).json('O campo nome é obrigatório');
    }

    if (!estoque) {
        return res.status(404).json('O campo estoque é obrigatório');
    }

    if (!preco) {
        return res.status(404).json('O campo preco é obrigatório');
    }

    if (!descricao) {
        return res.status(404).json('O campo descricao é obrigatório');
    }

    try {
        //const query = 'insert into produtos (usuario_id, nome, estoque, preco, categoria, descricao, imagem) values ($1, $2, $3, $4, $5, $6, $7)';
        //const produto = await conexao.query(query, [usuario.id, nome, estoque, preco, categoria, descricao, imagem]);
        const valores = {
            usuario_id: usuario.id,
            nome,
            estoque,
            preco,
            categoria,
            descricao,
            imagem
        }
        const produto = await knex('produtos')
            .insert(valores)
            .returning('*');
        
        if (!produto) {
            return res.status(400).json("O produto não foi cadastrado");
        }

        return res.status(200).json({mensagem: "O produto foi cadastrado com sucesso.", produto});
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const atualizarProduto = async (req, res) => {
    const { usuario } = req;
    const { id: idProduto } = req.params;
    const { nome, estoque, preco, categoria, descricao, imagem } = req.body;

    if (!nome && !estoque && !preco && !categoria && !descricao && !imagem) {
        return res.status(404).json('Informe ao menos um campo para atualizaçao do produto');
    }

    try {
        //const query = `select * from produtos where usuario_id = $1 and id = $2`;
        //const { rowCount } = await conexao.query(query, [usuario.id, id]);
        const produto = await knex('produtos')
        .where({ usuario_id: usuario.id, id: idProduto })
        .first();

        if (!produto) {
            return res.status(404).json("Produto não encontrado");
        }

        //const queryAtualizacao = `update produtos set ${params.join(', ')} where id = $${n} and usuario_id = $${n + 1}`;
        //const produtoAtualizado = await conexao.query(queryAtualizacao, valores);
        const produtoAtualizado = await knex('produtos')
            .update({ nome, estoque, preco, categoria, descricao, imagem })
            .where({ usuario_id: usuario.id, id: idProduto });
    

        if (!produtoAtualizado) {
            return res.status(400).json("O produto não foi atualizado");
        }

        return res.status(200).json("O produto foi atualizado com sucesso.");
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const excluirProduto = async (req, res) => {
    const { usuario } = req;
    const { id: idProduto } = req.params;

    try {
        const produto = await knex('produtos')
            .where({ usuario_id: usuario.id, id: idProduto })
            .first();

        if (!produto) {
            return res.status(404).json("Produto não encontrado");
        }

        //const produtoExcluido = await conexao.query('delete from produtos where id = $1', [id]);
        const produtoExcluido = await knex('produtos')
            .del()
            .where({ usuario_id: usuario.id, id: idProduto });

        if (!produtoExcluido) {
            return res.status(400).json("O produto não foi excluido");
        }

        return res.status(200).json("Produto excluido com sucesso");
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

module.exports = {
    listarProdutos,
    obterProduto,
    cadastrarProduto,
    atualizarProduto,
    excluirProduto
}