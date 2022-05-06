import { Api, AUTH_TOKEN_KEY } from "@/services/Api"
import axios from "axios"

export function fetchProjects(userId) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage[AUTH_TOKEN_KEY]}`
    return Api().get(`participation/${userId}`)
}

/* export function fetchProject(projectId) {

} */