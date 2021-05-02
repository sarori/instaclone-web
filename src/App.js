import { useReactiveVar } from "@apollo/client"
import { useState } from "react"
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"
import { ThemeProvider } from "styled-components"
import { darkModeVar, isLoggedInVar } from "./apollo"
import Home from "./screens/Home"
import Login from "./screens/Login"
import NotFound from "./screens/NotFound"
import { darkTheme, GlobalStyles, lightTheme } from "./styles"

function App() {
	const isLoggedIn = useReactiveVar(isLoggedInVar)
	const darkMode = useReactiveVar(darkModeVar)
	return (
		<ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
			<GlobalStyles />
			<div>
				<Router>
					<Switch>
						<Route path="/" exact>
							{isLoggedIn ? <Home /> : <Login />}
						</Route>
						<Route>
							<NotFound />
						</Route>
					</Switch>
				</Router>
			</div>
		</ThemeProvider>
	)
}

export default App
