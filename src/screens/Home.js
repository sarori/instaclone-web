import { isLoggedInVar } from "../apollo"

function Home() {
	return (
		<div>
			<h1> Home </h1> <button onClick={() => isLoggedInVar(false)}> Log out now! </button>
			<h2>hello</h2>
		</div>
	)
}
export default Home
