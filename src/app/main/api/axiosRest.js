import axios from 'axios'
import { SERVER_URL } from 'configs'

const instanceAxios = axios.create({
    baseURL: `${SERVER_URL}/rest`,
    headers:{"api_key" : localStorage.getItem('api_key')}
}) 

export default instanceAxios;