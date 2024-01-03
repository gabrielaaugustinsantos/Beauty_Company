const express = require('express');
const app = express();

app.use(express.static(__dirname + '/views'));

app.listen(3000, function(){
    console.log("Servidor no ar - Porta : 3000");
});

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:true}));

var mysql = require('mysql');
var conexao = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "beautycompany"
});

conexao.connect(function(err) {
    if (err) throw err;
    console.log("Banco de Dados Conectado");
});

/* npm install --save express-session */
const session = require('express-session');
app.use(session({secret: 'teste', saveUninitialized: true, resave: true}));

/* HOME */

app.get('/', function(req, res){
    res.render('index.ejs', {msg: req.session.nome + '(' + req.session.email + ')', logado: (req.session.email ? true:false), admin: (req.session.is_admin ? true:false)});
});

/* LOGIN */
app.get('/entrar', function(req, res){
	if (req.session.email) {
		res.render('login.ejs', {msg: req.session.nome + '(' + req.session.email + ')', logado: (req.session.email ? true:false), admin: (req.session.is_admin ? true:false)});
	 } else {
		res.render('login.ejs', {msg: '', logado: false, admin: false});
	} 
});

app.post('/login', function(req, res){
	
	if (req.body.email == '' || req.body.senha == '') {
		res.render('login.ejs', {msg: 'Você deve informar e-mail e senha!!!', logado: false, admin: false});
	} else {
		var c = new cliente();
		c.email = req.body.email;
		c.senha = req.body.senha;
		
		c.logar(conexao, function(result) {
			if (result.length > 0) {
				req.session.nome = result[0].nome;
				req.session.is_admin = result[0].is_admin;
				req.session.email = req.body.email;
                req.session.cpf = result[0].cpf;
			
				res.render('login.ejs', {msg: req.session.nome + ' (' + req.session.email + ')', logado: (req.session.email ? true:false), admin: (req.session.is_admin ? true:false)});
			} else {
				res.render('login.ejs', {msg: 'E-mail ou Senha inválidos!!!', logado: false, admin: false});
			}
		});	
	}
});

/* Processar logout do sistema */
app.get('/logout', function(req, res){
	req.session.destroy();
	res.render('login.ejs', {msg: 'Usuário desconectado!!!', logado: false, admin: false});
});

/* CLIENTE */

const cliente = require('./models/cliente.js');

app.get('/form_cliente', function(req, res){
       
        const a = "Inserir"
        res.render('cliente/form_cliente.ejs', {c: new cliente(), a, logado: (req.session.email ? true:false), admin: (req.session.is_admin ? true:false)});
});

    app.post('/form_cliente', function(req, res){
            var acao = req.body.acao.trim();
            
            if (acao == "Inserir") {
                res.render('cliente/form_cliente.ejs', {c: new cliente(), a: acao, logado: (req.session.email ? true:false), admin: (req.session.is_admin ? true:false)});
            }

            if  (acao == "Atualizar") {
                var cli = new cliente();
                cli.cpf = req.body.cpf;

                cli.pesquisarCpf(conexao, function(result) {
                    cli.nome = result[0].nome;
                    cli.cpf = result[0].cpf;
                    cli.data_nascimento = result[0].data_nascimento;
                    cli.email = result[0].email;
                    cli.senha = result[0].senha;
                    cli.isAdmin = result[0].is_admin;
                    cli.genero = result[0].genero;
                    cli.endereco = result[0].endereco;
                    cli.telefone = result[0].telefone;
                    cli.whatsapp = result[0].whatsapp;

                    res.render('cliente/form_cliente.ejs', {c: cli, a: acao, logado: (req.session.email ? true:false), admin: (req.session.is_admin ? true:false)});
                });
            }


            if (acao == 'Excluir') {
                var cli = new cliente();
                cli.cpf = req.body.cpf;
                cli.excluir(conexao);
                res.render('cliente/salvar_cliente.ejs', {msg: "Cliente excluido com sucesso!", logado: (req.session.email ? true:false), admin: (req.session.is_admin ? true:false)});    
            }

    });

    app.post('/processarcliente', function(req, res){
    
        var c = new cliente();
    
        c.nome = req.body.nome;
        c.cpf = req.body.cpf;
        c.data_nascimento = req.body.data_nascimento;
        c.email = req.body.email;
        c.senha = req.body.senha;
        c.genero = req.body.genero;
        c.endereco = req.body.endereco;
        c.telefone = req.body.telefone;
        c.whatsapp = req.body.whatsapp;

        var acao = req.body.acao;
        if (acao == "Inserir") {
            c.inserir(conexao);
        } else {
            c.atualizar(conexao);
        }
    
        res.render('cliente/salvar_cliente.ejs', {msg: "Suas informações foram salvas com sucesso!", logado: (req.session.email ? true:false), admin: (req.session.is_admin ? true:false)});
   
    });

app.get('/lista_cliente', function(req, res){
    if (req.session.email) {
        
    var c = new cliente();

    c.listar(conexao, function(result){
      res.render('cliente/lista_cliente.ejs', {cliente: result, logado: (req.session.email ? true:false), admin: (req.session.is_admin ? true:false)});
    });

    } else {
    res.render('login.ejs', {msg: '', logado: false, admin: false});
    }
});

