<template>
  <span class="search">
    <el-input
      class="inline-input"
      v-model="subText"
      placeholder="搜索动态"
      style="width: 400px"
      @keyup.enter.native="searchActivities()"
    >
      <template #append>
        <el-button :icon="Search" @click="searchActivities()"></el-button>
      </template>
    </el-input>
  </span>
</template>

<script>
import { Search } from "@element-plus/icons-vue";
import request from "@/utils/request";
export default {
  inject: ["reload"],
  name: "search",
  data() {
    return {
      subText: "",
      ArticleItem: [],
      timeout: null,
      hotLabels: [],
      state: {
        searchText: "",
        haveMoreData: false,
        artices: [],
        openActionSheet: false,
        scrollInto: "",
        hotLabels: [],
        showHotLabels: true,
        searchHistory: [],
      },
      page: 1,
      searchTextBefore: "",
    };
  },
  setup() {
    return {
      Search,
    };
  },
  methods: {
    //
    searchActivities() {
      this.$router.push({
        path: "/searchActivity",
        query: {
          subText: this.subText,
        },
      });
    },
  },
};
</script>

<style scoped>
.search {
  /* display: block; */
  width: 500px;
  margin-left: 50px;
  margin-right: 100px;
  /* background-color: rgb(129, 72, 72); */
}
.input[text] {
  width: 400px;
}
.el-button:hover {
  background-color: antiquewhite;
  display: inline;
}
</style>