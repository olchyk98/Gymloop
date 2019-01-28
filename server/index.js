const { createServer } = require('http');
const app = require('express')();
const { ApolloServer } = require('apollo-server-express');
const cookies = require('cookie-session');
const mongoose = require('mongoose');

const schema = require('./schema');

mongoose.connect("mongodb://oles:0password@ds213665.mlab.com:13665/gymloop-dev", {
    useNewUrlParser: true
});
mongoose.connection.once("open", () => console.log("Server was connected to the database!"));

// Express middlewares
app.use(new cookies({
    age: 24 * 60 * 60 * 1000,
    name: 'session',
    keys: [
        'zKSHCHt83jatf26H',
        'YMUVWE3LdCpyFgqP',
        'Uz2THg93Xs9UuC5d',
        'dKskmeBsL3gwLMd3',
        'J5V6TtwhDAVRuska'
    ]
}));

// ...
const server = new ApolloServer({
    schema,
    context: ({ req }) => ({ req }),
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