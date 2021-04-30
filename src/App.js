import { BrowserRouter as Router, Route, Switch } from "react-router-dom"
import Home from "./screens/Home"
import Login from "./screens/Login"
import NotFound from "./screens/NotFound"

function App() {
	const isLoggedIn = true
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
