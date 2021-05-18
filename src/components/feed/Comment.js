import React from "react"
import PropTypes from "prop-types"
import { Link } from "react-router-dom"
import styled from "styled-components"
import { FatText } from "../shared"
import { useMutation, gql } from "@apollo/client"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPencilAlt, faTrash } from "@fortawesome/free-solid-svg-icons"

const DELETE_COMMENT_MUTATION = gql`
	mutation deleteComment($id: Int!) {
		deleteComment(id: $id) {
			ok
		}
	}
`

const EDIT_COMMENT_MUTATION = gql`
	mutation editComment($id: Int!, $payload: String!) {
		editComment(id: $id, payload: $payload) {
			ok
		}
	}
`

const CommentContainer = styled.div`
	margin-bottom: 7px;
`

const CommentCaption = styled.span`
	margin-left: 10px;
	color: red;
	a {
		background-color: inherit;
		color: ${(props) => props.theme.accent};
		cursor: pointer;
		&:hover {
			text-decoration: underline;
		}
	}
`

const Icons = styled.div``

const Icon = styled.span`
	cursor: pointer;
	margin-left: 10px;
`

function Comment({ id, photoId, isMine, author, payload }) {
	const updateDeleteComment = (cache, result) => {
		const {
			data: {
				deleteComment: { ok, error },
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
	const updateEditComment = (cache, result) => {
		const {
			data: {
				editComment: { ok },
			},
		} = result
		if (ok) {
			console.log("ok")
		}
	}
	const [deleteCommentMutation] = useMutation(DELETE_COMMENT_MUTATION, {
		variables: {
			id,
		},
		update: updateDeleteComment,
	})
	const [editCommentMutation] = useMutation(EDIT_COMMENT_MUTATION, {
		variables: {
			id,
			payload,
		},
		update: updateEditComment,
	})

	const onDeleteClick = async () => {
		const ok = window.confirm("Are you sure you want to delete this comment?")
		if (ok) {
			deleteCommentMutation()
		}
	}
	const onEditClick = () => {
		editCommentMutation()
	}
	return (
		<CommentContainer>
			<Link to={`/users/${author}`}>
				<FatText>{author}</FatText>
			</Link>
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
			{isMine ? (
				<Icons>
					<Icon onClick={onEditClick}>
						<FontAwesomeIcon icon={faPencilAlt} />
					</Icon>
					<Icon onClick={onDeleteClick}>
						<FontAwesomeIcon icon={faTrash} />
					</Icon>
				</Icons>
			) : null}
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
