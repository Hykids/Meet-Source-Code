<template>
  <div class="content">
    <div class="view">
      <ul>
        <li v-for="item of chatLists" :key="index">
          <span class="time">
            <span v-if="item.type != -1"> {{ item.createTime }}</span>
          </span>

          <!-- 用户自己 -->
          <div v-if="item.my" :class="{ isMe: item.my }">
            <el-dropdown trigger="click">
              <img src="../assets/images/arrow.png" alt="" />
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="hanldDelete(item.id)"
                    >删除</el-dropdown-item
                  >
                  <el-dropdown-item @click="hanldWithdraw(item.id)">
                    撤回
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>

              <div class="chatList">
                <span class="text" v-if="item.type == 0">{{
                  uncodeUtf16(item.content)
                }}</span>
                <span v-else>
                  <el-image
                    fit="cover"
                    :src="item.content"
                    :preview-src-list="[image]"
                    style="height: 150px; width: 150px"
                  >
                  </el-image> </span
                ><el-icon class="el-icon--right"><arrow-down /></el-icon>
                <span>
                  <img :src="avatar" style="height: 42px; width: 42px"
                /></span>
              </div>
            </el-dropdown>
          </div>
          <!-- 用户好友 -->
          <div v-else>
            <div class="chatList">
              <span>
                <img :src="avatarFriend" style="height: 42px; width: 42px"
              /></span>
              <span
                class="text"
                v-if="item.type == 0"
                style="margin-left: 5px"
                >{{ uncodeUtf16(item.content) }}</span
              >
              <span v-else>
                <el-image
                  fit="cover"
                  :src="item.content"
                  :preview-src-list="[image]"
                  style="height: 150px; width: 150px"
                >
                </el-image> </span
              ><el-icon class="el-icon--right"><arrow-down /></el-icon>
            </div>
          </div>
        </li>
      </ul>
    </div>

    <ul class="icon" style="justify-content: flex-start">
      <li>
        <img
          src="../assets/images/picture.svg"
          @click="dialogFormVisible = true"
        />
      </li>
      <el-popover placement="right" width="400" trigger="click" class="emoBox">
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
          <li><img src="../assets/images/emoji.svg" alt="" /></li>
        </template>
      </el-popover>
      <li><img src="../assets/images/history.svg" @click="table = true" /></li>

      <el-button class="send" type="primary" @click="addMessageByClick"
        >发送</el-button
      >
    </ul>

    <textarea
      id="textarea"
      placeholder="输入消息"
      v-model="text"
      @keyup.enter="addMessageByClick"
    >
    </textarea>
  </div>
  <!-- 添加图片 -->
  <div class="publish">
    <el-dialog v-model="dialogFormVisible">
      <el-upload
        list-type="picture-card"
        multiple
        ref="upload"
        action="https://upload.qiniup.com/"
        :before-upload="beforeAvatarUpload"
        :auto-upload="false"
        :limit="9"
        :on-change="fileChange"
        :file-list="fileList"
        :on-exceed="handleExceed"
        :data="form"
        :on-remove="fileRemove"
      >
        <el-icon><Plus /></el-icon>
      </el-upload>
      <template #footer>
        <span class="dialog-footer"> </span>
      </template>
    </el-dialog>
  </div>
  <!-- 聊天记录 -->
  <el-drawer v-model="table" title="聊天记录" direction="rtl" size="30%">
    <transition name="fade">
      <loading v-if="isLoading"></loading>
    </transition>
    <div>
      <el-popover placement="right" width="400" trigger="click">
        <el-calendar v-model="value" />
        <template #reference>
          <img
            src="../assets/images/canlender.png"
            style="vertical-align: middle"
          />
        </template>
      </el-popover>

      <div style="background-color: #dadfef">
        日期： {{ value.toISOString().split("T")[0] }}（ 请点击日历表选择日期）
      </div>
    </div>

    <ul
      class="icon"
      style="justify-content: flex-start; display: flex; flex-direction: column"
      v-if="historyLists.length != 0"
    >
      <li
        v-for="item of historyLists"
        :key="index"
        style="margin-top: 5px; border-bottom: 1px solid rgb(176, 186, 216)"
      >
        <span class="time">
          <span
            v-if="item.type != -1"
            style="margin-left: 100px; margin-top: 15px"
          >
            {{ item.createTime }}</span
          >
        </span>
        <el-button class="delete1" @click="deleteHistory(item.id)"
          >删除消息</el-button
        >
        <div
          class="chatList"
          v-if="item.my"
          :class="{ isMe: item.my }"
          style="margin-left: auto; justify-content: flex-end"
        >
          <span class="text" v-if="item.type == 0">{{
            uncodeUtf16(item.content)
          }}</span>
          <span v-else>
            <el-image
              fit="cover"
              :src="item.content"
              :preview-src-list="[image]"
              style="height: 150px; width: 150px"
            >
            </el-image> </span
          ><el-icon class="el-icon--right"><arrow-down /></el-icon>
          <span> <img :src="avatar" style="height: 42px; width: 42px" /></span>
        </div>

        <div class="chatList" v-else>
          <span>
            <img :src="avatarFriend" style="height: 42px; width: 42px"
          /></span>
          <span class="text" v-if="item.type == 0">{{
            uncodeUtf16(item.content)
          }}</span>
          <span v-else>
            <el-image
              fit="cover"
              :src="item.content"
              :preview-src-list="[image]"
              style="height: 150px; width: 150px"
            >
            </el-image> </span
          ><el-icon class="el-icon--right"><arrow-down /></el-icon>
        </div>
      </li>
    </ul>
    <div>{{ msg }}</div>
    <!-- 分页 -->
    <el-pagination
      @current-change="handleCurrentChange"
      :current-page.sync="currentPage"
      layout="prev, pager, next, jumper"
      :total="total"
      :key="currentPage"
      :page-count="pageSum"
    >
    </el-pagination>
  </el-drawer>

  <!--  -->
