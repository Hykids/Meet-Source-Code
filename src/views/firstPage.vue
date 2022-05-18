<template>
  <header></header>
  <div id="page">
    <div style="width: 100%" class="flex-container column">
      <video
        ref="audio"
        src="http://ws.stream.qqmusic.qq.com/C40000045EpE1mQ4e2.m4a?guid=947712954&vkey=7D86BA516ACFA60EFD41CF6A4C0EF0E1D37B70820615C55551A5AE9890CBB93FE65CA1AA94CAE477877C05577E25EE11543D737557D41950&uin=&fromtag=66"
        controls="controls"
        hidden="hidden"
        autoplay="autoplay"
        loop="loop"
      ></video>
      <!-- style="transform: translate(-1584.4%, 121.5%) scale(1)" -->
      <img
        id="img"
        class="play"
        style="position: relative; top: 50px; left: 50px"
        :src="sound"
        @click="play()"
      />
    </div>
  </div>
  <!-- <button @click="play()">播放</button>
  <audio
    controls="controls"
    hidden
    src="http://music.163.com/song/media/outer/url?id=1501183304.mp3"
    ref="audio"
  ></audio> -->
</template>

<script>
import header from "../components/header.vue";
export default {
  components: {
    header,
  },

  data() {
    return {
      sound: require("../assets/images/play.png"),
      // audio: this.$refs.myAudio,
    };
  },
  // mounted() {
  //   this.play();
  // },
  methods: {
    play() {
      if (this.sound == require("../assets/images/play.png")) {
        this.sound = require("../assets/images/pause.png");
        this.$refs.audio.autoplay = true;
        this.$refs.audio.play();
      } else {
        this.sound = require("../assets/images/play.png");
        this.$refs.audio.pause();
      }
    },
    // play(type) {
    //   this.$refs.audio.currentTime = 0; //从头开始播放
    //   this.$refs.audio.play(); //播放
    //   setTimeout(() => {
    //     this.$refs.audio.pause(); //停止
    //   }, 5000);
    // },
  },
};
</script>

<style scoped>
</style>