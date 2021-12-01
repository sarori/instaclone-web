import PropTypes from "prop-types"
import { useForm } from "react-hook-form"
import styled from "styled-components"
import Comment from "./Comment"
import { useMutation, gql } from "@apollo/client"
import useUser from "../../hooks/useUser"
import Content from "./Content"

const CREATE_COMMENT_MUTATION = gql`
	mutation createComment($photoId: Int!, $payload: String!) {
		createComment(photoId: $photoId, payload: $payload) {
			ok
			id
			error
		}
	}
`

const CommentsContainer = styled.div`
	margin-top: 20px;
`

const CommentCount = styled.span`
	opacity: 0.7;
	font-size: 12px;
	margin: 10px 0px;
	display: block;
	font-weight: 600;
`

const PostCommentContainer = styled.div`
	margin-top: 10px;
	padding-top: 15px;
	padding-bottom: 10px;
	border-top: 1px solid ${(props) => props.theme.borderColor};
`
const PostCommentInput = styled.input`
	width: 100%;
	&::placeholder {
		font-size: 12px;
	}
`

function Comments({ photoId, author, caption, commentNumber, comments }) {
	const userData = useUser()
	const { register, handleSubmit, setValue, getValues } = useForm()
	const createCommentUpdate = (cache, result) => {
		const { payload } = getValues()
		setValue("payload", "")
		const {
			data: {
				createComment: { ok, id },
			},
		} = result
		if (ok && userData) {
			const newComment = {
				__typename: "Comment",
				createdAt: Date.now() + "",
				id,
				payload,
				user: {
					...userData.me,
				},
			}
			const newCacheComment = cache.writeFragment({
				data: newComment,
				fragment: gql`
					fragment Name on Comment {
						id
						createdAt
						payload
						user {
							username
							avatar
						}
					}
				`,
			})
			console.log(newCacheComment)
			cache.modify({
				id: `Photo:${photoId}`,
				fields: {
					comments(prev) {
						return [...prev, newCacheComment]
					},
					commentNumber(prev) {
						return prev + 1
					},
				},
			})
		}
	}
	const [createCommentMutation, { loading }] = useMutation(CREATE_COMMENT_MUTATION, {
		update: createCommentUpdate,
	})

	const onValid = (data) => {
		const { payload } = data
		if (loading) {
			return
		}
		createCommentMutation({
			variables: {
				photoId,
				payload,
			},
		})
	}

	return (
		<CommentsContainer>
			<Content author={author} payload={caption} />
			<CommentCount>
				{commentNumber === 1 ? "1 comment" : `${commentNumber} comments`}
			</CommentCount>
			{comments?.map((comment) => (
				<Comment
					key={comment.id}
					id={comment.id}
					photoId={photoId}
					author={comment.user.username}
					payload={comment.payload}
				/>
			))}
			<PostCommentContainer>
				<form onSubmit={handleSubmit(onValid)}>
					<PostCommentInput
						{...register("payload", {
							required: true,
						})}
						type="text"
						placeholder="Write a comment..."
					/>
				</form>
			</PostCommentContainer>
		</CommentsContainer>
	)
}

Comments.propTypes = {
	photoId: PropTypes.number.isRequired,
	author: PropTypes.string.isRequired,
	caption: PropTypes.string,
	commentNumber: PropTypes.number.isRequired,
	comments: PropTypes.arrayOf(
		PropTypes.shape({
			id: PropTypes.number.isRequired,
			user: PropTypes.shape({
				avatar: PropTypes.string,
				username: PropTypes.string.isRequired,
			}),
			payload: PropTypes.string.isRequired,
			createdAt: PropTypes.string.isRequired,
		})
	),
}

export default Comments
