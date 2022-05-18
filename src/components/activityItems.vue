<template>
  <div class="detail">
    <div class="currentPage" v-for="(item, key) in lists" :key="item.id">
      <!-- 头部 -->
      <div class="header" v-if="item.publisher">
        <span
          class="user"
          v-if="item.publisher && item.publisher.avatar == null"
        >
          <img
            src="../assets/images/head2.png"
            @click="toHome(item.publisher.id)"
          />
        </span>

        <span
          class="user"
          v-if="item.publisher && item.publisher.avatar != null"
        >
          <img
            :src="item.publisher.avatar"
            :onerror="errorImage"
            @click="toHome(item.publisher.id)"
          />
        </span>

        <span
          class="username"
          v-if="item.publisher && item.publisher.username != null"
          style="text-align: left; font-family: Microsoft YaHei; height: 25px"
        >
          {{
            item.publisher.username.length > 9
              ? item.publisher.username.substring(0, 8) + ".."
              : item.publisher.username
          }}
          <span class="time"> {{ timeDifference(item.createTime) }}</span>
        </span>

        <span class="sex" v-if="item.publisher" style="text-align: left">
          <img
            v-show="item.publisher.sex == 1"
            src="../assets/images/boy.png"
          />
          <img
            v-show="item.publisher.sex == 0"
            src="../assets/images/girl.png"
          />
        </span>
        <span
          class="username2"
          style="text-align: left"
          v-show="item.publisher && item.publisher.username == null"
          >无名</span
        >
        <span
          class="attention"
          v-show="(userId != '') & (item.publisher.id != userId)"
        >
          <el-button
            color="#8992c8"
            style="color: white"
            ref="btn1"
            @click.stop="getname($event, item.publisher.id)"
            :key="componentKey"
            >{{ buttonText(item.publisher.id) }}</el-button
          >
        </span>

        <!-- 更多 -->
        <span
          class="more"
          v-show="(item.publisher.id != userId) & (userId != '')"
        >
          <el-dropdown @command="handleCommand">
            <img src="../assets/images/arrow.png" alt="" />
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item
                  command="取消关注"
                  @click="cancleAttention(item.publisher.id)"
                  >取消关注</el-dropdown-item
                >
                <el-dropdown-item
                  @click="
                    privateChat(
                      item.publisher.id,
                      item.publisher.name,
                      item.publisher.avatar
                    )
                  "
                  >私聊</el-dropdown-item
                >
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </span>
      </div>
      <div class="header" v-show="item.isAnonymity == 1">
        <span class="user">
          <img src="../assets/images/head2.png" alt=""
        /></span>
        <span class="username1" style="text-align: left">
          匿名
          <span class="time"> {{ timeDifference(item.createTime) }}</span>
        </span>
      </div>
      <!-- 标签部分 -->
      <div class="label" style="text-align: left; margin-top: 5px">
        <span v-if="item.labels.length > 0">
          <el-tag
            v-for="(tag, key) in item.labels"
            :key="tag.id"
            :disable-transitions="false"
            @click="getLabels(tag.id)"
            @mouseenter="onEnter(tag.id)"
            @mouseleave="onLeave(tag.id)"
            :style="tagStyle[tag.id]"
          >
            {{ "#" + tag.content }}
          </el-tag>
        </span>
      </div>
      <!-- 内容部分 -->
      <div
        class="text-content"
        style="
          word-break: break-all;
          overflow: hidden;
          padding-left: 10px;
          padding-right: 10px;
          color: #353535;
          font-size: '23px';
        "
      >
        <p>{{ uncodeUtf16(item.text) }}</p>
      </div>

      <div class="imageContainer" v-if="item.pic">
        <span
          v-for="(list, key) in item.pic"
          :key="key"
          v-show="
            item.pic.length == 3 ||
            item.pic.length == 6 ||
            item.pic.length == 9 ||
            item.pic.length == 5 ||
            item.pic.length == 7
          "
        >
          <el-image
            fit="cover"
            :src="list"
            :preview-src-list="[list]"
            style="height: 200px; width: 33%"
          >
          </el-image>
        </span>
        <span
          v-for="(list, key) in item.pic"
          :key="key"
          v-show="item.pic.length == 1"
        >
          <el-image
            fit="cover"
            :src="list"
            :preview-src-list="[list]"
            style="height: 400px"
          >
          </el-image>
        </span>
        <span
          v-for="(list, key) in item.pic"
          :key="key"
          v-show="
            item.pic.length == 2 || item.pic.length == 4 || item.pic.length == 8
          "
        >
          <el-image
            fit="cover"
            :src="list"
            :preview-src-list="[list]"
            style="height: 300px; width: 47%"
          >
          </el-image>
        </span>
      </div>

      <!-- 底部 -->
      <div class="footer">
        <span class="like">
          <!-- <img src="../assets/images/like1.png" v-if="like[item.id]" alt="" /> -->
          <img src="../assets/images/like.png" />

          {{ item.likeSum }}</span
        >
        <router-link
          active-class="active"
          :to="{
            path: '/detail',
            query: {
              id: item.id,
            },
          }"
        >
          <span class="comments">
            <img src="../assets/images/comment.png" />
            {{ item.commentSum }}
          </span>
        </router-link>
      </div>
    </div>
  </div>
