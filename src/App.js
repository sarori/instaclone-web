import { useReactiveVar } from "@apollo/client"
import { useState } from "react"
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"
import { isLoggedInVar } from "./apollo"
import Home from "./screens/Home"
import Login from "./screens/Login"
import NotFound from "./screens/NotFound"

function App() {
	const isLoggedIn = useReactiveVar(isLoggedInVar)
	return (
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
	)
}

export default App
