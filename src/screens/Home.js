import { gql, useQuery } from "@apollo/client"
import Photo from "../components/feed/Photo"
import PageTitle from "../components/PageTitle"
// import { COMMENT_FRAGMENT, PHOTO_FRAGMENT } from "../fragments"

const FEED_QUERY = gql`
	query seeFeed {
		seeFeed {
			id
			user {
				username
				avatar
			}
			caption
			createdAt
		}
	}
`

function Home() {
	const { data } = useQuery(FEED_QUERY)
	console.log(data)
	return (
		<div>
			<PageTitle title="Home" />
			{data?.seeFeed?.map((photo) => (
				<Photo key={photo.id} {...photo} />
			))}
		</div>
	)
}
export default Home
