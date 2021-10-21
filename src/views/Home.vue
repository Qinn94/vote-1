<template>
  <div class="home">
    <div v-if="!isApp && !isWechat" id="openappBox">
      <img src="http://specials.cfbond.com/static/images/appOpenlogo.png">
      <button @click="goApp"></button>
    </div>
    <div :class="{topBlank:bannerHasBlank}">
      <img class="banner" src="../assets/img/banner.png" alt="" />
    </div>
    <div class="content">
      <img class="action-img" src="../assets/img/hdjs.png" alt="" />
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
      <img class="works-title-img" src="../assets/img/zpzs.png" alt="" />
      <div class="searchBox">
        <img @click="getSearchList" class="searchBtn" src="../assets/img/search.png"/>
        <input @change="getSearchList" type="text" v-model="searchVal" placeholder="请输入作品名称" />
        <img v-show="clearShow" @click="clearInput" class="searchClear" src="../assets/img/clear.png"/>
      </div>
      <div>
        <!-- 三个tab -->
        <ul v-show="tabShow" class="tab">
          <li
            v-for="(tab, index) in tabList"
            @click="tabChange(tab.code, index)"
            :class="{ 'tab-selected': index === currentIndex }"
            :key="tab.id"
          >
            {{ tab.name }}
          </li>
        </ul>
        <!-- 作品列表 -->
        <div v-show="!noData" class="hasData">
          <div class="works">
            <div class="works-item" v-for="item in worksList" :key="item.id">
              <div class="works-top">
                <img
                  class="works-img"
                  @click="lookWorksDetail(item.org_id,item.rank,item.flag)"
                  :src="item.image"
                  alt=""
                />
                <p
                  v-if="(item.rank === 1 || item.rank === 2 || item.rank === 3) && item.total !== 0"
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
                    :disabled="item.flag && !bannerHasBlank"
                    @click="vote(item)"
                    class="vote-btn"
                    :class="{ 'voted-btn': item.flag && !bannerHasBlank }"
                  >
                    {{ item.flag && !bannerHasBlank ? '已投票' : "投票" }}
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div class="page" v-if="totalPage > 1">
            <span :class="{disabled:currentPage == 1}" class="page-btn" @click="getLastPage">上一页</span>
            <span> {{ currentPage }} / {{ totalPage }} </span>
            <span :class="{disabled:currentPage == totalPage}" class="page-btn" @click="getNextPage">下一页</span>
          </div>
        </div>
        <div v-show="noData" class="noData">
          <p>没有找到相关作品</p>
          <p v-show="searchVal != ''">"换个词搜索看吧"</p>
        </div>
        
      </div>
    </div>
  </div>
</template>

