const express = require("express");
const { ApolloServer, gql } = require("apollo-server-express");
const mongoose = require("mongoose");
require("dotenv").config();

const Mission = require("./models/Mission");

// Connect to MongoDB using the URI from the .env file
mongoose
	.connect(process.env.MONGODB_URI)
	.then(() => console.log("MongoDB connected"))
	.catch((err) => console.log(err));

// Define your type definitions (schema)
const typeDefs = gql`
	type Mission {
		id: ID!
		url: String
		name: String!
		description: String!
		startDate: String!
		endDate: String
		launchSite: String
		destination: String
	}

	type Query {
		missions: [Mission]
	}

	type Mutation {
		addMission(
			url: String
			name: String!
			description: String!
			startDate: String!
			endDate: String
			launchSite: String
			destination: String
		): Mission
		updateMission(
			id: ID!
			url: String
			name: String!
			description: String!
			startDate: String!
			endDate: String
			launchSite: String
			destination: String
		): Mission
		deleteMission(id: ID!): Mission
	}
`;

// Define your resolvers
const resolvers = {
	Query: {
		missions: async () => await Mission.find(),
	},
	Mutation: {
		addMission: async (parent, args) => {
			const newMission = new Mission({ ...args });
			return await newMission.save();
		},
		updateMission: async (parent, { id, ...args }) => {
			return await Mission.findByIdAndUpdate(id, args, { new: true });
		},
		deleteMission: async (parent, { id }) => {
			return await Mission.findByIdAndDelete(id);
		},
	},
};

// Create an Apollo server
const server = new ApolloServer({ typeDefs, resolvers });

const app = express();
server.start().then(() => {
	server.applyMiddleware({ app });

	app.listen({ port: 4000 }, () =>
		console.log(`Server ready at http://localhost:4000${server.graphqlPath}`)
	);
});
