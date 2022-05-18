import { request } from "./request";

// @function 获取动态标签
// @param page 页数

//  function getHotLabels(page=1) {
//     let res = await request({
//       data: {
//         method: 'GET',
//         group: 'activity',
//         action: 'label/list',
//         data: {
//           page: page
//         },
//         header: {
//           'content-type': 'application/x-www-form-urlencoded', // 默认值
//         },
//       }
//     });
//     if (res.data.code === REQUEST_SUCCEEDED_CODE) {
//       let Labels: LabelItem[] = res.data.data.list
//       return Labels
//     } else {
//       return []
//     }
//   }

function searchActivities() {
    request
        .get(
            "/living/activity/fullTextQuery",
            {
                headers: {
                    "content-type": "application/x-www-form-urlencoded",
                },
                params: {
                    //   page: page,
                    subText: this.subText,
                },
            } //设置返回类型
        )
        .then((res) => {
            console.log(res);
            //   if (res.data.code === REQUEST_SUCCEEDED_CODE) {
            //     let pageSum = res.data.data.pageSum;
            //     let artices = res.data.data.list;
            //     console.log(artices);
            //     if (page === 1) {
            //       this.setState({
            //         artices: artices,
            //         scrollInto: "",
            //         haveMoreData: true,
            //       });
            //     } else {
            //       if (page > pageSum) {
            //         this.setState({
            //           haveMoreData: false,
            //         });
            //       } else {
            //         let allArtices = this.state.artices.concat(artices);
            //         this.setState({
            //           artices: allArtices,
            //         });
            //         if (page == pageSum) {
            //           this.setState({
            //             haveMoreData: false,
            //           });
            //         } else {
            //           this.setState({
            //             haveMoreData: true,
            //           });
            //         }
            //       }
            //     }
            //     if (artices.length < 1) {
            //       //如果这一页没有动态则切换到下一页
            //       if (page < pageSum) {
            //         this.page = page + 1;
            //       }
            //     }
            //   } else {
            //     console.log("searchActivities", res.data);
            //   }
            //   let searchHistory = this.state.searchHistory;
            //   if (searchHistory.indexOf(subText) == -1) {
            //     searchHistory.push(subText);
            //     if (searchHistory.length > 7) {
            //       searchHistory.splice(0, 1);
            //     }
            //     Taro.setStorage({ key: "search_history", data: searchHistory });
            //   }
        });
}

export default {
    searchActivities,
}