<script>
import { MessageBox } from 'mint-ui';
export default {
  name: "Home",
  data() {
    return {
      worksList: [],
      tabList: [],
      currentPage: 1,
      totalPage: 1,
      totalNum:0,
      currentIndex: 0,
      currentCode:-1,
      page_size:12,
      uid:'',
      searchVal:'',
      clearShow:false,
      tabShow:true,
      noData:false,
      isWechat:false,
      isApp:false,
      bannerHasBlank:false
    };
  },
  created() {
    this.isWechat = this.isWechatEvt();
    this.isApp = this.isInApp();
    if(this.isWechat){
      // this.wxShare();
      this.getWechatOauth2();
    }else{
      this.getLocalUid();
      this.getTabInfo();
    }
    if(!this.isWechat && !this.isApp){
      this.bannerHasBlank = true
    }else{
      this.bannerHasBlank = false
    } 
  },
  activated() {
    this.getVoteList()
  },
  methods: {

    //判断是否在app内部
    isInApp(){
      var userAgent = navigator.userAgent.toLowerCase();//获取UA信息
      if(userAgent.indexOf("cfbondclient") != -1){//判断ua中是否含有和app端约定好的标识cfbondclient
        return true;
      }
      else{
        return false;
      }
    },
    //app跳转
    goApp (){
      var _url = window.location.href+'&share_forbid=1';
      var _id = this.getQueryVariable('id');
      var _urlParam = "cfbond://com.cfbond.acfw/applinks?id="+_id+"&mode=2&url="+_url
      console.log(_url)
      if(navigator.userAgent.match(/android/gi)){
      window.location.href="https://a.app.qq.com/o/simple.jsp?pkgname=com.cfbond.acfw&android_schema="+encodeURIComponent(_urlParam )
      }else{
      window.location.href="https://a.app.qq.com/o/simple.jsp?pkgname=com.cfbond.acfw&ios_schema="+encodeURIComponent(_urlParam )
      }
    },
    //获取地址栏参数
    getQueryVariable(variable)
    {
      var query = window.location.search.substring(1);
      var vars = query.split("&");
      for (var i=0;i<vars.length;i++) {
              var pair = vars[i].split("=");
              if(pair[0] == variable){return pair[1];}
      }
      return(false);
    },
    //获取微信授权
    getWechatOauth2(){
      let code = this.getQueryVariable('code');
      this.getOpenId(code)
    },
    //获取微信openid
    async getOpenId(code){
      let result = await this.axios.get('https://yb.cfbond.com/wxtp/getuser?code=' + code);
      let uid = result.data && result.data.openid;
      if(uid){
        this.uid = uid;
        this.setLocalopenid(uid);
      }else{
        this.getLocalUid();
      }
      this.getTabInfo();
    },
    //判断是否在微信中打开
    isWechatEvt(){
      var ua = navigator.userAgent.toLowerCase();
      if (ua.match(/MicroMessenger/i) == "micromessenger" && this.getQueryVariable('code')) {
          return true;
        }
      else{
        return false
      }
    },

    //存储openid
    setLocalopenid(openid){
      localStorage.setItem('vote_uid', openid);
    },

    //存储uuid到本地
    setLocalUid(){
      let uid = this.getUuid();
      this.uid = uid;
      localStorage.setItem('vote_uid', uid);
    },
    //获取本地uuid
    getLocalUid(){
      this.uid = localStorage.getItem('vote_uid');
      if(!this.uid){
        this.setLocalUid()
      }
      // this.toast('本地uid' + this.uid)
    },

    //生成用户唯一id
    getUuid(){
      var d = new Date().getTime();
      if (window.performance && typeof window.performance.now === "function") {
          d += performance.now(); //use high-precision timer if available
      }
      var uuid = 'xxxxxx_xxxxxxxxxxxxxxxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
          var r = (d + Math.random() * 16) % 16 | 0;
          d = Math.floor(d / 16);
          return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
      });
      return uuid;
  },
    // 切换tab页
    tabChange(code, index) {
      this.currentIndex = index;
      this.currentCode = code;
      this.currentPage = 1;
      this.getVoteList();
    },
    // 点击查看详情
    lookWorksDetail(id,rank,flag) {
      if(!this.isWechat && !this.isApp){
        this.toast('需点击上方，打开中国财富APP进行投票');
        return;
      }
      const {href} = this.$router.resolve({
        path: "/detail",
        query: { id,code:this.currentCode,uid:this.uid,rank,flag,blank:this.bannerHasBlank},
      });
      window.open(href, '_blank')
    },
    // 点击投票
    vote(work) {
      if(!this.isWechat && !this.isApp){
        this.toast('需点击上方，打开中国财富APP进行投票');
        return;
      }
      if (work.flag) {
        return;
      }
      
      // 在这里调投票的接口
      this.axios.post('/wealth/szse_vote',
      {
        org_id:work.org_id,
        code:this.currentCode.toString(),
        uid:this.uid
      }
      // ,{
      //   headers:{
      //     'Content-Type':'application/x-www-form-urlencoded'
      //   }
      // }
      ).then(result => {
        if(result.data.code == 0){
          work.total += 1;
          work.flag = true;
          this.getVoteList()
        }else{
          this.toast(result.data.message)
        }
      })
    },
    toast(msg){
      MessageBox('', msg);
    },
    //获取列表数据
    getVoteList(){
      if(this.currentCode === -1) return;
      let params = {
        code:this.currentCode,
        page_size:this.page_size,
        page_num:this.currentPage,
        uid:this.uid,
        keyword:this.searchVal
      }
      if(this.searchVal !== ''){
        delete params.code
      }
      this.axios.get('/wealth/szse_activity',{params}).then(result => {
        this.totalNum = result.data.total;
        let page = parseInt(this.totalNum / this.page_size);
        this.totalPage = this.totalNum % this.page_size == 0 ? page : page + 1;
        this.worksList = result.data.data;
        this.noData = this.worksList.length > 0 ? false : true;
      })
    },
    getLastPage() {
      if (this.currentPage <= 1) {
        return;
      }
      this.currentPage--;
      // 这里调接口获取上一页的数据
      this.getVoteList()
    },
    getNextPage() {
      if (this.currentPage >= this.totalPage) {
        return;
      }
      this.currentPage++;
      // 这里调接口获取下一页的数据
      this.getVoteList()
    },
    getTabInfo(){
      this.axios.get('/wealth/szse_tab').then(result => {
        this.tabList = result.data.data;
        this.currentCode = this.tabList[0].code;
        this.getVoteList()
      })
    },
    //获取搜索结果
    getSearchList(){
      console.log(this.searchVal)
      if(this.searchVal == '') return;
      //调用搜索接口
      this.getVoteList()
      
    },
    //清空输入框
    clearInput(){
      this.searchVal = '';
      this.currentPage = 1;
      this.getVoteList();
    },
    wxShare(){
      var _title = '2021年第三届全国投教动漫大赛';
			var link = location.href;
      let desc = '深交所联合人民日报社《讽刺与幽默》、证券时报共同举办的 2021年第三届全国投教动漫大赛，正在火热进行中！';
      let imgUrl = '../assets/img/banner.png'
      let params = {
        "url": link
      }
      this.axios.get('https://app.cfbond.com/cfbond_app/Wx.getSignature.action',{params}).then(result => {
        let data = result.data;
        wx.config({
						debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来
						appId: data.appId, // 必填，公众号的唯一标识
						timestamp: data.timestamp, // 必填，生成签名的时间戳
						nonceStr: data.nonceStr, // 必填，生成签名的随机串
						signature: data.signature, // 必填，签名，见附录1
						jsApiList: [
							"onMenuShareTimeline",
							"onMenuShareAppMessage"
						] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
					});
					wx.error(function(res) {
						console.log(res)
						//alert(res);
					});
      })
      wx.ready(function(res) {
				wx.onMenuShareAppMessage({
					title:_title,
					desc: desc,
					link: link,
					imgUrl:imgUrl,
					trigger: function(res) {},
					success: function(res) {console.log(res)},
					cancel: function(res) {},
					fail: function(res) {console.log(res)}
				});
				wx.onMenuShareTimeline({
					title:_title ,
					desc: desc,
					link: link,
					imgUrl:imgUrl,
					trigger: function(res) {},
					success: function(res) {console.log(res)},
					cancel: function(res) {},
					fail: function(res) {console.log(res)}
				});
			});
    }
  },
  watch:{
    searchVal(val,oldVal){
      this.clearShow = val == '' ? false : true;
      this.tabShow = val == '' ? true : false;
    }
  }
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
  margin-top:-.7rem;
  text-align: center;
}

