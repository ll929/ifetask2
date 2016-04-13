/**
 * Created by liulei on 2016/4/9.
 */
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
    function animateFly(airship,id,action,speed) {
        var style = $("style"),
            reg1 = new RegExp("@-webkit-keyframes start"+id+".*?}}"), //匹配当前飞船的动画style
            reg2 = new RegExp("@keyframes start"+id+".*?}}");
        //高中公式
        var GM = 3375000;
        var radius = Math.floor(GM/(speed*speed));
        var cycle = Math.floor(2*Math.PI*radius/speed);
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
                    "-webkit-animation": "start"+id+" "+cycle+"s infinite linear",
                    "animation":"start"+id+" "+cycle+"s infinite linear",
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
    function Airship(id,speed,energyC,energyS,powerModel,energyModel) {
        this.id = id;
        this.powerModel = powerModel;
        this.energyModel = energyModel;
        this.speed = speed;
        this.energyS = energyS;
        this.energyC = energyC;
        this.state = "stopping";
        this.energy = 100;
        this.airship = (function (fullEnergy) {
           var space = $("#space");
           var airshipHtml = $("<div class='airship airship-"+id+"'><p class='energy'>"+id+"号-<span>"+fullEnergy+"</span>%</p></div>");
            //高中公式
            var GM = 3375000;
            var radius = Math.floor(GM/(speed*speed));
            airshipHtml.css({
                "width":(2*radius)+"px",
                "height":(2*radius)+"px",
                "margin-left":(-radius)+"px",
                "margin-top":(-radius)+"px"
            });
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
                    if(that.energy > that.energyC){
                        that.energy-=that.energyC;
                    }else{
                        that.energy = 0;
                        clearTimeout(consume);
                        consume = null;
                        that.powerSystem("stop");
                    }
                };
                consumeEnergy();
                animateFly(this.airship,this.id,"run",this.speed);
            }
            //如果当前接收到"stop"指令且飞船是运行的
            else if (action == "stop" && this.state == "running"){
                this.state = "stopping";
                animateFly(this.airship,this.id,"stop");
            }
        },
        //进制转换
        adapter : function (data,toHex) {
            if(toHex == 10){
                var id = parseInt(data.substr(0,data.length-4),2).toString(10),
                    commond = data.substr(-4);
                var jsonData = {
                    id : id
                };
                switch (commond){
                    case "0001":
                        jsonData.commond ="run";
                        break;
                    case "0010":
                        jsonData.commond ="stop";
                        break;
                    case "1110":
                        jsonData.commond ="destroy";
                        break;
                }
                return jsonData;
            }else if (toHex == 2){
                var binaryData = "";
                var id = this.id.toString(2);
                binaryData+=(Array(4).join(0) + id).slice(-4);
                switch (this.state){
                    case "running":
                        binaryData+="0001";
                        break;
                    case "stopping":
                        binaryData+="0010"
                        break;
                    default:
                        binaryData+="0010"
                        break;
                }
                binaryData+=(Array(8).join(0) + this.energy.toString(2)).slice(-8);
                return binaryData;
            }
        },
        //信息接收系统
        receiveMessage : function () {
            var that = this;
            //监听china频道
            message.listen("china",function (data) {
                var adapter = that.adapter(data,10);
                if(adapter.id  == that.id){
                    switch (adapter.commond){
                        case "run":
                            that.powerSystem("run");
                            break;
                        case "stop":
                            that.powerSystem("stop");
                            break;
                        case "destroy":
                            that.selfDestructSystem();
                    }
                    console.info(adapter.id+"号飞船成功接收"+adapter.commond+"指令");
                    showMessage.info(adapter.id+"号飞船成功接收"+adapter.commond+"指令");
                }
            })
        },
        //发送信息
        sentMessage : function () {
            var data = {};
            var that = this;
            function ssid() {
                data={
                    id : that.id,
                    state : that.state,
                    energy : that.energy
                };
                var adapter = that.adapter(data,2);
                BUS(adapter,"toPlanet");
                var ss = setTimeout(ssid,1000);
                if(that.state == "none"){
                    clearTimeout(ss)
                }
            }
            ssid();
        },
        //能源系统
        energySystem : function () {
            var that = this,
                energyShow = this.airship.children().children();
            var addEnergy = function () {
                energyShow.html(that.energy);
                that.energy+=that.energyS;
                var add = setTimeout(addEnergy,1000);
                if(that.state == "none"){
                    clearTimeout(add);
                }
                that.energy > 100?that.energy = 100:void(0);
            };
            addEnergy();
        },
        //自爆系统
        selfDestructSystem : function () {
            this.airship.remove();
            animateFly(this.airship,this.id,"destroy");
            this.state = "none";
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
    function BUS(data,dir) {
        var r = Math.random();
        if(dir == "toSpace"){
            if(r < 0.1){
                setTimeout(function () {
                    console.warn("向飞船发送"+data+"指令丢包");
                    showMessage.warn("向飞船发送"+data+"指令丢包");
                    console.log("尝试重新向飞船发送"+data+"指令");
                    showMessage.log("尝试重新向飞船发送"+data+"指令");
                    BUS(data,dir)
                },300);
            }else {
                setTimeout(function () {message.trigger("china",data)},300)
            }
        }else if(dir == "toPlanet"){
            if(r < 0.1){
                setTimeout(function () {BUS(data,dir)},300);
            }else {
                setTimeout(function () {message.trigger("space",data)},300)
            }
        }

    }
    /**
     * 指挥官
     */
    var commander = {
        airship : {
            length : 0
        },
        power : {
            "前进号" : {"速度":115,"能耗":5},
            "奔腾号" : {"速度":130,"能耗":6},
            "超越号" : {"速度":150,"能耗":8}
        },
        energy : {
            "劲量型" : {"补能":2},
            "光能型" : {"补能":3},
            "永久型" : {"补能":4}
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
                    $($("#showStateTable tbody").children()[id]).children().remove();
                    that.airship[id] = null;
                    that.airship.length--;
                })
        },
        //创建新飞船按钮
        createSelectSystem : function () {
            var selectPower = $("#selectSystem>.powerBox>label>div"),
                selectEnergy = $("#selectSystem>.energyBox>label>div"),
                selectPowerHtml = "",selectEnergyPower = "";
            for (var key in this.power){
                selectPowerHtml+="<p><input type='radio' value='"+key+"' name='power'>"+key+"(速度"+this.power[key]["速度"]+"px/s，能耗"+this.power[key]["能耗"]+"%/s)</p>"
            }
            for (var key in this.energy){
                selectEnergyPower+="<p><input type='radio' value='"+key+"' name='energy'>"+key+"(补充能速度"+this.energy[key]["补能"]+"%/s)</p>"
            }
            selectPower.html(selectPowerHtml);
            selectEnergy.html(selectEnergyPower);
        },
        createAirship : function () {
            var newAirship = $("#newAirship");
            var that = this;
            for(var i=1;i<=4;i++){
                this.airship[i] = null;
            }
            newAirship.click(function () {
                var power = $("#selectSystem input[name='power']:checked").val(),
                    energy= $("#selectSystem input[name='energy']:checked").val();
                if(power && energy){
                    var id;
                    for (var i = 1;i<=4;i++){
                        if(!that.airship[i]){
                            id = i;
                            break;
                        }
                    }
                    that.airship.length++;
                    that.airship[id] = new Airship(id,that.power[power]["速度"],that.power[power]["能耗"],that.energy[energy]["补能"],power,energy);
                    that.airship[id].energySystem();
                    that.airship[id].receiveMessage();
                    that.airship[id].sentMessage();
                    console.log("创建"+id+"号飞船<br>动力系统："+power+"<br>能源系统："+energy);
                    showMessage.log("创建"+id+"号飞船<br>>>>动力系统："+power+"<br>>>>能源系统："+energy);
                    var airshipSystem = $("#airshipSystem");
                    var btn = $("<span>对"+id+"号飞船下达指令：</span>");
                    airshipSystem.append($("<div></div>").append(btn).append(that.run(id)).append(that.stop(id)).append(that.destroy(id)));
                    that.airship.length == 4?newAirship.hide():void(0);
                }else if(!power && !energy){
                    alert("请选择动力和能源系统！")
                }else if (!power && energy){
                    alert("请选择动力系统！")
                }else if (power && !energy){
                    alert("请选择能源系统！")
                }
            })
        },
        //进制转换
        adapter : function (data,toHex) {
            if(toHex == 2){
                var binaryData = data.id.toString(2);
                switch (data.commond){
                    case "run":
                        binaryData+="0001";
                        break;
                    case "stop":
                        binaryData+="0010";
                        break;
                    case "destroy":
                        binaryData+="1110";
                        break;
                }
                return binaryData;
            }else if(toHex == 10){

            }
        },
        //发送信息系统
        sentMessage : function (data) {
            var adapter = this.adapter(data,2);
            BUS(adapter,"toSpace");
            console.log(">>Adapter转换指令为"+adapter+"<br>向"+data.id+"号飞船发出"+data.commond+"指令");
            showMessage.log(">>Adapter转换指令为"+adapter+"<br>向"+data.id+"号飞船发出"+data.commond+"指令");
        },
        //信息处理系统
        showMessage : function () {
            var that = this;
            var showStateTable = $("#showStateTable tbody"),td;
            var jsonData = {};
            message.listen("space",function (data) {
                var id = parseInt(data.substr(0,4),2).toString(10),
                    energy = parseInt(data.substr(9,8),2).toString(10),
                    powerModel,
                    energyModel,
                    state;
                if(that.airship[id]){
                    powerModel = that.airship[id].powerModel;
                    energyModel = that.airship[id].energyModel;
                }
                if(powerModel && energyModel){
                    state = data.substr(4,4) == "0001"?"running":"stopping";
                    jsonData = {
                        id : id,
                        powerModel : powerModel,
                        energyModel : energyModel,
                        energy : energy,
                        state : state
                    };
                    td = "<td>"+id+"号</td><td>"+powerModel+"</td><td>"+energyModel+"</td><td>"+state+"</td><td>"+energy+"%</td>";
                    $(showStateTable.children()[id]).html(td).removeClass("stopping","running").addClass(state);
                }
            })
        }
    };

    //展示信息
    commander.showMessage();
    //创建选择面板
    commander.createSelectSystem();
    //监听创建飞船按钮
    commander.createAirship();
    /**
     * 模拟控制台输出信息
     */
    function ShowCommondInformation() {
        var parent = $("#commondInformation");
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