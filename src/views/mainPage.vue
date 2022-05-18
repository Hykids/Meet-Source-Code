<template>
  <div
    class="background1"
    :style="{
      background: 'url(' + imageUrl + ')',
      backgroundSize: '100% 100%',
    }"
  >
    <Header></Header>
    <div class="wrapper">
      <Main> </Main>
      <Aside></Aside>
    </div>
  </div>
</template>

<script>
import Aside from "@/components/Aside.vue";
import Header from "../components/header.vue";
import Main from "@/components/Main.vue";
import store from "../store/index";
export default {
  name: "MainPage",
  data() {
    return {
      // imageUrl: require("../assets/images/bk2.jpeg"),
      imageUrl: store.state.imageUrl,
    };
  },
  components: {
    Header,
    Aside,
    Main,
  },
};
</script>

<style scoped>
.background1 {
  /* background: url("../assets/images/bk2.jpeg"); */

  background-repeat: no-repeat;
  background-size: 100% 100%;
}
.wrapper {
  position: relative;
  width: 1145px;
  margin: 5px auto;
  margin-bottom: 0;
  display: flex;
  height: 1203px;
}
</style>
