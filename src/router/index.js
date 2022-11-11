import {createRouter, createWebHistory} from 'vue-router';
import LoginVue from '../components/Login.vue';
import ChatVue from '../components/Chat.vue';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {path: '/login', component: LoginVue},
        {path: '/chat/:receiverId', component: ChatVue},
    ]
})

export default router