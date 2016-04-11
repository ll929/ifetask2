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

/**
 * 飞船
 */
$(document).ready(function () {
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
        var cssRules = document.styleSheets[0].cssRules,
            styleSheets = document.styleSheets[0];
        var insert = function (startPosition,endPosition) {
            if(styleSheets.insertRule){
                styleSheets.insertRule("@keyframes start" +id+ "{" + "0%{transform: rotate("+startPosition+"deg)}100%{transform: rotate("+endPosition+"deg)}" + "}", id)
            }else if (styleSheets.addRule) {
                styleSheets.addRule("@keyframes start"+id, "0%{transform: rotate(90deg)}100%{transform: rotate(360deg)}", id);
            }
        };
        var remove = function () {
            if(styleSheets.deleteRule){
                styleSheets.deleteRule(id);
            }else if(styleSheets.removeRule) {
                styleSheets.removeRule(id);
            }
        };
//start
        if(action == "run"){console.log(id)
            if(cssRules[id].name != "start"+id){
                insert(0,360);
            }
            airship.css({
                "animation-name":"start"+id,
                "animation-duration":"13s",
                "mozAnimationDuration":"13s"
            });
        }else if (action == "stop"){
            var endPosition = airship.css("transform");
            airship.css({
                "animation-name":"",
                "animation-duration":"",
                "transform":endPosition
            });
            if(cssRules[id].name == "start"+id){
                remove();
            }
            insert(matrixToDegree(endPosition),matrixToDegree(endPosition)+360);
        }else if (action == "destroy"){
            if(cssRules[id].name == "start"+id){
                remove();
            }
        }
    }
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
            if(action && this.state == "stopping"){
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
            }else if (!action && this.state == "running"){
                this.state = "stopping";
                animateFly(this.airship,this.id,"stop");
            }
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
            var cssRules = document.styleSheets[0].cssRules,
                styleSheets = document.styleSheets[0];
            if(cssRules[this.id].name == "start"+this.id){
                console.log(cssRules[this.id].name)
                if(styleSheets.deleteRule){
                    styleSheets.deleteRule(this.id);
                }else if(styleSheets.removeRule) {
                    styleSheets.removeRule(this.id);
                }
            }
            //animateFly(this.airship,this.id,"remove");
        }
    };
    window.Airship = Airship;
});
/**
 * 指挥官
 */
$(document).ready(function () {
    var commander = {
        airship : {
            length : 0
        },
        start : function (id) {
            var that = this;
            return $("<button class='start'>开始飞行</button>")
                .click(function () {
                    that.airship[id].powerSystem(true);
                })
        },
        stop : function (id) {
            var that = this;
            return $("<button class='stop'>停止飞行</button>")
                .click(function () {
                    that.airship[id].powerSystem(false);
                })
        },
        destroy : function (id) {
            var that = this;
            return $("<button class='destroy'>自毁</button>")
                .click(function (e) {
                    that.airship[id].selfDestructSystem();
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
                var airshipSystem = $("#airshipSystem");
                var btn = $("<span>对"+id+"号飞船下达指令：</span>");
                airshipSystem.append($("<div></div>").append(btn).append(that.start(id)).append(that.stop(id)).append(that.destroy(id)));
            })
        }
    };
    commander.createAirship();
});