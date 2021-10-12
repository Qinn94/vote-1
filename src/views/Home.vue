<template>
  <div class="home">
    <!-- <div class="nav">
      <span class="close"><i>X</i></span>
      <span class="title">全国投教动漫大赛</span>
      <span class="set">···</span>
    </div> -->
    <div>
      <img class="banner" src="../assets/img/banner.png" alt="" />
    </div>
    <div class="content">
      <img class="action-img" src="../assets/img/action.svg" alt="" />
      <div class="action-content">
        <div>
          <p class="action-title">活动介绍：</p>
          <p class="action-info">
            深交所联合人民日报社《讽刺与幽默》、证券时报共同举办的2021年第三届全国投教动漫大赛，正在火热进行中！大赛以“我身边的上市公司”为主题，收到了来自市场各界人士的踊跃投稿。经过初步筛选，现展示以下入围作品，期待各位投出您宝贵的一票，选出您最喜欢的作品！
          </p>
        </div>
        <div class="action-time">
          <p class="action-title">投票时间：</p>
          <p class="action-info special">2021年10月25日-10月31日</p>
        </div>
        <div>
          <p class="action-title">投票规则：</p>
          <p class="action-info">
            入围作品分为机构组、学校组、社会组、三个小组，
            <span class="special">用户每天每个小组只能投3票</span
            >，每票必须投不同作品。
          </p>
        </div>
      </div>
      <img class="works-title-img" src="../assets/img/action.svg" alt="" />
      <div>
        <!-- 三个tab -->
        <ul class="tab">
          <li
            v-for="(tab, index) in tabList"
            @click="tabChange(tab.id, index)"
            :class="{ 'tab-selected': index === currentIndex }"
            :key="tab.id"
          >
            {{ tab.label }}
          </li>
        </ul>
        <!-- 作品列表 -->
        <div class="works">
          <div class="works-item" v-for="item in worksList" :key="item.id">
            <div class="works-top">
              <img
                class="works-img"
                @click="lookWorksDetail(item.id)"
                :src="item.image"
                alt=""
              />
              <p
                v-if="item.rank === 1 || item.rank === 2 || item.rank === 3"
                class="ranking"
                :class="{ 'ranking-two': item.rank === 2 || item.rank === 3 }"
              >
                {{
                  item.rank === 1
                    ? "第一名"
                    : item.rank === 2
                    ? "第二名"
                    : "第三名"
                }}
              </p>
            </div>
            <div class="works-content">
              <p class="works-info">{{ item.title }}</p>
              <div class="vote">
                <p class="works-count">{{ item.total }}票</p>
                <button
                  :disabled="item.disabled"
                  @click="vote(item)"
                  class="vote-btn"
                  :class="{ 'voted-btn': item.disabled }"
                >
                  {{ item.voteBtnInfo ? item.voteBtnInfo : "投票" }}
                </button>
              </div>
            </div>
          </div>
        </div>
        <div class="page">
          <span class="page-btn" @click="getLastPage">上一页</span>
          <span> {{ currentPage }} / {{ totalPage }} </span>
          <span class="page-btn" @click="getNextPage">下一页</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      groupWorksList: [
        {
          image:
            "http://design-svc.fat.lunz.cn/StaticFiles/BP9999999788/BV9999999433/SA9999998497/48b784f6-b771-432e-9dd8-87859db48028.png",
          title:
            "我是介绍信息哦哦哦噢噢噢噢噢噢噢噢噢噢噢噢哦哦哦噢噢噢噢噢噢噢噢噢噢噢噢哦哦哦噢噢噢噢噢噢噢噢噢噢噢噢哦哦哦",
          total: 1000,
          id: 1,
          rank: 1,
        },
        {
          image:
            "http://design-svc.fat.lunz.cn/StaticFiles/BP9999999788/BV9999999433/SA9999998497/48b784f6-b771-432e-9dd8-87859db48028.png",
          title:
            "我是介绍信息哦哦哦噢噢噢噢噢噢噢噢噢噢噢噢哦哦哦噢噢噢噢噢噢噢噢噢噢噢噢哦哦哦噢噢噢噢噢噢噢噢噢噢噢噢哦哦哦",
          total: 1000,
          id: 2,
          rank: 2,
        },
        {
          image:
            "http://design-svc.fat.lunz.cn/StaticFiles/BP9999999788/BV9999999433/SA9999998497/48b784f6-b771-432e-9dd8-87859db48028.png",
          title: "我是介绍",
          total: 1000,
          id: 3,
          rank: 3,
        },
        {
          image:
            "http://design-svc.fat.lunz.cn/StaticFiles/BP9999999788/BV9999999433/SA9999998497/48b784f6-b771-432e-9dd8-87859db48028.png",
          title:
            "我是介绍信息哦哦哦噢噢噢噢噢噢噢噢噢噢噢噢哦哦哦噢噢噢噢噢噢噢噢噢噢噢噢哦哦哦噢噢噢噢噢噢噢噢噢噢噢噢哦哦哦",
          total: 1000,
          id: 4,
        },
      ],
      schoolWorksList: [
        {
          image:
            "http://design-svc.fat.lunz.cn/StaticFiles/BP9999999788/BV9999999433/SA9999998497/48b784f6-b771-432e-9dd8-87859db48028.png",
          title:
            "我是学校介绍信息哦哦哦噢噢噢噢噢噢噢噢噢噢噢噢哦哦哦噢噢噢噢噢噢噢噢噢噢噢噢哦哦哦噢噢噢噢噢噢噢噢噢噢噢噢哦哦哦",
          total: 2000,
          id: 1,
        },
        {
          image:
            "http://design-svc.fat.lunz.cn/StaticFiles/BP9999999788/BV9999999433/SA9999998497/48b784f6-b771-432e-9dd8-87859db48028.png",
          title:
            "我是学校介绍信息哦哦哦噢噢噢噢噢噢噢噢噢噢噢噢哦哦哦噢噢噢噢噢噢噢噢噢噢噢噢哦哦哦噢噢噢噢噢噢噢噢噢噢噢噢哦哦哦",
          total: 2000,
          id: 2,
        },
        {
          image:
            "http://design-svc.fat.lunz.cn/StaticFiles/BP9999999788/BV9999999433/SA9999998497/48b784f6-b771-432e-9dd8-87859db48028.png",
          title: "我是学校介绍",
          total: 2000,
          id: 3,
        },
        {
          image:
            "http://design-svc.fat.lunz.cn/StaticFiles/BP9999999788/BV9999999433/SA9999998497/48b784f6-b771-432e-9dd8-87859db48028.png",
          title:
            "我是学校介绍信息哦哦哦噢噢噢噢噢噢噢噢噢噢噢噢哦哦哦噢噢噢噢噢噢噢噢噢噢噢噢哦哦哦噢噢噢噢噢噢噢噢噢噢噢噢哦哦哦",
          total: 2000,
          id: 4,
        },
      ],
      socailWorksList: [
        {
          image:
            "http://design-svc.fat.lunz.cn/StaticFiles/BP9999999788/BV9999999433/SA9999998497/48b784f6-b771-432e-9dd8-87859db48028.png",
          title:
            "我是社会介绍信息哦哦哦噢噢噢噢噢噢噢噢噢噢噢噢哦哦哦噢噢噢噢噢噢噢噢噢噢噢噢哦哦哦噢噢噢噢噢噢噢噢噢噢噢噢哦哦哦",
          total: 3000,
        },
        {
          image:
            "http://design-svc.fat.lunz.cn/StaticFiles/BP9999999788/BV9999999433/SA9999998497/48b784f6-b771-432e-9dd8-87859db48028.png",
          title:
            "我是社会介绍信息哦哦哦噢噢噢噢噢噢噢噢噢噢噢噢哦哦哦噢噢噢噢噢噢噢噢噢噢噢噢哦哦哦噢噢噢噢噢噢噢噢噢噢噢噢哦哦哦",
          total: 3000,
        },
        {
          image:
            "http://design-svc.fat.lunz.cn/StaticFiles/BP9999999788/BV9999999433/SA9999998497/48b784f6-b771-432e-9dd8-87859db48028.png",
          title: "我是社会介绍",
          total: 3000,
        },
        {
          image:
            "http://design-svc.fat.lunz.cn/StaticFiles/BP9999999788/BV9999999433/SA9999998497/48b784f6-b771-432e-9dd8-87859db48028.png",
          title:
            "我是社会介绍信息哦哦哦噢噢噢噢噢噢噢噢噢噢噢噢哦哦哦噢噢噢噢噢噢噢噢噢噢噢噢哦哦哦噢噢噢噢噢噢噢噢噢噢噢噢哦哦哦",
          total: 3000,
        },
      ],
      worksList: [],
      tabList: [
        { label: "学校", id: "school" },
        { label: "机构", id: "group" },
        { label: "社会", id: "social" },
      ],
      currentPage: 1,
      totalPage: 5,
      currentIndex: 0,
    };
  },
  methods: {
    // 切换tab页
    tabChange(id, index) {
      this.currentIndex = index;
      switch (id) {
        case "group":
          this.worksList = this.groupWorksList;
          break;
        case "school":
          this.worksList = this.schoolWorksList;
          break;
        case "social":
          this.worksList = this.socailWorksList;
          break;
        default:
          break;
      }
    },
    // 点击查看详情
    lookWorksDetail(id) {
      this.$router.push({
        path: "/detail",
        query: { id },
      });
    },
    // 点击投票
    vote(work) {
      if (work.disable) {
        return;
      }
      work.total += 1;
      work.disabled = true;
      work.voteBtnInfo = "已投票";
      // 在这里调投票的接口
    },
    getLastPage() {
      if (this.currentPage <= 1) {
        return;
      }
      this.currentPage--;
      // 这里调接口获取上一页的数据
    },
    getNextPage() {
      if (this.currentPage >= this.totalPage) {
        return;
      }
      this.currentPage++;
      // 这里调接口获取下一页的数据
    },
  },
  created() {
    this.worksList = this.schoolWorksList;
    // 获取tab数据
  },
};
</script>

