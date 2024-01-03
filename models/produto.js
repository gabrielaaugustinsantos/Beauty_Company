module.exports = class produto { 
    constructor() {
      this.id_produto = 0;
      this.nome_produto = "";
      this.valor_produto = 0.0;
    }


listar(conexao, callback) {
    var sql = "select * from produto";

    conexao.query(sql,
    function (err, result) {
    if (err) throw err;
    return  callback(result);
    }
    );
}


inserir(conexao) {
  var sql = "insert into produto (id_produto, nome_produto, valor_produto) values (?, ?,?)";
  conexao.query(sql,
                [this.id_produto, this.nome_produto, this.valor_produto],
                function (err, result) {
                  if (err) throw err;
                }
  );

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

};


  