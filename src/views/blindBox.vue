<template>
  <div>
    <span class="total" v-show="sex != ''" :style="colorStyle"
      >当前有{{ sex == "男" ? maleBoxSum : femaleBoxSum }}个{{ sex }}盒</span
    >
    <span class="total" :style="colorStyle" v-show="sex == ''"
      >我收到的盒子</span
    >
    <span class="total" :style="colorStyle" @click="centerDialogVisible = true"
      >查看规则</span
    >
    <el-dialog
      v-model="centerDialogVisible"
      title="盲盒规则"
      width="30%"
      center
    >
      <span>
        <p style="margin-left: 82px">
          1.点击盒子切换类型，再次点击抽取一个盲盒
        </p>
        <p style="margin-left: 82px">
          2.投入盲盒可以获取一张盲盒劵，每周上限两张
        </p>
        <p style="margin-left: 82px">3.抽取盲盒需要消耗一张盲盒劵哦~</p>
        <p style="margin-left: 82px">4.一天只能抽取和投入一个盲盒哦~</p>
      </span>
    </el-dialog>
    <span class="total" :style="colorStyle">剩余盲盒{{ ticket }}劵</span>
  </div>

  <div class="boxes">
    <span
      class="box1"
      @mouseover="mouseOver1"
      @mouseleave="mouseLeave1"
      @click="getBlindBox1()"
      :style="borderStyle1"
    >
      <img src="..\assets\images\female.png" />
    </span>
    <span
      class="box2"
      @mouseover="mouseOver2"
      @mouseleave="mouseLeave2"
      @click="getBlindBox2()"
      :style="borderStyle2"
    >
      <img src="..\assets\images\male.png" />
    </span>
    <span
      class="box3"
      @mouseover="mouseOver3"
      @mouseleave="mouseLeave3"
      :style="borderStyle3"
    >
      <img src="..\assets\images\mine1.png" @click="toMyBox" />
    </span>
  </div>
  <hr
    style="filter: alpha(opacity=100, finishopacity=0, style=2)"
    width="80%"
    :color="color"
    SIZE="7"
  />

  <div>
    <el-button :style="colorStyle" @click="moreTicket"
      >获取更多盲盒劵</el-button
    >
  </div>
  <div>
    <el-button :style="colorStyle" @click="leaveBox(sex)" v-show="sex != ''"
      >留下{{ sex }}盒</el-button
    >
    <el-button :style="colorStyle" v-show="sex == ''" @click="toMyBox"
      >我的盒子</el-button
    >
  </div>
</template>


<script>
import request from "../utils/request";
import store from "../store";
import { ElMessage, ElMessageBox } from "element-plus";
import qs from "qs";

