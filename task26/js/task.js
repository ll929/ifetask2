/**
 * Created by liulei on 2016/4/9.
 */

/**
 * 处理页面横屏和竖屏布局
 */
$(document).ready(function () {
    var cHeight = $(window).height(),
        cWidth = $(window).width(),
        commander = $("#commander"),
        information = $("#information");
    if(cHeight > cWidth) {
        commander.css({
            "bottom":0,
            "width":"100%",
            "height":"350px"
        });
        information.css({
            "top":0,
            "width":"100%",
            "height":"350px"
        });
    }
});
$(document).ready(function () {
    /**
     *正弦值和余弦值求角度
     * @param matrix transform获得的值
     * @returns {number} 角度
     */
    function matrixToDegree(matrix) {
        var matrixArr = matrix.split(/\(|,/);   //把matrix转化为数组
        var degreeCos = matrixArr[1],
            degreeSin = matrixArr[2];
        var degree = Math.abs(Math.acos(degreeCos)/Math.PI*180);
        if(degreeCos<0 && degreeSin<0 || degreeCos>0 && degreeSin<0){
            degree = 360-degree;
        }
        return degree;
    }

    /**
     * 飞船动画效果
     * @param airship 飞船实例
     * @param id  飞船id
     * @param action 飞船命令
     */
    function animateFly(airship,id,action) {
        var style = $("style"),
            reg1 = new RegExp("@-webkit-keyframes start"+id+".*?}}"), //匹配当前飞船的动画style
            reg2 = new RegExp("@keyframes start"+id+".*?}}");
        //向页面插入keyframes
        var insert = function (startPosition,endPosition) {
            style.html(style.html()
                +"@keyframes start" +id+ "{" + "0%{transform: rotate("+startPosition+"deg)}100%{transform: rotate("+endPosition+"deg)}" + "}"
                +"@-webkit-keyframes start" +id+ "{" + "0%{-webkit-transform: rotate("+startPosition+"deg)}100%{-webkit-transform: rotate("+endPosition+"deg)}" + "}"
            );
        };
        //移除页面keyframes
        var remove = function () {style.html(style.html().replace(reg1,"").replace(reg2,""))};
        switch (action){
            case "run":
                if(!reg2.test(style.html())){insert(0,360);}
                airship.css({
                    "-webkit-animation": "start"+id+" 13s infinite linear",
                    "animation":"start"+id+" 13s infinite linear",
                    "background":"url('./images/rocket_1.png') no-repeat"
                });
                break;
            case "stop":
                var endPosition = airship.css("transform");   //飞船停止时的位置
                airship.css({
                    "animation-name":"",
                    "animation-duration":"",
                    "transform":endPosition,
                    "background":"url('./images/rocket_0.png') no-repeat"
                });
                remove();
                insert(matrixToDegree(endPosition),matrixToDegree(endPosition)+360);
                break;
            case "destroy":
                remove();
                break;
        }
    }

    //监听与发布信息
    var message = new Events();
    //显示控制台信息
    var showMessage = new ShowCommondInformation();

    /**
     * 飞船
     * @param id 飞船id
     */
    function Airship(id) {
       this.id = id;
       this.state = "stopping";
       this.energy = 100;
       this.airship = (function (energy) {
           var space = $("#space");
           var airshipHtml = $("<div class='airship airship-"+id+"'><p class='energy'>"+id+"号-<span>"+energy+"</span>%</p></div>");
           space.append(airshipHtml);
           return airshipHtml;
       })(this.energy);
   }
    Airship.prototype = {
        //动力系统
        powerSystem :　function (action) {
            //如果当前接收到"run"指令且飞船是停止的
            if(action == "run" && this.state == "stopping"){
                this.state = "running";
                var that = this;
                var consumeEnergy = function () {
                    var consume = setTimeout(consumeEnergy,1000);
                    if(that.state == "stopping"){
                        clearTimeout(consume);
                        consume = null;
                    }
                    if(that.energy > 4){
                        that.energy-=4;
                    }else{
                        that.energy = 0;
                        clearTimeout(consume);
                        consume = null;
                        that.powerSystem("stop");
                    }
                };
                consumeEnergy();
                animateFly(this.airship,this.id,"run");
            }
            //如果当前接收到"stop"指令且飞船是运行的
            else if (action == "stop" && this.state == "running"){
                this.state = "stopping";
                animateFly(this.airship,this.id,"stop");
            }
        },
        //信息接收系统
        receiveMessage : function () {
            var that = this;
            //监听china频道
            message.listen("china",function (data) {
                if(data.id  == that.id){
                    switch (data.commond){
                        case "run":
                            that.powerSystem("run");
                            break;
                        case "stop":
                            that.powerSystem("stop");
                            break;
                        case "destroy":
                            that.selfDestructSystem();
                    }
                    console.info(data.id+"号飞船成功接收"+data.commond+"指令");
                    showMessage.info(data.id+"号飞船成功接收"+data.commond+"指令");
                }
            })
        },
        //能源系统
        energySystem : function () {
            var that = this,
                energyShow = this.airship.children().children();
            var addEnergy = function () {
                energyShow.html(that.energy);
                that.energy+=2;
                setTimeout(addEnergy,1000);
                that.energy > 100?that.energy = 100:void(0);
            };
            addEnergy();
        },
        //自爆系统
        selfDestructSystem : function () {
            this.airship.remove();
            animateFly(this.airship,this.id,"destroy");
            this.state = "stopping";
        }
    };

    /**
     * 监测信息
     */
    function Events() {
        var obj = {};
        /**
         * @param channel 监听信息频道
         * @param eventfn 回调函数
         */
        this.listen = function (channel, eventfn) {
            if(obj[channel] != null){
                obj[channel].push(eventfn)
            }else {
                obj[channel] = [];
                obj[channel].push(eventfn)
            }
        };
        /**
         * @param channel 发布信息频道
         * @param data 发布的信息数据
         */
        this.trigger = function (channel,data) {
            if(obj[channel] == null){obj[channel] == []}
            for (var i = 0;i < obj[channel].length;i++) {
                if (obj[channel][i].call(this,data) === false) {
                    return false;
                }
            }
        }
    }

    /**
     * 介质
     */
    function mediator(data) {
        var r = Math.random();
        if(r < 0.3){
            setTimeout(function () {
                console.warn("向"+data.id+"号飞船发送"+data.commond+"指令丢包");
                showMessage.warn("向"+data.id+"号飞船发送"+data.commond+"指令丢包")
            },500);
        }else {
            setTimeout(function () {message.trigger("china",data)},1000)
        }
    }
    /**
     * 指挥官
     */
    var commander = {
        airship : {
            id : 0,
            length : 0
        },
        //运行按钮
        run : function (id) {
            var that = this;
            return $("<button class='run'>开始飞行</button>")
                .click(function () {
                    that.sentMessage({id:id,commond:"run"})
                })
        },
        //停止按钮
        stop : function (id) {
            var that = this;
            return $("<button class='stop'>停止飞行</button>")
                .click(function () {
                    that.sentMessage({id:id,commond:"stop"})
                })
        },
        //自爆按钮
        destroy : function (id) {
            var that = this;
            return $("<button class='destroy'>自毁</button>")
                .click(function () {
                    that.sentMessage({id:id,commond:"destroy"});
                    $("#newAirship").show();
                    $(this).parent().remove();
                    delete that.airship[id];
                    that.airship.length--;
                })
        },
        //创建新飞船按钮
        createAirship : function () {
            var newAirship = $("#newAirship");
            var that = this;
            newAirship.click(function () {
                if(that.airship.length < 4){
                    var id = ++that.airship.id;
                    that.airship.length++;
                    that.airship[id] = new Airship(id);
                    that.airship[id].energySystem();
                    that.airship[id].receiveMessage();
                    console.log("创建"+id+"号飞船");
                    showMessage.log("创建"+id+"号飞船");
                    var airshipSystem = $("#airshipSystem");
                    var btn = $("<span>对"+id+"号飞船下达指令：</span>");
                    airshipSystem.append($("<div></div>").append(btn).append(that.run(id)).append(that.stop(id)).append(that.destroy(id)));
                    that.airship.length == 4?newAirship.hide():void(0);
                }
            })
        },
        //发送信息系统
        sentMessage : function (data) {
            mediator(data);
            console.log("向"+data.id+"号飞船发出"+data.commond+"指令");
            showMessage.log("向"+data.id+"号飞船发出"+data.commond+"指令");
        }
    };
    //监听创建飞船按钮
    commander.createAirship();
    /**
     * 模拟控制台输出信息
     */
    function ShowCommondInformation() {
        var parent = $("#commond-information");
        this.log = function (data) {
            parent.prepend($("<p class='log'>>"+data+"</p>"))
        };
        this.warn = function (data) {
            parent.prepend($("<p class='warn'>>"+data+"</p>"))
        };
        this.info = function (data) {
            parent.prepend($("<p class='info'>>"+data+"</p>"))
        }
    }
});