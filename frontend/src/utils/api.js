import axios from 'axios'
// import configFile from '../config.json'
const API_URL = window.API_URL;

const api = axios.create({
    baseURL: API_URL
})

export {api}