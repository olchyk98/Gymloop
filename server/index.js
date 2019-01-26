const { createServer } = require('http');
const app = require('express')();
const { ApolloServer } = require('apollo-server-express');

const schema = require('./schema');

const server = new ApolloServer({
    schema,
    playground: {
        settings: {
            'editor.theme': 'light'
        }
    }
});

server.applyMiddleware({
    app,
    path: '/graphql',
    cors: {
        origin: 'http://localhost:3000',
        credentials: true
    }
});
const httpServer = createServer(app);
server.installSubscriptionHandlers(httpServer);

httpServer.listen(4000, () => console.log("Server is listening on port 4000!"));