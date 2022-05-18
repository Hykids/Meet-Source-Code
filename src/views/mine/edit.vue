<template>
  <div class="upload" title="上传头像" style="overflow: hidden">
    <span class="header">
      <img
        :src="avatar"
        style="
          width: 145px;
          height: 145px;
          display: inline-block;
          margin-left: 75px;
          margin-top: 10px;
          float: left;
          border: 1px dashed #c0ccda;
          border-radius: 6px;
          box-sizing: border-box;
        "
      />
    </span>
    <el-upload
      list-type="picture-card"
      ref="upload"
      action="https://upload.qiniup.com/"
      :before-upload="beforeAvatarUpload"
      :auto-upload="false"
      :data="fileVouchers"
      style="
        display: inline-block;
        float: left;
        margin-top: 10px;
        margin-left: 75px;
      "
      :limit="1"
      :on-change="fileChange"
      :file-list="fileList"
      v-if="isShow"
    >
      <el-icon><Plus /></el-icon>
    </el-upload>
  </div>
  <el-form ref="form" :model="form" label-width="80px">
    <el-form-item label="用户名:">
      <el-input v-model="form.name" style="width: 180px"></el-input>
    </el-form-item>

    <el-form-item label="性别">
      <el-radio-group v-model="form.sex">
        <el-radio label="男"></el-radio>
        <el-radio label="女"></el-radio>
      </el-radio-group>
    </el-form-item>

    <el-form-item>
      <el-button @click="onSubmit" style="">submit</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import aes from "@/utils/export";
import request from "@/utils/request";
import { Plus, Delete } from "@element-plus/icons-vue";
import store from "../../store";
import qs from "qs";
export default {
  inject: ["reload"],
  data() {
    return {
      avatar: "",
      userId: store.state.userId,
      userInfo: [],
      fileVouchers: {
        token: "",
        key: "",
      },
      fileName: "",
      isShow: true,
      form: {
        name: "",
        sex: "",
      },
    };
  },
  components: {
    Plus,
    Delete,
  },
  created() {
    this.getUserInfo();
  },
  methods: {
    getUserInfo() {
      var userId = this.userId;
      request
        .get(
          "/living/user/" + userId + "/info",

          {
            path: {
              userId: Number(userId),
            },
            headers: {
              "content-type": "application/x-www-form-urlencoded",
            },
          }
        )
        .then((res) => {
          this.avatar = res.data.avatar;
          this.userInfo = res.data;
          this.form.name = this.userInfo.username;
          store.commit("setAvatar", this.avatar);

          if (this.userInfo.sex == 0) {
            this.form.sex = "女";
          } else {
            this.form.sex = "男";
          }
        });
    },
    back() {
      this.$router.go(-1);
    },
    fileChange(file, fileList) {
      console.log("file", file);
      if (file) {
        this.getToken();
      }
      if (file.status == "success") {
        this.fileName = this.fileVouchers.key;
      }
    },
    getToken() {
      request
        .get("/living/user/avatar/token", {
          headers: {
            "content-type": "application/x-www-form-urlencoded",
          },
        })
        .then((res) => {
          if (res.code === "00000") {
            this.fileVouchers.token = aes.decrypt(res.data.token);
            this.fileVouchers.key = res.data.fileName;
            this.$refs.upload.submit();
          }
        });
    },

    publishAvatar() {
      let data = qs.stringify({
        fileName: this.fileName,
      });
      console.log(data);
      request
        .post("/living/user/avatar/change", data, {
          headers: {
            "content-type": "application/x-www-form-urlencoded",
          },
        })
        .then((res) => {
          if (res.code == "00000") {
            this.getUserInfo();
            setTimeout(() => {
              window.location.reload();
            }, 200);
          }
        });
    },
    changeName(username) {
      username = this.form.name;
      if (username == "") {
        this.$message("用户名不能为空");
        return;
      }
      request
        .post("/living/user/username/change/" + username, {
          path: {
            username: this.form.name,
          },
          headers: {
            "content-type": "application/x-www-form-urlencoded",
          },
        })
        .then((res) => {
          if (res.code == "00000") {
            this.getUserInfo();
          } else {
            this.$message(res.userMsg);
          }
        });
    },
    changeSex(sex = this.form.sex) {
      let num = 0;
      if (sex == "男") {
        num = 1;
      }
      let data = qs.stringify({
        sex: num.toString(),
      });

      request
        .post("/living/user/sex/update", data, {
          headers: {
            "content-type": "application/x-www-form-urlencoded",
          },
        })
        .then((res) => {
          if (res.code == "00000") {
            this.getUserInfo();
          } else if ((res.code = "A0004")) {
            this.$notify({
              title: "提示",
              message: "你已经设置过性别，不可再修改",
              duration: 3000,
            });
          }
        });
    },
    onSubmit() {
      this.changeName();
      this.changeSex();
      if (this.fileName != "") {
        this.publishAvatar();
      }
    },
  },
};
</script>

<style scoped>
/deep/.el-radio__input.is-checked .el-radio__inner {
  border-color: #9ca4cf;
  background: #9ca4cf;
}
/deep/.el-radio__input.is-checked + .el-radio__label {
  color: #9ca4cf;
}
/deep/.el-upload-list--picture-card .el-upload-list__item-thumbnail {
  height: 100%;
  width: auto;
  object-fit: contain;
}
/deep/.el-icon--zoom-in svg {
  display: none;
}
/* .header {
  display: inline-block;
  width: 145px;
  height: 145px;
  border: 1px solid;
} */
.upload {
  padding: 20px;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>