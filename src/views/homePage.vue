<template>
  <Header></Header>
  <div
    class="wrapper"
    :style="{
      background: 'url(' + imageUrl + ')',
      backgroundSize: '100% 100%',
      position: absolute,
    }"
  >
    <div class="home">
      <div class="head" :key="componentKey">
        <div class="avatar">
          <img :src="userInfo.avatar" alt="" />
        </div>
        <div class="basic">
          <div>
            <span class="h-name">{{ userInfo.username }}</span>

            <span class="h-sex">
              <img v-show="userInfo.sex == 1" src="../assets/images/boy.png" />
              <img v-show="userInfo.sex == 0" src="../assets/images/girl.png" />
            </span>
          </div>
          <div class="user-profile-head">
            <ul>
              <li>
                <div class="visited-num">{{ userInfo.visitorSum }}</div>
                <div class="visited-name">被访问</div>
                <div class="bar"></div>
              </li>
              <li>
                <div class="visited-num">{{ userInfo.beAttentionSum }}</div>
                <div class="visited-name">粉丝</div>
                <div class="bar"></div>
              </li>
              <li>
                <div class="visited-num">{{ userInfo.attentionSum }}</div>
                <div class="visited-name">关注</div>
                <div class="bar"></div>
              </li>
            </ul>
          </div>
          <div class="h-basic-spacing"></div>
          <div class="operate-btn" v-if="myId == userId">
            <el-button round @click="toedit()"><p>编辑资料</p></el-button>
          </div>
          <div class="operate-btn" v-if="myId != userId">
            <el-button
              color="#8992c8"
              style="color: white"
              ref="btn1"
              round
              @click.stop="getname($event, userId)"
              :key="componentKey"
              >{{ buttonText }}</el-button
            >
            <el-button round @click="chat"><p>私信</p></el-button>
          </div>
        </div>
      </div>
      <!-- 侧边栏部分 -->
      <div class="home-aside">
        <el-row class="tac">
          <el-col :span="12">
            <h5>个人动态</h5>
            <el-menu
              default-active="myarticle"
              class="el-menu-vertical-demo"
              :default-active="this.$route.path"
              :route="{ query: { userId: userId } }"
              router
            >
              <el-menu-item index="myarticle">
                <i class="el-icon-menu"></i>
                <span slot="title" @click="toArticle">发布的动态</span>
              </el-menu-item>
              <el-menu-item index="follow">
                <i class="el-icon-menu"></i>
                <span slot="title" @click="toFollow">关注列表 </span>
              </el-menu-item>
              <el-menu-item index="fanslist">
                <i class="el-icon-document"></i>
                <span slot="title" @click="toFns">粉丝列表</span>
              </el-menu-item>
              <el-menu-item v-if="myId == userId">
                <i class="el-icon-setting"></i>
                <span slot="title" @click="exit">退出登录</span>
              </el-menu-item>
            </el-menu>
          </el-col>
        </el-row>
      </div>
      <!-- main -->
      <div class="home-main">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import Header from "../components/header.vue";
import recomendView from "../views/recomendView.vue";
import request from "@/utils/request";
import myArticle from "./mine/myArticle.vue";
import edit from "./mine/edit.vue";
import store from "../store";
import qs from "qs";

