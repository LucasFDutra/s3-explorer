import axios from 'axios'
const API_URL = `${window.location.origin}/api`

const api = axios.create({
    //baseURL: API_URL.replace('3000', '5000') //dev
    baseURL: API_URL
})

export {api}