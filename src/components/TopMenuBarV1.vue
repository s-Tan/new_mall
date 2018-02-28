<template>
    <div class="top_menu_bar" :class="{'height-auto':heightAuto}">
        <div class="top_menu_more" v-show="isShowMore" :class="{'show-all':whiteSpaceNormal}">
            <div class="list_shadow"></div>
            <a href="javascript:;" class="more_btn" @click="showMoreClickEvent()"></a>
        </div>
        <div class="top_menu_list" :class="{'white-space-normal':whiteSpaceNormal}">
            <a href="javascript:;" class="btn" :class="{'nav-curr':(!item.url && !whiteSpaceNormal),'nav-curr-show-all':(!item.url && whiteSpaceNormal),'show-all':whiteSpaceNormal}" v-for="(item,inx) in navList" @click="getData(inx,item.url)">
                <span v-text="item.name"></span>
                <span class="today-new-num" v-show="item.name=='今日上新' && !whiteSpaceNormal && todayNewNum>0" v-text="todayNewNum"></span>
            </a>
        </div>
        <div class="top_menu_up" v-show="whiteSpaceNormal" :class="{'show-all':whiteSpaceNormal}" @click="showMoreClickEvent()"></div>
    </div>
</template>

<script>
export default {
  name: "topMenuBarV1",
  props: ["navList", "showAll", "todayNewNum"],
  data: function() {
    return {
      whiteSpaceNormal: this.showAll,
      heightAuto: this.showAll,
      currNav: 0,
      isShowMore: false
    };
  },
  methods: {
    getData: function(inx, url) {
      localStorage.setItem("lastresid", this.navList[inx].id || "0000");
      localStorage.removeItem("lastgid");

      this.hideMoreClickEvent();

      try {
        //debugger;
        var server = newMallTools.getPlatform().server;
        _czc.push([
          "_trackEvent",
          "toptab" + server,
          "点击" + (inx + 1),
          this.navList[inx].name
        ]);

        newMallTools.selfTjClick({
          position: "toptab" + server,
          actionFrom: "点击" + (inx + 1) + ":" + this.navList[inx].name
        });
      } catch (e) {}

      newMallTools.redirect(url);
    },
    showMoreClickEvent: function() {
      this.whiteSpaceNormal = !this.whiteSpaceNormal;
      this.heightAuto = !this.heightAuto;
    },
    hideMoreClickEvent: function() {
      this.whiteSpaceNormal = false;
      this.heightAuto = false;
    }
  },
  watch: {
    navList: function(newValue) {
      var that = this;

      this.$nextTick(function() {
        var scrollWidth = $(".top_menu_list")[0].scrollWidth;
        var clientWidth = $(".top_menu_list")[0].clientWidth;

        if (scrollWidth > clientWidth) {
          that.isShowMore = true;
        }

        var len = that.navList.length;
        for (var i = 0; i < len; i++) {
          if (that.navList[i].url == undefined) {
            that.currNav = i;
            break;
          }
        }

        if (that.currNav > 0) {
          var currNavObj = that.$el.querySelectorAll(".top_menu_list .btn")[
            that.currNav
          ];
          var currNavWidth = currNavObj.offsetWidth;
          var listObj = that.$el.querySelectorAll(".top_menu_list")[0];
          var listHalfWidth = parseInt(listObj.offsetWidth / 2);
          var currNavLeft = parseInt(currNavObj.offsetLeft - listHalfWidth);

          setTimeout(function() {
            listObj.scrollLeft = currNavLeft + currNavWidth;
          }, 100);
        }
      });

      var len = newValue.length;

      for (var i = 0; i < len; i++) {
        if (!newValue[i].url) {
          localStorage.setItem("lastpagename", newValue[i].name);
        }
      }
    }
  }
};
</script>

<style scoped>
.top_menu_bar {
  background: #fefefe;
  height: 37px;
  box-sizing: border-box;
  border-top: 1px solid #eee;
}

