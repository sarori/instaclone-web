import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faInstagram } from "@fortawesome/free-brands-svg-icons"
import routes from "../routes"
import Button from "../components/auth/Button"
import AuthLayout from "../components/auth/AuthLayout"
import Input from "../components/auth/Input"
import FormBox from "../components/auth/FormBox"
import BottomBox from "../components/auth/BottomBox"
import styled from "styled-components"
import { FatLink } from "../components/shared"
import PageTitle from "../components/PageTitle"
import { useForm } from "react-hook-form"
import { useMutation, gql } from "@apollo/client"
import { useHistory } from "react-router-dom"

const HeaderContainer = styled.div`
	display: flex;
	align-items: center;
	flex-direction: column;
`

const Subtitle = styled(FatLink)`
	font-size: 16px;
	text-align: center;
	margin-top: 10px;
`

const CREATE_ACCOUNT_MUTATION = gql`
	mutation createAccount(
		$firstName: String!
		$lastName: String
		$username: String!
		$email: String!
		$password: String!
	) {
		createAccount(
			firstName: $firstName
			lastName: $lastName
			username: $username
			email: $email
			password: $password
		) {
			ok
			error
		}
	}
`

function SignUp() {
	const history = useHistory()
	const onCompleted = (data) => {
		const { username, password } = getValues()
		const {
			createAccount: { ok, error },
		} = data
		if (!ok) {
			return setError("result", {
				message: error,
			})
		}
		history.push(routes.home, {
			message: "Account created. Please log in.",
			username,
			password,
		})
	}
	const [createAccount, { loading }] = useMutation(CREATE_ACCOUNT_MUTATION, {
		onCompleted,
	})
	const { register, handleSubmit, formState, setError, getValues } = useForm({
		mode: "onChange",
	})
	const onSubmitValid = (data) => {
		if (loading) {
			return
		}
		createAccount({
			variables: {
				...data,
			},
		})
	}
	return (
		<AuthLayout>
			<PageTitle title="Sign Up" />
			<FormBox>
				<HeaderContainer>
					<FontAwesomeIcon icon={faInstagram} size="3x" />
					<Subtitle>Sign up to see photos and videos from your friends.</Subtitle>
				</HeaderContainer>
				<form onSubmit={handleSubmit(onSubmitValid)}>
					<Input
						{...register("firstName", {
							required: "First Name is required",
						})}
						type="text"
						placeholder="First Name"
					/>
					<Input {...register("lastName")} type="text" placeholder="Last Name" />
					<Input
						{...register("email", {
							required: "Email is required",
						})}
						type="text"
						placeholder="Email"
					/>
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
					/>
					<Input
						{...register("password", {
							required: "Password is required",
						})}
						type="password"
						placeholder="Password"
					/>
					<Button
						type="submit"
						value={loading ? "Loading..." : "Sign Up"}
						disabled={!formState.isValid || loading}
					/>
				</form>
			</FormBox>
			<BottomBox cta="Have an account?" linkText="Log in" link={routes.home} />
		</AuthLayout>
	)
}
export default SignUp