app.get('/salvar_cliente', function(req, res){
    if (req.session.email) {

    res.render('cliente/salvar_cliente.ejs', {logado: (req.session.email ? true:false), admin: (req.session.is_admin ? true:false)});

    } else {
    res.render('login.ejs', {msg: '', logado: false, admin: false});
    }
});

app.post('/pesquisarCliente', function(req, res){
	if (req.session.email) {
		var c = new cliente();
  
		c.nome = '%' + req.body.nome + '%';

		c.pesquisar(conexao, function(result) {
			res.render('cliente/lista_cliente.ejs', {cliente: result, logado: (req.session.email ? true:false), admin: (req.session.is_admin ? true:false)});
		});
	} else {
		res.render('login.ejs', {msg: '', logado: false, admin: false});
	}
});

/*  perfil  */
             
app.get('/perfil', function(req, res){
       
    var c = new cliente();
    c.cpf = req.session.cpf;
    const a = "Atualizar Perfil"

    c.pesquisarCpf(conexao, function(result) {
        res.render('cliente/form_cliente.ejs', {c: result[0], a, logado: (req.session.email ? true:false), admin: (req.session.is_admin ? true:false)});
    })

});

/* ESPECIALISTA */

const especialista = require('./models/especialista.js')

app.get('/form_especialista', function(req, res){
       
    const a = "Inserir"
    res.render('especialista/form_especialista.ejs', {e: new especialista(), a, logado: (req.session.email ? true:false), admin: (req.session.is_admin ? true:false)});
});

        app.post('/form_especialista', function(req, res){
            var acao = req.body.acao.trim();

            if (acao == "Inserir") {
                res.render('especialista/form_especialista.ejs', {e: new especialista(), a: acao, logado: (req.session.email ? true:false), admin: (req.session.is_admin ? true:false)});
            }

            if (acao == "Atualizar") {
                var esp = new especialista();
                esp.cpf_especialista = req.body.cpf_especialista;

                esp.pesquisarCpf(conexao, function(result) {
                    esp.nome_especialista = result[0].nome_especialista;
                    esp.cpf_especialista = result[0].cpf_especialista;
                    esp.data_nascimento_especialista = result[0].data_nascimento_especialista;
                    esp.endereco_especialista= result[0].endereco_especialista;
                    esp.telefone_especialista = result[0].telefone_especialista;
                    esp.email_especialista = result[0].email_especialista;
                    esp.genero_especialista = result[0].genero_especialista;
                    esp.formacao_especialista = result[0].formacao_especialista;
                    esp.experiencia_especialista = result[0].experiencia_especialista;
                    esp.objetivo_especialista = result[0].objetivo_especialista;

                    res.render('especialista/form_especialista.ejs', {e: esp, a: acao, logado: (req.session.email ? true:false), admin: (req.session.is_admin ? true:false)});
            });

        }

            if (acao == "Excluir") {
                var esp = new especialista();
                esp.cpf_especialista = req.body.cpf_especialista;
                esp.excluir(conexao);
                res.render('especialista/salvar_especialista.ejs', {msg: "Especialista excluido com sucesso!", logado: (req.session.email ? true:false), admin: (req.session.is_admin ? true:false)});
            }

        });


app.post('/processarespecialista', function(req, res){
        
    var e = new especialista();
  
    e.nome_especialista = req.body.nome_especialista;
    e.cpf_especialista = req.body.cpf_especialista;
    e.data_nascimento_especialista = req.body.data_nascimento_especialista;
    e.endereco_especialista = req.body.endereco_especialista;
    e.telefone_especialista = req.body.telefone_especialista;
    e.email_especialista = req.body.email_especialista; 
    e.genero_especialista = req.body.genero_especialista; 
    e.formacao_especialista = req.body.formacao_especialista;
    e.experiencia_especialista = req.body.experiencia_especialista;
    e.objetivo_especialista = req.body.objetivo_especialista;
  
    var acao = req.body.acao;
    if (acao == "Inserir") {
        e.inserir(conexao);
    } else {
        e.atualizar(conexao);
    }

    res.render('especialista/salvar_especialista.ejs', {msg: "Suas informações foram salvas com sucesso!", logado: (req.session.email ? true:false), admin: (req.session.is_admin ? true:false)});

});

app.get('/lista_especialista', function(req, res){
    if (req.session.email) {

    var e = new especialista();

    e.listar(conexao, function(result){
      res.render('especialista/lista_especialista.ejs', {especialista: result, logado: (req.session.email ? true:false), admin: (req.session.is_admin ? true:false)});
    });

    } else {
    res.render('login.ejs', {msg: '', logado: false, admin: false});
    }
});

app.get('/salvar_especialista', function(req, res){
    if (req.session.email) {
        
    res.render('especialista/salvar_especialista.ejs',{logado: (req.session.email ? true:false), admin: (req.session.is_admin ? true:false)});

    } else {
    res.render('login.ejs', {msg: '', logado: false, admin: false});
    }
});

