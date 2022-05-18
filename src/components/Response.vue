<template>
  <!-- 回复列表 -->
  <div
    class="response"
    v-for="(list1, index) in responseItems[listId]"
    :key="list1.id"
    v-if="isShow & (toResponseSum[listId] > 0)"
  >
    <div class="responseContent">
      <!-- 回复头部 -->
      <div class="responseHeader">
        <span class="user">
          <img :src="list1.fromUserAvatar" :onerror="errorImage"
        /></span>
        <span class="username3">
          <!-- {{ list.fromUserId == activityInfo.publisher.id ? "作者" : "" }} -->
          {{
            list1.fromUsername.length > 11
              ? list1.fromUsername.slice(0, 10) + ".."
              : list1.fromUsername
          }}回复{{ list1.toUsername }}
        </span>
        <span class="moreDelete" v-show="list1.isDeleted == 0">
          <img
            src="../assets/images/more1.png"
            alt=""
            @click="deleteCommentResponse(list1.id)"
          />
        </span>
      </div>
      <!-- 回复内容 -->
      <div class="content" v-show="list1.isDeleted == 0">
        <p>{{ list1.content }}</p>
      </div>
      <div class="content" v-show="list1.isDeleted == 1">
        <p>该评论已经被删除</p>
      </div>
      <div class="replay">
        <img
          src="../assets/images/comment.png"
          @click.native.stop="toggleBox4(list1.id)"
        />
      </div>
    </div>
    <!-- 回复输入框 -->
    <el-input v-model="content[list1.id]" v-show="open4[list1.id]">
      <template #append>
        <el-icon @click="toResponse(list1.id, item.id, list1.fromUserId)"
          ><position
        /></el-icon>
      </template>
    </el-input>

    <!-- <Response :listId="list1.id" v-show="toResponseSum[item.id] > 0"></Response> -->
  </div>
</template>

<script>
import request from "@/utils/request";
import { Position } from "@element-plus/icons-vue";
import qs from "qs";
export default {
  name: "Response",
  // 接受父组件信息
  props: ["listId"],

  data(props) {
    const listId = props.listId;
    console.log(listId);

    return {
      open4: [],
      content: [],
      type: 1,
      responseItems: [],
      toResponseSum: [],
      isShow: true,
      listId,
    };
  },
  components: { Position },
  // watch: {
  //   listId: {
  //     handler(newVal, oldVal) {
  //       // newVal是获取的是新的值
  //       this.listId = newVal;
  //       this.getResponse(this.listId);
  //       this.isShow = false;
  //       this.$nextTick(() => {
  //         this.isShow = true;
  //       });
  //     },
  //     deep: true, // deep属性是深度监听formData对象里的属性的值是否改变。
  //   },
  // },
  methods: {
    toggleBox4(id) {
      this.open4[id] = !this.open4[id];
    },
    toResponse(listId, id, toUserId) {
      let data = qs.stringify({
        id: Number(id),
        content: this.content[listId],
        type: this.type,
        toUserId: toUserId,
      });
      request
        .post("/living/activity/comment/" + id + "/response", data, {
          headers: {
            "content-type": "application/x-www-form-urlencoded",
          },
        })
        .then((res) => {
          if (res.code === "00000") {
            // 清空输入框内容
            this.content[id] = "";
            this.open4[id] = !this.open4[id];
            this.getResponse(id);
          }
        });
    },
    getResponse(id) {
      request
        .get(
          "/living/activity/comment/" + id + "/responseList",

          {
            headers: {
              "content-type": "x-www-form-urlencoded",
            },
          } //设置返回类型
        )
        .then((res) => {
          this.toResponseSum[id] = res.data.length;
          if (this.toResponseSum[id] > 0) {
            this.responseItems[id] = res.data;
            this.isShow = false;
            this.$nextTick(() => {
              this.isShow = true;
            });
          } else {
            this.responseItems[id] = [];
          }

          // console.log(this.responseItems[id]);
        });
    },
    deleteCommentResponse(id) {
      request
        .delete("/living/activity/comment/response/" + id + "/delete", {
          path: {
            id: Number(id),
          },
          headers: {
            "content-type": "application/x-www-form-urlencoded",
          },
        })
        .then((res) => {
          if (res.code === "00000") {
          } else if (res.code === "A0203") {
            this.$notify({
              title: "提示",
              message: "没有权限删除",
              duration: 3000,
            });
          }
        });
    },
  },
  mounted() {
    this.getResponse(this.listId);
  },
};
</script>

<style scoped>
.responseContent {
  margin-left: 40px;
  /* margin-right: 40px; */
  border-top: solid #adb3d7 thin;
  min-height: 40px;
  border-collapse: collapse;
  overflow: hidden;
}
div.responseHeader {
  height: 70px;
  /* text-align: left; */
}
.responseHeader span {
  float: left;
  display: line-block;
  width: 60px;
  height: 45px;
  line-height: 30px;
  /* background-color: blue; */
  margin-top: 0px;
  font-size: 12px;
}
span.username3 {
  width: 200px;
}

.responseHeader .user img {
  height: 35px;
  width: 35px;
  border-radius: 50%;
  display: inline-block;
  margin-top: 3px;
}

.responseHeader .moreDelete img {
  height: 25px;
  /* margin-left: 470px; */
  margin-left: 403px;
}
.content {
  text-align: left;
  line-height: 25px;
  margin-left: 41px;
}
div.replay {
  text-align: right;
  height: 55px;
  padding: 0;
}
.replay img {
  margin-right: 30px;
  height: 30px;
}
.el-input-group {
  width: 92%;
}
</style>