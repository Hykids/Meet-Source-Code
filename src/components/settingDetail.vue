<template>
  <el-row class="tac">
    <el-col :span="24">
      <h5 class="mb-2"><h1>设置</h1></h5>
      <el-menu
        default-active="2"
        class="el-menu-vertical-demo"
        @open="handleOpen"
        @close="handleClose"
      >
        <el-menu-item index="1" @click="modifyProfile">
          <el-icon><icon-menu /></el-icon>
          <span>个人资料</span>
        </el-menu-item>

        <el-sub-menu index="2">
          <template #title>
            <el-icon><location /></el-icon>
            <span>切换背景</span>
          </template>
          <el-menu-item-group>
            <el-menu-item
              index="2-1"
              :key="index"
              @click="changeBg(item.id)"
              v-for="item in backgroundImg"
              >背景{{ item.id }}</el-menu-item
            >
          </el-menu-item-group>
        </el-sub-menu>

        <el-sub-menu index="3">
          <template #title>
            <el-icon><setting /></el-icon>
            <span>帮助与反馈</span>
          </template>
          <el-menu-item-group>
            <div class="demo-collapse">
              <el-collapse v-model="activeNames" @change="handleChange">
                <el-collapse-item title="为什么要评论不能匿名？" name="1">
                  <div>
                    我们竭力创造一个真实，安全，和谐的社交平台，每一位用户对动态的评论都要具有真实性
                  </div>
                </el-collapse-item>
                <el-collapse-item title="删除的聊天消息好友能看到吗？" name="2">
                  <div>
                    消息记录和聊天窗口，消息删除，自己将看不见，对方仍保有记录
                  </div>
                </el-collapse-item>
                <el-collapse-item title="为什么性别设置后不会修改？" name="3">
                  <div>
                    为了用户安全和各类活动参与的真实性，性别一旦进行设置后无法自主修改。如果您的性别设置错误，请联系客服上传证明材料修改
                  </div>
                </el-collapse-item>
                <el-collapse-item title="更多问题" name="4">
                  <div>请添加客服QQ:2587439923询问</div>
                </el-collapse-item>
              </el-collapse>
            </div>
          </el-menu-item-group>
        </el-sub-menu>

        <!-- <el-menu-item index="5">
          <el-icon><setting /></el-icon>
          <el-button type="text" slot="reference">关于Meet</el-button>
          <el-popover placement="right" width="400" trigger="click">
            <el-card>
              互联网交友模式高度发达的今天，利用论坛进行生活学习工作上的分享，成为当代青年人进行沟通娱乐的一种普遍而实用的手段。但大多数互联网论坛类软件或网页的面向群众过于广泛，导致一类用户很难快速分享或获取自己圈子内的信息。而meet这个网页正是针对此情况，将论坛交友的范围控制在湖北工业大学的师生范围圈内。
            </el-card>
          </el-popover>
        </el-menu-item> -->

        <el-menu-item index="4" @click="open1()">
          <el-icon><setting /></el-icon>
          <span>关于Meet</span>
          <el-dialog title="提示" v-if="true" width="30%">
            <span>这是一段信息</span>
            <span slot="footer" class="dialog-footer">
              <el-button @click="dialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="dialogVisible = false"
                >确 定</el-button
              >
            </span>
          </el-dialog>
        </el-menu-item>

        <el-menu-item index="5" @click="open">
          <el-icon><setting /></el-icon>
          <span>退出登录</span>
        </el-menu-item>
      </el-menu>
    </el-col>
  </el-row>
</template>

<script >
import { Location, Document, Menu, Setting } from "@element-plus/icons-vue";
import { ElMessageBox, ElMessage } from "element-plus";
import store from "../store";

export default {
  inject: ["reload"],
  data() {
    return {
      backgroundImg: [
        { id: 1, img: require("../assets/images/bk1.jpg") },
        { id: 2, img: require("../assets/images/bk2.jpeg") },
        { id: 3, img: require("../assets/images/bk3.jpg") },
        { id: 4, img: require("../assets/images/bk4.jpg") },
        { id: 5, img: require("../assets/images/bk5.jpg") },
        { id: 6, img: require("../assets/images/bk6.jpg") },
        { id: 7, img: require("../assets/images/bk7.jpg") },
        { id: 8, img: require("../assets/images/bk8.jpg") },
        { id: 9, img: require("../assets/images/bk9.jpg") },
        { id: 10, img: require("../assets/images/bk10.jpg") },
      ],
      HelpState: [{ id: 1, valua: "1" }],
      dialogVisible: false,
    };
  },
  methods: {
    exit() {
      this.$router.push("/recomend");
      store.commit("setId", "");
      store.commit("setAvatar", "");
      store.commit("clearNotes", []);
      setTimeout(() => {
        window.location.reload();
      }, 100);
    },
    open() {
      ElMessageBox.confirm("确定退出吗", "", {
        confirmButtonText: "OK",
        cancelButtonText: "Cancel",
        type: "",
      })
        .then(() => {
          this.exit();
          ElMessage({
            type: "success",
            message: "成功退出",
          });
        })
        .catch(() => {
          ElMessage({
            type: "info",
            message: "取消退出",
          });
        });
    },

    open1() {
      this.$alert(
        "互联网交友模式高度发达的今天，利用论坛进行生活学习工作上的分享，成为当代青年人进行沟通娱乐的一种普遍而实用的手段。但大多数互联网论坛类软件或网页的面向群众过于广泛，导致一类用户很难快速分享或获取自己圈子内的信息。而meet这个网页正是针对此情况，将论坛交友的范围尽量宣传推广在大学的师生范围圈内。",
        "关于Meet"
      );
    },

    handleNodeClick(data) {
      console.log(data);
    },

    changeBg(id) {
      store.commit("imageUrl", this.backgroundImg[id - 1].img);
      this.reload();
    },

    modifyProfile() {
      store.commit("homePageId", store.state.userId);
      this.$router.push("/homepage/edit");
    },
  },
  setup() {
    const handleOpen = (key, keyPath) => {
      console.log(key, keyPath);
    };
    const handleClose = (key, keyPath) => {
      console.log(key, keyPath);
    };

    return {
      handleOpen,
      handleClose,
      Location,
      Document,
      Menu,
      Setting,
    };
  },
};
</script>
<style lang="css" scoped>
.el-menu {
  border-right: 0;
}
.box-card {
  position: relative;
  top: 50px;
  right: 380px;
  width: 480px;
  height: 70px;
}
</style>