</template>


<script>
import request from "@/utils/request";
import { ArrowDown, Refresh } from "@element-plus/icons-vue";
import store from "../store";
import qs from "qs";

export default {
  // 依赖注入reload
  inject: ["reload"],
  name: "activityItems",
  // 接受父组件信息
  props: ["lists"],
  data(props) {
    const lists = props.lists;
    console.log("子", lists);
    return {
      errorImage: 'this.src="' + require("../assets/images/erro.png") + '"',
      pic: [],
      publisher: {},
      userId: store.state.userId,
      attentionListId: [],
      componentKey: 0,
      tagStyle: [],
      lists,
    };
  },
  components: {
    Refresh,
    ArrowDown,
  },
  computed: {
    // 鼠标移入移出
    onEnter(id) {
      this.tagStyle[id] = {
        color: "hsl(0, 0%, 100%)",
        "background-color": "rgb(207, 207, 233)",
      };
    },
    onLeave(id) {
      this.tagStyle[id] = {};
    },
    buttonText() {
      // 传入关注用户id判断是否已关注
      return function (id) {
        if (this.attentionListId) {
          return this.attentionListId.indexOf(id) == -1 ? "关注" : "已关";
        } else {
          return "关注";
        }
      };
    },
    userId() {
      return this.$store.state.userId;
    },
  },

  methods: {
    privateChat(id, name, avatar) {
      this.$router.push("/chat");
      store.commit("ADD_ITEM", id);
      store.commit("setNickuser", id);
      store.commit("setNickuserName", name);
      store.commit("setNickuserAvatar", avatar);
      this.reload();
    },
    toHome(id) {
      store.commit("homePageId", id);
      this.$router.push("/homepage");
    },
    // 时间设置
    GettimeifferenceOfNow(lastDate) {
      var time = lastDate.split(" ");
      var dayTime = time[0];
      var lastDate = lastDate.replace(/\-/g, "/"); //使用replace函数，调用data.replace(/\-/g, "/")将全部的“-”替换为”/“
      var date = new Date(lastDate);
      var date_last = date.getTime();
      var date_now = new Date().getTime();
      var day = Math.round((date_now - date_last) / (1000 * 60 * 60 * 24)); //核心：时间戳相减，然后除以天数
      var hours = Math.round((date_now - date_last) / (1000 * 60 * 60)); //核心：时间戳相减，然后除以天数
      var minutes = Math.round((date_now - date_last) / (1000 * 60)); //核心：时间戳相减，然后除以天数
      var myYear = date.getFullYear(); //获取完整的年份(4位,1970-????)
      var myMonth = date.getMonth() + 1; //获取当前月份(0-11,0代表1月)
      var myToday = date.getDate(); //获取当前日(1-31)
      var myDay = date.getDay(); //获取当前星期X(0-6,0代表星期天)
      var myHour = date.getHours(); //获取当前小时数(0-23)
      var myMinute = date.getMinutes(); //获取当前分钟数(0-59)
      var mySecond = date.getSeconds(); //获取当前秒数(0-59)
      var week = [
        "星期日",
        "星期一",
        "星期二",
        "星期三",
        "星期四",
        "星期五",
        "星期六",
      ];
      if ((day > 0) & (day < 7)) {
        return {
          DistanceNow: `${day}天前`,
          Detailed:
            myYear +
            "-" +
            myMonth +
            "-" +
            myToday +
            " " +
            (myHour < 10 ? "0" + myHour : myHour) +
            ":" +
            (myMinute < 10 ? "0" + myMinute : myMinute),
          MinuteDifference: minutes,
          HourDifference: hours,
        };
      } else if (day >= 7) {
        return {
          DistanceNow: dayTime,
        };
      } else if (hours > 0) {
        return {
          DistanceNow: `${hours}小时前`,
          Detailed:
            (myHour < 10 ? "0" + myHour : myHour) +
            ":" +
            (myMinute < 10 ? "0" + myMinute : myMinute),
          MinuteDifference: minutes,
          HourDifference: hours,
        };
      } else if (minutes > 0) {
        return {
          DistanceNow: `${minutes}分钟前`,
          Detailed:
            (myHour < 10 ? "0" + myHour : myHour) +
            ":" +
            (myMinute < 10 ? "0" + myMinute : myMinute),
          MinuteDifference: minutes,
          HourDifference: hours,
        };
      } else {
        return {
          DistanceNow: `刚刚`,
          Detailed:
            (myHour < 10 ? "0" + myHour : myHour) +
            ":" +
            (myMinute < 10 ? "0" + myMinute : myMinute),
          HourDifference: hours,
          MinuteDifference: minutes,
        };
      }
    },

    timeDifference(time) {
      var time = this.GettimeifferenceOfNow(time);
      return time.DistanceNow;
    },
    // 表情包转换为字符
    uncodeUtf16(str) {
      var reg = /\&#.*?;/g;
      var result = str.replace(reg, function (char) {
        var H, L, code;
        if (char.length == 9) {
          code = parseInt(char.match(/[0-9]+/g));
          H = Math.floor((code - 0x10000) / 0x400) + 0xd800;
          L = ((code - 0x10000) % 0x400) + 0xdc00;
          return unescape("%u" + H.toString(16) + "%u" + L.toString(16));
        } else {
          return char;
        }
      });
      return result;
    },
    // 获取关注列表
    getAttention() {
      var userId = this.userId;
      var data = qs.stringify({
        path: {
          userId: Number(this.userId),
        },
      });

      request
        .get("/living/user/" + userId + "/attentionList", data, {
          headers: {
            "content-type": "application/x-www-form-urlencoded",
          },
        })
        .then((res) => {
          var attentionList = res.data;
          attentionList = Array.from(attentionList);
          if (attentionList != []) {
            attentionList.forEach((item) => {
              this.attentionListId.push(item.id);
            });
          }
        });
    },
    // 关注
    getname(e, id) {
      e.target.innerText = "已关";
      request
        .post("/living/social/attention/" + id, {
          path: {
            userId: Number(id),
          },
          headers: {
            "content-type": "application/x-www-form-urlencoded",
          },
        })
        .then((res) => {
          if (res.code === "00000") {
            this.attentionListId.push(id);
            this.componentKey += 1;
          }
        });
    },
    // 取消关注
    async cancleAttention(id) {
      this.$refs.btn1.innerText = "关注";
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
            this.attentionListId = this.attentionListId.filter(function (item) {
              return item != id;
            });
            // 页面重新渲染
            this.componentKey += 1;
          }
        });
    },
  },
  created() {
    if (this.userId != "") {
      this.getAttention();
    }
  },
};
</script>


