<template>
  <activity-items :lists="lists" :key="key"></activity-items>
  <transition name="fade">
    <loading v-if="isLoading"></loading>
  </transition>
  <el-pagination
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
    :current-page.sync="currentPage"
    :page-size="pagesize"
    layout="prev, pager, next, jumper"
    :total="total"
    :key="currentPage"
    v-show="isShow"
  >
  </el-pagination>
</template>

<script>
// 父组件
import activityItems from "../components/activityItems.vue";
import request from "@/utils/request";
import loading from "../components/loading.vue";
export default {
  data() {
    return {
      lists: [],
      pageSum: 0,
      currentPage: 1,
      total: 0,
      likeId: [],
      like: [],
      pageSize: 5,
      subText: "",
      key: 1,
      isLoading: true,
    };
  },
  components: {
    activityItems,
    loading,
  },
  methods: {
    searchActivities() {
      request
        .get("/living/activity/fullTextQuery", {
          params: {
            page: this.currentPage,
            subText: this.subText,
          },
          headers: {
            "content-type": "application/json",
          },
        })
        .then((res) => {
          if (res.code === "00000") {
            this.lists = res.data.list;
            this.pageSum = res.data.pageSum;
            this.total = res.data.total;
            if (this.pageSum <= 1) {
              this.isShow = false;
            }
            this.key += 1;
          }
        });
      this.isLoading = false;
    },
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage; //修改currentPage
      this.searchActivities();
    },
  },
  watch: {
    // 监视搜索词变化
    "$route.query.subText": {
      immediate: true,
      handler() {
        this.subText = this.$route.query.subText;
        this.searchActivities();
      },
    },
  },

  created() {
    this.subText = this.$route.query.subText;
    this.searchActivities();
  },
};
</script>

<style>
</style>