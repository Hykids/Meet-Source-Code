<template>
  <div class="signbox" v-if="show">
    <button id="close" @click="show = false">
      <el-icon><close /></el-icon>
    </button>
    <div class="sign" v-for="index of 7" :key="index">
      <span class="day" key="key"
        >第{{ index }}天<span v-if="index <= signInfo.signInDays"
          ><img src="../assets/images/sign.png" /></span
      ></span>
    </div>

    <div>
      <el-progress
        :text-inside="true"
        :stroke-width="24"
        :percentage="percentage"
        :color="customColors"
        :format="customFormat"
        status="success"
      ></el-progress>
    </div>
    <div class="getsign">
      <el-button v-if="!isSign" size="medium" @click="sign">签到</el-button>
      <el-button v-if="isSign" size="medium" disabled>今日已签到</el-button>
    </div>
    <div class="tip">
      <ul>
        <li>签到从每天凌晨开始</li>
        <!-- <li>连续七天可获取一个月vip</li> -->
        <li>漏签需要重新开始</li>
      </ul>
    </div>
  </div>
</template>

<script>
import { Close, Medal } from "@element-plus/icons-vue";
import request from "@/utils/request";
import { ref } from "@vue/reactivity";
export default {
  name: "lottery",
  components: {
    Close,
    Medal,
  },
  props: ["show"],
  data(props) {
    const show = props.show;
    console.log(show);
    return {
      customColor: "#409eff",
      format: "",
      percentage: ref(0),
      signInfo: [],
      isSign: false,
      key: 1,
      // show: false,
      customColors: [
        { color: "#f56c6c", percentage: 20 },
        { color: "#e6a23c", percentage: 40 },
        { color: "#5cb87a", percentage: 60 },
        { color: "#1989fa", percentage: 80 },
        { color: "#6f7ad3", percentage: 100 },
      ],
      show,
    };
  },

  methods: {
    //关闭
    // closeShow() {
    //   // console.log(show);
    //   // this.$emit("show", false);
    //   // console.log(this.show);
    //   this.show = false;
    // },
    getPercentage(day) {
      if (day == 1) {
        return (this.percentage = 15);
      } else if (day == 2) {
        return (this.percentage = 30);
      } else if (day == 3) {
        return (this.percentage = 45);
      } else if (day == 4) {
        return (this.percentage = 60);
      } else if (day == 5) {
        return (this.percentage = 75);
      } else if (day == 6) {
        return (this.percentage = 90);
      } else if (day == 7) {
        return (this.percentage = 100);
      }
    },

    //签到
    sign() {
      request
        .put("/living/signIn/signIn", {
          headers: {
            "content-type": "application/x-www-form-urlencoded",
          },
        })
        .then((res) => {
          console.log(res);
          if (res.code == "00000") {
            this.$message({
              message: "签到成功",
              type: "success",
            });
            this.isSign = true;
            localStorage.setItem("isSign", true);
            this.getSigngift();
            this.getSignInfo();
            this.percentage += 15;
            this.key += 1;
            if (this.percentage > 100) {
              this.percentage = 100;
            }
          }
        });
    },
    //签到信息
    getSignInfo() {
      request
        .get("/living/signIn/info", {
          headers: {
            "content-type": "application/x-www-form-urlencoded",
          },
        })
        .then((res) => {
          this.signInfo = res.data;
          this.percentage = this.getPercentage(this.signInfo.signInDays);
          // if(res.data.signInToday==true){
          this.$nextTick(() => {
            this.isSign = res.data.signInToday;
          });

          console.log(res.data.signInToday);
        });
    },
    //获取签到奖励
    getSigngift() {
      request
        .post("/living/signIn/getGift", {
          headers: {
            "content-type": "application/x-www-form-urlencoded",
          },
        })
        .then((res) => {
          if (res.code == "00000") {
            this.$message({ message: "领取礼物成功", type: "success" });
          }
        });
    },
    customFormat() {
      if (this.percentage == 15) {
        return (this.format = "第一天");
      } else if (this.percentage == 30) {
        return (this.format = "第二天");
      } else if (this.percentage == 45) {
        return (this.format = "第三天");
      } else if (this.percentage == 60) {
        return (this.format = "第四天");
      } else if (this.percentage == 75) {
        return (this.format = "第五天");
      } else if (this.percentage == 90) {
        return (this.format = "第六天");
      } else if (this.percentage == 100) {
        return (this.format = "可领取vip");
      }
    },
  },
  mounted() {
    this.getSignInfo();
  },
};
</script>

<style scoped>
.signbox {
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  width: 500px;
  height: 400px;
  padding: 10px;
  margin-top: 10px;
  text-align: center;
  position: relative;
  right: 500px;
  top: -400px;
}
.sign {
  margin: 0;
  display: inline-block;
  z-index: 1;
}
.day {
  display: inline-block;
  width: 105px;
  height: 80px;
  background-color: #f7f6ff;
  margin: 10px 5px;
  text-align: center;
  line-height: 80px;
  border-radius: 50%;
  border: #8595d8 1px solid;
  color: rgb(138, 159, 187);
}
.tip {
  margin-top: 35px;
  text-align: left;
}

.day img {
  width: 50px;
  height: 50px;
  position: relative;
  display: block;
  bottom: 58px;
  left: 33px;
}
ul li::marker {
  color: rgb(146, 120, 238);
}
/* .day7 {
  width: 441px;
} */

.getsign button {
  position: relative;
  top: 20px;
  width: 7rem;
  border-radius: 1.5rem;
  background-image: linear-gradient(to right, #b2a0d4 0%, #8595d8 100%);
  border: #31ebeb;
}

#close {
  float: right;
  background-color: transparent;
  border: none;
  width: 20px;
  height: 20px;
}
</style>