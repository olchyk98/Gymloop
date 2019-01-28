// Imports
const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLID,
    GraphQLString,
    GraphQLList,
    GraphQLNonNull,
    GraphQLBoolean
} = require('graphql');

const {
    User
} = require('./models');

// External functions
function generateNoise(l = 256) {
	let a = "",
		b = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890'; // lib

	for(let ma = 0; ma < l; ma++) {
		a += b[Math.floor(Math.random() * b.length)];
	}

	return a;
}

const str = a => a.toString();

// TODO: Connection model
// TODO: Activity model

// !IN
const UserType = new GraphQLObjectType({
    name: "User",
    fields: {
        id: { type: GraphQLID },
        login: { type: GraphQLString },
        password: { type: GraphQLString },
        email: { type: GraphQLString },
        mainActivity: { type: GraphQLString },
        // getActivies
        // getActiviesGraph
        firstLogin: { type: GraphQLString },
        authTokens: { type: new GraphQLList(GraphQLString) },
        lastAuthToken: {
            type: GraphQLString,
            resolve: ({ authTokens: a }) => a.slice(-1)[0]
        }
    }
});

const RootQuery = new GraphQLObjectType({
    name: "RootQuery",
    fields: {
        users: {
            type: new GraphQLList(UserType),
            resolve: () => User.find({})
        },
        validateUserLogin: {
            type: GraphQLBoolean,
            args: {
                login: { type: new GraphQLNonNull(GraphQLString) }
            },
            async resolve(_, { login }) {
                let a = await User.findOne({ login });
                return !!a;
            }
        }
    }
});

const RootMutation = new GraphQLObjectType({
    name: "RootMutation",
    fields: {
        registerUser: {
            type: UserType,
            args: {
                login: { type: new GraphQLNonNull(GraphQLString) },
                password: { type: new GraphQLNonNull(GraphQLString) }
            },
            async resolve(_, { login, password }, { req }) {
                let a = await User.findOne({ login, password });
                if(a) return null;
                
                const token = generateNoise();

                const user = await (new User({
                    login, password,
                    email: "",
                    mainActivity: "",
                    firstLogin: new Date,
                    authTokens: [token]
                })).save();
                
                req.session.id = str(user._id);
                req.session.authToken = token;

                return user;
            }
        },
        loginUser: {
            type: UserType,
            args: {
                login: { type: new GraphQLNonNull(GraphQLString) },
                password: { type: new GraphQLNonNull(GraphQLString) }
            },
            async resolve(_, { login, password }, { req }) {
                let a = await User.findOne({ login, password });

                const token = generateNoise();

                if(a) {
                    req.session.id = str(a._id);
                    req.session.authToken = token;
                }

                return a;
            }
        }
    }
});

// const RootSubscription = new GraphQLObjectType({
//     name: "RootSubscription",
//     fields: {}
// });

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: RootMutation,
    // subscription: RootSubscription
});