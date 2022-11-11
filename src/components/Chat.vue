<template>
  <div class="main-chat">
    <!-- <h1 class="title">CHAT PAGE</h1>
    <input type="text" placeholder="enter your message" v-model="inputMessage" />
    <button @click="sendHandle(inputMessage)">Send</button>
    <button @click="testHandle">Test</button>
    <h4 v-for="(message,idx) in listMessage" v-bind:key="idx">{{message}}</h4> -->

    <div class="left">
      <div v-if="listUser !== null" class="condition">
        <div
          v-for="(u, idx) in listUser"
          v-bind:key="idx"
          @click="pushReceiverId(u._id)"
        >
          <img style="border: 4px solid #ff0066 ; width: 70px; height: 70px; border-radius: 40px;"
            src="https://res.cloudinary.com/djbju13al/image/upload/v1665325365/Avatar/1665325365045.jpg"
          />
          <p style="color: white; font-weight: bold; margin-left: 25px">
            {{ u.username }}
          </p>
        </div>

        <!-- <div v-if="listUser !== null">
        <h1 v-for="(u, idx) in listUser" v-bind:key="idx">{{u.username}}</h1>
      </div> -->
      </div>
    </div>
    <div class="right">
      <!-- <div class="receiver">
          <p v-if="receiver !== null" style="font-weight: bold;">Send to: {{receiver}}</p>
      </div> -->
      <p v-if="receiver !== null" style="font-weight: bold;">Send to: {{receiver.username}}</p>
      <div v-if="listMessage !== null" class="right-wrap">
        <div v-for="(m, idx) in listMessage" v-bind:key="idx" class="right-content">
          <img class="avatar" src="https://res.cloudinary.com/djbju13al/image/upload/v1665325508/Avatar/1665325507027.jpg" />
          <p class="name">{{m.user.username}}</p>
          <p class="width-100">{{m.content}}</p>
        </div>
      </div>
    </div>
    <div class="send-control">
      <input
        class="input-send"
        type="text"
        placeholder="enter your message"
        v-model="inputMessage"
      />
      <button class="btn-send" @click="sendHandle(inputMessage, route.params.receiverId)">Send</button>
    </div>
  </div>
</template>

<script>
import { computed, ref } from "vue";
import { useStore } from "vuex";
import { socket } from "../App.vue";
import { authAPI } from "../api/API";
import router from "@/router";
import { useRoute } from "vue-router";
import axios from 'axios';

// import { socket } from '../App.vue';

export default {
  name: "ChatVue",
  data(){
    const receiver = ref({username: ''})
    return {
      receiver
    }
  },
  methods: {
    async pushReceiverId(receiverId){
       
       
       
      // router.push(`/chat/${receiverId}`);
      // console.log(route.params.receiverId);
      // // const res = await axios.get(`http://localhost:8000/api/v1/user/get-user-by-id/${route.params.receiverId}`)
      // // console.log(res.data)
      // this.receiver = route.params.receiverId
      console.log(receiverId)
      router.push(`/chat/${receiverId}`);
      const res = await axios.get(`http://localhost:8000/api/v1/user/get-user-by-id/${receiverId}`)
      console.log(res.data)
      this.receiver = res.data
      this.getAllMessage()
    }
  },
  setup() {
    const store = useStore();
    const route = useRoute();
    const listMessage = computed(() => store.state.listMessage);
    const listUser = computed(() => store.state.listUser);
    const inputMessage = ref("");
    const getAllMessage = async () => {
      const currentUser = await authAPI().get("/api/v1/user/current-user");
      console.log('currentUser' + currentUser.data)
      store.dispatch('loadAllMessageAsync', {user: currentUser.data._id, receiver: route.params.receiverId})
    }
    
    store.dispatch("getAllUserAsync");
    const sendHandle = async (message, receiverId) => {
      if (inputMessage.value !== "") {
        const currentUser = await authAPI().get("/api/v1/user/current-user");
        console.log(currentUser.data);

        const data = {
          content: message,
          user: currentUser.data._id,
          receiver: route.params.receiverId,
        };
        store.dispatch("addMessageAsync", data);

        socket.emit("clientSendMessage", {content: data.content, user: currentUser.data, receiverId: receiverId });
      }
    };

    socket.off("serverReSendMessage").on("serverReSendMessage", (data) => {
      console.log("server resend" + data.content);
      store.commit("addMessage", data);
    });

    // const pushReceiverId = async (receiverId) => {
    //   router.push(`/chat/${receiverId}`);
    //   console.log(route.params.receiverId);
    //   const res = await axios.get(`http://localhost:8000/api/v1/user/get-user-by-id/${route.params.receiverId}`)
    //   console.log(res.data)
    //   receiver = res.data
    //   console.log(receiver)
    // };
    return {
      sendHandle,
      inputMessage,
      listMessage,
      listUser,
      getAllMessage,
      route
    };
  
  },
};
</script>

<style>
h1.title {
  text-align: center;
}
div.main-chat {
  display: flex;
  width: 90%;
  margin: 0 5%;
  flex-wrap: wrap;
}

div.left {
  width: 25%;
}
div.left div.condition div {
  width: 100%;
  margin: 40px 0;
  display: flex;
  cursor: pointer;
}
div.right {
  width: 50%;
  background: white;
  height: 780px;
  border-radius: 10px;
  box-shadow: 15px 15px 25px #1c64d9;
  display: block;
  overflow-y: scroll;
}

div.left img {
  width: 70px;
  height: 70px;
  border-radius: 35px;
}

div.send-control {
  width: 100%;
  margin-top: 30px;
}
.btn-send {
  padding: 14px 50px;

  background: white;
  border-radius: 10px;
  border: none;
  font-weight: bold;
  cursor: pointer;
}
.input-send {
  width: 400px;
  height: 40px;
  border-radius: 10px;
  border: none;
  margin-right: 30px;
  outline: #ff0066;
}
img.avatar{
  width: 40px;
  height: 40px;
  border-radius: 50px;
  border: 4px solid #ff0066;
}
div.right-content {
  display: flex;
  flex-wrap: wrap;
  width: 90%;
  margin: 0 5% ;
}
.width-100{
  width: 50%;
  text-align: left;
  background: #1c64d9;
  border-radius: 20px;
  padding: 10px 0px;
  color: white;
  padding-left: 10px;
}
p.name {
  font-weight: bold;
  margin-left: 10px;
  margin-top: 0;
  width: 80%;
  text-align: left;
}
div.right-wrap {
  padding-top: 40px;
}
</style>