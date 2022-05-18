<template>
  <div class="header" style="width: 100%; background-color: white">
    <div class="navHeader">
      <span
        class="bugu"
        style="
          font: italic 22px Georgia, serif;
          line-height: 54.67px;
          width: 60px;
          color: #9ca4cf;
        "
      >
        Meet
      </span>
      <ul>
        <li>
          <router-link active-class="active" to="/recomend"> 推荐 </router-link>
        </li>
        <li>
          <router-link active-class="active" to="/hotlist">热榜</router-link>
        </li>
      </ul>
      <searchText />
      <span @click="toHome"
        ><img
          src="../assets/images/head.png"
          style="height: 40px"
          v-if="avatar == ''"
        />
        <img :src="avatar" style="height: 40px" v-if="avatar != ''" />
      </span>

      <el-popover v-model:visible="visible" placement="bottom" :width="300">
        <div style="text-align: right">
          <img
            src="../assets/images/more1.png"
            style="height: 23px; width: 23px"
            @click="clear()"
          />
        </div>
        <div v-if="notes">
          <div
            v-for="(item, key) in notes"
            key="key"
            style="
              height: 35px;
              line-height: 35px;
              border-bottom: solid #adb3d7 thin;
              border-collapse: collapse;
              width: 100%;
              color: #adb3d7;
            "
          >
            {{ item }}
          </div>
        </div>
        <template #reference>
          <span class="note">
            <img
              src="../assets/images/note.png"
              alt=""
              @click="visible = !visible"
            />
          </span>
        </template>
      </el-popover>
      <div class="unreadResumeWarning" v-if="notes.length > 0" :key="key1">
        <span class="unreadResumeCount">{{ notes.length }}</span>
      </div>
      <span class="setting">
        <img src="../assets/images/setting.png" alt="" @click="drawer = true" />
      </span>

      <el-drawer
        v-model="drawer"
        title="I am the title"
        :with-header="false"
        size="20%"
      >
        <setting-detail />
      </el-drawer>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { Search } from "@element-plus/icons-vue";
import searchText from "../views/searchText.vue";
import settingDetail from "../components/settingDetail.vue";
import store from "../store";
export default {
  inject: ["reload"],
  name: "header",
  components: {
    settingDetail,
    searchText,
  },
  data() {
    return {
      subText: "",
      avatar: store.state.avatar,
      userId: store.state.userId,
      notes: store.state.notes,
    };
  },
  methods: {
    toHome() {
      store.commit("homePageId", this.userId);
      this.$router.push("/homepage");
      this.reload();
    },
    clear() {
      this.notes = [];
      store.commit("clearNotes", this.notes);
    },
  },
  setup() {
    const visible = ref(false);
    const drawer = ref(false);
    const subText = ref("");
    const activeIndex = ref("1");
    const activeIndex2 = ref("1");
    var keyPath = new Array();
    const handleSelect = (key, keyPath) => {
      console.log(key, keyPath);
    };

    return {
      activeIndex,
      activeIndex2,
      handleSelect,
      subText,
      Search,
      drawer,
      visible,
    };
  },
};
</script>

<style scoped>
.unreadResumeWarning {
  width: 14px;
  height: 14px;
  border-radius: 7px;
  background-color: #ff3b30;
  left: 28px;
  top: 10px;
}

.unreadResumeCount {
  display: block;
  width: 100%;
  height: 14px;
  line-height: 14px;
  text-align: center;
  color: #fff;
  font-size: 12px;
}
.navHeader {
  width: 1300px;
  margin: 0 auto;
  height: 54.67px;
  background-color: #fff;
  display: flex;
  flex-direction: row;
}
ul {
  width: 300px;
  display: flex;
  list-style: none;
  text-transform: uppercase;
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}

li::after {
  content: "";
  width: 100%;
  height: 4px;
  background-color: transparent;
  /* background-color: pink; */
  display: block;
  width: 150px;
  transition: 0.3s ease;
  position: relative;
  left: 0%;
}

li:nth-child(1):hover ~ li:last-child::after {
  left: -100%;
  background-color: #a59adb;
}
li:nth-child(2):last-child:last-child:hover::after {
  left: 0;
  background-color: #a59adb !important;
}

li:nth-child(1) a {
  color: #a59adb;
}
li:nth-child(2) a {
  color: #a59adb;
}

a {
  padding: 16px;
  display: block;
  text-align: center;
  text-decoration: none;
  background-color: #fff;
  color: #666;
}
span {
  display: block;
  line-height: 54.67px;
}

.note {
  margin-left: 40px;
}
img {
  width: 40px;
  vertical-align: middle;
}

.setting {
  margin-left: 40px;
}
.setting img {
  height: 40px;
  width: 30px;
}

span.search {
  width: 400px;
  margin-left: 30px;
}
.bugu {
  width: 100px;
}
.el-input {
  width: 400px;
}

* a {
  text-decoration: none;
}
</style>
