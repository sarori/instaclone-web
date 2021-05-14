import { useParams } from "react-router"
import { gql, useQuery } from "@apollo/client"
import { PHOTO_FRAGMENT } from "../fragments"
import PageTitle from "../components/PageTitle"
import { FatText } from "../components/shared"
import styled from "styled-components"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faComment, faHeart } from "@fortawesome/free-regular-svg-icons"

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
	margin-bottom: 100px;
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

const SEE_PROFILE_QUERY = gql`
	query seeProfile($username: String!) {
		seeProfile(username: $username) {
			id
			firstName
			lastName
			username
			bio
			avatar
			photos {
				...PhotoFragment
			}
			totalFollowing
			totalFollowers
			isMe
			isFollowing
		}
	}
	${PHOTO_FRAGMENT}
`

function Profile() {
	const { username } = useParams()
	const { data } = useQuery(SEE_PROFILE_QUERY, {
		variables: {
			username,
		},
	})

	console.log(data?.seeProfile)
	return (
		<div>
			<Header>
				<PageTitle title={username} />
				<Avatar src={data?.seeProfile?.avatar} />
				<Column>
					<Row>
						<Username>{data?.seeProfile?.username}</Username>
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