<style scoped>
/* .nav {
  position: relative;
  width: 100%;
  height: 1.2rem;
  font-size: 0.34rem;
  line-height: 1.2rem;
  text-align: center;
  background-color: #fff;
} */

.close {
  position: absolute;
  left: 5%;
}

.title {
  font-family: PingFang SC;
  font-weight: 500;
  color: #000000;
}

.set {
  position: absolute;
  right: 5%;
}

.banner {
  display: block;
  max-width: 800px;
  margin: auto;
  width: 100%;
  /* background: url(../assets/img/banner.png) no-repeat;
  background-size: cover;
  background-position: top; */
}

.content {
  max-width: 750px;
  margin: auto;
  text-align: center;
}

.action-img {
  width: 70%;
  transform: translate(0px, -50%);
}

.action-content {
  width: 7rem;
  height: 6.02rem;
  margin: 0 auto;
  padding: 0.4rem;
  font-size: 0.26rem;
  line-height: 0.4rem;
  text-align: left;
  border-radius: 0.2rem;
  box-sizing: border-box;
  box-shadow: 0px 18px 40px 0px rgba(5, 17, 102, 0.25);
  color: #fff;
  background: #1f33c3;
}

.action-title {
  font-weight: bold;
}

.action-info {
  font-family: Alibaba PuHuiTi;
}

