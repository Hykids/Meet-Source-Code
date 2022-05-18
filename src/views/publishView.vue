

<template>
  <div>
    <div class="text">
      <el-input
        type="textarea"
        placeholder="请输入内容"
        :rows="15"
        v-model="text"
        maxlength="500"
        show-word-limit
        @keyup.enter.native="sendInfo"
        id="textarea"
      >
      </el-input>
    </div>
    <!-- 标签 -->
    <div class="tag">
      <el-tag
        v-for="tag in tags"
        :key="tag.name"
        closable
        :type="tag.type"
        @close="handleClose(tag, tag.id)"
      >
        {{ "#" + tag.name }}
      </el-tag>
    </div>

    <div class="addFile">
      <span class="pic">
        <img
          src="../assets/images/pic.png"
          alt=""
          @click="dialogFormVisible = true"
        />
      </span>

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
            <img src="../assets/images/smile.png" alt=""
          /></template>
        </el-popover>
      </span>

      <el-popover placement="bottom" width="300px" trigger="click">
        <div class="search">
          <el-input
            v-model="tagContent"
            ref="saveTagInput"
            class="inline-input"
            placeholder="搜索标签"
            style="width: 270px"
          >
            <template #append>
              <el-icon @click="searchTags"><Search /></el-icon>
            </template>
          </el-input>
        </div>

        <div class="searchTag" v-if="searchTag">
          <el-tag
            :key="tag.id"
            v-for="tag in searchTag"
            style="margin-top: 5px"
            @click="insertTag(tag.id, tag.content)"
            :id="tag.id"
            v-show="searchTag.length != 0"
          >
            {{ "#" + tag.content }}
          </el-tag>
          <el-tag
            v-show="addTag"
            @click="addLabel(tagContent)"
            style="margin-top: 5px"
          >
            {{ "#" + tagContent }}
          </el-tag>
        </div>
        <div class="tag" v-show="isShow">
          <el-tag
            :key="tag.id"
            v-for="tag in tagLists"
            style="margin-top: 5px"
            @click="insertTag(tag.id, tag.content)"
            :id="tag.id"
          >
            {{ "#" + tag.content }}
          </el-tag>
          <span class="refresh" title="刷新">
            <el-icon style="font-size: 20px; margin-top: 8px; margin-left: 5px"
              ><refresh @click="refresh" /></el-icon
          ></span>
        </div>

        <template #reference>
          <span>
            <el-button style="height: 24px; color: #8992c8"
              >#添加标签</el-button
            >
          </span>
        </template>
      </el-popover>
      <span class="isAnonymity" style="color: #8992c8"
        >匿名<el-switch v-model="isAnonymity"></el-switch
      ></span>
      <span class="visibility">
        <select
          name=""
          id="select"
          v-on:change="indexSelect($event)"
          style="color: #8992c8"
        >
          <option
            v-for="(item, index) in optionList"
            :key="index"
            v-bind:value="item"
          >
            {{ item }}
          </option>
        </select>
      </span>
    </div>

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
    <el-button @click="publishText" style="margin-top: 5px">发布</el-button>
  </div>
</template>

<script type="text/javascript" >
const appData = require("../utils/emoji.json");

