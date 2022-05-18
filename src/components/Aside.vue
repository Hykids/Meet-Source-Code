<template>
  <div class="aside" v-if="isShow">
    <div>
      <button class="btn" @click.native="publish">
        <span>发布动态</span> <img src="../assets/images/publish.png" alt="" />
      </button>
    </div>

    <div class="label">热点话题</div>
    <div
      class="tags"
      style="
        border: 2px solid #beaddb;
        position: relative;
        cursor: pointer;
        color: white;
        font-size: 1em;
        margin: 5px 10px;
      "
    >
      <el-tag
        :key="tag.id"
        v-for="tag in tagLists"
        style="margin-top: 5px"
        @click="toTag(tag.id)"
        :id="tag.id"
      >
        {{ "#" + tag.content }}
      </el-tag>
    </div>

    <button
      class="btn1 draw-outline"
      @click="blindBox()"
      style="
        box-shadow: 0 2px 12px 0 #9ca4cf;
        margin-top: 25px;
        margin: 10px 10px;
        padding: 0 60px;
        white-space: nowrap;
      "
    >
      <img src="../assets/images/openBox.png" style="margin: 10px 10px" />
      <div>互动盒子</div>
    </button>
    <button
      @click="handleClick()"
      class="btn1 draw-outline"
      style="
        box-shadow: 0 2px 12px 0 #9ca4cf;
        margin: 10px 10px;
        padding: 0 80px;
        white-space: nowrap;
      "
    >
      <img
        src="../assets/images/canlender.png"
        style="width: 26px; position: relative; top: 5px"
      />
      签到抽奖
    </button>

    <div class="lottery">
      <lottery :show.sync="showFlag" />
    </div>
  </div>
</template>

<script>
import request from "@/utils/request";
import lottery from "../components/lottery.vue";
export default {
  name: "Aside",
  components: {
    lottery,
  },
  created() {
    this.getTagList();
  },
  data() {
    return {
      isShow: true,
      showFlag: false,
      tagLists: [],
    };
  },
  methods: {
    toTag(id) {
      this.$router.push({
        path: "/activity",
        query: {
          labelId: id,
        },
      });
    },
    getTagList() {
      request
        .get(
          "/living/activity/label/list",
          {
            params: {
              page: 1,
            },
          },
          {
            headers: {
              "content-type": "application/x-www-form-urlencoded",
            },
          }
        )
        .then((res) => {
          if (res.code == "00000") {
            this.tagLists = res.data.list;
          }
        });
    },

    blindBox() {
      this.$router.push("/blindBox");
    },
    publish() {
      this.$router.push("/publish");
    },
    handleClick() {
      this.showFlag = true;
      this.isShow = false;
      this.$nextTick(() => {
        this.isShow = true;
      });
    },
  },
};
</script>

<style scoped>
.aside {
  width: 291px;
  box-sizing: border-box;
  background-color: rgba(255, 255, 255, 0.948);
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  margin-left: 5px;
  margin-top: 5px;
  -webkit-box-align: center;
  align-items: center;
  display: flex;
  flex-direction: column;
}

.label {
  font-family: "Raleway", sans-serif;
  color: white;
  line-height: 8vh;
  font-size: 20px;
  text-align: center;
  font-family: "Arial Black";
  text-shadow: 0.66913px 0.74314px 0 #9ca4cf, 1.33826px 1.48629px 0 #beaddb,
    2.00739px 2.22943px 0 #beaddb, 2.67652px 2.97258px 0 #9ca4cf;
}
.draw-outline {
  /* #c994bd */
  box-shadow: inset 0 0 0 1px #9ca4cf;
  color: #9ca4cf;
  -webkit-transition: color 0.25s 0.125s;
  transition: color 0.25s 0.125s;
  position: relative;
}
.draw-outline::before,
.draw-outline::after {
  border: 0 solid transparent;
  box-sizing: border-box;
  content: "";
  pointer-events: none;
  position: absolute;
  width: 0;
  height: 0;
}
.draw-outline::before {
  top: 0;
  right: 0;
}
.draw-outline::after {
  left: 0;
  bottom: 0;
}
.draw-outline::after {
  border-top-width: 2px;
  border-left-width: 2px;
}
.draw-outline::before {
  border-bottom-width: 2px;
  border-right-width: 2px;
}
.draw-outline:hover {
  color: #9ca4cf;
}
.draw-outline:hover::before,
.draw-outline:hover::after {
  border-color: #9ca4cf;
  -webkit-transition: border-color 0s, height 0.25s, width 0.25s;
  transition: border-color 0s, height 0.25s, width 0.25s;
  width: 100%;
  height: 100%;
}
.draw-outline:hover::before {
  -webkit-transition-delay: 0s, 0s, 0.25s;
  transition-delay: 0s, 0s, 0.25s;
}
.draw-outline:hover::after {
  -webkit-transition-delay: 0.5s, 0.5s, 0.75s;
  transition-delay: 0.5s, 0.5s, 0.75s;
}

.btn1 {
  background: none;
  border: none;
  cursor: pointer;
  line-height: 1.5;
  font: 500 1.2rem "Roboto Slab", sans-serif;
}

.btn {
  border: none;
  display: block;
  text-align: center;
  cursor: pointer;
  text-transform: uppercase;
  outline: none;
  overflow: hidden;
  position: relative;
  color: #fff;
  font-weight: 700;
  font-size: 16px;
  background-color: #9ca4cf;
  padding: 15px 45px;
  margin: 0 auto;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  margin-top: 25px;
}

.btn span {
  position: relative;
  z-index: 1;
}

.btn:after {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  height: 490%;
  width: 140%;
  background: #a1bce6;
  -webkit-transition: all 0.5s ease-in-out;
  transition: all 0.5s ease-in-out;
  -webkit-transform: translateX(-98%) translateY(-25%) rotate(45deg);
  transform: translateX(-98%) translateY(-25%) rotate(45deg);
}

.btn:hover:after {
  -webkit-transform: translateX(-9%) translateY(-25%) rotate(45deg);
  transform: translateX(-9%) translateY(-25%) rotate(45deg);
}
.btn img {
  display: inline-block;
  vertical-align: middle;
  height: 25px;
}
</style>