export default {
  data() {
    const open = () => {
      ElMessageBox.prompt("介绍一下自己吧", "投放盲盒", {
        confirmButtonText: "OK",
        cancelButtonText: "Cancel",
      })
        .then(({ value }) => {
          this.deliveryBlindBox(value);
        })
        .catch(() => {
          ElMessage({
            type: "info",
            message: "Input canceled",
          });
        });
    };
    return {
      centerDialogVisible: false,
      femaleBoxSum: 1,
      maleBoxSum: 1,
      ticket: 0,
      sex: "",
      borderStyle1: {},
      borderStyle2: {},
      borderStyle3: {},
      color: "#c7c0df",
      sexLogin: store.state.loginSex == 0 ? "女" : "男",
      open,
    };
  },

  computed: {
    colorStyle() {
      if (this.sex == "男") {
        return {
          "background-color": "#76acff",
        };
      } else if (this.sex == "女") {
        return {
          "background-color": "#efb4d4",
        };
      } else {
        return {
          "background-color": "#c7c0df",
        };
      }
    },
  },
  methods: {
    toMyBox() {
      this.$router.push("/myBox");
    },
    moreTicket() {
      ElMessageBox.alert("投入盲盒即可获得一张盲盒券噢~", "获取方法");
    },
    successOpenBox(userId, text, id) {
      ElMessageBox.confirm(text, "来自" + id + "的盒子", {
        confirmButtonText: "和ta打声招呼",
        cancelButtonText: "再等一会儿",
        type: "",
      })
        .then(() => {
          store.commit("homePageId", userId);
          this.$router.push("/homePage");
        })
        .catch(() => {
          ElMessage({
            type: "info",
            message: " canceled",
          });
        });
    },

    openBox(sex) {
      ElMessageBox.confirm("确定要消耗一张盲盒券？", "", {
        confirmButtonText: "OK",
        cancelButtonText: "Cancel",
        type: "",
      })
        .then(() => {
          this.getBlindBox(sex);
        })
        .catch(() => {
          ElMessage({
            type: "info",
            message: "Delete canceled",
          });
        });
    },

    getBlindBox1() {
      this.openBox(0);
    },
    getBlindBox2() {
      this.openBox(1);
    },
    getBlindBox(sex) {
      request
        .get("/living/blindBox/collect", {
          params: {
            sex: sex,
          },
          headers: {
            "content-type": "application/json",
          },
        })
        .then((res) => {
          if (res.code == "00000") {
            var userId = res.data.userId;
            var text = res.data.text;
            var id = res.data.id;
            this.ticket = 0;
            this.successOpenBox(userId, text, id);
          } else if (res.code == "A0203") {
            this.$notify({
              title: "提示",
              message: "盲盒券已用完噢~",
              duration: 3000,
            });
          }
        });
    },
    deliveryBlindBox(content) {
      var sex = this.sex == "男" ? 1 : 0;
      var text = content;
      let data = qs.stringify({
        sex: sex,
        text: text,
      });
      request
        .put("/living/blindBox/deliver", data, {
          headers: {
            "content-type": "application/x-www-form-urlencoded",
          },
        })
        .then((res) => {
          if (res.code == "00000") {
            this.ticket = 1;
            ElMessage({
              type: "success",
              message: `已成功投递`,
            });
          } else if (res.code == "A0203") {
            ElMessage({
              type: "warning",
              message: `此星期已投送`,
            });
          }
        });
    },
    leaveBox(sex) {
      console.log(this.sexLogin);
      if (this.sexLogin != sex) {
        if (this.sexLogin == "女") {
          this.$notify({
            title: "提示",
            message: "小姐姐，要投女盒噢~",
            duration: 3000,
          });
        } else {
          this.$notify({
            title: "提示",
            message: "小哥哥，要投男盒噢~",
            duration: 3000,
          });
        }
      } else {
        this.open();
      }
    },
    mouseOver1() {
      this.sex = "女";
      this.color = "#efb4d4";
      this.borderStyle1 = {
        // border: "5px dotted #efb4d4",
        "border-radius": 10 + "px",
        border: "5px solid #efb4d4",
      };
    },
    mouseLeave1() {
      this.borderStyle1 = {};
    },
    mouseOver2() {
      this.sex = "男";
      this.color = "#76acff";
      this.borderStyle2 = {
        // border: "5px dotted #76acff",
        "border-radius": 10 + "px",
        border: "5px solid #76acff",
      };
    },
    mouseLeave2() {
      this.borderStyle2 = {};
    },
    mouseOver3() {
      this.sex = "";
      this.color = "#c7c0df";
      this.borderStyle3 = {
        // border: "5px dotted  #c7c0df",
        "border-radius": 10 + "px",
        border: "5px solid #c7c0df",
      };
    },
    mouseLeave3() {
      this.borderStyle3 = {};
    },
    getBlindBoxInfo() {
      request
        .get("/living/blindBox/info", {
          headers: {
            "content-type": "application/x-www-form-urlencoded",
          },
        })
        .then((res) => {
          this.maleBoxSum = res.data.maleBoxSum;
          this.femaleBoxSum = res.data.femaleBoxSum;
        });
    },
  },
  created() {
    this.getBlindBoxInfo();
  },
};
</script>

<style scoped>
/deep/.el-overlay.is-message-box .el-overlay-message-box {
  right: 507px;
}
/deep/.el-dialog {
  margin-left: 323px;
  margin-top: 183px;
}
.el-button--primary {
  --el-button-text-color: var(--el-color-white);
  --el-button-hover-text-color: var(--el-color-white);
  --el-button-hover-bg-color: var(--el-color-primary-light-3);
  --el-button-hover-border-color: var(--el-color-primary-light-3);
  --el-button-active-bg-color: var(--el-color-primary-dark-2);
  --el-button-active-border-color: var(--el-color-primary-dark-2);
  --el-button-disabled-text-color: var(--el-color-white);
  --el-button-disabled-bg-color: var(--el-color-primary-light-5);
  --el-button-disabled-border-color: var(--el-color-primary-light-5);
}

.boxes {
  overflow: hidden;
  height: 455px;
  /* border-bottom: 5px dotted #c7c0df; */
}
.el-button {
  position: relative;
  margin-top: 50px;

  height: 50px;
}
img {
  width: 305px;
  position: relative;
  right: 64px;
  top: -29px;
}
.total {
  width: fit-content;
  text-align: center;
  min-width: 270px;
  position: relative;
  padding: 15px;
  border-radius: 30px 30px 0px 30px;
  /* background-color: #c7c0df; */
  top: 70px;
  font-family: Lucida Console;
  margin-left: 239px;
}
span.box1,
span.box2,
span.box3 {
  width: 170px;
  height: 150px;
  border-radius: 0 0 0.5vw 0.5vw;
  margin-top: 240px;
  margin-left: 60px;
  display: block;
  float: left;
}
</style>