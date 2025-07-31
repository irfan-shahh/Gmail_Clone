import axios from "axios";
 
const API_URL='http://localhost:8000'

const API_GMAIL=(urlObject,payload,type='')=>{
    const isFormData=payload instanceof FormData
    return axios({
        method:urlObject.method,
        url:`${API_URL}/${urlObject.endpoint}/${type}`,
        data:payload,
        headers:isFormData ?{
            'Content-Type':'multipart/form-data'
        }:{
             'Content-Type':'application/json'
        }
    })
}

export default API_GMAIL;