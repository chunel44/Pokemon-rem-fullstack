import axios from "axios";

const localApi = axios.create({
  baseURL: '/api/'
})

export default localApi;