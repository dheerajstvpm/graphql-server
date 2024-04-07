"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const express_graphql_1 = require("express-graphql");
const graphql_1 = require("graphql");
const Todos = [
    { id: 1, name: "Cook Meals", description: "Need to cook meals" },
    { id: 2, name: "Wash Clothes", description: "Need to put the clothes in WM" },
];
const TodoType = new graphql_1.GraphQLObjectType({
    name: "Todo",
    description: "This is a todo",
    fields: () => ({
        id: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLInt) },
        name: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
        description: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
    }),
});
const RootQueryType = new graphql_1.GraphQLObjectType({
    name: "Query",
    description: "Root Query",
    fields: () => ({
        todos: {
            type: new graphql_1.GraphQLList(TodoType),
            description: "List of All Todos",
            resolve: () => Todos,
        },
        todo: {
            type: TodoType,
            description: "Single Todo",
            args: {
                id: {
                    type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLInt),
                },
            },
            resolve: (root, args) => {
                return Todos.find((todo) => todo.id === args.id);
            },
        },
    }),
});
const RootMutationType = new graphql_1.GraphQLObjectType({
    name: "Mutation",
    description: "Root Mutation",
    fields: () => ({
        addTodo: {
            type: TodoType,
            description: "Add a new Todo",
            args: {
                name: {
                    type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString),
                },
                description: {
                    type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString),
                },
            },
            resolve: (root, args) => {
                const newTodo = {
                    id: Todos.length + 1,
                    name: args.name,
                    description: args.description,
                };
                Todos.push(newTodo);
                return newTodo;
            },
        },
        deleteTodo: {
            type: TodoType,
            description: "Delete a Todo",
            args: {
                id: {
                    type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLInt),
                },
            },
            resolve: (root, args) => {
                const todo = Todos.find((todo) => todo.id === args.id);
                if (todo) {
                    Todos.splice(Todos.indexOf(todo), 1);
                    return todo;
                }
                return null;
            },
        },
    }),
});
const schema = new graphql_1.GraphQLSchema({
    query: RootQueryType,
    mutation: RootMutationType,
});
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use("/graphql", (0, express_graphql_1.graphqlHTTP)({
    schema: schema,
    graphiql: true,
}));
app.listen(4000);
console.log("Running a GraphQL API server at localhost:4000/graphql");
