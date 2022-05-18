<template>
  <div>
    <router-view v-if="isRouterAlive" :key="key"></router-view>
  </div>
</template>

<script>
import loading from "./components/loading.vue";
import useWebSocket from "./hooks";
import store from "./store";
export default {
  name: "App",
  components: { loading },
  computed: {
    key() {
      return this.$route.name !== undefined
        ? this.$route.name + +new Date()
        : this.$route + +new Date();
    },
  },

  created() {
    //   在页面加载时读取 localStorage里的状态信息
    if (localStorage.getItem("state")) {
      this.$store.replaceState(
        Object.assign(
          {},
          this.$store.state,
          JSON.parse(localStorage.getItem("state"))
        )
      );
    }

    //   页面刷新时将state数据存储到 localStorage中

    window.addEventListener("beforeunload", () => {
      localStorage.setItem("state", JSON.stringify(this.$store.state));
      if (store.state.token != null) {
        useWebSocket();
      }
    });
  },
  provide() {
    return {
      reload: this.reload,
    };
  },
  data() {
    return {
      isRouterAlive: true,
    };
  },

  methods: {
    reload() {
      this.isRouterAlive = false; //先关闭，
      this.$nextTick(function () {
        this.isRouterAlive = true; //再打开
      });
    },
  },
};
</script>
<style>
#App {
  height: 100%;
}
</style>

