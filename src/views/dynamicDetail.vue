<template>
  <Header></Header>
  <div class="background1">
    <transition name="fade">
      <loading v-if="isLoading"></loading>
    </transition>
    <div class="wrapper">
      <div class="main">
        <!-- 动态详情 -->
        <div class="detail">
          <!-- 详情头部 -->
          <div class="head" v-if="activityInfo.publisher">
            <span
              class="user"
              v-if="
                activityInfo.publisher && activityInfo.publisher.avatar == null
              "
            >
              <img
                src="../assets/images/head2.png"
                @click="toHome(activityInfo.publisher.id)"
              />
            </span>

            <span
              class="user"
              v-if="
                activityInfo.publisher && activityInfo.publisher.avatar != null
              "
            >
              <img
                :src="activityInfo.publisher.avatar"
                :onerror="errorImage"
                @click="toHome(activityInfo.publisher.id)"
              />
            </span>
            <span
              class="username"
              style="
                text-align: left;
                font-family: Microsoft YaHei;
                height: 25px;
              "
              v-if="
                activityInfo.publisher &&
                activityInfo.publisher.username != null
              "
            >
              {{
                activityInfo.publisher.username.length > 9
                  ? activityInfo.publisher.username.substring(0, 8) + ".."
                  : activityInfo.publisher.username
              }}
              <span class="time">
                {{ timeDifference(activityInfo.createTime) }}</span
              >
            </span>

            <!-- <span
            class="username2"
            style="text-align: left; font-family: Microsoft YaHei; height: 25px"
            v-show="
              activityInfo.publisher && activityInfo.publisher.username == null
            "
            >无名</span
          > -->

            <span class="sex" v-if="activityInfo.publisher">
              <img
                v-show="activityInfo.publisher.sex == 1"
                src="../assets/images/boy.png"
              />
              <img
                v-show="activityInfo.publisher.sex == 0"
                src="../assets/images/girl.png"
              />
            </span>

            <span
              class="attention"
              v-show="(userId != '') & (activityInfo.publisher.id != userId)"
            >
              <el-button
                color="#8992c8"
                style="color: white"
                ref="btn1"
                @click.stop="getname($event, activityInfo.publisher.id)"
                :key="componentKey"
                >{{ buttonText(activityInfo.publisher.id) }}
              </el-button>
            </span>

            <!-- 更多 -->
            <span
              class="more"
              v-show="(activityInfo.publisher.id != userId) & (userId != '')"
            >
              <el-dropdown @command="handleCommand">
                <img src="../assets/images/arrow.png" alt="" />
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item
                      command="取消关注"
                      @click="cancleAttention(activityInfo.publisher.id)"
                      >取消关注</el-dropdown-item
                    >
                    <el-dropdown-item
                      @click="
                        privateChat(
                          activityInfo.publisher.id,
                          activityInfo.publisher.name,
                          activityInfo.publisher.avatar
                        )
                      "
                      >私聊</el-dropdown-item
                    >
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </span>
          </div>
          <div class="head" v-show="activityInfo.isAnonymity == 1">
            <span class="user">
              <img src="../assets/images/head2.png" alt=""
            /></span>
            <span class="username1">
              匿名
              <span class="time">
                {{ timeDifference(activityInfo.createTime) }}</span
              >
            </span>
          </div>

          <!-- 标签部分 -->
          <div class="label" style="text-align: left; margin-top: 5px">
            <span v-if="activityInfo.labels.length > 0">
              <el-tag
                v-for="(tag, key) in activityInfo.labels"
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

          <!-- 文字部分 -->

          <div class="text-content">
            <p>{{ uncodeUtf16(activityInfo.text) }}</p>
          </div>

          <div class="imageContainer" v-if="activityInfo.pic">
            <span
              v-for="(list, key) in activityInfo.pic"
              :key="key"
              v-show="
                activityInfo.pic.length == 3 ||
                activityInfo.pic.length == 6 ||
                activityInfo.pic.length == 9 ||
                activityInfo.pic.length == 5 ||
                activityInfo.pic.length == 7
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
              v-for="(list, key) in activityInfo.pic"
              :key="key"
              v-show="activityInfo.pic.length == 1"
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
              v-for="(list, key) in activityInfo.pic"
              :key="key"
              v-show="
                activityInfo.pic.length == 2 ||
                activityInfo.pic.length == 4 ||
                activityInfo.pic.length == 8
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
            <span
              class="like"
              @click.native="
                likeAnddislike(activityInfo.id, activityInfo.isLiked)
              "
            >
              <img
                src="../assets/images/like1.png"
                v-if="activityInfo.isLiked == 1"
                alt=""
              />
              <img src="../assets/images/like.png" v-else />

              {{ activityInfo.likeSum }}</span
            >
            <span class="comments">
              <img
                src="../assets/images/comment.png"
                @click.native.stop="toggleBox1"
              />
              {{ activityInfo.commentSum }}
            </span>
          </div>

          <!-- 动态评论输入框-->
          <div v-show="open1">
            <el-input
              v-model="content1"
              @keyup.enter.native="sendInfo"
              id="textarea"
            >
              <template #append>
                <el-icon @click="commentDynamic(activityInfo.id)"
                  ><position
                /></el-icon>
              </template>
            </el-input>
            <span>
              <el-popover placement="right" width="400" trigger="click">
                <div class="emotionList">
                  <a
                    href="javascript:void(0);"
                    @click="getEmo(index)"
                    v-for="(item, index) in faceList"
                    :key="index"
                    class="emotionItem"
                    >{{ item }}</a
                  >
                </div>
                <template #reference>
                  <img
                    src="../assets/images/smile.png"
                    style="
                      height: 27px;
                      position: relative;
                      top: 9px;
                      left: 16px;
                    "
                /></template>
              </el-popover>
            </span>
          </div>
        </div>
        <!-- 评论详情部分 -->
        <div class="commentList">
          <div
            v-for="(item, index) in commentList"
            :key="item.id"
            class="commentInfo"
          >
            <!-- 每个评论头部 -->
            <div class="commentHeader">
              <span
                class="user"
                v-if="item.publisher && item.publisher.avatar == null"
              >
                <img src="../assets/images/head2.png" alt=""
              /></span>

              <span
                class="user"
                v-if="item.publisher && item.publisher.avatar != null"
              >
                <img :src="item.publisher.avatar" :onerror="errorImage"
              /></span>
              <span class="username" v-if="item.publisher">
                {{ item.publisher.id == activityInfo.publisher.id ? 作者 : "" }}
                {{
                  item.publisher.username.length > 11
                    ? item.publisher.username.slice(0, 10) + ".."
                    : item.publisher.username
                }}
              </span>

              <span
                class="username2"
                v-show="item.publisher && item.publisher.username == null"
                >无名
              </span>
              <span class="moreDelete" v-show="item.isDeleted == 0">
                <img
                  src="../assets/images/more1.png"
                  @click="deleteComment(item.id)"
                />
              </span>
            </div>
            <!-- 每个评论内容 -->
            <div class="content">
              <p v-if="item.isDeleted == 0">{{ uncodeUtf16(item.content) }}</p>
              <p v-else>该评论已删除</p>
            </div>
            <!-- 每个评论底部 -->
            <div class="footer">
              <span
                class="like"
                @click="commentLikeAndDislike(item.id, item.isLiked)"
              >
                <img
                  src="../assets/images/like1.png"
                  v-if="item.isLiked == 1"
                />
                <img src="../assets/images/like.png" v-else />
                {{ item.likeSum }}</span
              >
              <span class="comments">
                <img
                  src="../assets/images/comment.png"
                  @click.native.stop="toggleBox2(item.id)"
                />{{ item.responseSum }}
              </span>
            </div>
            <!-- 评论框 -->
            <div v-show="open2[item.id]">
              <el-input
                v-model="content[item.id]"
                @keyup.enter.native="sendInfo"
                :id="item.id"
              >
                <template #append>
                  <el-icon @click="response(item.id)"><position /></el-icon>
                </template>
              </el-input>
              <span>
                <el-popover placement="right" width="400" trigger="click">
                  <div class="emotionList">
                    <a
                      href="javascript:void(0);"
                      @click="getEmoResponse(index, item.id)"
                      v-for="(ite, index) in faceList"
                      :key="index"
                      class="emotionItem"
                      >{{ ite }}</a
                    >
                  </div>
                  <template #reference>
                    <img
                      src="../assets/images/smile.png"
                      style="
                        height: 27px;
                        position: relative;
                        top: 9px;
                        left: 16px;
                      "
                  /></template>
                </el-popover>
              </span>
            </div>
            <!-- 回复列表 -->
            <div
              class="response"
              v-show="(item.responseSum > 0) & showAgain"
              v-for="(list, cindex) in responseLists[item.id]"
              :key="list.id"
            >
              <div class="responseContent">
                <!-- 回复头部 -->
                <div class="responseHeader">
                  <span class="user">
                    <img :src="list.fromUserAvatar" :onerror="errorImage"
                  /></span>
                  <span class="username3" style="font-size: 12px">
                    {{
                      list.fromUserId == activityInfo.publisher.id ? "作者" : ""
                    }}
                    {{
                      list.fromUsername.length > 11
                        ? list.fromUsername.slice(0, 10) + ".."
                        : list.fromUsername
                    }}回复{{
                      item.publisher.id == activityInfo.publisher.id
                        ? "作者"
                        : item.publisher.username
                    }}
                  </span>
                  <span class="moreDelete" v-show="list.isDeleted == 0">
                    <img
                      src="../assets/images/more1.png"
                      alt=""
                      @click="deleteCommentResponse(list.id, item.id)"
                    />
                  </span>
                </div>
                <!-- 回复内容 -->
                <div class="content" v-show="list.isDeleted == 0">
                  <p>{{ uncodeUtf16(list.content) }}</p>
                </div>
                <div class="content" v-show="list.isDeleted == 1">
                  <p>该评论已经被删除</p>
                </div>
                <div class="replay">
                  <img
                    src="../assets/images/comment.png"
                    @click.native.stop="toggleBox3(list.id)"
                  />
                </div>
              </div>

              <!-- 回复输入框 -->
              <div v-show="open3[list.id]">
                <el-input
                  v-model="content[list.id]"
                  @keyup.enter.native="sendInfo"
                  :id="list.id"
                >
                  <template #append>
                    <el-icon
                      @click="toResponse(list.id, item.id, list.fromUserId)"
                      ><position
                    /></el-icon>
                  </template>
                </el-input>
                <span>
                  <el-popover placement="right" width="400" trigger="click">
                    <div class="emotionList">
                      <a
                        href="javascript:void(0);"
                        @click="getEmoResponse(index, list.id)"
                        v-for="(item, index) in faceList"
                        :key="index"
                        class="emotionItem"
                        >{{ item }}</a
                      >
                    </div>
                    <template #reference>
                      <img
                        src="../assets/images/smile.png"
                        style="
                          height: 27px;
                          position: relative;
                          top: 9px;
                          left: 16px;
                        "
                    /></template>
                  </el-popover>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Aside></Aside>
    </div>
  </div>
