import { useParams } from "react-router"
import { gql, useApolloClient, useMutation, useQuery, useLazyQuery } from "@apollo/client"
import { PHOTO_FRAGMENT } from "../fragments"
import PageTitle from "../components/PageTitle"
import { FatText } from "../components/shared"
import styled from "styled-components"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faComment, faHeart } from "@fortawesome/free-regular-svg-icons"
import Button from "../components/auth/Button"
import useUser from "../hooks/useUser"
import { logUserOut } from "../apollo"
import { useEffect } from "react/cjs/react.development"

const FOLLOW_USER_MUTATION = gql`
	mutation followUser($username: String!) {
		followUser(username: $username) {
			ok
		}
	}
`

const UNFOLLOW_USER_MUTATION = gql`
	mutation unfollowUser($username: String!) {
		unfollowUser(username: $username) {
			ok
		}
	}
`

const Header = styled.div`
	display: flex;
`

const Avatar = styled.img`
	border-radius: 50%;
	height: 160px;
	width: 160px;
	margin-left: 50px;
	margin-right: 150px;
	background-color: #2c2c2c;
`
const Column = styled.div``

const Username = styled.h3`
	font-size: 28px;
	font-weight: 400;
`

const Row = styled.div`
	margin-bottom: 15px;
	font-size: 16px;
	display: flex;
`

const List = styled.ul`
	display: flex;
`

const Item = styled.li`
	margin-right: 20px;
`

const Value = styled(FatText)`
	font-size: 18px;
`

const Name = styled(FatText)`
	font-size: 20px;
`

const Grid = styled.div`
	display: grid;
	grid-auto-rows: 290px;
	grid-template-columns: repeat(3, 1fr);
	gap: 30px;
	margin-top: 50px;
	/* margin-bottom: 100px; */
`
const Photo = styled.div`
	background-image: url(${(props) => props.bg});
	background-size: cover;
	position: relative;
`
const Icons = styled.div`
	position: absolute;
	display: flex;
	justify-content: center;
	align-items: center;
	width: 100%;
	height: 100%;
	background-color: rgba(0, 0, 0, 0.5);
	color: white;
	opacity: 0;
	&:hover {
		opacity: 1;
	}
`

const Icon = styled.span`
	font-size: 18px;
	display: flex;
	align-items: center;
	margin: 0px 5px;
	svg {
		font-size: 14px;
		margin-right: 3px;
	}
`

const ProfileBtn = styled(Button).attrs({
	as: "span",
})`
	margin-left: 10px;
	padding: 8px 4px;
	margin-top: 0px;
	cursor: pointer;
`

const SEE_PROFILE_QUERY = gql`
	query seeProfile($username: String!) {
		seeProfile(username: $username) {
			id
			firstName
			lastName
			username
			bio
			avatar
			# photos {
			# 	id
			# 	file
			# 	commentNumber
			# }
		}
	}
`

function Profile() {
	const { username } = useParams()
	const userInfo = useUser()
	const client = useApolloClient()

	const [getProfile, { data, loading }] = useLazyQuery(SEE_PROFILE_QUERY)

	useEffect(() => {
		getProfile({
			variables: {
				username,
			},
		})
	}, [username, getProfile])

	const unfollowUserUpdate = (cache, result) => {
		const {
			data: {
				unfollowUser: { ok },
			},
		} = result
		if (!ok) {
			return
		}
		cache.modify({
			id: `Users:${username}`,
			fields: {
				isFollowing(prev) {
					return false
				},
				totalFollowers(prev) {
					return prev - 1
				},
			},
		})

		if (!userInfo) {
			return
		}
		if (userInfo?.username) {
			cache.modify({
				id: `Users:${userInfo.username}`,
				fields: {
					totalFollowing(prev) {
						return prev - 1
					},
				},
			})
		}
	}

	const [unfollowUser] = useMutation(UNFOLLOW_USER_MUTATION, {
		variables: {
			username,
		},
		update: unfollowUserUpdate,
	})

	const followUserCompleted = (data) => {
		const {
			followUser: { ok },
		} = data
		if (!ok) {
			return
		}
		const { cache } = client
		cache.modify({
			id: `Users:${username}`,
			fields: {
				isFollowing(prev) {
					return true
				},
				totalFollowers(prev) {
					return prev + 1
				},
			},
		})
		if (!userInfo) {
			return
		}
		if (userInfo?.username) {
			cache.modify({
				id: `Users:${userInfo.username}`,
				fields: {
					totalFollowing(prev) {
						return prev + 1
					},
				},
			})
		}
	}

	const [followUser] = useMutation(FOLLOW_USER_MUTATION, {
		variables: {
			username,
		},
		onCompleted: followUserCompleted,
	})
	const getButton = (seeProfile) => {
		const { isMe, isFollowing } = seeProfile
		if (isMe) {
			return <ProfileBtn onClick={logUserOut}>LogOut</ProfileBtn>
		}
		if (isFollowing) {
			return <ProfileBtn onClick={unfollowUser}>Unfollow</ProfileBtn>
		} else {
			return <ProfileBtn onClick={followUser}>Follow</ProfileBtn>
		}
	}

	return (
		<div>
			<Header>
				<PageTitle title={loading ? "loading" : `${data?.seeProfile?.username}`} />
				<Avatar src={data?.seeProfile?.avatar} />
				<Column>
					<Row>
						<Username>{data?.seeProfile?.username}</Username>
						{data?.seeProfile ? getButton(data?.seeProfile) : null}
					</Row>
					<Row>
						<List>
							<Item>
								<span>
									<Value>{data?.seeProfile?.totalFollowers} </Value>followers
								</span>
							</Item>
							<Item>
								<span>
									<Value>{data?.seeProfile?.totalFollowing} </Value>followings
								</span>
							</Item>
						</List>
					</Row>
					<Row>
						<Name>
							{data?.seeProfile?.firstName} {data?.seeProfile?.lastName}
						</Name>
					</Row>
					<Row>{data?.seeProfile?.bio}</Row>
				</Column>
			</Header>
			<Grid>
				{data?.seeProfile?.photos.map((photo) => (
					<Photo key={photo.id} bg={photo.file}>
						<Icons>
							<Icon>
								<FontAwesomeIcon icon={faHeart} />
								{photo.likes}
							</Icon>
							<Icon>
								<FontAwesomeIcon icon={faComment} />
								{photo.commentNumber}
							</Icon>
						</Icons>
					</Photo>
				))}
			</Grid>
		</div>
	)
}

export default Profile
