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
import PageTitle from "../components/PageTitle"
import { useForm } from "react-hook-form"
import FormError from "../components/auth/FormError"
import { useMutation, gql } from "@apollo/client"

const FacebookLogin = styled.div`
	color: #385285;
	span {
		margin-left: 10px;
		font-weight: 600;
	}
`

const LOGIN_MUTATION = gql`
	mutation login($username: String!, $password: String!) {
		login(username: $username, password: $password) {
			ok
			token
			error
		}
	}
`

function Login() {
	const { register, handleSubmit, formState, getValues, setError } = useForm({
		mode: "onChange",
	})
	const onCompleted = (data) => {
		const {
			login: { ok, error, token },
		} = data
		if (!ok) {
			setError("result", {
				message: error,
			})
		}
		console.log(data, "data is")
		console.log("error is", error)
	}
	const [login, { loading, error }] = useMutation(LOGIN_MUTATION, {
		onCompleted,
	})
	const onSubmitValid = async (data) => {
		if (loading) {
			return
		}
		const { username, password } = getValues()
		console.log(username, password)
		login({
			variables: { username, password },
		})
	}
	return (
		<AuthLayout>
			<PageTitle title="Log In" />
			<FormBox>
				<div>
					<FontAwesomeIcon icon={faInstagram} size="3x" />
				</div>
				<form onSubmit={handleSubmit(onSubmitValid)}>
					<Input
						{...register("username", {
							required: "Username is required",
							minLength: {
								value: 5,
								message: "Username should be longer than 5 characters.",
							},
						})}
						type="text"
						placeholder="Username"
						hasError={Boolean(formState.errors?.username?.message)}
					/>
					<FormError message={formState.errors?.username?.message} />
					<Input
						{...register("password", { required: "Password is required" })}
						name="password"
						type="password"
						placeholder="Password"
						hasError={Boolean(formState.errors?.password?.message)}
					/>
					<FormError message={formState.errors?.password?.message} />
					<Button
						type="submit"
						value={loading ? "Loading..." : "Log in"}
						disabled={!formState.isValid || loading}
					/>
					<FormError message={formState.errors?.result?.message} />
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