</template>

<script>
const appData = require("../utils/emoji.json");

import Aside from "@/components/Aside.vue";
import Header from "../components/header.vue";

import Response from "../components/Response.vue";
import request from "@/utils/request";
import qs from "qs";
import { Position } from "@element-plus/icons-vue";
import store from "../store";
import loading from "../components/loading.vue";
export default {
  inject: ["reload"],
  data() {
    return {
      isLoading: true,
      activityInfo: {},
      content: [],
      content1: "",
      type: 0,
      commentList: [],
      responseLists: [],
      open1: "",
      open2: [],
      open3: [],
      showAgain: true,
      userId: store.state.userId,
      dynamicId: this.$route.query.id,
      attentionListId: [],
      componentKey: 0,
      toResponseSum: [],
      isShow: true,
      showAgain: true,
      faceList: [],
      tagStyle: [],
    };
  },

  components: { Position, Response, Header, Aside, loading },
  computed: {
    buttonText() {
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
  mounted() {
    for (let i in appData) {
      this.faceList.push(appData[i].char);
    }
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
    onEnter(id) {
      this.tagStyle[id] = {
        color: "hsl(0, 0%, 100%)",
        "background-color": "rgb(207, 207, 233)",
      };
    },
    onLeave(id) {
      this.tagStyle[id] = {};
    },
    toHome(id) {
      store.commit("homePageId", id);
      this.$router.push("/homepage");
    },
    // 表情包转字符码存入数据库再转出
    utf16toEntities(str) {
      const patt = /[\ud800-\udbff][\udc00-\udfff]/g; // 检测utf16字符正则
      str = str.replace(patt, function (char) {
        var H, L, code;
        if (char.length === 2) {
          H = char.charCodeAt(0); // 取出高位
          L = char.charCodeAt(1); // 取出低位
          code = (H - 0xd800) * 0x400 + 0x10000 + L - 0xdc00; // 转换算法
          return "&#" + code + ";";
        } else {
          return char;
        }
      });
      return str;
    },
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
    // 输入框显示表情
    getEmoResponse(index, id) {
      var textArea = document.getElementById(id);
      function changeSelectedText(obj, str) {
        if (window.getSelection) {
          textArea.setRangeText(str);
          textArea.selectionStart += str.length;
          textArea.focus();
        } else if (document.selection) {
          obj.focus();
          var sel = document.selection.createRange();
          sel.text = str;
        }
      }
      changeSelectedText(textArea, this.faceList[index]);
      this.content[id] = textArea.value; // 要同步data中的数据
      return;
    },
    // 回复的表情包输入框设置
    getEmo(index) {
      var textArea = document.getElementById("textarea");
      function changeSelectedText(obj, str) {
        if (window.getSelection) {
          textArea.setRangeText(str);
          textArea.selectionStart += str.length;
          textArea.focus();
        } else if (document.selection) {
          obj.focus();
          var sel = document.selection.createRange();
          sel.text = str;
        }
      }
      changeSelectedText(textArea, this.faceList[index]);
      this.content1 = textArea.value; // 要同步data中的数据

      return;
    },
    // 输入框的收起
    toggleBox1() {
      this.open1 = !this.open1;
    },
    toggleBox2(index) {
      this.open2[index] = !this.open2[index];
    },
    toggleBox3(id) {
      this.open3[id] = !this.open3[id];
    },
    // 获取评论列表
    getCommentList() {
      var id = this.dynamicId;
      request
        .get(
          "/living/activity/" + id + "/commentList",
          {
            headers: {
              "content-type": "x-www-form-urlencoded",
            },
          } //设置返回类型
        )
        .then((res) => {
          if (res.code == "00000") {
            this.commentList = res.data;
            if (this.commentList != []) {
              this.commentList.forEach((item) => {
                if (item.responseSum > 0) {
                  this.getResponse(item.id);
                }
              });
            }

            this.isLoading = false;
          }
        });
    },
    // 评论动态
    commentDynamic(id) {
      var content = this.utf16toEntities(this.content1);
      let data = qs.stringify({
        id: id,
        type: this.type,
        text: content,
      });
      request
        .post("/living/activity/" + id + "/comment", data, {
          headers: {
            "content-type": "application/x-www-form-urlencoded",
          },
        })
        .then((res) => {
          if (res.code === "00000") {
            // 发送后输入框清空收起输入框
            this.content1 = "";
            this.open1 = !this.open1;
            this.getCommentList();
            this.getInfo();
          }
        });
    },
    commentLikeAndDislike(id, isLiked) {
      if (isLiked == 1) {
        this.dislikeComment(id);
      } else {
        this.likeComment(id);
      }
    },
    // 点赞评论
    likeComment(id) {
      request
        .put("/living/activity/comment/" + id + "/like", {
          headers: {
            "content-type": "application/x-www-form-urlencoded",
          },
        })
        .then((res) => {
          if (res.code === "00000") {
            this.getCommentList();
            this.getInfo();
          }
        });
    },
    // 取消点赞
    dislikeComment(id) {
      request
        .delete("/living/activity/comment/" + id + "/like/remove", {
          headers: {
            "content-type": "application/x-www-form-urlencoded",
          },
        })
        .then((res) => {
          if (res.code === "00000") {
            this.getCommentList();
            this.getInfo();
          }
        });
    },
    // 删除评论
    deleteComment(id) {
      request
        .delete("/living/activity/comment/" + id + "/delete", {
          path: {
            id: Number(id),
          },
          headers: {
            "content-type": "application/x-www-form-urlencoded",
          },
        })
        .then((res) => {
          if (res.code === "00000") {
            this.getCommentList();
            this.getInfo();
          }
        });
    },
    // 删除评论的回复
    deleteCommentResponse(id, itemId) {
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
            // this.reload();
            this.getResponse(itemId);
          } else if (res.code === "A0203") {
            this.$notify({
              title: "提示",
              message: "没有权限删除",
              duration: 3000,
            });
          }
        });
    },
    // 回复动态评论
    response(id) {
      var content = this.utf16toEntities(this.content[id]);
      let data = qs.stringify({
        id: Number(id),
        content: content,
        type: this.type,
        toUserId: 0,
      });
      request
        .post("/living/activity/comment/" + id + "/response", data, {
          headers: {
            "content-type": "application/x-www-form-urlencoded",
          },
        })
        .then((res) => {
          if (res.code === "00000") {
            this.content[id] = "";
            this.open2[id] = !this.open2[id];
            this.getResponse(id);
            this.getCommentList();
            this.getInfo();
          }
        });
    },
    // 回复的回复
    toResponse(listId, id, toUserId) {
      var content = this.utf16toEntities(this.content[listId]);
      let data = qs.stringify({
        id: Number(id),
        content: content,
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
            this.content[listId] = "";
            this.open3[listId] = !this.open3[listId];
            this.getCommentList();
            this.getInfo();
            this.getResponse(id);
          }
        });
    },
    // 获取评论回复列表
    async getResponse(id) {
      request
        .get(
          "/living/activity/comment/" + id + "/responseList",

          {
            headers: {
              "content-type": "x-www-form-urlencoded",
            },
          }
        )
        .then((res) => {
          this.toResponseSum[id] = res.data.length;
          if (this.toResponseSum[id] > 0) {
            this.responseLists[id] = res.data;
            this.showAgain = false;
            this.$nextTick(() => {
              this.showAgain = true;
            });
          } else {
            this.responseLists[id] = [];
          }
        });
    },

    // 获取动态详情
    getInfo() {
      // var id = this.$route.query.id;

      var id = this.dynamicId;
      request
        .get("/living/activity/" + id + "/info", {
          headers: {
            "content-type": "x-www-form-urlencoded",
          },
        })
        .then((res) => {
          this.activityInfo = res.data;
        });
    },
    // 动态详情的点赞与取消点赞
    likelike(id) {
      request
        .post("/living/activity/" + id + "/like", {
          path: {
            id: Number(id),
          },
          headers: {
            "content-type": "application/x-www-form-urlencoded",
          },
        })
        .then((res) => {
          if (res.code === "00000") {
            this.getInfo();
          } else if (res.code === "A0004") {
            his.$notify({
              title: "提示",
              message: "请不要重复点赞",
              duration: 3000,
            });
          }
        });
    },
    likeAnddislike(id, isLiked) {
      if (isLiked == 1) {
        this.Cancelike(id);
      } else {
        this.likelike(id);
      }
    },

    Cancelike(id) {
      request
        .post("/living/activity/" + id + "/like/remove", {
          path: {
            id: Number(id),
          },
          headers: {
            "content-type": "application/x-www-form-urlencoded",
          },
        })
        .then((res) => {
          if (res.code === "00000") {
            this.getInfo();
          } else if (res.code === "A0004") alert("");
        });
    },
    //  关注列表
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
    cancleAttention(id) {
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

            this.componentKey += 1;
          }
        });
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
      var nowTime;

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
    // 跳转到标签页
    getLabels(id) {
      this.$router.push({
        path: "/activity",
        query: {
          labelId: id,
        },
      });
    },
  },
  created() {
    this.getCommentList();
    this.getInfo();
    if (this.userId != "") {
      this.getAttention();
    }
  },
};
</script>

