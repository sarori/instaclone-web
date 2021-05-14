import React from "react"
import PropTypes from "prop-types"
import { Link } from "react-router-dom"
import styled from "styled-components"
import { FatText } from "../shared"
import { useMutation, gql } from "@apollo/client"

const DELETE_COMMENT_MUTATION = gql`
	mutation deleteComment($id: Int!) {
		deleteComment(id: $id) {
			ok
		}
	}
`

const CommentContainer = styled.div`
	margin-bottom: 7px;
`

const CommentCaption = styled.span`
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

function Comment({ id, photoId, isMine, author, payload }) {
	const updateDeleteComment = (cache, result) => {
		const {
			data: {
				deleteComment: { ok },
			},
		} = result
		if (ok) {
			cache.evict({ id: `Comment:${id}` })
			cache.modify({
				id: `Photo:${photoId}`,
				fields: {
					commentNumber(prev) {
						return prev - 1
					},
				},
			})
		}
	}
	const [deleteCommentMutation] = useMutation(DELETE_COMMENT_MUTATION, {
		variables: {
			id,
		},
		update: updateDeleteComment,
	})
	const onDeleteClick = () => {
		deleteCommentMutation()
	}
	return (
		<CommentContainer>
			<FatText>{author}</FatText>
			<CommentCaption>
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
			</CommentCaption>
			{isMine ? <button onClick={onDeleteClick}>❌</button> : null}
		</CommentContainer>
	)
}

Comment.propTypes = {
	id: PropTypes.number,
	photoId: PropTypes.number,
	isMine: PropTypes.bool,
	author: PropTypes.string.isRequired,
	payload: PropTypes.string.isRequired,
}

export default Comment