app.post('/pesquisarEspecialista', function(req, res){
	if (req.session.email) {
		var e = new especialista();
  
		e.nome_especialista = '%' + req.body.nome_especialista + '%';

		e.pesquisar(conexao, function(result) {
			res.render('especialista/lista_especialista.ejs', {especialista: result, logado: (req.session.email ? true:false), admin: (req.session.is_admin ? true:false)});
		});
	} else {
		res.render('login.ejs', {msg: '', logado: false, admin: false});
	}
});

/* PEDIDO */

const pedido = require('./models/pedido.js')

app.get('/form_pedido', function(req, res){
    if (req.session.email) {

        res.render('pedido/form_pedido.ejs', {logado: (req.session.email ? true:false), admin: (req.session.is_admin ? true:false)});

    } else {
        res.render('login.ejs', {msg: '', logado: false, admin: false});
    }
});

app.post('/processarpedido', function(req, res){
    if (req.session.email) {
        
       var acao = req.body.acao.trim();
      
        if (acao == "Comprar") {
            var p = new pedido();

            p.cli.cpf = req.session.cpf;
            p.prod.id_produto = req.body.id_produto;
            p.prod.nome_produto = req.body.nome_produto;
            p.qtd = req.body.quantidade;
            p.prod.valor_produto = req.body.valor_produto; 

            /* calcular o valor total - taxa fixa de R$15,00 de frete */
            p.valor_pedido = (parseFloat(p.qtd) * parseFloat(p.prod.valor_produto)) + 15.00;  

            p.inserir(conexao, function(result){
                p.id_pedido = result.insertId;
                p.inserirItem(conexao);
            });

            res.render('pedido/salvar_pedido.ejs', {pr: new produto(), acao: acao, logado: (req.session.email ? true:false), admin: (req.session.is_admin ? true:false)}); 
        
        }
      
        if (acao == "Adicionar Produto") {
            res.render('produto/form_produto.ejs', {pr: new produto(), a: acao, logado: (req.session.email ? true:false), admin: (req.session.is_admin ? true:false)});
        }
       
        } else {
        res.render('login.ejs', {msg: '', logado: false, admin: false});
        }
});

app.get('/lista_pedido', function(req, res){
    if (req.session.email) {

    var p = new pedido();
   
    p.listarPedido(conexao, function(result){
        res.render('pedido/lista_pedido.ejs', {pedido: result, logado: (req.session.email ? true:false), admin: (req.session.is_admin ? true:false)});
    })

    } else {
    res.render('login.ejs', {msg: '', logado: false, admin: false});
    }
});

app.get('/salvar_pedido', function(req, res){
    if (req.session.email) {

    res.render('pedido/salvar_pedido.ejs', {logado: (req.session.email ? true:false), admin: (req.session.is_admin ? true:false)});
    
    } else {
    res.render('login.ejs', {msg: '', logado: false, admin: false});
    }
});

app.post('/pesquisarPedido', function(req, res){
    var p = new pedido();
    var pr = new produto();

		pr.nome_produto = '%' + req.body.nome_produto + '%';

		p.pesquisar(conexao, function(result) {
			res.render('pedido/lista_pedido.ejs', {pedido: result, logado: (req.session.email ? true:false), admin: (req.session.is_admin ? true:false)});
		});

});

/* PRODUTO */

const produto = require('./models/produto.js')

app.get('/form_produto', function(req, res){
    if (req.session.email) {
        
    res.render('produto/form_produto.ejs', {logado: (req.session.email ? true:false), admin: (req.session.is_admin ? true:false)});

    } else {
    res.render('login.ejs', {msg: '', logado: false, admin: false});
    }
});

app.post('/processarproduto', function(req, res){
    if (req.session.email) {
        
    var pr = new produto();
    var acao = req.body.acao;    
  
    pr.id_produto = req.body.id_produto;
    pr.nome_produto = req.body.nome_produto;
    pr.valor_produto = req.body.valor_produto;
   

    pr.inserir(conexao);
  
    res.render('produto/salvar_produto.ejs', {logado: (req.session.email ? true:false), admin: (req.session.is_admin ? true:false)});

    } else {
    res.render('login.ejs', {msg: '', logado: false, admin: false});
    }
});

app.get('/lista_produto', function(req, res){

    var pr = new produto();

    pr.listar(conexao, function(result){
      res.render('produto/lista_produto.ejs', {produto: result, logado: (req.session.email ? true:false), admin: (req.session.is_admin ? true:false)});
    });
});

app.get('/salvar_produto', function(req, res){
    if (req.session.email) {

    res.render('produto/salvar_produto.ejs', {logado: (req.session.email ? true:false), admin: (req.session.is_admin ? true:false)});

} else {
    res.render('login.ejs', {msg: '', logado: false, admin: false});
    }
});

app.post('/pesquisarProduto', function(req, res){
		var pr = new produto();
  
		pr.nome_produto = '%' + req.body.nome_produto + '%';

		pr.pesquisar(conexao, function(result) {
			res.render('produto/lista_produto.ejs', {produto: result, logado: (req.session.email ? true:false), admin: (req.session.is_admin ? true:false)});
		});
	
});

