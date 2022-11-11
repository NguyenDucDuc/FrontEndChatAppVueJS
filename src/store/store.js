import {createStore} from 'vuex'
import axios from 'axios'
import { authAPI } from '@/api/API';



const store = createStore({
    state: {
        username: '',
        listMessage: [],
        listUser: []
    },
    mutations: {
        login: (state, payload) => {
            state.username = payload;
            console.log(state.username);
        },
        addMessage: (state, payload) => {
            state.listMessage.push(payload);
        },
        loadListUser: (state, payload) => {
            state.listUser = payload;
        },
        getAllMessage: (state, payload) => {
            state.listMessage = payload;
        }
    },
    actions: {
        loginAsync: async (context, user) => {
            console.log(user);
            const res = await axios.post('http://localhost:8000/api/v1/user/login', {
                username: user.username,
                password: user.password
            });
            console.log(res.data);
            //Save cookies
            localStorage.setItem('accessToken', res.data.accessToken)
            context.commit('login', res.data.user.username);
        },
        addMessageAsync: async (context, data) => {
            const res = await axios.post('http://localhost:8000/api/v1/message/add', {
                content: data.content,
                user: data.user,
                receiver: data.receiver
            })
            console.log(res.data)
            const currentUser = await authAPI().get('/api/v1/user/current-user')
            context.commit('addMessage', {content: data.content, user: currentUser.data})
        },
        getAllUserAsync: async (context) => {
            const res = await axios.get("http://localhost:8000/api/v1/user/get-all");
            context.commit('loadListUser', res.data)
        },
        loadAllMessageAsync: async (context, data) => {
            const res = await axios.post('http://localhost:8000/api/v1/message/get-all-message', {
                user: data.user,
                receiver: data.receiver
            })
            console.log(data.user, data.receiver)
            console.log('Load MS data' + res.data)
            console.log(res.data)
            context.commit('getAllMessage', res.data)
        }
    }
})

export default store