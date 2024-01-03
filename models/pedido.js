const cliente = require('./cliente');
const produto = require('./produto');

module.exports = class pedido { 
  constructor() {
        this.id_pedido = 0;
        this.valor_pedido = 0.0;
	this.qtd = 0;
        this.frete_pedido = 15.00;
        this.data_pedido = '';

        this.cli = new cliente();
        this.prod = new produto();

}

        listar(conexao, callback) {
                var sql = "select * from pedido";
        
                conexao.query(sql, 
                function (err, result) {
                if (err) throw err;
                return  callback(result);
                }
                );
        }
        
        inserir(conexao, callback) {
                var sql = "insert into pedido (valor_pedido, cliente_cpf, frete_pedido) values (?, ?, ?)";

                conexao.query(sql, 
                        [this.valor_pedido, this.cli.cpf, this.frete_pedido],
                        function (err, result) {
                          if (err) throw err;
                          console.log("1 record inserted, ID: " + result.insertId);
                          callback(result);
                          
                        }
                );

        }

        inserirItem(conexao) {
                var sql2 = "insert into pedido_has_produto (pedido_id_pedido, produto_id_produto, qtd) values (?, ?, ?)";

                conexao.query(sql2, 
                                [this.id_pedido, this.prod.id_produto, this.qtd],
                                function (err, result) {
                                       
                                  if (err) throw err;
        
                                }
                        );              

        }
        
        atualizar(connection) {
                var sql = "UPDATE clube SET nome=?, sigla=?, ano_fundacao=?, cidade=?, estado=? WHERE id=?";
            
                connection.query(sql, [this.nome, this.sigla, this.ano, this.cidade, this.estado, this.id],       function (err, result) {
                  if (err) throw err;
                  });
        }
        
        excluir(connection) {
                var sql = "DELETE FROM cliente WHERE id = ?";
            
                connection.query(sql, [this.id],       function (err, result) {
                  if (err) throw err;
                  });
        }

        pesquisar(conexao, callback) {
                var sql = "select * from produto where nome_produto like ?";
            
                conexao.query(sql, [this.nome_produto],
                      function (err, result) {
                        if (err) throw err;
                        return  callback(result);
                      }
                );
              } 

        listarPedido(connection, callback){
                var sql = "select * from pedido, produto, pedido_has_produto where pedido.id_pedido = pedido_has_produto.pedido_id_pedido and produto.id_produto = pedido_has_produto.produto_id_produto"
                connection.query(sql, function (err, result) {
                        if (err) throw err;
                        return callback(result)
                        });

        }
        
};