.action-img {
  width: 70%;
  -transform: translate(0px, -50%);
}

.action-content {
  width: 7rem;
  height: 6.4rem;
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
  margin-bottom:.2rem;
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
  margin: .4rem auto 0;
}
.searchBox{
  width:6.9rem;
  margin:0 .3rem .3rem;
  height:.8rem;
  background: #1F33C3;
  border-radius: .18rem;
  display: flex;
  align-items: center;
}
.searchBox .searchBtn{
  display:block;
  width:.28rem;
  height:.28rem;
  margin:0 .3rem 0 .4rem;
}
.searchBox .searchClear{
  display:block;
  width:.28rem;
  height:.28rem;
  margin:0 .3rem 0 .4rem;
}
.searchBox input{
  background:#1F33C3;
  height:.6rem;
  width:5rem;
  border:none;
  outline: none;
  color:#fff;
  font-size:16px;
}

.tab {
  overflow: hidden;
  width: 6.9rem;
  height: 0.36rem;
  line-height: 0.36rem;
  margin: 0 auto;
  border-radius: 0.18rem;
  font-size: 0.3rem;
  font-family: Alibaba PuHuiTi;
  font-weight: bold;
  list-style: none;
  color: #9DA9FF;
}

.tab li {
  width: 2.2rem;
  height: 100%;
  float: left;
  border-right:1px solid #9DA9FF; 
}
.tab li:last-child{
  border-right:none;
}

.tab-selected {
  color: #fff;
  font-weight:bold;
  /* background: linear-gradient(64deg, #4c57f5, #243ff5, #001cd7); */
}

.hasData{
  padding-bottom:1rem;
}
.works {
  width: 7.2rem;
  overflow: hidden;
  margin: 0.24rem auto 0;
  padding-bottom:0.5rem;
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
  color:#fff;
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
  padding: 0.2rem 0 1.31rem;
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
.disabled{
  color:#ccc;
  background:rgba(200,200,200,.3)
}
.noData{
  padding:1rem 0 6rem;
  text-align:center;
  color:#fff;
}
.noData p:first-child{
  font-size: .28rem;
  margin-bottom:.22rem;
}
.noData p:last-child{
  font-size: .24rem;
}
#openappBox{
  height:1rem;
  background:#F9F9F9;
  padding:0 .3rem;
  justify-content: space-between;align-items: center;
  display:flex;
  position:fixed;
  width:100%;
  box-sizing: border-box;
  z-index:9999;
}
.topBlank{padding-top:1rem;}
#openappBox img{width:2.76rem;height:auto;}
#openappBox button{
  
  background:url(http://specials.cfbond.com/static/images/appOpenBtn.png) no-repeat;
width:1.64rem;height:.62rem;border:none;background-size:100% 100%;outline:none;}

</style>
