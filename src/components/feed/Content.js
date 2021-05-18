import React from "react"
import PropTypes from "prop-types"
import { Link } from "react-router-dom"
import styled from "styled-components"
import { FatText } from "../shared"

const ContentContainer = styled.div`
	margin-bottom: 7px;
`

const ContentCaption = styled.span`
	margin-left: 10px;
	a {
		background-color: inherit;
		color: ${(props) => props.theme.accent};
		cursor: pointer;
		&:hover {
			text-decoration: underline;
		}
	}
`

function Content({ author, payload }) {
	return (
		<ContentContainer>
			<Link to={`/users/${author}`}>
				<FatText>{author}</FatText>
			</Link>
			<ContentCaption>
				{payload.split(" ").map((word, index) =>
					/#[\w]+/.test(word) ? (
						<React.Fragment key={index}>
							<Link key={index} to={`/hashtags/${word}`}>
								{word}
							</Link>{" "}
						</React.Fragment>
					) : (
						<React.Fragment key={index}>{word} </React.Fragment>
					)
				)}
			</ContentCaption>
		</ContentContainer>
	)
}

Content.propTypes = {
	author: PropTypes.string.isRequired,
	payload: PropTypes.string.isRequired,
}

export default Content
