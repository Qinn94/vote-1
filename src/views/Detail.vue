<template>
  <div class="detail">
    <div v-if="false" id="openappBox">
      <img src="http://specials.cfbond.com/static/images/appOpenlogo.png">
      <button @click="goApp"></button>
    </div>
    <div class="title-fa">
      <div class="title">
        <p class="title-text">标题：{{ detail.title }}</p>
        <div class="title-line"></div>
      </div>
    </div>
    <div class="vote-fa">
      <div class="vote">
        <div>
          <p class="number">{{ detail.total }}</p>
          <p class="vote-text">票数</p>
        </div>
        <div class="vote-line"></div>
        <div>
          <p class="number ranking">{{rank }}</p>
          <p class="vote-text">排名</p>
        </div>
      </div>
    </div>

    <div class="vote-detail">
      <div v-html="detail.detail"></div>
      <p class="author">作者： {{ detail.author }}</p>
    </div>

    <div class="footer">
      <button
        class="vote-btn"
        :class="{ 'btn-disabled': btnDisabled }"
        :disabled="btnDisabled"
        @click="vote"
      >
        {{ btnDisabled ? "已投票" : "投票" }}
      </button>
    </div>
  </div>
</template>

<script>
import { MessageBox } from 'mint-ui';
export default {
  data() {
    return {
      detail: {},
      id: "",
      code:'',
      uid:'',
      rank:'',
      btnDisabled: false,
      flag:false,
      bannerHasBlank:false
    };
  },
  created() {
    // 获取作品id，然后调接口获取作品详情
    this.id = this.$route.query.id;
    this.code = this.$route.query.code;
    this.uid = this.$route.query.uid;
    this.rank = this.$route.query.rank;
    this.flag = this.$route.query.flag;
    this.btnDisabled = this.flag === 'true' ? true : false;
    this.bannerHasBlank = this.$route.query.blank === 'true' ? true : false;;
    this.getDetail();
  },
  mounted(){
    
  },
  methods: {
    //app跳转
    goApp (){
      var _url = window.location.href+'&share_forbid=1';
      // var _id = document.getElementsByTagName("meta")["contentid"].getAttribute("content");
      let _id = '';
      var _urlParam = "cfbond://com.cfbond.acfw/applinks?id="+_id+"&mode=2&url="+_url
      console.log(_url)
      if(navigator.userAgent.match(/android/gi)){
      window.location.href="https://a.app.qq.com/o/simple.jsp?pkgname=com.cfbond.acfw&android_schema="+encodeURIComponent(_urlParam )
      }else{
      window.location.href="https://a.app.qq.com/o/simple.jsp?pkgname=com.cfbond.acfw&ios_schema="+encodeURIComponent(_urlParam )
      }
    },
    vote() {
      if(this.btnDisabled) return;
      if(this.bannerHasBlank){
        MessageBox('','需返回上一页，打开中国财富APP进行投票');
        return;
      }
      // 投票以后调接口获取新票数和排名
      this.axios.post('/wealth/szse_vote',
      {
        org_id:this.id,
        code:this.code,
        uid:this.uid
      }
      // ,{
      //   headers:{
      //     'Content-Type':'application/x-www-form-urlencoded'
      //   }
      // }
      ).then(result => {
        if(result.data.code == 0){
          this.btnDisabled = true;
          this.getDetail()
        }else{
          MessageBox('',result.data.message)
        }
      })
    },
    getDetail(){
      this.axios.get('/wealth/szse_detail?org_id=' + this.id).then(result => {
        this.detail = result.data.data
      })
    }
  },
};
</script>


<style scoped>
.detail {
  background-color: #fff;
}

.title-fa {
  position: fixed;
  top: 0;
  width: 100%;
  background-color: #fff;
  height: 1.6rem;
}

.title {
  width: 6.69rem;
  margin: auto;
  border-bottom: 0.01rem dashed #dddddd;
}

.title-text {
  height: 1.5rem;
  line-height: 1.5rem;
  font-size: 0.44rem;
  font-family: Alibaba PuHuiTi;
  font-weight: 400;
  color: #222222;
}

.vote-fa {
  position: fixed;
  top: 1.51rem;
  width: 100%;
  height: 1.75rem;
  background-color: #fff;
}

.vote {
  display: flex;
  justify-content: space-between;
  box-sizing: border-box;
  width: 6.69rem;
  margin: auto;
  padding: 0.3rem 1.2rem;
  text-align: center;
}

.number {
  font-size: 0.46rem;
  font-family: SF Compact Display;
  font-weight: 500;
  color: #e42235;
}

.ranking {
  color: #2834bf;
}

.vote-line {
  /* width: 0.01rem; */
  height: 0.6rem;
  margin-top: 0.16rem;
  /* background-color: #ddd; */
  border-right: 0.01rem dashed #ddd;
}

.vote-text {
  margin-top: 0.12rem;
  font-size: 0.3rem;
  font-family: Alibaba PuHuiTi;
  font-weight: 300;
  color: #666666;
}

.vote-detail {
  width: 6.69rem;
  margin: 3.3rem auto 1.76rem;
}

.vote-img {
  width: 100%;
}

.author {
  font-size: 0.32rem;
  font-family: Alibaba PuHuiTi;
  font-weight: 300;
  color: #222222;
  line-height: 0.53rem;
}

.footer {
  position: fixed;
  bottom: 0;
  width: 7.49rem;
  margin-top: 0.5rem;
  border-top: 0.01rem solid #efefef;
  background-color: #fff;
}

.vote-btn {
  display: block;
  width: 3.24rem;
  height: 0.8rem;
  margin: 0.35rem auto;
  text-align: center;
  font-size: 0.36rem;
  font-family: Alibaba PuHuiTi;
  font-weight: bold;
  border: none;
  border-radius: 0.1rem;
  color: #fff;
  background: #1b227f;
}

.btn-disabled {
  background: #cccccc;
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
  top:0;
}
.topBlank{top:1rem;}
#openappBox img{width:2.76rem;height:auto;}
#openappBox button{
  
  background:url(http://specials.cfbond.com/static/images/appOpenBtn.png) no-repeat;
width:1.64rem;height:.62rem;border:none;background-size:100% 100%;outline:none;}
</style>