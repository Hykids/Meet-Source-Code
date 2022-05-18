<template>
  <div class="currentPage">
    <ul class="list" v-for="(item, key) in attentionList" :key="key">
      <li class="list-item">
        <img :src="item.avatar" @click="toHomePage(item.id)" />

        <div class="content">
          <router-link
            class="cover"
            :to="{
              path: '/homepage',
              query: {
                id: item.id,
              },
            }"
            >{{ item.username }}</router-link
          >
          <div class="action">
            <el-button @click="open(item.id)"
              ><p>{{ attentionBoth[item.id] }}</p></el-button
            >
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import request from "@/utils/request";
import store from "../../store";
import { ElMessage, ElMessageBox } from "element-plus";
export default {
  inject: ["reload"],
  data() {
    return {
      userId: store.state.homePageId,

      attentionList: [],
      attentionBoth: [],
      centerDialogVisible: false,
    };
  },
  methods: {
    toHomePage(id) {
      store.commit("homePageId", id);
      this.$router.push("/homepage");
      this.userId = id;
      this.getAttention();
      this.reload();
    },
    open(id) {
      ElMessageBox.confirm("确定要取消关注吗？", "", {
        confirmButtonText: "OK",
        cancelButtonText: "Cancel",
        type: "",
      })
        .then(() => {
          this.cancleAttention(id);
        })
        .catch(() => {
          ElMessage({
            type: "info",
            message: "CancelAttention canceled",
          });
        });
    },
    async cancleAttention(id) {
      request
        .delete("/living/social/removeAttention/" + id, {
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
    getAttention() {
      var userId = this.userId;
      request
        .get("/living/user/" + userId + "/attentionList", {
          path: {
            userId: Number(userId),
          },
          headers: {
            "content-type": "application/x-www-form-urlencoded",
          },
        })
        .then((res) => {
          this.attentionList = res.data;
          if (this.attentionList != []) {
            this.attentionList.forEach((item) => {
              this.mutualAttention(item.id);
            });
          }
        });
    },
    mutualAttention(id) {
      var userId = id;
      request
        .get("/living/user/" + userId + "/attentionList", {
          path: {
            userId: Number(userId),
          },
          headers: {
            "content-type": "application/x-www-form-urlencoded",
          },
        })
        .then((res) => {
          if (res.data != []) {
            // var isAttention = [];
            for (var i = 0; i < res.data.length; i++) {
              var a = res.data[i].id;
              if (a == this.userId) {
                var b = 1;
              }
            }
            if (b == 1) {
              this.attentionBoth[id] = "相互关注";
            } else {
              this.attentionBoth[id] = "已关注";
            }
          }
        });
    },
  },

  created() {
    this.getAttention();
  },
};
</script>

<style scoped>
.dialog-footer button:first-child {
  margin-right: 10px;
}
a {
  color: inherit;
  text-decoration: none;
  transition: color 0.2s ease, background-color 0.2s ease;
}
.list {
  padding: 0 20px 20px;
}
.cover {
  border-radius: 48px;
  overflow: visible;
  margin-left: 0;
}
.list-item img {
  border-radius: 60px;
  width: 60px;
  height: 60px;
}
.content {
  padding: 0 200px 0 0;
  position: relative;
  margin-left: 88px;
  margin-top: -35px;
}
.action {
  position: absolute;
  right: 0;
  bottom: 7px;
}
.list-item {
  border-bottom: 1px solid #eee;
  display: block;
  padding: 20px 0;
  position: relative;
  line-height: 1;
}
</style>