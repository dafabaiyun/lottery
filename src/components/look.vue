<!--
 * @Author: army liu
 * @Date: 2020-11-02 22:10:14
 * @LastEditors: army liu
 * @LastEditTime: 2020-11-03 11:08:11
 * @FilePath: \lottery\src\components\look.vue
-->
<template>
  <div class="container">
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh" style="color:#000">
    <div class="loginUser" style="margin:20px 0">
      <span>一共有{{loginUser.length}}个手机号参与抽奖</span>
    </div>
    <div class="loginUser">
      <div style="margin:10px 0">中奖手机号：</div>
      <div style="margin:5px 0" v-for="(item,index) in  winningUsers" :key="index">{{index}}：{{item.phone}}
        ---{{item.price}}等奖</div>
    </div>
    </van-pull-refresh>
  </div>
</template>

<script>
  import axios from 'axios';
  import {
    Toast
  } from 'vant/lib/toast';
  export default {
    data() {
      return {
        loginUser: [],
        winningUsers: [],
        count: 0,
        isLoading: false,
      }
    },
    created() {
      this.getLoginUser()
      this.getWinningUsers();
    //   this.getPrizePool()
    },
    methods: {
      async getLoginUser() {
        axios({
            url: '/monitor/loginUsers',
            method: "get"
          })
          .then(res => {
            this.loginUser = Object.values(res.data);
            // console.log(obj)
            // let arr = []
            // for(let value of obj){
            //     console.log(Array.from( value))
            // }
            // this.loginUser = arr;
            // console.log(arr)
          })
      },
      async getWinningUsers() {
        axios({
            url: '/monitor/winningUsers',
            method: "get"
          })
          .then(res => {
            console.log(res.data)
            let phone = Object.keys(res.data);
            let price = Object.values(res.data);
            let arr = []
            for (let i = 0; i < phone.length; i++) {
              let obj = {
                phone: phone[i],
                price: price[i]
              }
              arr.push(obj);
              // console.log(arr);

            }
            this.winningUsers = arr
          })
      },
      async onRefresh() {
          await this.getLoginUser();
          await this.getWinningUsers();
          this.isLoading = false
          this.$toast.success("刷新成功")
      },
      // getPrizePool(){
      //     axios({
      //         url:'/monitor/prizePool',
      //         method:"get"
      //     })
      //     .then( res => {
      //         console.log(res)
      //     })
      // }
    }
  }

</script>

<style scoped>
  .container {
    display: flex;
    flex-direction: column;
    /* justify-content: center; */
    align-items: center;
    width: 100vw;
    min-height: 100vh;
    height: auto;
    color: #000;
    font-size: 20px;
  }

  .loginUser {
    width: 80vw;
  }

</style>
<style>
.van-toast__text{
  color: #fff !important;
}
.van-icon{
  color: #fff !important;
}
</style>