<style scoped>
.background1 {
  background: url("../assets/images/bk2.jpeg");
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
/* 动态详情 */

.main {
  width: 759px;

  background-color: #fff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  text-align: center;
  overflow: scroll;
  overflow-x: hidden;
  display: column;
  margin-top: 5px;
}
::-webkit-scrollbar {
  width: 6px;

  height: 6px;

  background-color: rgba(240, 240, 240, 1);
}
.detail {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

/* 头部样式 */

.head {
  width: 770px;
  height: 50px;
  overflow: hidden;
}
.head span {
  float: left;
  display: line-block;
  width: 60px;
  height: 45px;
  line-height: 30px;
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
.head .user img {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  margin-left: 5px;
  margin-top: 4px;
}
.head .more img {
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

.text-content {
  margin-left: 10px;
  text-align: left;
  line-height: 25px;
}
/* 图片样式 */
.el-image {
  position: relative;
  display: inline-block;
  overflow: hidden;
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
  margin-left: 24px;
}
span.response {
  margin-left: 10px;
}
.footer img {
  height: 30px;
}
/* 评论详情 */

.commentInfo {
  border-bottom: solid #adb3d7 thin;
  min-height: 100px;
  line-height: 100px;
  border-collapse: collapse;
}
div.commentHeader {
  overflow: hidden;
  height: 70px;
  margin-top: 5px;
}
.commentHeader span {
  float: left;
  display: line-block;
  width: 60px;
  height: 45px;
  line-height: 30px;
  margin-top: 0px;
  font-size: 15px;
}
.commentHeader .username {
  width: 100px;
}
.commentHeader .user img {
  height: 35px;
  width: 35px;
  border-radius: 50%;
}
.commentHeader .moreDelete img {
  height: 25px;
  margin-left: 540px;
}
.responseContent {
  margin-left: 40px;
  border-top: solid #adb3d7 thin;
  min-height: 40px;
  border-collapse: collapse;
  overflow: hidden;
}
div.responseHeader {
  height: 70px;
}
.responseHeader span {
  float: left;
  display: line-block;
  width: 60px;
  height: 45px;
  line-height: 30px;
  margin-top: 0px;
  font-size: 15px;
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
  margin-right: 24px;
  height: 30px;
  margin-bottom: 5px;
}
.el-input-group {
  width: 85%;
  margin-bottom: 20px;
}
</style>