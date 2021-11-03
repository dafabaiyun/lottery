<template>
  <div class="bg" style="overflow:hidden">
    <canvas ref="cloudCanvas" id="cloudCanvas"></canvas>
    <div class="clickButton mountain" @click="showPrice('mountain')" :style="{opacity:opacity}">爪哇山</div>
    <div class="clickButton village" @click="showPrice('village')" :style="{opacity:opacity}">爪哇村</div>
    <div class="clickButton river" @click="showPrice('river')" :style="{opacity:opacity}">爪哇河</div>
    <div class="clickButton secret" @click="turnTo" :style="{'padding':'30px 40px 48px 40px',opacity:opacity}">神秘画卷
    </div>
    <div id="showPrice" v-show="show">
      <div class="success" v-if="judgePrice">恭喜你，获得{{price}}等奖</div>
      <div class="fail" v-else>很遗憾，您未中奖</div>
    </div>
    <div id="specialShowPrice" v-show="showSectry">
      <canvas id="canvas" ref="myCanvas" style="background:#f0e7d8"></canvas>
      <div class="specialTitle" @click.once="specialChange">{{specilTit}}</div>
    </div>
  </div>
</template>

<script>
  import $ from "jquery"
  import {
    MessageBox
  } from 'element-ui';
  import {
    Toast
  } from 'vant/lib/toast';
  export default {
    data: function () {
      return {
        show: false,
        showSectry: false,
        price: "三",
        judge: true,
        token: '',
        judgePrice: false,
        specialTitle: "点我",
        ctx: "",
        specilTit: "点击此处完成作画",
        flag: '',
        count: 0,
        opacity: 0,
        isiOS: false
      }
    },
    watch: {
      opacity(n, o) {
        if (n > 3) {
          window.cancelAnimationFrame(this.cloud)
        }
      }
    },
    methods: {
      async showPrice(point) {
        if (this.judgeWherter()) {
          return;
        }
        // console.log(point)
        //发起中奖接口
        await this.getPrice();
        // console.log("1秒后")
        this.show = true;
        if (point == "mountain") {
          //没中奖了的话
          if (!this.judgePrice) {
            $("#showPrice").css({
              "backgroundImage": 'url("https://lottery-1302674052.cos-website.ap-guangzhou.myqcloud.com/static/m_fail.gif")',
            })
          } else {
            $("#showPrice").css({
              "backgroundImage": 'url("https://lottery-1302674052.cos-website.ap-guangzhou.myqcloud.com/static/m_success.gif")',
            })
          }
        } else if (point == "village") {
          if (!this.judgePrice) {
            $("#showPrice").css({
              "backgroundImage": 'url("https://lottery-1302674052.cos-website.ap-guangzhou.myqcloud.com/static/v_fail.gif")',
            })
          } else {
            $("#showPrice").css({
              "backgroundImage": 'url("https://lottery-1302674052.cos-website.ap-guangzhou.myqcloud.com/static/v_success.gif")',
            })
          }
        } else if (point == "river") {
          if (!this.judgePrice) {
            $("#showPrice").css({
              "backgroundImage": 'url("https://lottery-1302674052.cos-website.ap-guangzhou.myqcloud.com/static/r_fail.gif")',
            })
          } else {
            $("#showPrice").css({
              "backgroundImage": 'url("https://lottery-1302674052.cos-website.ap-guangzhou.myqcloud.com/static/r_success.gif")',
            })
          }
        }
        $("#showPrice").css({

          "background-repeat": "no-repeat",
          "background-size": "100% 100%",
        })
      },
      getPrice() {
        return new Promise((resolve, reject) => {
          // let sino = parseInt(Math.random() * 6 +1)
          // let flag = window.localStorage.getItem("flag")
          let time = window.localStorage.getItem("time")
          // console.log("time:" + time)
          let endTime = Math.round(new Date().getTime() - time) / (1000 * 60)
          // console.log(!flag )
          // flag = false
          // if (endTime > 5) {
          // debugger
          this.$axios.defaults.headers.common['Authorization'] = this.token
          this.$axios.post("/begin")
            .then(res => {
              // console.log(res)
              let data = res.data;
              // window.localStorage.setItem("flag", data.lotteried);
              window.localStorage.setItem("time", (new Date()).getTime());
              this.price = data.prizeGrade;
              this.judgePrice = data.winning;
              localStorage.setItem('flag', 1);;
              localStorage.setItem('price', this.price)
              resolve(res)
            })
        })
      },

      turnTo() {
        this.showSectry = true;
      },
      async specialChange() {
        // console.log(1111)
        await this.getPrice();
        if (!this.judgePrice) {
          this.specilTit = "很遗憾，你没有中奖"
        } else {
          this.specilTit = `恭喜你获得${this.price}等奖`
        }
      },
      failLottery() {
        // window.location.reload();
      },
      judgeWherter() {
        if (localStorage.getItem('flag')) {
          let price = localStorage.getItem('price')
          let message = ''
          if (price == 4) {
            message = "您已经抽奖，但很遗憾未中奖"
          } else {
            message = `您已经抽奖，恭喜你获得${price}等奖`
          }
          this.$toast({
            type: "fail",
            message,
            className: "fail",
            onOpened: function () {
              // window.location.reload()
            },
            duration: 7000
          })
          // window.location.reload()
          this.flag = '111'
          return true;
        }
      },
      paint() {
        // 获得整个屏幕的长和宽
        let width = document.documentElement.clientWidth;
        let height = document.documentElement.clientHeight;
        // console.log(width, height)
        // console.log(width,height)
        var canvas = this.$refs.myCanvas;
        this.ctx = canvas.getContext("2d");
        canvas.width = width / 100 * 56.93
        canvas.height = height / 100 * 57.3
        // console.log(canvas)
        // console.log(ctx)
        let flag = true;
        this.ctx.lineWidth = 1.0;
        canvas.addEventListener('touchstart', (e) => {
          // console.log("开始触摸！")
          let touch = e.targetTouches[0];
          // console.log(e)
          this.ctx.beginPath();
          this.ctx.moveTo(touch.clientX - canvas.offsetLeft, touch.clientY - canvas.offsetTop);
          canvas.addEventListener('touchmove', (e) => {
            // console.log("开始移动")
            // console.log(e)
            if (e.targetTouches.length === 1) {
              let touch = e.targetTouches[0];
              this.ctx.lineTo(touch.clientX - canvas.offsetLeft, touch.clientY - canvas.offsetTop);
              this.ctx.stroke();
            }

          }, false)
          canvas.addEventListener('touchend', (e) => {
            this.ctx.closePath();
            // console.log("我没了")
          }, false)
        }, false)
      },
      judgeLogin() {
        const self = this;
        if (localStorage.getItem('token')) {
          let time = window.localStorage.getItem("time")
          // console.log("time:"+time)
          let endTime = Math.round(new Date().getTime() - time) / (1000 * 60);
          if (endTime > 5) {
            localStorage.clear()
          } else {
            // debugger
            this.token = localStorage.getItem('token')
            if(this.isiOS){
              this.opacity = 1
              $(".bg").eq(0).css({
                "backgroundImage": 'url("https://lottery-1302674052.cos-website.ap-guangzhou.myqcloud.com/static/抽奖.jpg")',
              })
              // let bg = document.getElementsByClassName("bg")[0];
              // bg.style.backgroundImage = "https://lottery-1302674052.cos-website.ap-guangzhou.myqcloud.com/static/抽奖.jpg"
            }else{
              self.cloud();
            }
          }
        } else {
          this.$msgbox.prompt("请输入你的手机号码(手机号码仅用于兑奖使用)", '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              inputPattern: /^1[3456789]\d{9}$/,
              inputErrorMessage: '格式不正确',
              confirmButtonClass: "confirmButton",
              customClass: "messageBox",
              center: true,
              showClose: false
            })
            .then(({
              value
            }) => {
              this.$axios.get("/login?phone=" + value)
                .then(res => {
                  // if(res.d)
                  // self.token = res.data;

                  let data = res.data;
                  // console.log(JSON.parse(JSON.stringify(data)))
                  // debugger
                  if (data.code === 200) {
                    self.token = data.message;
                    localStorage.setItem('token', data.message);

                    localStorage.setItem('time', new Date().getTime())
                    // debugger
                    if(this.isiOS){
                      this.opacity = 1
                      $(".bg").eq(0).css({
                        "backgroundImage": 'url("https://lottery-1302674052.cos-website.ap-guangzhou.myqcloud.com/static/抽奖.jpg")',
                      })
                    }else{
                      this.cloud();
                    }
                    
                  } else {
                    this.$toast({
                      type: "fail",
                      message: "登录失败,请勿重复抽奖",
                      className: "fail",
                      onOpened: function () {
                        // window.location.reload()
                      },
                      duration: 7000
                    })
                  }
                  // console.log(res)
                })
            })
            .catch(() => {
              // window.location.reload() 
            });
        }
      },
      cloud() {
        let width = document.documentElement.clientWidth;
        let height = document.documentElement.clientHeight;
        let canvas = this.$refs.cloudCanvas;
        let ctx = canvas.getContext('2d');
        let img = new Image();
        let imgMark = new Image();
        img.src = "https://lottery-1302674052.cos-website.ap-guangzhou.myqcloud.com/static/img/main-center-med-1.png"
        imgMark.src = 'https://lottery-1302674052.cos-website.ap-guangzhou.myqcloud.com/static/抽奖.jpg'
        let maskX = (canvas.width - (70 + this.count)) / 2,
          maskY = (canvas.height - (40 + this.count)) / 2;
        imgMark.onload = (() => {
          canvas.width = imgMark.width;
          canvas.height = imgMark.height
          // debugger
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.globalCompositeOperation = "source-over";
          // this.drawImageIOSFix(ctx,img, maskX, maskY, 70 + this.count, 40 + this.count)
          ctx.drawImage(img, maskX, maskY, 70 + this.count, 40 + this.count)
          // ctx.drawImage();
          // debugger
          // let imgRect = this.coverImg(width,height,imgMark.width,imgMark.height);
          // console.log(imgRect)
          ctx.globalCompositeOperation = "source-in";
          // this.drawImageIOSFix(ctx,imgMark, 0, 0, imgMark.naturalWidth, imgMark.naturalHeight);
          ctx.drawImage(imgMark, 0, 0, imgMark.naturalWidth, imgMark.naturalHeight)

          this.opacity += 0.005
          ctx.globalAlpha = this.opacity
          this.count += 20;
          // console.log(width,height)
          window.requestAnimationFrame(this.cloud);
        })
      },
      detectVerticalSquash(img) {
        var iw = img.naturalWidth,
          ih = img.naturalHeight;
        var canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = ih;
        var ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        var data = ctx.getImageData(0, 0, 1, ih).data;
        // search image edge pixel position in case it is squashed vertically.
        var sy = 0;
        var ey = ih;
        var py = ih;
        while (py > sy) {
          var alpha = data[(py - 1) * 4 + 3];
          if (alpha === 0) {
            ey = py;
          } else {
            sy = py;
          }
          py = (ey + sy) >> 1;
        }
        var ratio = (py / ih);
        return (ratio === 0) ? 1 : ratio;
      },

      /**
       * A replacement for context.drawImage
       * (args are for source and destination).
       */
      drawImageIOSFix(ctx, img, sx, sy, sw, sh, dx, dy, dw, dh) {
        var vertSquashRatio = this.detectVerticalSquash(img);
        // Works only if whole image is displayed:
        // ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh / vertSquashRatio);
        // The following works correct also when only a part of the image is displayed:
        ctx.drawImage(img, sx * vertSquashRatio, sy * vertSquashRatio,
          sw * vertSquashRatio, sh * vertSquashRatio,
          dx, dy, dw, dh);
      }
    },
    async mounted() {
      // this.loading()
      let u = navigator.userAgent;
      await this.judgeLogin();
      // navigator.language = "zh-CN"
      // var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
      this.isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
      if (this.judgeWherter()) {
        return;
      }

      
      // debugger
      // 云雾动画

      // 作图
      await this.paint()

    }
  }

