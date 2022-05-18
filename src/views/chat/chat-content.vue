<template>
  <div>
    <Header></Header>
    <div
      class="wrapper"
      :style="{
        background: 'url(' + imageUrl + ')',
        backgroundSize: '100% 100%',
        position: absolute,
      }"
    >
      <div class="chat">
        <div class="head">
          <span style="flex-grow: 1" @click="goback"
            ><svg
              t="1647789571202"
              class="icon"
              viewBox="0 0 1142 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="2601"
              width="200"
              height="200"
            >
              <path
                d="M1142.76662 421.476662H295.468175l318.64215-319.366337L512 0 0 512l512 512 102.110325-102.110325-354.851485-355.575672h883.50778v-144.837341z"
                p-id="2602"
                fill="#7490eb"
              ></path></svg
            >返回</span
          >
          <span style="flex-grow: 2"> {{ nickName }}</span>
        </div>
        <list></list>
        <content></content>
      </div>
    </div>
  </div>
</template>

<script>
import list from "../../components/list.vue";
import content from "../../components/content.vue";
import store from "../../store";
import Header from "../../components/header.vue";
export default {
  data() {
    return {
      nickName: store.state.chat.nickName,
      imageUrl: store.state.imageUrl,
    };
  },
  components: {
    list,
    content,
    Header,
  },
  methods: {
    goback() {
      this.$router.go(-1);
    },
  },
};
</script>

<style scoped>
.wrapper {
  position: absolute;
  height: 1060px;
  width: 100%;

  /* background: url("../../assets/images/bk2.jpeg"); */

  background-repeat: no-repeat;
  background-size: 100% 100%;
}
svg {
  position: relative;
  top: 3px;
  width: 20px;
  height: 20px;
}
/* div {
  display: inline-block;
} */
.head {
  width: 980px;
  height: 40px;
  line-height: 40px;
  padding: 5px 10px;
  background-color: #ffffff60;
  margin-bottom: 5px;
  /* border-radius: 15px; */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
}
.head span {
  color: rgb(121, 133, 170);
  font-size: 20px;
}
.chat {
  margin: 35px auto;
  padding: 10px 15px;
  /* width: 816px; */
  height: 580px;
  width: 1000px;
  height: 650px;

  background-color: #ffffff70;
  border: #7490eb 1px solid;
}
</style>