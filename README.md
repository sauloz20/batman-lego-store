# Batman LEGO Store

Loja de LEGO do Batman em React Native com Expo. O cadastro e o login usam uma API PHP com PDO e MySQL. O checkout continua usando o serviço externo de Mercado Pago configurado no projeto original.

## Executar

1. Inicie o MySQL ou MariaDB e importe database/schema.sql pelo phpMyAdmin.
2. Use PHP 8 com pdo_mysql. Configure BATMAN_DB_DSN, BATMAN_DB_USER e BATMAN_DB_PASSWORD no ambiente do servidor. Os valores locais padrão são MySQL em 127.0.0.1, banco batman_store, usuário root e senha vazia.
3. Na raiz do projeto, execute php -S 0.0.0.0:8080 -t backend/public para desenvolvimento local.
4. Copie .env.example para .env. Em um celular na mesma rede, troque localhost pelo IP do computador.
5. Execute npm install e npx expo start. Reinicie o Expo após alterar a URL.

Para usar o Snack, hospede backend/public em um servidor PHP com HTTPS e configure a URL completa de index.php em config/api.js. As credenciais do banco ficam no servidor. Contas do serviço anterior precisam de migração ou novo cadastro. O perfil salvo no aparelho serve para a interface e não autoriza operações protegidas no servidor.
