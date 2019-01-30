// Imports
const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLID,
    GraphQLString,
    GraphQLList,
    GraphQLNonNull,
    GraphQLBoolean,
    GraphQLInt
} = require('graphql');

const {
    AuthenticationError
} = require('apollo-server');

const {
    User,
    Sleep,
    Training
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

function getDayDate() { // WARNING: Check freq - use PUSH instead of ADDTOSET
    // Thanks: https://stackoverflow.com/questions/2013255/how-to-get-year-month-day-from-a-date-object
    const a = new Date,
          b = a.getUTCMonth() + 1;
          c = a.getUTCDate();
          d = a.getUTCFullYear();

    newdate = `${ d }/${ b }/${ c }`; // 2019/04/21
}

const str = a => a.toString();

// TODO: Training model
// TODO: Sleep session model -> sleep qua, time, did you wke

// !IN
const UserType = new GraphQLObjectType({
    name: "User",
    fields: () => ({
        id: { type: GraphQLID },
        login: { type: GraphQLString },
        password: { type: GraphQLString },
        email: { type: GraphQLString },
        mainActivity: { type: GraphQLString },
        heightCM: { type: GraphQLInt },
        firstLogin: { type: GraphQLString },
        authTokens: { type: new GraphQLList(GraphQLString) },
        connections: {
            type: new GraphQLList(UserType),
            resolve: ({ connections }) => User.find({
                _id: {
                    $in: connections
                }
            })
        },
        lastAuthToken: {
            type: GraphQLString,
            resolve: ({ authTokens: a }) => a.slice(-1)[0]
        },
        weight: { type: GraphQLInt },
        sleeps: {
            type: new GraphQLList(SleepType),
            resolve: ({ id }) => Sleep.find({ creatorID: id })
        },
        trainings: {
            type: new GraphQLList(TrainingType),
            resolve: ({ id }) => Training.find({
                people: {
                    $in: [str(id)]
                }
            })
        },
        monthCalories: {
            type: GraphQLInt,
            async resolve({ id }) {
                // TODO: Calculate food calories

                let a = await Training.find({
                    startTime: {
                        $gte: +new Date - 2678400000 // last 30 days
                    },
                    people: {
                        $in: [str(id)]
                    }
                }).select("destroyedCalories");

                return (a.length) ? a.reduce((a, { destroyedCalories: b }) => a + b) : 0;
            }
        },
        avgSleepTime: {
            type: GraphQLInt,
            async resolve({ id }) { // XXX
                const a = await Sleep.find({ creatorID: str(id) }).select("sleepHours");
                return (a.length) ? a.reduce((a, { sleepHours: b }) => a + b) / a.length : 0;
            }
        },
        connectionsInt: {
            type: GraphQLInt,
            async resolve({ id }) {
                const a = Training.find({
                    people: {
                        $in: [str(id)]
                    }
                }).select("people");


                return (a.length) ? a.reduce((a, { people: b }) => a + b.length - 1) : 0; // NOTE: - self
            }
        },
        appActivity: { type: new GraphQLList(GraphQLString) },
        appActivityMonthGraph: {
            type: new GraphQLList(GraphQLInt), // !IDEA: Scan days - arg
            resolve({ appActivity: actions }) {
                // !:PUSH >> fun getDayDate
                // IDEA: Move this part to the front-end
                    // PROBLEM: The actions array can contain a lot of values, so it's bad for plt. 

                // Get all values that added during the last 30 days
                const tmpMonth = +new Date - 2592000000; // current timestamp - 30 days in milliseconds
                let a = actions.filter(io => {
                    return +new Date(io) >= tmpMonth;
                });

                // Generate freq array
                // [1, 4, 1, 2, 1, 1, 1] -> [{ value: 1, found: 5 }, { value: 4, found: 1 }, ...]
                a = a.map(io => {
                    // Get number of values that describes the same date
                    const values = a.filter(ik => ik === io).length;
                    a = a.filter(ik => ik !== io);
                    return ({
                        day: io,
                        values
                    });
                });
                a = a.filter(io => io.values);

                // Fill up array // XXX: Very dirty
                let aa = [];

                for(let ma = 1; ma <= 30; ma++) {
                    const a_a = new Date(tmpMonth + ma * 86400000),
                        a_b = a_a.getUTCMonth() + 1;
                        a_c = a_a.getUTCDate();
                        a_d = a_a.getUTCFullYear();
            
                    aa.push(`${ a_d }/${ a_b }/${ a_c }`);
                }

                let ab = [];
                const ac = a.map(io => io.day);

                aa.forEach(io => {
                    if(ac.findIndex(ik => ik === io) !== -1) {
                        ab.push(a.find(ik => ik.day === io).values);
                    } else { // add empty day
                        ab.push(0);
                    }
                });

                a = ab;

                return a;
            }
        }
    })
});

const SleepType = new GraphQLObjectType({
    name: "Sleep",
    fields: () => ({
        id: { type: GraphQLID },
        sleepHours: { type: GraphQLInt },
        startTime: { type: GraphQLInt },
        endTime: { type: GraphQLInt },
        creatorID: { type: GraphQLID },
        creator: {
            type: UserType,
            resolve: ({ creatorID }) => User.findById(creatorID)
        }
    })
});

const TrainingType = new GraphQLObjectType({
    name: "Training",
    fields: () => ({
        id: { type: GraphQLID },
        destroyedCalories: { type: GraphQLInt },
        minutes: { type: GraphQLInt },
        startTime: { type: GraphQLInt },
        action: { type: GraphQLString },
        people: {
            type: new GraphQLList(UserType),
            resolve: ({ people }) => User.find({
                _id: {
                    $in: people
                }
            })
        }
    })
});

const RootQuery = new GraphQLObjectType({
    name: "RootQuery",
    fields: {
        users: {
            type: new GraphQLList(UserType),
            resolve: () => User.find({})
        },
        user: {
            type: UserType,
            args: {
                targetID: { type: GraphQLID }
            },
            async resolve(_, { targetID }, { req }) {
                if(!req.session.id || !req.session.authToken) {
                    throw new AuthenticationError("Invalid auth data");
                }

                return User.findById(targetID || req.session.id);
            }
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
                    authTokens: [token],
                    weight: 0,
                    appActivity: [
                        getDayDate()
                    ],
                    heightCM: 0
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
                let a = await User.findOne({
                    $or: [
                        { login },
                        { email: login }
                    ],
                    password
                });

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