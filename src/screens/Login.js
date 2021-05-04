import styled from "styled-components"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faFacebookSquare, faInstagram } from "@fortawesome/free-brands-svg-icons"
import routes from "../routes"
import Button from "../components/auth/Button"
import AuthLayout from "../components/auth/AuthLayout"
import Seperator from "../components/auth/Seperator"
import Input from "../components/auth/Input"
import FormBox from "../components/auth/FormBox"
import BottomBox from "../components/auth/BottomBox"
import { useState } from "react"

const FacebookLogin = styled.div`
	color: #385285;
	span {
		margin-left: 10px;
		font-weight: 600;
	}
`

function Login() {
	const [username, setUsername] = useState("")
	const [usernameError, setUsernameError] = useState("")
	const onUsernameChange = (event) => {
		setUsernameError("")
		setUsername(event.target.value)
	}
	const handleSubmit = (event) => {
		event.preventDefault()
		if (username.length < 10) {
			setUsernameError("Too Short")
		}
	}
	return (
		<AuthLayout>
			<FormBox>
				<div>
					<FontAwesomeIcon icon={faInstagram} size="3x" />
				</div>
				<form onSubmit={handleSubmit}>
					{usernameError}
					<Input
						onChange={onUsernameChange}
						value={username}
						type="text"
						placeholder="Username"
					/>
					<Input type="text" placeholder="Password" />
					<Button
						type="submit"
						value="Log in"
						disable={username === "" && username.length < 10}
					/>
				</form>
				<Seperator />
				<FacebookLogin>
					<FontAwesomeIcon icon={faFacebookSquare} />
					<span> Log in with Facebook </span>
				</FacebookLogin>
			</FormBox>
			<BottomBox cta="Don't have an account?" linkText="Sign up" link={routes.signUp} />
		</AuthLayout>
	)
}
export default Login