<style scoped>
/* 内容部分 */

.refresh {
  margin-left: -5px;
}
.demo-image__error .image-slot {
  font-size: 30px;
}
.demo-image__error .image-slot .el-icon {
  font-size: 30px;
}
.demo-image__error .el-image {
  width: 200px;
  height: 100%;
}
.currentPage {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
.text-content {
  /* background-color: pink; */
  text-align: left;
  line-height: 25px;
}
/* 头部样式 */

.header {
  width: 770px;
  height: 50px;
  /* background-color: pink; */
  overflow: hidden;
}
.header span {
  float: left;
  display: line-block;
  width: 60px;
  height: 45px;
  line-height: 30px;
  /* background-color: blue; */
  margin-top: 0px;
  font-size: 15px;
}
span.time {
  width: 100px;
  color: rgb(151, 146, 146);
  font-weight: normal;
  font-size: 10px;
  text-align: left;
  height: 25px;

  line-height: 8px;
}
span.username,
span.username2,
span.username1 {
  width: 100px;
  font-size: 14px;
}

.header .user img {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  margin-left: 5px;
  margin-top: 4px;
}
.header .more img {
  height: 25px;
}
.sex img {
  height: 19px;
  margin-top: 5px;
}
span.sex {
  width: 40px;
  line-height: 30px;
  text-align: left;
}
.attention {
  position: relative;
  top: 4px;
  left: 440px;
}

.el-button {
  height: 23px;
  margin-top: 7px;
}
span.more {
  position: relative;
  left: 450px;
  height: 25px;
  top: 7px;
}
.more image {
  height: 5px;
}
.more image {
  height: 5px;
}

/* 图片样式 */
.el-image {
  position: relative;
  display: inline-block;
  overflow: hidden;
}
/* 底部样式 */
.footer {
  width: 770px;
  margin-top: 30px;
  height: 50px;
  overflow: hidden;
}
.footer span {
  float: left;
  line-height: 70px;
  display: line-block;
}
.like {
  margin-left: 630px;
}
.comments {
  margin-left: 20px;
}
.footer img {
  height: 30px;
}
/deep/.el-pagination {
  width: 110px;
  background: hsla(240, 50%, 98%, 0.932);
}
/deep/ .el-pagination__jump {
  margin-left: 30px;
}
</style>

