import axios from 'axios'


export const authAPI = () => {
    return axios.create({
        baseURL: 'http://localhost:8000',
        headers: {
            'token': `Bearer ${localStorage.getItem('accessToken')}`
        }
    })
}