import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import React from 'react'

function DocPermission({docId}) {
    const{data, isLoading, isError} = useQuery({
        queryKey: [`/editor/${docId}`],
        queryFn: async()=>{
            const response = await axios.get('', {
                withCredentials: true
            })
        }
    })
  return (
    <div>DocPermission</div>
  )
}

export default DocPermission