import { createGlobalStyle } from "styled-components"
import reset from "styled-reset"

export const lightTheme = {
	fontColor: "#2c2c2c",
	bgColor: "lightgray",
}

export const darkTheme = {
	fontColor: "lightgray",
	bgColor: "#2c2c2c",
}

export const GlobalStyles = createGlobalStyle`
${reset}
	*{
		box-sizing:border-box
	} 
	input{
		all: unset
	}
    body{
        background-color: ${(props) => props.theme.bgColor};
		background-color: #FAFAFA;
        font-size:14px;
        font-family:'Open Sans', sans-serif;
    }
`
