import { useParams } from "react-router"

function Profile() {
	const { username } = useParams()

	return "Profile"
}

export default Profile