import {
  ArrowDown,
  Plus,
  Delete,
  Refresh,
  Search,
} from "@element-plus/icons-vue";
import qs from "qs";
import request from "@/utils/request";
import aes from "@/utils/export";
export default {
  data() {
    return {
      dialogFormVisible: false,
      pic: [],
      isAnonymity: false,
      labelIds: [],
      text: "",
      video: 0,
      visibility: 0,
      optionList: ["所有人可见", "仅主页可见", "仅自己可见"],
      dynamicTags: [],
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
      faceList: [],
      tagLists: [],
      pageSum: Number,
      tagContent: "",
      searchTag: [],
      isShow: true,
      addTag: false,
      tags: [],
    };
  },
  components: {
    ArrowDown,
    Plus,
    Delete,
    Search,
    Refresh,
  },
  created() {
    this.getToken();
    this.getTagList(1);
  },

  mounted() {
    for (let i in appData) {
      this.faceList.push(appData[i].char);
    }
  },
  methods: {
    handleClose(tag, id) {
      this.tags.splice(this.tags.indexOf(tag), 1);
      this.labelIds.splice(this.tags.indexOf(id), 1);
      console.log(this.labelIds);
    },
    addLabel(name) {
      let data = qs.stringify({
        content: this.tagContent,
      });
      request
        .put("/living/activity/label/add", data, {
          headers: { "content-type": "application/x-www-form-urlencoded" },
        })
        .then((res) => {
          if (res.code == "00000") {
            var id = res.data;

            this.insertTag(id, name);
          }
        });
      console.log(this.labelIds);
    },
    insertTag(id, name) {
      var type = "";
      this.labelIds.push(id);
      this.tags.push({ name: name, type: type, id: id });
      console.log(this.tags);
      console.log(this.labelIds);
    },
    searchTags() {
      var content = this.tagContent;
      this.isShow = false;
      request
        .get(
          "/living/activity/label/query",
          {
            params: {
              content: content,
            },
          },
          {
            headers: {
              "content-type": "application/json",
            },
          }
        )
        .then((res) => {
          if (res.code == "00000") {
            if (res.data.length != 0) {
              this.searchTag = res.data;
              console.log(this.searchTag);
            } else {
              this.addTag = true;
            }
          }
        });
    },
    refresh() {
      var max = this.pageSum;
      var page = Math.floor(Math.random() * (max - 1)) + 1;
      this.getTagList(page);
    },

    // 标签
    getTagList(page) {
      request
        .get(
          "/living/activity/label/list",
          {
            params: {
              page: page,
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
            this.pageSum = res.data.pageSum;
            console.log(this.pageSum);
          }
        });
    },

    // 表情包
    getEmo(index) {
      var textArea = document.getElementById("textarea");
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
      changeSelectedText(textArea, this.faceList[index]);
      this.text = textArea.value; // 要同步data中的数据
      // console.log(this.faceList[index]);
      return;
    },
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
    // 图片发布
    handleExceed() {
      this.$message.warning(`当前限制选择 9 张图片噢~`);
    },

    fileChange(file, fileList) {
      var token1 = aes.decrypt(this.fileVouchers[0].token);
      var key1 = this.fileVouchers[0].fileName;
      this.form.key = key1;
      this.form.token = token1;
      this.fileList = fileList;
      this.$refs.upload.submit();
      if (file.status == "success") {
        this.uploadImages.push(this.form.key);
        this.getToken();
      }
    },
    fileRemove(file, fileList) {
      this.fileList = fileList;
      this.uploadImages.splice;
      this.uploadImages = this.uploadImages.filter(function (item) {
        return item != file.response.key;
      });
    },
    // 发布图片
    async getToken() {
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
            this.fileVouchers = res.data;
          } else {
            this.$notify({
              title: "提示",
              message: "没有权限",
              duration: 3000,
            });
            return;
          }
        });

      return true;
    },

    // 发布
    publishText() {
      if ((this.text.length <= 0) & (this.uploadImages.length <= 0)) {
        this.$notify({
          title: "提示",
          message: "发布内容不能为空",
          duration: 3000,
        });
      } else {
        var text = this.utf16toEntities(this.text);

        if (this.labelIds.length > 0) {
          var tag = JSON.stringify(this.labelIds);
        } else {
          var tag = "";
        }
        let data =
          //使用qs插件
          qs.stringify({
            text: text,
            isAnonymity: this.isAnonymity == true ? 1 : 0,
            //  this.labelIds == [] ? "" : JSON.stringify(this.labelIds),
            labelIds: tag,
            pic: JSON.stringify(this.uploadImages),
            visibility: this.visibility,
            video: 0,
          });
        request
          .post("/living/activity/publish", data, {
            headers: { "content-type": "application/x-www-form-urlencoded" },
          })
          .then((res) => {
            if (res.code == "00000") {
              this.$notify({
                title: "提示",
                message: "发布成功",
                duration: 3000,
              });
              this.$router.push("/recomend");
            } else {
              this.$notify({
                title: "提示",
                message: "发布失败",
                duration: 3000,
              });
            }
          });
      }
    },
  },
};
</script>
<style scoped>
/deep/.el-upload-list--picture-card .el-upload-list__item-thumbnail {
  height: 100%;
  width: auto;
  object-fit: contain;
}
/deep/.el-icon--zoom-in svg {
  display: none;
}
/deep/.el-dialog {
  margin-left: 280px;
  width: 750px;
}

span {
  height: 35px;
  width: 80px;
  line-height: 35px;
  float: left;
}
.tag span,
.searchTag span {
  height: 25px;
  min-width: 50px;
  color: rgb(167, 162, 198);
}
/* div.tag {
  min-height: 30px;
} */
.addFile {
  overflow: hidden;
  /* background-color: pink; */
  width: 100%;
  /* border: 1px solid rgb(110, 106, 106); */

  height: 35px;
  line-height: 35px;
}
.addFile span {
  /* float: left; */
  width: 35px;
  position: relative;
  margin-left: 15px;
}
.addFile img {
  height: 26px;
  margin-top: 5px;
}

span.isAnonymity {
  position: relative;
  width: 75px;
  margin-left: 420px;
}

#select {
  border: 0;
  outline: 0;
}

.tag {
  margin-left: 10px;
}

.el-tag + .el-tag {
  margin-left: 10px;
}
</style>
