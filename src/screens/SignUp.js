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

function SignUp() {
	return (
		<AuthLayout>
			<FormBox>
				<HeaderContainer>
					<FontAwesomeIcon icon={faInstagram} size="3x" />
					<Subtitle>Sign up to see photos and videos from your friends.</Subtitle>
				</HeaderContainer>
				<form>
					<Input type="text" placeholder="Name" />
					<Input type="text" placeholder="Email" />
					<Input type="text" placeholder="Username" />
					<Input type="text" placeholder="Password" />
					<Button type="submit" value="Log In" />
				</form>
			</FormBox>
			<BottomBox cta="Have an account?" linkText="Log in" link={routes.home} />
		</AuthLayout>
	)
}
export default SignUp
