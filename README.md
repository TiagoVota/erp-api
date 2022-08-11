# 🏢 ERP API
## 🚀 Descrição do Projeto
Está cansado de ter pilhas de papel para organizar sua empresa? Então temos a solução perfeita para você! Utilize a ERP API e desfrute da praticidade e facilidade na hora de gerenciar seus funcionários, clientes e transações!!!


<br/>


## 🔍 Sobre
Na ERP API você poderá adicionar, editar e deletar as informações dos profissionais envolvidos em seu negócio, sem falar que cada um deles pode possuir uma especialização na sua empresa, tendo permissão para fazer pagamentos, compras e muito mais! Fácil, não é mesmo? Nessa API, podemos encontrar as seguintes funcionalidades:

### Features
- [x] [`Verificar se o server está funcionando`](#get-health)
- [x] [`Cadastrar um administrador`](#post-adminauthsign-up)
- [x] [`Como admin, cadastrar uma empresa`](#post-adminenterprise)
- [x] [`Como admin, editar os dados da empresa`](#put-adminenterprise)
- [x] [`Como admin, adicionar usuários`](#post-authsign-up)
- [x] [`Como admin, editar as informações de usuários`](#put-adminusersuserid)
- [x] [`Receber dados da empresa`](#get-enterprises)
- [x] [`Fazer login como usuário`](#post-authlogin)
- [x] [`Visualizar informação de um usuário`](#get-usersuserid)
- [x] [`Modificar permissões de usuários`](#put-userspermissionsuserid)
- [x] [`Visualizar usuários e suas permissões`](#get-users)
- [x] [`Modificar os dados do seu usuário`](#put-usersuserid)
- [x] [`Remover usuários`](#delete-usersuserid)
- [x] [`Realizar transações`](#get-transactions)
- [x] [`Visualizar transações`](#post-transactions)
- [x] [`Modificar dados das transações`](#put-transactionstransactionid)
- [x] [`Deletar transações`](#delete-transactionstransactionid)

<br/>


## ✔️ Tabela de conteúdo
<!--ts-->
- [🏢 ERP API](#-erp-api)
	- [🚀 Descrição do Projeto](#-descrição-do-projeto)
	- [🔍 Sobre](#-sobre)
		- [Features](#features)
	- [✔️ Tabela de conteúdo](#️-tabela-de-conteúdo)
	- [🖥 Tecnologias](#-tecnologias)
	- [⚙ Como usar](#-como-usar)
		- [Instalando a API](#instalando-a-api)
		- [Preparando setup](#preparando-setup)
		- [Populando banco de dados](#populando-banco-de-dados)
		- [Inicializando a API](#inicializando-a-api)
	- [📜 Documentação](#-documentação)
		- [`GET /health`](#get-health)
		- [`POST /admin/auth/sign-up`](#post-adminauthsign-up)
		- [`POST /admin/enterprise`](#post-adminenterprise)
		- [`PUT /admin/enterprise`](#put-adminenterprise)
		- [`PUT /admin/users/:userId`](#put-adminusersuserid)
		- [`POST /auth/login`](#post-authlogin)
		- [`POST /auth/sign-up`](#post-authsign-up)
		- [`PUT /users/permissions/:userId`](#put-userspermissionsuserid)
		- [`GET /users`](#get-users)
		- [`GET /users/:userId`](#get-usersuserid)
		- [`DELETE /users/:userId`](#delete-usersuserid)
		- [`PUT /users/:userId`](#put-usersuserid)
		- [`GET /enterprises`](#get-enterprises)
		- [`GET /transactions`](#get-transactions)
		- [`POST /transactions`](#post-transactions)
		- [`PUT /transactions/:transactionId`](#put-transactionstransactionid)
		- [`DELETE /transactions/:transactionId`](#delete-transactionstransactionid)
	- [🤖 Testes](#-testes)
	- [👨🏼‍💻 Autor](#-autor)
<!--te-->

<br/>


## 🖥 Tecnologias
<p align="center">
	<img alt="npm" src="https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white"/>
	<img alt="nodejs" src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white"/>
	<img alt="javascript" src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" />
	<img alt="expressjs" src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white"/>
	<img alt="postgresql" src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white"/>
	<img alt="jest" src="https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest&logoColor=white"/>
	<img alt="eslinter" src="https://img.shields.io/badge/eslint-3A33D1?style=for-the-badge&logo=eslint&logoColor=white"/>
</p>

<br/>


## ⚙ Como usar

Para utilizar essa API, será necessário ter na sua máquina as seguintes ferramentas:
[Git](https://git-scm.com), [Node.js](https://nodejs.org/en/) e [PostgreSQL](https://www.postgresql.org/).
Além disso recomendo fortemente a utilização de um bom ter um editor de código, como o [VSCode](https://code.visualstudio.com/)!


### Instalando a API
```bash
# Clone este repositório
git clone https://github.com/TiagoVota/erp-api.git
# Acesse a pasta do projeto no terminal/cmd
cd erp-api
# Instale as dependências
npm install
```


### Preparando setup
Na pasta principal da API, crie um arquivo `.env.dev` aos mesmos moldes do arquivo [`.env.example`](https://github.com/TiagoVota/erp-api/blob/main/.env.example). Caso você queira ver nossos testes em ação, crie um arquivo `.env.test` também aos mesmos moldes do [`.env.example`](https://github.com/TiagoVota/erp-api/blob/main/.env.example).


### Populando banco de dados

```bash
# Popular sua database através de um script
npm run seed
```
Caso queira ver, a população da database será feita através [desse script](https://github.com/TiagoVota/erp-api/blob/main/prisma/seed/seed.js). Além disso, a estrutura do nosso banco de dados pode ser vista através [desse arquivo](https://github.com/TiagoVota/erp-api/blob/main/prisma/schema.prisma)!


### Inicializando a API
```bash
# Execute a aplicação em modo de desenvolvimento
npm run start:dev
# O servidor iniciará na porta:PORT (escolhida no arquivo .env) - acesse http://localhost:PORT 
```

<br/>


## 📜 Documentação
Agora veremos quais os principais endpoints dessa aplicação

### `GET /health`

### `POST /admin/auth/sign-up`

### `POST /admin/enterprise`

### `PUT /admin/enterprise`

### `PUT /admin/users/:userId`

### `POST /auth/login`

### `POST /auth/sign-up`

### `PUT /users/permissions/:userId`

### `GET /users`

### `GET /users/:userId`

### `DELETE /users/:userId`

### `PUT /users/:userId`

### `GET /enterprises`

### `GET /transactions`

### `POST /transactions`

### `PUT /transactions/:transactionId`

### `DELETE /transactions/:transactionId`

<br/>


## 🤖 Testes
Para essa API foram implementados testes de integração e unitários! Segue a listinha de comando que temos para utilizar:

```bash
# Roda uma única vez os testes
npm run test
# Avalia a taxa de cobertura dos testes
npm run test:coverage
```

<br/>


## 👨🏼‍💻 Autor

<img border-radius='50%' style="border-radius: 50%;" src="https://avatars.githubusercontent.com/u/56308226?v=4" width="100px;" alt="Foto de perfil Tiago Vota Cucco"/>

Feito com carinho por Tiago Vota Cucco. Entre em contato comigo!

[![Gmail Badge](https://img.shields.io/badge/-tiagovotacucco@gmail.com-c14438?style=flat&logo=Gmail&logoColor=white&link=mailto:tiagovotacucco@gmail.com)](mailto:tiagovotacucco@gmail.com)
[![Linkedin Badge](https://img.shields.io/badge/-Tiago-Vota?style=flat&logo=Linkedin&logoColor=white&color=blue&link=https://www.linkedin.com/in/tiago-vota-cucco)](https://www.linkedin.com/in/tiago-vota-cucco) 

<br/><br/>
