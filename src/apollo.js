import {
	ApolloClient,
	InMemoryCache,
	makeVar,
	gql,
	ApolloLink,
	HttpLink,
	concat,
} from "@apollo/client"
import { onError } from "@apollo/client/link/error"

const typeDefs = gql`
	extend type Query {
		isLoggedIn: Boolean!
	}
`
const TOKEN = "TOKEN"
const DARK_MODE = "DARK_MODE"

export const isLoggedInVar = makeVar(Boolean(localStorage.getItem(TOKEN)))
export const darkModeVar = makeVar(Boolean(localStorage.getItem(DARK_MODE)))

export const enableDarkMode = () => {
	localStorage.setItem(DARK_MODE, "enabled")
	darkModeVar(true)
}

export const disenableDarkMode = () => {
	localStorage.removeItem(DARK_MODE)
	darkModeVar(false)
}

export const logUserIn = (token) => {
	localStorage.setItem(TOKEN, token)
	isLoggedInVar(true)
}

export const logUserOut = () => {
	localStorage.removeItem(TOKEN)
	window.location.reload()
}

const cache = new InMemoryCache({
	typePolicies: {
		User: {
			keyFields: (obj) => `Users:${obj.username}`,
		},
		Query: {
			fields: {
				isLoggedIn: {
					read() {
						return isLoggedInVar()
					},
				},
			},
		},
	},
})

const authMiddle = new ApolloLink((operation, forward) => {
	operation.setContext({ headers: { token: localStorage.getItem("TOKEN") || "" } })
	return forward(operation)
})

const errLink = onError(({ graphqlErrors, networkError }) => {
	if (graphqlErrors) {
		graphqlErrors.map(({ message }) => console.log("network graphql Error : ", message))
	}
})

const httpLink = new HttpLink({
	uri: "http://localhost:4000/graphql",
})

export const client = new ApolloClient({
	cache,
	link: ApolloLink.from([errLink, concat(authMiddle, httpLink)]),
	headers: {
		authorization: localStorage.getItem("X-JWT") || "",
	},
	typeDefs,
})
