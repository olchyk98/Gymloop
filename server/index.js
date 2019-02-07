const { createServer } = require('http');
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const cookies = require('cookie-session');
const mongoose = require('mongoose');

const schema = require('./schema');

mongoose.connect("mongodb://oles:0password@ds213665.mlab.com:13665/gymloop-dev", {
    useNewUrlParser: true
});
mongoose.connection.once("open", () => console.log("Server was connected to the database!"));

// Create app instance
const app = express();

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

// Allow users to use server files
app.use('/files', express.static('./files'));

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
        origin: [ // NOTE: Wow. I didn't know that I can use few urls :)
            'http://localhost:3000',
            'http://192.168.10.170:3000'
        ],
        credentials: true
    }
});
const httpServer = createServer(app);
server.installSubscriptionHandlers(httpServer);

httpServer.listen(4000, () => console.log("Server is listening on port 4000!"));