<template>
    <img :src="imgUrl" class="drag" id="dragimg">
</template>
<script>
var dragDivObj,objoW,objoH,oTop,oLeft,oL,oT,winH,returnBottom;

export default{
    name: 'drag',
    props: ['flowad'],
    data () {
        return {
            imgUrl:''
        }
    },
    methods:{
        getRTop: function(){
            var topObj = document.getElementsByClassName("to-top");
            winH = window.innerHeight;
            var bottomTop;
            if(topObj.length>0 && topObj[0].offsetTop !== 0){
                bottomTop = winH - topObj[0].offsetTop;
            }else{
                bottomTop = '100';
            }
            return bottomTop;
        },
        jump: function(){
            //debugger;
            try {
                var server = newMallTools.getPlatform().server;
                _czc.push(['_trackEvent', this.position + server, '点击', this.flowad[0].name]);

                newMallTools.selfTjClick({
                    position: this.position + server,
                    actionFrom: '点击' + (inx + 1) + ':' + this.flowad[0].name
                })
            } catch (e) {
            }
            try {
                var uri = this.flowad[0].uri;
                var resId = this.flowad[0].id;

                localStorage.setItem('lastresid', resId || '0000');
                localStorage.removeItem('lastgid');

                newMallTools.redirect(uri);
            } catch (e) {
                console.log(e);
            }
        },
        init () {
            var _me = this;
            if(_me.flowad.length>0){
                if(_me.flowad[0].image_uri){
                    _me.imgUrl = _me.flowad[0].image_uri;
                }
            }else{
                $('.drag').hide();
            }
            //获取初始化悬浮窗距离底部位置大小
            returnBottom = _me.getRTop();
            dragDivObj = document.getElementById('dragimg');
            
            setTimeout(function(){
                objoW = dragDivObj.offsetWidth;
                objoH = dragDivObj.offsetHeight;
                var maxW=document.body.clientWidth-objoW;
                var maxH=document.body.clientHeight-objoH;
                
                if(returnBottom){
                    dragDivObj.style.bottom = (Number(returnBottom)+10) +'px';
                }else{
                    dragDivObj.style.bottom = '110px';
                }
                dragDivObj.addEventListener('touchstart',function(e){
                    var ev = e || window.event;
                    var touch = ev.targetTouches[0];
                    oL = touch.clientX - dragDivObj.offsetLeft;
                    oT = touch.clientY - dragDivObj.offsetTop;
                    document.addEventListener("touchmove",defaultEvent(e),false);
                })

                dragDivObj.addEventListener('touchmove',function(e){
                    var ev = e || window.event;
                    ev.preventDefault();
                    var touch = ev.targetTouches[0];
                    winH = window.innerHeight;
                    oLeft = touch.clientX - oL;
                    oTop = touch.clientY - oT;
                    if(oLeft<0){
                        oLeft=5;
                    }else if (oLeft>=maxW) {
                        oLeft=maxW-5;
                    }
                    
                    if(oTop<0){
                        oTop=0;
                    }else if (oTop>=winH-objoH) {
                        console.log('进来了');
                        oTop=winH-objoH;
                    }
                    dragDivObj.style.left = oLeft + 'px';
                    dragDivObj.style.top =oTop+ 'px';

                })
                dragDivObj.addEventListener('touchend',function(e){ 
                    var ev = e || window.event;
                    ev.preventDefault();
                    if(oLeft>=maxW/2){
                        oLeft=maxW-5;
                    }else if(oLeft<maxW/2){
                        oLeft=5;
                    }
                    if(oTop<0){
                        oTop=0;
                    }else if (oTop>=winH-objoH) {
                        oTop=winH-objoH;
                    }
                    dragDivObj.style.left = oLeft + 'px';
                    dragDivObj.style.top = oTop + 'px';
                    document.removeEventListener("touchmove",function(e){
                        var ev = e || window.event;
                        ev.preventDefault();
                    });
                })
                dragDivObj.addEventListener("tap",function(e){
                    _me.jump()
                });
                function defaultEvent(e) {
                    e.preventDefault();
                }
                
            },1000); 
        }
    },
    watch: {
        flowad: function() {
            var _me = this;
            _me.$nextTick(function() {
                if(_me.flowad.length>0){
                    if(_me.flowad[0].image_uri){
                        _me.imgUrl = _me.flowad[0].image_uri;
                    }
                }else{
                    $('.drag').hide();
                }
                _me.init();
            });
        }
    }
}
</script>

<style>
    .drag {
        position: fixed;
        right: 5px;
        bottom: -160px;
        min-width: 60px;
        max-width: 100px;
        z-index: 999;
    }
</style>

