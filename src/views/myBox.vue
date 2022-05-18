<template>
  <div>
    <button @click="toOpenBox">
      我打开的盒子 <img src="../assets/images/openBox.png" />
    </button>
    <button @click="toLeaveBox">
      我留的盒子
      <img
        src="../assets/images/leaveBox.png"
        style="height: 37px; top: -6px"
      />
    </button>
  </div>

  <div>
    <router-view />
  </div>
</template>

<script>
export default {
  data() {
    return {
      isCollapse: true,
      leave: false,
    };
  },
  methods: {
    toOpenBox() {
      this.$router.push("/myBox");
    },
    toLeaveBox() {
      this.$router.push("/myBox/leaveBox");
    },
  },
};
</script>

<style scoped>
img {
  height: 45px;
  position: relative;
  vertical-align: middle;
  top: -7px;
}

button {
  width: 375px;
  margin-top: 22px;
  height: 50px;
  line-height: 50px;
  font-family: Roboto, "PingFang SC", "Helvetica Neue", Helvetica, STHeiTi,
    Arial, sans-serif;
  font-size: 16px;
  font-weight: 550;
  color: rgb(134, 136, 226);
  text-align: center;
  margin-right: -1px;
  border: 0.5px solid rgb(220, 213, 213);
  background-color: #fff;
  background: linear-gradient(45deg, #cec4ea, white);
}
</style>