.top_menu_bar:after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 1px;
  background-image: -webkit-linear-gradient(
    top,
    transparent,
    transparent 40%,
    #eee 0
  );
  background-size: 100% 1px;
  background-position: bottom;
  background-repeat: no-repeat;
}
.top_menu_bar .top_menu_more {
  float: right;
  position: relative;
}
.top_menu_bar .top_menu_more.show-all {
  display: none;
}
.top_menu_bar .top_menu_more .list_shadow {
  left: -30px;
}
.top_menu_bar .top_menu_more .list_shadow {
  height: 108px;
}
.top_menu_bar .top_menu_more .list_shadow {
  width: 30px;
}
.top_menu_bar .top_menu_more .list_shadow {
  position: absolute;
  width: 10px;
  height: 36px;
  left: -10px; /*background: url(../img/shadow.png) no-repeat 100%;
        background-size: contain;
        background-color: rgba(244, 245, 246, .3);*/
}
.top_menu_bar .top_menu_more .more_btn {
  background-size: 60px;
}
.top_menu_bar .top_menu_more .more_btn {
  height: 108px;
}
.top_menu_bar .top_menu_more .more_btn {
  width: 120px;
}
.top_menu_bar .top_menu_more .more_btn {
  background: url(../imgs/more.png) no-repeat center center;
  display: block;
  width: 40px;
  height: 36px;
  background-size: 35px;
}
.top_menu_bar .top_menu_list {
  overflow: hidden;
  overflow-x: scroll;
  -webkit-overflow-scrolling: touch;
  white-space: nowrap;
}
.top_menu_bar .top_menu_list::-webkit-scrollbar {
  display: none;
  width: 0;
  height: 0;
  overflow-x: hidden;
  overflow: scroll;
}
.top_menu_bar .top_menu_list .btn {
  margin-bottom: 15px;
}
.top_menu_bar .top_menu_list .btn {
  margin-top: 15px;
}
.top_menu_bar .top_menu_list .btn {
  margin-left: 15px;
}
.top_menu_bar .top_menu_list .btn {
  height: 78px;
}
.top_menu_bar .top_menu_list .btn {
  line-height: 78px;
}
.top_menu_bar .top_menu_list .btn {
  font-size: 51px;
}
.top_menu_bar .top_menu_list .btn {
  padding-right: 30px;
}
.top_menu_bar .top_menu_list .btn {
  padding-left: 30px;
}
.top_menu_bar .top_menu_list .btn {
  white-space: nowrap;
  display: inline-block;
  padding: 0 15px;
  color: #505050;
  text-decoration: none;
  font-size: 17px;
  line-height: 26px;
  height: 26px;
  margin-left: 0px;
  margin-top: 5px;
  margin-bottom: 5px;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0.3);
  position: relative;
}
.top_menu_bar .top_menu_list .btn.show-all {
  background: #f0f0f0;
  border-radius: 1000px;
  width: 23%;
  text-align: center;
  font-size: 14px;
  color: #646464;
  margin: 0 3px 13px 3px;
  padding: 0 5px;
}
.top_menu_bar .top_menu_list::-webkit-scrollbar {
  display: none;
}
.top_menu_up {
  height: 24px;
  background: #efefef;
  text-align: center;
}
.top_menu_up::after {
  display: inline-block;
  content: "";
  border: 1px solid #999;
  width: 10px;
  height: 10px;
  border-bottom: none;
  border-right: none;
  transform: rotate(45deg);
  margin-top: 10px;
}
.btn {
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  -webkit-user-select: none;
}
.btn span:first-of-type {
  display: inline-block;
  width: 100%;
  overflow: hidden;
  font-size: 14px;
  font-weight: 500;
}
.nav-curr {
  color: #d43c31;
}
.nav-curr:after {
  content: "";
  border-bottom: 3px solid #d43c31;
  position: absolute;
  bottom: -5px;
  left: 0;
  width: 100%;
  height: 20px;
}
.nav-curr-show-all.show-all {
  background: #d43c31 !important;
  color: #fff !important;
}
.white-space-normal {
  padding: 10px 0 5px 0;
}
.today-new-num {
  position: absolute;
  top: -4px;
  left: 64px;
  background: url(../imgs/message.png) no-repeat left top;
  background-size: 100% 100%;
  color: #fff;
  font-size: 8px;
  padding: 2px 3px 0 3px;
  height: 13px;
  line-height: 8px;
}
.today-new-num:after {
  content: "件";
}
</style>