.special {
  color: #72effc;
}

.action-time {
  margin: 0.39rem 0;
}

.works-title-img {
  width: 70%;
  margin: 20px 0;
}

.tab {
  overflow: hidden;
  width: 6.9rem;
  height: 0.8rem;
  line-height: 0.8rem;
  margin: 0 auto;
  border-radius: 0.18rem;
  font-size: 0.3rem;
  font-family: Alibaba PuHuiTi;
  font-weight: bold;
  list-style: none;
  color: #1b227f;
  background-color: #fff;
}

.tab li {
  width: 2.3rem;
  height: 100%;
  float: left;
}

.tab-selected {
  color: #fff;
  background: linear-gradient(64deg, #4c57f5, #243ff5, #001cd7);
}

.works {
  width: 7.2rem;
  overflow: hidden;
  margin: 0.24rem auto;
}

.works-item {
  overflow: hidden;
  float: left;
  width: 3.38rem;
  /* height: 4.38rem; */
  margin: 0.1rem;
  border-radius: 0.1rem;
  background-color: #fff;
  font-size: 0.28rem;
  font-family: Alibaba PuHuiTi;
}

.works-top {
  position: relative;
  height: 2.54rem;
}

.works-img {
  height: 2.54rem;
  width: 100%;
  object-fit: cover;
  object-position: center;
}

.ranking {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 1.04rem;
  height: 0.33rem;
  font-size: 0.23rem;
  font-family: Source Han Sans CN;
  font-weight: bold;
  color: #ffffff;
  line-height: 0.33rem;
  background: #f45c41;
  border-radius: 0 0.06rem 0.06rem 0;
}

.ranking-two {
  background: #fca630;
}

.works-content {
  box-sizing: border-box;
  height: 1.84rem;
  padding: 0.2rem;
  text-align: left;
}

.works-count {
  /* margin-top: 0.1rem; */
  font-size: 0.3rem;
  font-weight: bold;
  color: #e42235;
  line-height: 0.47rem;
}

.works-info {
  height: 0.71rem;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}

.vote {
  display: flex;
  justify-content: space-between;
  margin-top: 0.1rem;
}

.vote-btn {
  float: left;
  width: 1.3rem;
  height: 0.56rem;
  /* margin-top: 0.17rem; */
  font-size: 0.28rem;
  border: none;
  border-radius: 0.1rem;
  background: linear-gradient(-90deg, #4160f6, #2e49f4);
}

.voted-btn {
  background: #cccccc;
}

.page {
  padding: 1rem 0 1.31rem;
  font-size: 0.26rem;
  font-family: Alibaba PuHuiTi;
  font-weight: bold;
  color: #72effc;
}

.page-btn {
  display: inline-block;
  width: 1.38rem;
  height: 0.6rem;
  margin: 0.2rem;
  line-height: 0.6rem;
  border: 0.01rem solid #72effc;
  border-radius: 0.1rem;
  background: rgba(255, 255, 255, 0);
}
</style>
