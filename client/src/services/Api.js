import axios from 'axios'

export function Api() {
    return axios.create({
        baseURL: `http://localhost:8081/api/`
    })
}

export const AUTH_TOKEN_KEY = 'authToken'