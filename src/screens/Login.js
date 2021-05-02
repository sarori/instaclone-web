import { darkModeVar } from "../apollo"
import styled from "styled-components"

const Title = styled.h1`
	color: ${(props) => props.theme.fontColor};
`

const Container = styled.div`
	background-color: ${(props) => props.theme.bgColor};
`
const TogglePotato = styled.button`
	color: red;
`

function Login() {
	return (
		<Container>
			<Title>Login</Title>
			<button onClick={() => darkModeVar(true)}>To Dark Mode</button>
			<button onClick={() => darkModeVar(false)}>To Light Mode</button>
		</Container>
	)
}
export default Login