export default {
  inject: ["reload"],
  components: {
    Header,
    myArticle,
    recomendView,
    edit,
  },
  data() {
    return {
      imageUrl: store.state.imageUrl,
      userId: store.state.homePageId,
      myId: store.state.userId,
      pageSum: "",
      total: "",
      article: [],
      userInfo: [],
      avatar: "",
      attentionListId: [],
      componentKey: 0,
      buttonText: this.$route.query.buttonText,
    };
  },
  computed: {
    buttonText() {
      var id = this.userId;
      if (store.state.attentionListId) {
        var buttonText =
          store.state.attentionListId.indexOf(id) == -1 ? "关注" : "已关注";
      }
      console.log(buttonText);
      return buttonText;
    },
  },
  methods: {
    // 获取我的关注列表 关注 取消关注
    getAttention() {
      var Id = store.state.userId;

      var data = qs.stringify({
        path: {
          userId: Number(Id),
        },
      });

      request
        .get("/living/user/" + Id + "/attentionList", data, {
          headers: {
            "content-type": "application/x-www-form-urlencoded",
          },
        })
        .then((res) => {
          var attentionList = res.data;
          attentionList = Array.from(attentionList);
          if (attentionList != []) {
            attentionList.forEach((item) => {
              this.attentionListId.push(item.id);
            });
          }
        });
    },
    chat() {
      this.$router.push("/chat");
      store.commit("ADD_ITEM", this.userId);
      store.commit("setNickuser", this.userId);
      store.commit("setNickuserName", this, userInfo.username);
      store.commit("setNickuserAvatar", this, userInfo.avatar);
    },

    getname(e, id) {
      e.target.innerText = "已关";
      request
        .post("/living/social/attention/" + id, {
          path: {
            userId: Number(id),
          },
          headers: {
            "content-type": "application/x-www-form-urlencoded",
          },
        })
        .then((res) => {
          if (res.code === "00000") {
            this.getAttention();
          }
        });
    },

    toedit() {
      this.$router.push("/homepage/edit");
    },

    getUserInfo() {
      var userId = this.userId;
      request
        .get(
          "/living/user/" + userId + "/info",
          //"/living/user/{useId}/info",
          {
            path: {
              userId: Number(userId),
            },
            headers: {
              "content-type": "application/x-www-form-urlencoded",
            },
          } //设置返回类型
        )
        .then((res) => {
          this.userInfo = res.data;
          // console.log(res.data);
        });
    },
    toFollow() {
      this.$router.push("/homepage/follow");
    },
    toFans() {
      this.$router.push("/homepage/fanslist");
    },
    toArticle() {
      this.$router.push("/homepage/myarticle");
    },
    exit() {
      this.$router.push("/recomend");
      store.commit("setId", "");
      store.commit("setAvatar", "");
      store.commit("clearNotes", []);
      setTimeout(() => {
        window.location.reload();
      }, 100);
    },
  },

  watch: {
    // 监视搜索词变化
    "store.state.homePageId": {
      immediate: true,
      handler() {
        this.userId = store.state.homePageId;
        this.getAttention();
        this.getUserInfo();
      },
    },
  },

  created() {
    // store.commit("homePageId", this.$route.query.userId);
    this.userId = store.state.homePageId;
    this.getAttention();
    this.getUserInfo();
  },
};
</script>

<style scoped>
/deep/.el-menu-item.is-active {
  color: black;
}
.wrapper {
  height: 100%;
  width: 100%;
  /* background-color: #ebebee; */

  position: relative;
}
.home {
  margin: 0 auto;
  width: 1200px;
}
.head {
  display: block;
  height: 192px;
  background-position: 50%;
  background-color: rgba(255, 255, 255, 0.7);
}

.basic {
  margin-top: 40px;
  margin-left: 90px;
}
.avatar {
  position: relative;
  top: 110px;
  left: 20px;
  height: 60px;
  width: 60px;
  border-radius: 50%;
  margin: 0;
  padding: 0;
  border: 1px solid #ddd;
  overflow: hidden;
}
.h-name {
  font-size: 22px;
  line-height: 24px;
}
.h-sex img {
  height: 20px;
  position: relative;
  top: 3px;
}
.h-sex {
  width: 50px;
  line-height: 30px;
}
.user-profile-head {
  position: relative;
  right: 35px;
}
li {
  list-style: none;
  display: block;
  float: left;
}
li div {
  float: left;
}
.avatar img {
  height: 62px;
  width: 62px;
}
.visited-num {
  color: #222226;
  font-weight: 600;
  font-size: 20px;
  line-height: 24px;
  margin-right: 4px;
}
.visited-name {
  color: #555666;
  font-size: 14px;
  line-height: 21px;
  margin-top: 2px;
}
.bar {
  width: 1px;
  height: 16px;
  background: #e8e8ed;
  margin: 0 16px;
}

.operate-btn {
  /* border: 1px solid #ccccd8;
  border-radius: 20px; */
  position: relative;
  right: 20px;
  bottom: 10px;
  font-size: 0;
  float: right;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
}
/* .operate-btn :hover {
  border: 1px solid #848488;
  border-radius: 20px;
} */

.operate-btn p {
  display: flex;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  font-size: 14px;
  width: 96px;
  text-align: center;
  height: 32px;
  color: #555666;
  /* text-decoration: none; */
}

.home-aside {
  display: block;
  margin-top: 5px;
  padding: 10px;
  float: left;
  position: absolute;
  height: 590px;
  width: 285px;
  background-color: #fff;
}

.el-col-12 {
  /* max-width: 100%; */
  min-width: 305;
}
.home-main {
  /* position: absolute; */
  display: block;
  margin-left: 310px;
  margin-top: 5px;
  height: 608px;
  width: 890px;
  background-color: #fff;
  overflow: scroll;
  overflow-x: hidden;
}
::-webkit-scrollbar {
  width: 6px;

  height: 6px;

  background-color: rgba(240, 240, 240, 1);
}
</style>