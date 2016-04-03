/**
 * Created by liulei on 2016/4/3.
 */

/**
 *创建一个hobbies类
 */
function Hobbies(){
    this.dataStore = [];   //存放数据
    this.ipt = undefined;   //当前的输入框
    this.htmlBox = undefined;   //当前显示的div
    this.add = add;   //添加数据
    this.removeDuplicateData = removeDuplicateData;   //数据去重
    this.delete = deleteData;   //点击删除
    this.render = render;   //数据渲染
    this.dataChangeClear = false;   //默认false，每次添加新数据，原数据不清空；如果为true，每次添加新数据前原数据清空
}

/**
 * 添加数据
 */
function add(){
    if(this.dataChangeClear){
        this.dataStore = [];
    }
    var tempInputValue = this.ipt.value;
    if(/^\s*$/ .test(tempInputValue)){   //如果文本域内容为空
        alert("请填写兴趣爱好！");
    }else {
        var tempDataStore = tempInputValue   //用来缓存文本域内的额文字分割后的数据
            .trim()   //获得的文本域内容首位去空字符串
            .split(/[\s,，;:；：!！？?'‘’、"“”()=\{\}\[\]，。。\.\/\\\|]+/);   //以标点符号或者空字符分割，返回数组
        this.removeDuplicateData(tempDataStore);
    }
}
/**
 * 数据去重
 * @param tempArr  缓存数据，有重复内容
 */
function removeDuplicateData(tempArr){
    for (var i = 0;i < tempArr.length;i++){
        var trimArrData = tempArr[i].trim();   //首尾去空格
        if(trimArrData != ""){
            //如果原数组没有新数据，则添加新数据
            if(this.dataStore.indexOf(trimArrData) == -1){
                //如果数据的长度大于10，则先删除第一项再追加新数据
                if (this.dataStore.length < 10){
                    this.dataStore.push(trimArrData);
                }else {
                    this.dataStore.shift();
                    this.dataStore.push(trimArrData);
                }
            }
        }
    }
}

/**
 * 数据页面渲染
 */
function render(){
    var queueHtml = "";   //清空页面
    //遍历dataStore中的所有数据，渲染页面
    for(var key in this.dataStore){
        queueHtml += "<div class="+key+">"+this.dataStore[key]+"</div>"
    }
    this.htmlBox.innerHTML = queueHtml;
}

/**
 *点击删除事件
 */
function deleteData(){
    //添加监听事件
    var t = this;
    this.htmlBox.addEventListener("click",function(e){
        if(e.target.id ==""){   //如果被点击的是队列
            t.dataStore.splice(e.target.className,1);   //删除被点击的数字
            t.render();   //渲染列表
        }
    })
}

/*
* 第一个输入框实例化一个Hobbies
*/
var tagHobbies = new Hobbies();
tagHobbies.ipt = document.getElementById("ipt");
tagHobbies.htmlBox = document.getElementById("queue-box-1");
tagHobbies.delete();

/**
 * 点击按钮事件
 */
function changeIpt(){
    tagHobbies.ipt.onkeydown = function(e){
        if(e.keyCode == 32 || e.keyCode == 13 || e.keyCode == 188){
            tagHobbies.add();
            tagHobbies.ipt.value = "";
            tagHobbies.render();
        }
    }
}

/*
 * 第二个输入框实例化一个Hobbies
 */
var textAreaHobbies = new Hobbies();
textAreaHobbies.ipt = document.getElementById("iptArea");
textAreaHobbies.htmlBox = document.getElementById("queue-box-2");
textAreaHobbies.dataChangeClear = true;
textAreaHobbies.delete();

/**
 * 监测何时添加数据
 */
var confirmBtn = document.getElementById("confirmBtn");
function clickConfirmBtn(){
    //添加监听事件
    confirmBtn.onclick = function(){
        textAreaHobbies.add();
        textAreaHobbies.ipt.value = "";
        textAreaHobbies.render();
    };
}

function init(){
    clickConfirmBtn();
    changeIpt();
}
init();