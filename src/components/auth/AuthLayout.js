import { useReactiveVar } from "@apollo/client"
import { faMoon, faSun } from "@fortawesome/free-regular-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import styled from "styled-components"
import { darkModeVar, disenableDarkMode, enableDarkMode } from "../../apollo"

const Container = styled.div`
	display: flex;
	height: 100vh;
	justify-content: center;
	align-items: center;
	flex-direction: column;
`
const Wrapper = styled.div`
	max-width: 350px;
	width: 100%;
`

const Footer = styled.div`
	margin-top: 20px;
`

const DarkModeBtn = styled.span`
	cursor: pointer;
`

function AuthLayout({ children }) {
	const darkMode = useReactiveVar(darkModeVar)
	return (
		<Container>
			<Wrapper>{children}</Wrapper>
			<Footer>
				<DarkModeBtn onClick={darkMode ? disenableDarkMode : enableDarkMode}>
					<FontAwesomeIcon icon={darkMode ? faSun : faMoon} />
				</DarkModeBtn>
			</Footer>
		</Container>
	)
}

export default AuthLayout
