import { createStore } from "vuex";
import { getUserInfo } from "./requstFunction"
import request from "@/utils/request";
export default createStore({
  state: {
    loginSex: Number,
    username: '',
    imageUrl: require("../assets/images/bk2.jpeg"),
    attentionListId: [],
    userId: localStorage.getItem("userId"),
    homePageId: Number,
    avatar: localStorage.getItem("avatar"),
    likeId: [],
    like: [],
    notes: [],

    token: localStorage.getItem("token"),//初始化token
    user: {
      loginId: '',
      attentionPublisherId: ''
    },
    chat: {
      chatLists: [],
      routes: [],
      sessions: {
        fromUserId: '',
        type: "",
        badgeNumber: 0,
        news: [],

      },//聊天记录
      nickuserAvatar: '',
      userIds: [],//消息列表用户Id
      currentUser: null,//当前登录用户
      chatUsers: [],
      currentList: '',//当前聊天窗口列表
      filterKey: '',
      stomp: null,
      nickname: '',//选中用户id
      nickName: '',//选中用户名字
      isDot: {},//两用户之间是否有未读信息


    },


  },
  mutations: {


    setToken(state, token) {
      localStorage.setItem("token", token);
      state.token = token
    },
    setUsername(state, username) {
      localStorage.setItem("username", username);
      state.username = username
    },
    setId(state, userId) {
      localStorage.setItem("userId", userId);
      state.userId = userId //同步存储token至localStorage
    },
    setAvatar(state, avatar) {
      localStorage.setItem("avatar", avatar);
      state.avatar = avatar
    },
    loginSex(state, value) {
      localStorage.setItem("loginSex", value);
      state.loginSex = value
    },
    // 背景图
    imageUrl(state, value) {
      localStorage.setItem("imageUrl", value);
      state.imageUrl = value
    },
    //  存储主页用户id
    homePageId(state, homePageId) {

      state.homePageId = homePageId;
    },
    attentionListId(state, attentionListId) {
      state.attentionListId = attentionListId;
    },


    // 存储点赞id
    setLikeId(state, likeId) {
      localStorage.setItem("likeId", likeId);
      state.avatar = likeId
    },
    setLike(state, value) {
      localStorage.setItem("like", value);
      state.like = value
    },
    setNickuser(state, nickuser) {
      localStorage.setItem("nickuser", nickuser);
      state.chat.nickname = nickuser;
    },
    setNickuserName(state, name) {
      localStorage.setItem("nickuserName", name);
      state.chat.nickName = name;
    },
    setNickuserAvatar(state, avatar) {
      localStorage.setItem("nickuserAvatar", avatar);
      state.chat.nickuserAvatar = avatar;
    },
    setButtonText(state, buttonText) {
      localStorage.setItem("buttonText", buttonText);
      state.buttonText = buttonText
    },
    saveNote(state, note) {
      // localStorage.setItem("note", note);
      if (state.notes) {
        state.notes.push(note);
        console.log(state.notes)
      }

    },
    clearNotes(state, notes) {
      state.notes = []
    },
    //添加新聊天用户
    ADD_ITEM(state, item) {
      console.log(state.chat.userIds)
      state.chat.userIds.push(item);
      let arr = state.chat.userIds;
      let newArr = [];
      for (var i = 0; i < arr.length; i++) {
        if (newArr.indexOf(arr[i]) === -1) {
          newArr.push(arr[i]);
        }
      }
      state.chat.userIds = newArr;
    },
    //清除列表用户
    CLEAL_ITEM(state) {
      state.chat.userIds = [];
    },


    //保存与指定id用户的聊天记录
    saveChatRecord(state, new_message) {
      console.log("调用addMessage")
      let newsGroup = this.dispatch("getchat", new_message.data.fromUserId)//获取与指定id用户的聊天记录
      console.log('newsGroup', newsGroup)


    },


    chatLists(state, chatLists) {
      state.chat.chatLists = chatLists
    }


  },
  actions: {
    getchat() {

    },
    //获取与指定id用户的聊天记录
    getChatRecord(context, id) {
      console.log('kkk')
      request
        .get("/living/message/history", {
          params: {
            userId: id,
          },
          headers: {
            "content-type": "application/json",
          },
        })
        .then((res) => {
          if (res.data.list) {
            var chatLists = res.data.list.reverse();
            context.commit('chatLists', chatLists)
          }

        });
    },
  },
  //modules: {},
  getters: {
    //获取token方法
    //判断是否有token,如果没有重新赋值，返回给state的token
    getToken(state) {
      if (!state.token) {
        state.token = localStorage.getItem('token')
      }
      return state.token
    },
    getUserId(state) {
      return state.userId
    },
  },
});
