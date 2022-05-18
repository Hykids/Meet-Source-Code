<template>
  <div class="currentPage">
    <ul class="list" v-for="(item, key) in fansList" :key="key">
      <li class="list-item">
        <img :src="item.avatar" @click="toHomePage(item.id)" />

        <div class="content">{{ item.username }}</div>
      </li>
    </ul>
  </div>
</template>

<script>
import request from "@/utils/request";
import store from "../../store";
export default {
  inject: ["reload"],
  data() {
    return {
      userId: store.state.homePageId,
      fansList: [],
    };
  },

  methods: {
    toHomePage(id) {
      store.commit("homePageId", id);
      this.$router.push({
        path: "/homepage",
        query: {
          buttonText: buttonText,
        },
      });
      this.userId = id;
      this.getfansList();
      this.reload();
    },
    getfansList(userId = this.userId) {
      request
        .get("/living/user/" + userId + "/fansList", {
          path: {
            userId: Number(userId),
          },
          headers: {
            "content-type": "application/x-www-form-urlencoded",
          },
        })
        .then((res) => {
          //   console.log(res);
          this.fansList = res.data;
        });
    },
  },
  watch: {
    // 监视搜索词变化
    "$route.query.userId": {
      immediate: true,
      handler() {
        this.getfansList();
      },
    },
  },
  created() {
    this.getfansList();
  },
};
</script>

<style scoped>
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