import { gql, useQuery, useReactiveVar } from "@apollo/client"
import { useEffect, useState } from "react"
import { isLoggedInVar, logUserOut } from "../apollo"

const ME_QUERY = gql`
	query me($token: String!) {
		me(token: $token) {
			ok
			error
			user {
				id
				username
				avatar
			}
		}
	}
`

function useUser() {
	// const hasToken = useReactiveVar(isLoggedInVar)
	const hasToken = localStorage.getItem("TOKEN")
	const [data, setData] = useState()
	const { loading } = useQuery(ME_QUERY, {
		skip: !hasToken,
		variables: {
			token: hasToken,
		},
		onCompleted: (result) => {
			console.log(result)
			const { me } = result
			if (me) {
				setData(me)
			}
		},
	})

	useEffect(() => {
		const timer = setTimeout(() => {
			if (loading === false && data === undefined && hasToken === true) {
				logUserOut()
			}
		}, 3000)
		return () => clearTimeout(timer)
	}, [loading, data, hasToken])

	if (loading) {
		return false
	}
	return data
}
export default useUser
