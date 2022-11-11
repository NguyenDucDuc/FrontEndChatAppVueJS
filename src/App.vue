<template>
  <div class="main">
    <router-link to="/login" class="link">Login</router-link>
    <router-link to="/chat/636bd68da8c14625469d4798" class="link"
      >Chat</router-link
    >
    <h2>{{ username }}</h2>
   
    <router-view></router-view>
  </div>
</template>

<script>
import { io } from "socket.io-client";
import { computed } from "@vue/runtime-core";
import store from "./store/store";
import router from "../src/router/index";
import axios from "axios";
import { authAPI } from "./api/API";

export const socket = io("http://localhost:8000");

export default {
  name: "App",
  components: {},
  setup() {
    const username = computed(() => store.state.username);
    const checkLogin = () => {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        router.push("/login");
      }
    };
    checkLogin();
    const emitInfoToServer = async () => {
      const currentUser = await authAPI().get('/api/v1/user/current-user')
      socket.emit('login', currentUser.data._id)
    }
    emitInfoToServer()
    socket.on('serverResendConnection', data => {
      console.log(data)
    })
    const loadMessage = async () => {
      const res = await axios.post(
        "http://localhost:8000/api/v1/message/get-all-message",
        {
          user: "636bd673a8c14625469d4792",
          receiver: "636bd68da8c14625469d4798",
        }
      );
      console.log(res.data)
    };
    return {
      username,
      loadMessage,
    };
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  /* margin-top: 60px; */
}
.link {
  color: black;
  padding: 0 20px;
  font-weight: bold;
  text-decoration: none;
}
.main {
  background: linear-gradient(to bottom, #009999 0%, #0099ff 100%);
  min-height: 905px;
}
</style>
