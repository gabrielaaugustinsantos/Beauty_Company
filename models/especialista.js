module.exports = class especialista { 
    constructor() {
      this.nome_especialista = "";
      this.cpf_especialista = "";
      this.data_nascimento_especialista = "";
      this.endereco_especialista = ""; 
      this.telefone_especialista = "";
      this.email_especialista = "";
      this.genero_especialista = "";
      this.formacao_especialista = "";
      this.experiencia_especialista = "";
      this.objetivo_especialista = "";
    }

    listar(conexao, callback) {
      var sql = "select * from especialista";
  
      conexao.query(sql, 
      function (err, result) {
      if (err) throw err;
      return  callback(result);
      }
      );
    }

    pesquisarCpf(conexao, callback) {
      var sql = "select * from especialista where cpf_especialista = ?";
  
      conexao.query(sql, [this.cpf_especialista],
      function (err, result) {
      if (err) throw err;
      return  callback(result);
      }
      );
    }

    inserir(conexao) {
      var sql = "insert into especialista (nome_especialista, cpf_especialista, data_nascimento_especialista, endereco_especialista, email_especialista, genero_especialista, telefone_especialista, formacao_especialista, experiencia_especialista, objetivo_especialista) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
      conexao.query(sql, 
                    [this.nome_especialista, this.cpf_especialista, this.data_nascimento_especialista, this.endereco_especialista, this.email_especialista, this.genero_especialista, this.telefone_especialista, this.formacao_especialista, this.experiencia_especialista, this.objetivo_especialista],
                    function (err, result) {
                      if (err) throw err;
                    }
      );
    }
  
    atualizar(connection) {
      var sql = "UPDATE especialista SET nome_especialista=?, data_nascimento_especialista=?, endereco_especialista=?, email_especialista=?, genero_especialista=?, telefone_especialista=?, formacao_especialista=?, experiencia_especialista=?, objetivo_especialista=?  WHERE cpf_especialista=?";
  
      connection.query(sql, [this.nome_especialista, this.data_nascimento_especialista, this.endereco_especialista, this.email_especialista, this.genero_especialista, this.telefone_especialista, this.formacao_especialista, this.experiencia_especialista, this.objetivo_especialista, this.cpf_especialista],       function (err, result) {
        if (err) throw err;
        });
    }
  
    excluir(connection) {
      var sql = "DELETE FROM especialista WHERE cpf_especialista = ?";
  
      connection.query(sql, [this.cpf_especialista],       function (err, result) {
        if (err) throw err;
        });

    }

    pesquisar(conexao, callback) {
      var sql = "select * from especialista where nome_especialista like ?";
  
      conexao.query(sql, [this.nome_especialista],
            function (err, result) {
              if (err) throw err;
              return  callback(result);
            }
      );
    }
};

