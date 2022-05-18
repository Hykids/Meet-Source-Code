<template>
  <div class="list">
    <div class="head">
      <div class="avatar"><img :src="avatar" /></div>
      <span>{{ username }}</span>
    </div>
    <el-input placeholder="搜索用户" v-model="input" style="width: 200px">
    </el-input>
    <el-button @click="searchUser">
      <el-icon style="vertical-align: middle">
        <search />
      </el-icon>
    </el-button>
    <ul class="list-item" v-for="(item, key) in userList" :key="key">
      <li :class="{ active: item.id == nickname }">
        <span
          v-if="isLineState[item.id] == true"
          class="status-point"
          style="background-color: #67c23a; margin-right: 3px"
        ></span>
        <span
          v-else
          class="status-point"
          style="background-color: rgb(141, 140, 140); margin-right: 3px"
        ></span>
        <router-link
          :to="{
            path: '/homepage',
            query: {
              id: item.id,
            },
          }"
          ><img :src="item.avatar" />
        </router-link>
        <div
          class="name"
          @click="changeNickuer(item.id, item.username, item.avatar)"
        >
          {{ item.username }}
        </div>
      </li>
    </ul>
    <el-button @click="clear" style="margin-top: 15px">清空列表</el-button>
  </div>
</template>



<script>
import store from "../store";
import request from "@/utils/request";
import { Search } from "@element-plus/icons-vue";

export default {
  inject: ["reload"],
  name: "list",
  components: {
    Search,
  },
  computed: {
    nickName() {
      return store.state.chat.nickName;
    },
  },
  watch: {
    nickName(newVal, oldVal) {
      console.log("nickName newVal", newVal);
      console.log("nickName oldVal", oldVal);
      if (newVal != oldVal) {
        this.reload();
      }
    },
  },
  data() {
    return {
      isLineState: [],
      input: "",
      myId: store.state.userId,
      username: store.state.username,
      avatar: store.state.avatar,
      userList: [], //列表用户信息
      userIds: this.$store.state.chat.userIds,
      unReadSum: "", //未读消息总数
      unRead: [], //未读消息列表
      nickuser: store.state.chat.nickname, //选中用户
    };
  },
  methods: {
    clear() {
      store.commit("CLEAL_ITEM");
    },
    searchUser() {
      request
        .get("/living/social/searchUser", {
          params: {
            username: this.input,
          },
          headers: {
            "content-type": "application/json",
          },
        })
        .then((res) => {
          if (res.code == "00000") {
            this.$nextTick(() => {
              this.userList = res.data;
            });
          }
        });
    },

    changeNickuer(id, name, avatar) {
      store.commit("setNickuser", id);
      store.commit("setNickuserName", name);
      store.commit("setNickuserAvatar", avatar);
    },

    getUserInfo(userIds = this.userIds) {
      userIds = userIds.map(Number);
      console.log(userIds);
      request
        .get("/living/message/users/info", {
          params: {
            userIds: JSON.stringify(userIds),
          },
          headers: {
            "content-type": "application/x-www-form-urlencoded",
          },
        })
        .then((res) => {
          this.userList = res.data;
          this.userList.forEach((item) => {
            this.getonlineState(item.id);
          });
        });
    },
    getonlineState(id) {
      request
        .get("/living/message/onlineState", {
          params: {
            userId: id,
          },
          headers: {
            "content-type": "application/x-www-form-urlencoded",
          },
        })
        .then((res) => {
          this.isLineState[id] = res.data;
        });
    },

    //获取未读消息列表
    getunreadList() {
      request
        .get("/living/message/unRead/user", {
          headers: {
            "content-type": "application/x-www-form-urlencoded",
          },
        })
        .then((res) => {
          return res.data;
        });
    },

    //处理未读消息
    async getCachedMessage() {
      let unReadList = await this.getUnReadUser();
    },
  },
  created() {
    this.getUserInfo();
  },
};
</script>

<style scoped>
.status-point {
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  color: rgb(141, 140, 140);
}
ul {
  margin: 0 !important;
  margin-block-start: 0;
  margin-block-end: 0;
}
ul li {
  list-style: none;
  cursor: pointer;
}
div {
  display: inline-block;
}
.avatar img {
  height: 42px;
  width: 42px;
}
a {
  color: inherit;
  text-decoration: none;
  transition: color 0.2s ease, background-color 0.2s ease;
}
.list {
  width: 280px;
  height: 565px;

  padding: 10px 10px;
  background-color: #ffffff60;
  /* border-radius: 15px; */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  float: left;
}
.head {
  width: 100%;
  height: 50px;
}
.head span {
  line-height: 50px;
  font-size: 18px;
  padding: 10px;
  position: relative;
  bottom: 10px;
  display: inline-block;
  color: rgb(121, 133, 170);
}
.avatar {
  border-radius: 48px;
  overflow: visible;
  margin-left: 0;
}
.list-item {
  width: 100%;
  height: 43px;
  line-height: 43px;
}
.list-item img {
  border-radius: 48px;
  overflow: visible;
  height: 30px;
  width: 30px;
  margin-left: 0;
  margin-right: 5px;
  position: relative;
  top: 6px;
}
.name {
  color: rgb(121, 133, 170);
}
.input {
  width: 100%;
  -web-kit-appearance: none;
  -moz-appearance: none;
  display: block;
}
.list-item {
  border-bottom: 1px solid rgb(176, 186, 216);
  display: block;
  padding: 5px 0;
  /* position: relative; */
  line-height: 1;
}
.text {
  font-size: 14px;
}
.item {
  margin-bottom: 18px;
}

.box-card {
  width: 200px;
}

.active {
  background-color: (121, 133, 170);
}
</style>