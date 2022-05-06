import Api from "@/services/Api"
import axios from "axios"

const AUTH_TOKEN_KEY = 'authToken'

export function fetchProjects(userId) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage[AUTH_TOKEN_KEY]}`
    return Api().get(`participation/${userId}`)
}