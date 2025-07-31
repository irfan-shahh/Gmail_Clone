
import { useState } from 'react'
import API from '../services/api'

const useApi=(urlObject)=>{
    const [response,setResponse]= useState(null)
    const [error,setError]= useState('');
    const [isloading,setisLoading]= useState(false);

    const call=async(payload,type='')=>{
        setisLoading(true)
        setResponse(null)
        setError('')
        try{
        let res= await API(urlObject,payload,type)
        setResponse(res.data)
        }catch(error){
           setError(error.message)
        }
        finally{
            setisLoading(false)
        }
    }

    return {call,response,error,isloading};
}
export default useApi;