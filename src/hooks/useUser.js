import { gql, useQuery, useReactiveVar } from "@apollo/client"
import { useEffect, useState } from "react"
import { isLoggedInVar, logUserOut } from "../apollo"

const ME_QUERY = gql`
	query me {
		me {
			id
			username
			avatar
		}
	}
`

function useUser() {
	const hasToken = useReactiveVar(isLoggedInVar)

	const [temp, setTemp] = useState()
	const { loading, data } = useQuery(ME_QUERY, {
		skip: !hasToken,
		onCompleted: (result) => {
			const { me } = result
			if (me) {
				setTemp(me)
				// console.log(temp)
			}
		},
	})
	// console.log(temp)
	// useEffect(() => {
	// 	if (data?.me === null) {
	// 		logUserOut()
	// 	}
	// }, [data])

	// useEffect(() => {
	// 	if (temp === null) {
	// 		logUserOut()
	// 	}
	// }, [temp])
	return temp
}
export default useUser
