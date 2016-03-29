/**
 * Created by liulei on 2016/3/29.
 */
var queueBox = document.getElementById("queue-box"),
    form = document.getElementById("form"),
    queueHtml,
    dataStore = [],
    input = document.getElementById("ipt");
function leftEnqueue(){
    dataStore.unshift(input.value);
}
function rightEnqueue(){
    dataStore.push(input.value);
}
function leftDequeue(){
    alert("左侧出的数字为"+dataStore.shift());
}
function rightDequeue(){
    alert("右侧出的数字为"+dataStore.pop());
}
function renderQueue(){
    queueHtml = "";
    for(var key in dataStore){
       queueHtml += "<div>"+dataStore[key]+"</div>"
    }
    queueBox.innerHTML = queueHtml;
}
function changeQueue(){
    form.addEventListener("click",function(e){
        if(e.target.localName == "button"){
            //eval(e.target.id+"()");   //不知道能不能用
            switch (e.target.id){
                case "leftEnqueue":
                    leftEnqueue();
                    break;
                case "rightEnqueue":
                    rightEnqueue();
                    break;
                case "leftDequeue":
                    leftDequeue();
                    break;
                case "rightDequeue":
                    rightDequeue();
                    break;
            }
            renderQueue();
        }
    })
}
function init(){
    changeQueue();
}
init();