</template>

<script>
const appData = require("../utils/emoji.json");
import {
  onMounted,
  reactive,
  toRefs,
  getCurrentInstance,
  nextTick,
  watch,
} from "vue";
import loading from "./loading.vue";
import request from "@/utils/request";
import store from "../store";
import { useWebSocket } from "../hooks";
import { ElMessage } from "element-plus";
import { mapState } from "vuex";
import { Plus, Delete, arrowDown } from "@element-plus/icons-vue";
import aes from "@/utils/export";
export default {
  inject: ["reload"],
  computed: { ...mapState(["sessions", "userId", "nickname"]) },
  components: {
    Plus,
    Delete,
    arrowDown,
    loading,
  },
  setup() {
    const ws = useWebSocket();
    const datas = reactive({
      isLoading: true,
      value: new Date(),
      historyLists: [],
      table: false,
      avatar: store.state.avatar,
      fileList: [],
      form: {
        token: "",

        key: "",
      },
      uploadImages: [],
      fileVouchers: [
        {
          token: "",
          key: "",
        },
      ],
      uploadId: "",
      dialogFormVisible: false,
      avatarFriend: store.state.chat.nickuserAvatar,
      currentPage: 1,
      pageSum: 0,
      pagesize: 10, //    每页的数据
      total: 0,
    });
    const state = reactive({
      message: {},
      type: 0,
      text: "",
      images: [],
      image: "",
      nickname: store.state.chat.nickname, //选中聊天用户Id
      unRead: [],
      faceList: [], //表情包数据
      chatLists: store.state.chat.chatLists,
    });
    let currentInstance = "";

    watch(
      () => datas.value,
      (val) => {
        searchHistory(val.toISOString().split("T")[0]);
      },
      { deep: true, immediate: true }
    );

    onMounted(() => {
      getToken();
      history();
      currentInstance = getCurrentInstance();
      for (let i in appData) {
        //读取json表情包文件保存数据给数组
        state.faceList.push(appData[i].char);
      }
      searchHistory(datas.value.toISOString().split("T")[0]);
    });

    //发送消息
    function handleCurrentChange(currentPage) {
      datas.currentPage = currentPage; //修改currentPage
      searchHistory(datas.value.toISOString().split("T")[0]);
    }
    function addMessageByClick() {
      if (datas.uploadImages.length != 0) {
        state.type = 1;
        datas.uploadImages.forEach((item) => {
          sendContent(item);
        });
      } else if (!state.text || state.text.match(/^[ ]*$/)) {
        ElMessage({
          message: "不能发送空消息",
          type: "warning",
        });
        return;
      } else {
        state.type = 0;
        sendContent(utf16toEntities(state.text));
      }

      state.text = "";
    }
    function sendContent(content) {
      request
        .post("/living/message/send", {
          content: content,
          toUserId: store.state.chat.nickname,
          type: state.type,
        })
        .then((res) => {
          if (res.code == "00000") {
            history();
            searchHistory(datas.value.toISOString().split("T")[0]);
            state.message = {
              content: content,
              id: res.data.messageId,
              my: true,
              userName: store.state.chat.nickName,
            };
            useWebSocket();

            ws.send(JSON.stringify(state.message));
            state.text = "";
          }
          datas.fileList = [];
        });
    }
    //获取；历史消息
    function history() {
      request
        .get("/living/message/history", {
          params: {
            userId: state.nickname,
          },
          headers: {
            "content-type": "application/json",
          },
        })
        .then((res) => {
          state.chatLists = res.data.list.reverse();
        });
    }
    //删除消息
    function hanldDelete(id) {
      request
        .post("/living/message/" + id + "/delete", {
          path: {
            id: id,
          },
          headers: {
            "content-type": "application/x-www-form-urlencoded",
          },
        })
        .then((res) => {
          if (res.code == "00000") {
            history();
            const newArr = state.chatLists.filter((item) => {
              return !state.chatLists.includes(item.id);
            });
            // this.$nextTick(() => {
            //   state.chatLists = newArr;
            // });

            ElMessage({
              message: "消息删除成功",
              type: "success",
            });
          }
        });
    }

    //撤回消息
    function hanldWithdraw(id) {
      request
        .post("/living/message/" + id + "/withdraw", {
          path: {
            id: id,
          },
          headers: {
            "content-type": "application/x-www-form-urlencoded",
          },
        })
        .then((res) => {
          let news = state.chatLists;
          for (let i = news.length - 1; i >= 0; i--) {
            if (news[i].id == id) {
              news[i] = {
                id: id,
                content: "你撤回了一条消息",
                type: -1,
                my: true,
                createTime: news[i].createTime,
              };
              break;
            }
          }
          nextTick(() => {
            state.chatLists = news;
          });
          if (res.code == "00000") {
            history();
            ElMessage({
              message: "消息撤回成功",
              type: "success",
            });
          }
        });
    }

    function GetNumberOfMenit(date1) {
      //date1：开始日期，date2结束日期
      var date1_time = new Date(date1).getTime();
      var date2_time = new Date().getTime();
      var menit = Math.round((date2_time - date1_time) / (1000 * 60)); //核心：时间戳相减，然后除以天数
      return menit;
    }

    //添加表情
    const getEmo = (index) => {
      var textArea = document.getElementById("textarea");
      //将选中的表情插入到输入文本的光标之后
      function changeSelectedText(obj, str) {
        if (window.getSelection) {
          // 非IE浏览器
          textArea.setRangeText(str);
          // 在未选中文本的情况下，重新设置光标位置
          textArea.selectionStart += str.length;
          textArea.focus();
        } else if (document.selection) {
          // IE浏览器
          obj.focus();
          var sel = document.selection.createRange();
          sel.text = str;
        }
      }
      changeSelectedText(textArea, state.faceList[index]);
      state.text = textArea.value; // 要同步data中的数据
      // console.log(this.faceList[index]);
      return;
    };
    function utf16toEntities(str) {
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
    }
    function uncodeUtf16(str) {
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
    }
    // 获取token发送图片
    function getToken() {
      request
        .get(
          "/living/activity/publish/getToken",
          {
            params: {
              sum: 1,
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
            datas.fileVouchers = res.data;
          } else {
            // this.$notify({
            //   title: "提示",
            //   message: "没有权限",
            //   duration: 3000,
            // });
            return;
          }
        });

      return true;
    }
    function fileChange(file, fileList) {
      var token1 = aes.decrypt(datas.fileVouchers[0].token);
      var key1 = datas.fileVouchers[0].fileName;
      datas.form.key = key1;
      datas.form.token = token1;
      datas.fileList = fileList;
      // this.$refs.upload.submit();
      currentInstance.ctx.$refs.upload.submit();
      if (file.status == "success") {
        datas.uploadImages.push(datas.form.key);
        getToken();
      }
    }
    function searchHistory(date) {
      request
        .get("/living/message/history/byDate", {
          params: {
            date: date,
            page: datas.currentPage,
            userId: store.state.chat.nickname,
          },
          headers: {
            "content-type": "application/json",
          },
        })
        .then((res) => {
          if (res.code == "00000") {
            datas.total = res.data.total;
            datas.pageSum = res.data.pageSum;
            datas.historyLists = res.data.list;

            datas.isLoading = false;
          } else {
            datas.isLoading = true;
          }
        });
    }
    function deleteHistory(id) {
      request
        .post("/living/message/" + id + "/delete", {
          path: {
            id: id,
          },
          headers: {
            "content-type": "application/x-www-form-urlencoded",
          },
        })
        .then((res) => {
          if (res.code == "00000") {
            searchHistory(datas.value.toISOString().split("T")[0]);
          }
        });
    }
    return {
      ...toRefs(state),
      ...toRefs(datas),
      deleteHistory,
      handleCurrentChange,
      addMessageByClick,
      hanldDelete,
      hanldWithdraw,
      GetNumberOfMenit,
      getEmo,
      sendContent,
      history,
      utf16toEntities,
      uncodeUtf16,
      getToken,
      fileChange,
      searchHistory,
    };
  },
};
</script>

