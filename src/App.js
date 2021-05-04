import { ApolloProvider, useReactiveVar } from "@apollo/client"
import { HelmetProvider } from "react-helmet-async"
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"
import { ThemeProvider } from "styled-components"
import { client, darkModeVar, isLoggedInVar } from "./apollo"
import routes from "./routes"
import Home from "./screens/Home"
import Login from "./screens/Login"
import NotFound from "./screens/NotFound"
import SignUp from "./screens/SignUp"
import { darkTheme, GlobalStyles, lightTheme } from "./styles"

function App() {
	const isLoggedIn = useReactiveVar(isLoggedInVar)
	return (
		<ApolloProvider client={client}>
			<HelmetProvider>
				<ThemeProvider theme={darkModeVar ? darkTheme : lightTheme}>
					<GlobalStyles />
					<div>
						<Router>
							<Switch>
								<Route path={routes.home} exact>
									{isLoggedIn ? <Home /> : <Login />}
								</Route>
								{!isLoggedIn ? (
									<Route path={routes.signUp}>
										<SignUp />
									</Route>
								) : null}

								<Route>
									<NotFound />
								</Route>
							</Switch>
						</Router>
					</div>
				</ThemeProvider>
			</HelmetProvider>
		</ApolloProvider>
	)
}

export default App
