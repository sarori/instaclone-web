import { gql, useQuery, useReactiveVar } from "@apollo/client"
import { useEffect, useState } from "react"
import { isLoggedInVar } from "../apollo"

const ME_QUERY = gql`
	query me {
		me {
			username
			avatar
		}
	}
`

function useUser() {
	const hasToken = useReactiveVar(isLoggedInVar)
	const [temp, setTemp] = useState()
	const { loading } = useQuery(ME_QUERY, {
		onCompleted: (result) => {
			const { me } = result
			if (me) {
				setTemp(me)
			}
		},
	})

	if (loading) {
		return "loading"
	}

	return temp
}
export default useUser