<style scoped>
.chatList {
  display: flex;
  flex-direction: row;
}
.content {
  width: 680px;
  height: 545px;
  padding: 20px 10px;
  /* padding-right: 40px; */
  background-color: #eeeeee60;
  /* border-radius: 15px; */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  /* float: right; */
  display: flex;
  flex-direction: column;
}
ul li {
  list-style: none;
  margin: 0;
  margin-left: -40px;
  /* 设置鼠标 样式*/
  cursor: pointer;
  /* background-color: pink; */
}
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
  background-color: #eeeeee60;
}
.emotionList {
  /* display: flex; */
  height: 450px;
  width: 400px;
  flex-wrap: wrap;
  padding: 5px;
  overflow: auto;
}
.emotionItem {
  width: 10%;
  font-size: 20px;
  text-align: center;
}

/*包含以下四种的链接*/
.emotionItem {
  text-decoration: none;
}
/*正常的未被访问过的链接*/
.emotionItem:link {
  text-decoration: none;
}
/*已经访问过的链接*/
.emotionItem:visited {
  text-decoration: none;
}
/*鼠标划过(停留)的链接*/
.emotionItem:hover {
  text-decoration: none;
}
/* 正在点击的链接*/
.emotionItem:active {
  text-decoration: none;
}
#emojiBtn {
  border: none;
  padding-right: 0px;
  padding-bottom: 0px;
  margin-bottom: 0px;
}
#emojiBtn:hover {
  background-color: white;
}
.view {
  width: 100%;
  height: 440px;
  border-bottom: 1px solid #7490eb;
  overflow-y: scroll;
  overflow-x: hidden;
  /* overflow: auto; */
}
.text {
  display: inline-block;
  padding: 0 10px;
  max-width: 80%;
  border-radius: 4px;
  line-height: 30px;
  height: 30px;
  background-color: #fff;
  box-shadow: 0 0px 2px 0 rgba(0, 0, 0, 0.1);
}
.time {
  text-align: center;
  margin: 7px 0;
}
.time span {
  display: inline-block;
  padding: 0 18px;
  font-size: 12px;
  background-color: #dadfef;
  border-radius: 2px;
  margin-left: 250px;
}

/* ul {
  position: relative;
  right: 20px;
} */
.icon li {
  float: left;
  margin-left: 15px;
}
.icon {
  margin-left: -53px;
}

.isMe {
  text-align: right;
}
.isMe .text {
  background-color: #7490eb;
  margin-right: -15px;
}

ul li img {
  height: 20px;
  width: 20px;
}
.send {
  background-color: #90a5eb;
  color: #fff;
  border: none;
  width: 55px;
  height: 20px;
  border-radius: 2px;
  font-size: 13px;
  font-family: "微软雅黑";
  float: right;
}
.delete1 {
  background-color: #dadfef;
  /* color: #fff; */
  border: none;
  width: 55px;
  height: 20px;
  border-radius: 2px;
  font-size: 13px;
  font-family: "微软雅黑";
  float: right;
}
#textarea {
  padding: 10px;
  width: 95%;
  height: 18%;
  background-color: transparent;
  border: none;
  outline: none;
  resize: none;
}
</style>