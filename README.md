Backend do site clone da OLX feito com Node, Typescript e MongoDB como banco de dados. Funciona em conjunto com o projeto react_olx, onde é possível acessar o site e testar todas as funcionalidades direto do navegador: https://react-fdvhm0nnw-wandersondsteixeira.vercel.app/

—> Pré-requisitos globais:

npm i -g nodemon typescript ts-node

—> Instalação de dependências:

npm install

—> Para rodar o projeto:

npm run dev

—> Configuração do arquivo .env (exemplo):

PORT=3001

BASE=http://localhost:3001

DATABASE=mongodb://localhost:27017/olx

SECRET_KEY=87654321

—> Dados para preencher seu banco de dados MongoDB:

Após criar a database olx no MongoDB, criar as collections (ads, categories, states e users) e importar os arquivos de mesmo nome que são disponibilizados na pasta "mongoDB data" do projeto.

—> Para ter acesso aos dados e anúncios do meu usuário, fazer login:

email: teste@teste.com

senha: teste
