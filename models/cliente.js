module.exports = class cliente { 
    constructor() {
      this.nome = "";
      this.cpf = "";
      this.data_nascimento = "";
      this.email = "";
	    this.senha = "";
      this.genero= "";
      this.endereco = "";
      this.telefone = "";
      this.whatsapp = "";
      this.isAdmin = false;
    }

    listar(conexao, callback) {
        var sql = "select * from cliente";
    
        conexao.query(sql, 
        function (err, result) {
        if (err) throw err;
        return  callback(result);
        }
        );
      }

      pesquisarCpf(conexao, callback) {
        var sql = "select * from cliente where cpf = ?";
    
        conexao.query(sql, [this.cpf],
        function (err, result) {
        if (err) throw err;
        return  callback(result);
        }
        );
      }

      inserir(conexao) {
        var sql = "insert into cliente (nome, cpf, data_nascimento, email, senha, genero, endereco, telefone, whatsapp) values (?, ?, ?, ?, ?, ?, ?, ?, ?)";
        conexao.query(sql, 
                      [this.nome, this.cpf, this.data_nascimento, this.email, this.senha, this.genero, this.endereco, this.telefone, this.whatsapp],
                      function (err, result) {
                        if (err) throw err;
                      }
        );
    
      }
    
      atualizar(connection) {
        var sql = "UPDATE cliente SET nome=?, data_nascimento=?, email=?, senha=?, genero=?, endereco=?, telefone=?, whatsapp=?, is_admin = ? WHERE cpf=?";
    
        connection.query(sql, [this.nome, this.data_nascimento, this.email, this.senha, this.genero, this.endereco, this.telefone, this.whatsapp, this.isAdmin, this.cpf],       function (err, result) {
          if (err) throw err;
          });
      }

      excluir(conexao) {
        var sql = "DELETE FROM cliente WHERE cpf = ?";
    
        conexao.query(sql, [this.cpf],       function (err, result) {
          if (err) throw err;
          });
      }

      logar(conexao, callback) { 
        var sql = "select nome, email, is_admin, cpf from cliente where email = ? and senha = ?";
    
        conexao.query(sql, [this.email, this.senha],
              function (err, result) {
                if (err) throw err;
                return  callback(result);
              }
        );
      }

      pesquisar(conexao, callback) {
        var sql = "select * from cliente where nome like ?";
    
        conexao.query(sql, [this.nome],
              function (err, result) {
                if (err) throw err;
                return  callback(result);
              }
        );
      }


}