</script>

<style scoped>
  .bg {
    display: flex;
    position: relative;
    width: 100vw;
    height: 100vh;
    /* background-image: url("https://lottery-1302674052.cos-website.ap-guangzhou.myqcloud.com/static/抽奖.jpg"); */
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
  }

  .clickButton {
    width: 30px;
    height: 60px;
    padding: 20px 20px 20px 20px;
    text-align: center;
    /* background-color: #f2e2c0; */
    background-image: url("https://lottery-1302674052.cos-website.ap-guangzhou.myqcloud.com/static/地点框.png");
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    font-size: 1.6rem;
  }

  .mountain {
    position: absolute;
    right: 10vw;
    top: 8vh;
  }

  .village {
    position: absolute;
    right: 27vw;
    top: 23vh;
  }

  .river {
    position: absolute;
    left: 10vw;
    top: 30vh;
  }

  .secret {
    position: absolute;
    left: 20vw;
    top: 53vh;
  }

  #showPrice {
    display: flex;
    position: absolute;
    justify-content: center;
    width: 100vw;
    height: 100vh;
    /* background-color: #f2e2c0; */
    animation: show 1s ease;
    z-index: 10;
  }

  #specialShowPrice {
    display: flex;
    position: absolute;
    justify-content: center;
    width: 100vw;
    height: 100vh;
    /* background-color:#dbcfc2; */
    background-image: url("https://lottery-1302674052.cos-website.ap-guangzhou.myqcloud.com/static/手写板.jpg");
    background-repeat: no-repeat;
    background-size: 100% 100%;
    background-color: #d7c9bc;
    background-position: center;
    /* animation: show 1s ease; */
    z-index: 10;
  }

  #showPrice>div {
    position: absolute;
    bottom: 15vh;
    text-align: center;
    margin: 0 auto;
    font-size: 2.2rem;
  }

  @keyframes show {
    0% {
      opacity: 0;

    }

    25% {
      /* scale: 0.25; */
      /* transform: rotate(360deg) scale(0.25); */
      opacity: 0.25;
    }

    50% {
      /* scale: 0.5; */
      /* transform: rotate(720deg) scale(0.5); */
      opacity: 0.5;
    }

    75% {
      /* scale: 0.75; */
      /* transform: rotate(540deg) scale(0.75); */
      opacity: 0.75;
    }

    100% {
      /* scale: 1; */
      /* transform: rotate(720deg) scale(1); */
      opacity: 1;
    }
  }

  #canvas {
    position: absolute;
    top: 23.3vh;
    background: #fff;
    /* width: 59.3vw;
  height: 58vh; */
  }

  .specialTitle {
    position: absolute;
    bottom: 8vh;
    font-size: 2.2rem;
  }

  #cloudCanvas {
    width: 100vw;
    max-width: 100%;
    height: 100%;
    display: block;
    /* position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%); */
    cursor: pointer;
  }

</style>
<style>
  .confirmButton {
    background-color: #fff !important;
    border-color: #DCDFE6 !important;
  }

  .messageBox {
    width: 100vw !important;
  }

  .van-icon {
    color: #fff !important;
  }

  .van-toast__text {
    color: #fff !important;
  }

</style>
