<template>
  <div>
    <h4>{{username}}</h4>
    <form class="form-main" v-on:submit.prevent="login(inputUsername, inputPassword)">
      <h1 class="title">LOGIN PAGE</h1>
      <div class="form-group">
        <label>Username: </label>
        <input type="text" placeholder="enter username" v-model="inputUsername" />
      </div>
      <div class="form-group">
        <label>Password: </label>
        <input type="password" placeholder="enter password" v-model="inputPassword" />
      </div>
      <button class="btn-login" type="submit">Login</button>
      <h4>{{infoUser}}</h4>
    </form>
  </div>
</template>

<script>
import { authAPI } from '@/api/API';
import { ref } from '@vue/reactivity';
import {useStore} from 'vuex'
import { socket } from '../App.vue';

export default {
  name: "LoginVue",
  setup() {
    const store = useStore()
    const inputUsername = ref('')
    const inputPassword =ref('')
    
    
    const login = async ( username, password) => {
      const user = {
        username: username,
        password: password,
      }
      store.dispatch('loginAsync', user)
      const currentUser = await authAPI().get('/api/v1/user/current-user')
      socket.emit('login', currentUser.data._id)
    }
    return {
      login,
      inputUsername,
      inputPassword,
      
    }
  },

  created(){
    socket.on('serverReSendLogin', data => {
      console.log(data)
    })
  }
};
</script>

<style>
h1.title {
  text-align: center;
  margin-top: 50px;
  padding-top: 70px;
}
form.form-main{
  width: 35%;
  background: white;
  box-shadow: 15px 15px 15px #007acc;
  margin: 0 auto;
  height: 700px;
  border-radius: 10px;
}
div.form-group {
  width: 100%;
  display: flex;
  margin: 0 auto;
  margin: 80px 0;
}
div.form-group label {
  width: 25%;
  font-weight: bold;
}
div.form-group input {
  width: 65%;
  height: 30px;
  margin-top: -16px;
}
.btn-login {
  padding: 15px 50px;
  color: white;
  background: #0080ff;
  outline: none;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-weight: bold;
}
.btn-login:hover {
  transform: scale(0.96);
  transition-duration: 0.7s;
  
}
</style>