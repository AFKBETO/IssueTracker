import Api from '@/services/Api'
import axios from 'axios'
import decode from 'jwt-decode'

const AUTH_TOKEN_KEY = 'authToken'

export function register (credentials) {
    return Api().post('register', credentials)
}
export function login (credentials) {
    return Api().post('login', credentials)
}
export function logout(){
    clearAuthToken()
}
export function setAuthToken(token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    localStorage.setItem(AUTH_TOKEN_KEY, token)
}
export function getAuthToken() {
    return localStorage.getItem(AUTH_TOKEN_KEY)    
}
export function clearAuthToken() {
    axios.defaults.headers.common['Authorization'] = ''
    localStorage.removeItem(AUTH_TOKEN_KEY)
}
export function isLoggedIn() {
    const authToken = getAuthToken()
    if (authToken) localStorage.setItem(`displayName`, decode(authToken).name)
    else localStorage.removeItem(`displayName`)
    return !(!authToken) && !isTokenExpired(authToken)
}
export function getUserInfo() {
    if (isLoggedIn()) {
        return decode(getAuthToken())
    }
}

function getTokenExpirationDate(encodedToken) {
    let token = decode(encodedToken)
    if (!token.exp) {
        return null
    }
  
    let date = new Date(0)
    date.setUTCSeconds(token.exp)
  
    return date
}
  
function isTokenExpired(token) {
    let expirationDate = getTokenExpirationDate(token)
    return expirationDate < new Date()
}

