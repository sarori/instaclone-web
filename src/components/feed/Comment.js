import React, { useState } from "react"
import PropTypes from "prop-types"
import { Link } from "react-router-dom"
import styled from "styled-components"
import { FatText } from "../shared"
import { useMutation, gql } from "@apollo/client"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
	faCheckSquare,
	faPencilAlt,
	faTrash,
	faWindowClose,
} from "@fortawesome/free-solid-svg-icons"

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
	display: flex;
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
	padding: 2px 0px;
	width: 408px;
`
const CommentContent = styled.div`
	margin-left: 10px;
`

const Icons = styled.div`
	padding: 2px 0px;
	display: flex;
	flex-direction: row;
	width: 60px;
	justify-content: space-between;
	padding-left: 3px;
	padding-right: 9px;
`

const Icon = styled.span`
	cursor: pointer;
	margin-left: 5px;
`
const Button = styled.button`
	border: none;
	background-color: white;
`

const InputForm = styled.form`
	display: flex;
`

const EditInput = styled.input`
	width: 400px;
	padding: 2px 8px;
	padding-left: 0px;
`
const WholeComment = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
`

const StyledLink = styled(Link)`
	padding: 2px 0px;
`

function Comment({ id, photoId, isMine, author, payload }) {
	const [editing, setEditing] = useState(false)
	const [newComment, setNewComment] = useState(payload)
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
	const updateEditComment = async (cache, result) => {
		const {
			data: {
				editComment: { ok },
			},
		} = result
		if (ok) {
			cache.modify({
				id: `Comment:${id}`,
				fields: {
					payload(prev) {
						return newComment
					},
				},
			})
			await editCommentMutation({
				variables: {
					id,
					payload: newComment,
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
	const toggleEditing = () => setEditing((prev) => !prev)

	const onSubmit = async (event) => {
		event.preventDefault()
		await editCommentMutation()
		setEditing(false)
	}
	const onChange = (event) => {
		const {
			target: { value },
		} = event
		setNewComment(value)
	}
	return (
		<CommentContainer>
			<StyledLink to={`/users/${author}`}>
				<FatText>{author}</FatText>
			</StyledLink>
			{editing ? (
				<>
					<WholeComment>
						<InputForm onSubmit={onSubmit}>
							<CommentContent>
								<EditInput
									type="text"
									placeholder="Edit your comment"
									value={newComment}
									required
									autoFocus
									onChange={onChange}
								/>
							</CommentContent>
							<Button type="submit">
								<FontAwesomeIcon icon={faWindowClose} size="lg" />
							</Button>
						</InputForm>
						<Icon onClick={toggleEditing}>
							<FontAwesomeIcon icon={faCheckSquare} size="lg" />
						</Icon>
					</WholeComment>
				</>
			) : (
				<>
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
					{/* {isMine ? (
						<Icons>
							<Icon onClick={toggleEditing}>
								<FontAwesomeIcon icon={faPencilAlt} size="lg" />
							</Icon>
							<Icon onClick={onDeleteClick}>
								<FontAwesomeIcon icon={faTrash} size="lg" />
							</Icon>
						</Icons>
					) : null} */}
				</>
			)}
		</CommentContainer>
	)
}

Comment.propTypes = {
	id: PropTypes.number,
	photoId: PropTypes.number,
	author: PropTypes.string.isRequired,
	payload: PropTypes.string.isRequired,
}

export default Comment
