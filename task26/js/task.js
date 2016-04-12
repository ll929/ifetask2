/**
 * Created by liulei on 2016/4/9.
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
     * 飞船
     */
    function matrixToDegree(matrix) {
        var matrixArr = matrix.split(/\(|,/);
        var degreeCos = matrixArr[1],
            degreeSin = matrixArr[2];
        var degree = Math.abs(Math.acos(degreeCos)/Math.PI*180);
        if(degreeCos<0 && degreeSin<0 || degreeCos>0 && degreeSin<0){
            degree = 360-degree;
        }
        return degree;
    }
    function animateFly(airship,id,action) {
        /*var cssRules = document.styleSheets[0].cssRules,
            styleSheets = document.styleSheets[0];*/
        var style = $("style"),
            reg1 = new RegExp("@-webkit-keyframes start"+id+".*?}}"),
            reg2 = new RegExp("@keyframes start"+id+".*?}}");
        var insert = function (startPosition,endPosition) {
            /*if(styleSheets.insertRule){
                styleSheets.insertRule("@keyframes start" +id+ "{" + "0%{transform: rotate("+startPosition+"deg)}100%{transform: rotate("+endPosition+"deg)}" + "}", id)
            }else if (styleSheets.addRule) {
                styleSheets.addRule("@keyframes start"+id, "0%{transform: rotate(90deg)}100%{transform: rotate(360deg)}", id);
            }*/
            style.html(style.html()
                +"@keyframes start" +id+ "{" + "0%{transform: rotate("+startPosition+"deg)}100%{transform: rotate("+endPosition+"deg)}" + "}"
                +"@-webkit-keyframes start" +id+ "{" + "0%{-webkit-transform: rotate("+startPosition+"deg)}100%{-webkit-transform: rotate("+endPosition+"deg)}" + "}"
            );
        };
        var remove = function () {
            /*if(styleSheets.deleteRule){
                styleSheets.deleteRule(id);
            }else if(styleSheets.removeRule) {
                styleSheets.removeRule(id);
            }*/
            style.html(style.html().replace(reg1,"").replace(reg2,""));
        };
//start
        if(action == "run"){
            if(!reg2.test(style.html())){
                insert(0,360);
            }
            airship.css({
                /*"animation-name":"start"+id,
                "animation-duration":"13s",
                "mozAnimation-duration":"13s",*/
                "-webkit-animation": "start"+id+" 13s infinite linear",
                "animation":"start"+id+" 13s infinite linear",
                "background":"url('./images/rocket_1.png') no-repeat"
            });
        }else if (action == "stop"){
            var endPosition = airship.css("transform");
            airship.css({
                "animation-name":"",
                "animation-duration":"",
                "transform":endPosition,
                "background":"url('./images/rocket_0.png') no-repeat"
            });
            //if(cssRules[id].name == "start"+id){
                remove();
           // }
            insert(matrixToDegree(endPosition),matrixToDegree(endPosition)+360);
        }else if (action == "destroy"){
            //if(cssRules[id].name == "start"+id){
                remove();
           // }
        }
    }

    var message = new Events();

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
        powerSystem :　function (action) {
            if(action == "run" && this.state == "stopping"){
                this.state = "running";
                var that = this;
                var consumeEnergy = function () {
                    //energyShow.html(that.energy);
                    var consume = setTimeout(consumeEnergy,250);
                    if(that.state == "stopping"){
                        clearTimeout(consume);
                        consume = null;
                    }
                    if(that.energy > 0){
                        that.energy--;
                    }else{
                        clearTimeout(consume);
                        consume = null;
                        that.powerSystem(false);
                    }
                };
                consumeEnergy();
                animateFly(this.airship,this.id,"run");
            }else if (action == "stop" && this.state == "running"){
                this.state = "stopping";
                animateFly(this.airship,this.id,"stop");
            }
        },
        receiveMessage : function () {
            var that = this;
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
                }

            })
        },
        energySystem : function () {
            var that = this,
                energyShow = this.airship.children().children(),
                add;
            var addEnergy = function () {
                //console.log(that.energy+":"+that.state);
                energyShow.html(that.energy);
                that.energy++;
                add = setTimeout(addEnergy,500);
                if(that.energy > 100){
                    that.energy = 100;
                }
            };
            addEnergy();
        },
        selfDestructSystem : function () {
            this.airship.remove();
/*            var cssRules = document.styleSheets[0].cssRules,
                styleSheets = document.styleSheets[0];
            if(cssRules[this.id].name == "start"+this.id){
                console.log(cssRules[this.id].name)
                if(styleSheets.deleteRule){
                    styleSheets.deleteRule(this.id);
                }else if(styleSheets.removeRule) {
                    styleSheets.removeRule(this.id);
                }
            }*/
            animateFly(this.airship,this.id,"destroy");
            this.state = "stopping";
        }
    };

    /**
     * 观察者与发布者
     */
    function Events() {
        var obj = {};
        this.listen = function (channel, eventfn) {
            if(obj[channel] != null){
                obj[channel].push(eventfn)
            }else {
                obj[channel] = [];
                obj[channel].push(eventfn)
            }
        };
        this.trigger = function (channel,data) {
            if(obj[channel] == null){
                obj[channel] == [];
            }
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
            console.log("丢包");
        }else {
            setTimeout(function () {message.trigger("china",data)},1000)
        }
    }
    /**
     * 指挥官
     */
    var commander = {
        airship : {
            length : 0
        },
        start : function (id) {
            var that = this;
            return $("<button class='start'>开始飞行</button>")
                .click(function () {
                    that.sentMessage({id:id,commond:"run"})
                })
        },
        stop : function (id) {
            var that = this;
            return $("<button class='stop'>停止飞行</button>")
                .click(function () {
                    that.sentMessage({id:id,commond:"stop"})
                })
        },
        destroy : function (id) {
            var that = this;
            return $("<button class='destroy'>自毁</button>")
                .click(function (e) {
                    that.sentMessage({id:id,commond:"destroy"})
                    $(this).parent().remove();
                    that.airship[id] = null;
                    --that.airship.length;
                })
        },
        createAirship : function () {
            var newAirship = $("#newAirship");
            var that = this;
            for (var i = 1;i<=4;i++){
                that.airship[i] = null;
            }
            newAirship.click(function () {
                var id;
                for (var key in that.airship){
                    if(that.airship[key] == null){
                        id = key;
                        break;
                    }
                }
                that.airship[id] = new Airship(id);
                that.airship[id].energySystem();
                that.airship[id].receiveMessage();
                var airshipSystem = $("#airshipSystem");
                var btn = $("<span>对"+id+"号飞船下达指令：</span>");
                airshipSystem.append($("<div></div>").append(btn).append(that.start(id)).append(that.stop(id)).append(that.destroy(id)));
            })
        },
        sentMessage : function (data) {
            mediator(data);
        }
    };
    commander.createAirship();
});