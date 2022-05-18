<template>
  <p>一共发布{{ total }}条动态</p>

  <div v-if="article">
    <el-empty description="空空如也" v-show="article.length == 0"></el-empty>
  </div>
  <!-- 发布的动态 -->

  <div class="currentPage" v-for="(item, key) in article" :key="key">
    <div
      class="article"
      style="
        white-space: normal;
        word-break: break-all;
        overflow: hidden;
        padding-left: 10px;
        padding-right: 10px;
      "
    >
      <router-link
        v-show="item.text"
        active-class="active"
        :to="{
          path: '/detail',
          query: {
            id: item.id,
          },
        }"
      >
        {{ uncodeUtf16(item.text).slice(0, 25) + "......" }}
      </router-link>
      <span class="like" @click.native="likeAnddislike(item.id, item.isLiked)">
        <img src="../../assets/images/heart.png" hspace="7" />

        {{ item.likeSum }}</span
      >

      <span>{{ item.publishTime }}</span>
      <router-link
        active-class="active"
        :to="{
          path: '/detail',
          query: {
            id: item.id,
          },
        }"
      >
        <span class="article-pic"><img :src="item.pic[0]" /></span>
      </router-link>
      <span class="delete" v-if="myId == userId">
        <el-button @click="deleteDynamics(item.id)">删除动态</el-button>
      </span>
    </div>
  </div>
  <transition name="fade">
    <loading v-if="isLoading"></loading>
  </transition>
  <el-pagination
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
    :current-page.sync="currentPage"
    :page-size="pagesize"
    layout="prev, pager, next, jumper"
    :total="total"
    :key="currentPage"
    v-show="pageSum > 1"
  >
  </el-pagination>
</template>

<script>
import loading from "../../components/loading.vue";
import request from "@/utils/request";
import store from "../../store/index";
import { ElMessage, ElMessageBox } from "element-plus";
export default {
  data() {
    return {
      userId: store.state.homePageId,
      likeId: store.state.likeId,
      like: store.state.like,
      currentPage: 1,
      pageSum: "",
      total: "",
      article: [],
      userInfo: [],
      pageSize: 5,
      myId: store.state.userId,
      isLoading: true,
    };
  },
  components: { loading },
  methods: {
    // 表情转换为字符
    uncodeUtf16(str) {
      var reg = /\&#.*?;/g;
      var result = str.replace(reg, function (char) {
        var H, L, code;
        if (char.length == 9) {
          code = parseInt(char.match(/[0-9]+/g));
          H = Math.floor((code - 0x10000) / 0x400) + 0xd800;
          L = ((code - 0x10000) % 0x400) + 0xdc00;
          return unescape("%u" + H.toString(16) + "%u" + L.toString(16));
        } else {
          return char;
        }
      });
      return result;
    },
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage; //修改currentPage
      this.getMyArticle();
    },
    likelike(id) {
      request
        .post("/living/activity/" + id + "/like", {
          path: {
            id: Number(id),
          },
          headers: {
            "content-type": "application/x-www-form-urlencoded",
          },
        })
        .then((res) => {
          if (res.code === "00000") {
            this.getMyArticle();
          } else if (res.code === "A0004") {
            this.$notify({
              title: "提示",
              message: "请不要重复点赞",
              duration: 3000,
            });
          }
        });
    },
    likeAnddislike(id) {
      let list = this.likeId;
      if (list.indexOf(id) == -1) {
        this.likeId.push(id);
        this.like[id] = !this.like[id];
        this.likelike(id);
      } else {
        this.like[id] = !this.like[id];
        this.Cancelike(id);

        for (var i in this.likeId) {
          if (this.likeId[i] == id) {
            this.likeId.splice(i, 1);
          }
        }
      }
    },

    Cancelike(id) {
      request
        .post("/living/activity/" + id + "/like/remove", {
          path: {
            // id: qs.stringify(id),
            id: Number(id),
          },
          headers: {
            "content-type": "application/x-www-form-urlencoded",
          },
        })
        .then((res) => {
          if (res.code === "00000") {
            this.getMyArticle();
          } else if (res.code === "A0004") alert("");
        });
    },
    getMyArticle() {
      var userId = this.userId;
      var page = Number(this.currentPage);
      request
        .get("/living/user/" + userId + "/activity", {
          params: {
            page: page,
          },
          path: {
            userId: Number(userId),
          },
          headers: {
            "content-type": "application/x-www-form-urlencoded",
          },
        })
        .then((res) => {
          console.log(res);
          this.pageSum = res.data.pageSum;
          this.total = res.data.total;
          this.article = res.data.list;
          this.isLoading = false;
        });
    },
    deleteDynamics(id) {
      ElMessageBox.confirm("确定要删除动态？", "", {
        confirmButtonText: "OK",
        cancelButtonText: "Cancel",
        type: "",
      })
        .then(() => {
          request
            .delete(
              "/living/activity/" + id + "/delete",
              {
                path: {
                  id: id,
                },
                headers: {
                  "content-type": "application/x-www-form-urlencoded",
                },
              } //设置返回类型
            )
            .then((res) => {
              if (res.code == "00000") {
                this.getMyArticle();
                this.$notify({
                  title: "提示",
                  message: "动态删除成功",
                  duration: 3000,
                });
              } else {
                this.$notify({
                  title: "提示",
                  message: "没有权限",
                  duration: 3000,
                });
              }
            });
        })
        .catch(() => {
          ElMessage({
            type: "info",
            message: "Delete canceled",
          });
        });
    },
  },

  created() {
    this.getMyArticle();
  },
};
</script>

<style scoped>
.like img,
.view img {
  position: relative;
  top: 2px;
  /* width: 20px; */
  height: 18px;
}
.view img {
  height: 22px;
  top: 4px;
}
.el-button {
  background-color: whitesmoke;
  width: 60px;
  font-size: 13px;
  color: #8992c8;
  height: 28px;
  position: absolute;
  top: -23px;
  left: 326px;
  /* display: block; */
}
.delete {
  position: absolute;
}
.article a:hover {
  color: black;
}

.article {
  color: rgb(112, 111, 111);
  width: 870px;
  min-height: 150px;
  padding: 0 10px;
  padding-top: 10px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
.article span {
  padding: 0 10px;
  position: relative;
  top: 96px;
}
.article-pic {
  position: relative;
  display: block;
  float: right;
  padding-right: 20px;
  max-height: 100px;
  width: 160px;
  overflow: hidden;
}

span.article-pic {
  top: 1px;
}
.article-pic img {
  width: 160px;
}
a {
  display: block;
  text-decoration: none;
  color: black;
}
</style>