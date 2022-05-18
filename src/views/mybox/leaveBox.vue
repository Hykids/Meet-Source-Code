<template>
  <div v-for="item in lists" :key="item.id" class="list">
    <div class="sex">{{ item.sex == 0 ? "女生" : "男生" }}盒子</div>
    <div class="text">
      <p>{{ item.text }}</p>
    </div>

    <div class="time">{{ item.createTime }}</div>
  </div>
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
import request from "@/utils/request";

export default {
  data() {
    return {
      lists: [],
      currentPage: 1,
      pageSum: 0,
      total: 0,
      isShow: false,
    };
  },
  methods: {
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage; //修改currentPage
      getBoxDetail();
    },
    getBoxDetail() {
      request
        .get("/living/blindBox/deliver/log", {
          params: {
            page: this.currentPage,
          },
          headers: {
            "content-type": "application/json",
          },
        })
        .then((res) => {
          this.lists = res.data.list;
          this.pageSum = res.data.pageSum;
          this.total = res.data.total;
          if (res.pageSum > 1) {
            this.isShow = true;
          }
        });
    },
  },
  created() {
    this.getBoxDetail();
  },
};
</script>

<style scoped>
.sex {
  font-size: 14px;
  color: rgb(141, 136, 136);
  font-weight: 520;
  height: 30px;
  line-height: 30px;
}
.text {
  min-height: 50px;
}
.time {
  font-size: 14px;
  color: rgb(141, 136, 136);
  font-weight: 520;
}
.list {
  text-align: left;
  margin-left: 5px;
  width: 750px;
  /* min-height: 150px; */
  background: linear-gradient(45deg, white, #e0d7fb);
  margin-top: 3px;
}
</style>