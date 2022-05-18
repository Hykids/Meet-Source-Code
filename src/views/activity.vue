<template>
  <activity-items :lists="lists" :key="key"></activity-items>
  <transition name="fade">
    <loading v-if="isLoading"></loading>
  </transition>
  <!-- 分页 -->
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
import activityItems from "../components/activityItems.vue";
import request from "@/utils/request";
import { ArrowDown, Refresh } from "@element-plus/icons-vue";
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
      labelId: "",
      key: 1,
      isLoading: true,
    };
  },
  components: {
    Refresh,
    ArrowDown,
    activityItems,
    loading,
  },

  methods: {
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage; //修改currentPage
      this.getList();
    },
    getList() {
      request
        .get("living/activity/groupByLabel", {
          params: {
            labelId: this.labelId,
            page: this.currentPage,
          },
          headers: {
            "content-type": "application/x-www-form-urlencoded",
          },
        })
        .then((res) => {
          // console.log(res);
          if (res.code === "00000") {
            this.lists = res.data.list;
            this.pageSum = res.data.pageSum;
            this.total = res.data.total;
            if (this.pageSum <= 1) {
              this.isShow = false;
            }
            this.key += 1;
            this.isLoading = false;
          }
        });
    },
  },
  watch: {
    // 监视搜索词变化
    "$route.query.labelId": {
      immediate: true,
      handler() {
        this.labelId = this.$route.query.labelId;
        this.getList();
      },
    },
  },
  mounted() {
    this.labelId = this.$route.query.labelId;
    this.getList();
  },
};
</script>

<style scoped>
</style>
