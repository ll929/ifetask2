/**
 * Created by liulei on 2016/4/4.
 */
/**
 * 封装Node类
 */
(function(){
    function Node(data,left,right){
        this.data = data;     //节点数据
        this.fch = left;     //
        this.nsib = right;   //
    }
    window.Node = Node;
})();
/**
 *封装Tree类
 */
(function(){
    function Tree(){
        this.root = null;     //初始化根节点为null
        this.createBinaryTree = createTree;    //创建二叉树函数
        this.show = show;    //显示树遍历过程
        this.orderNode = [];    //按照遍历顺序存放二叉树遍历节点
        this.i = 0;
        this.searchResult = [];  //用来存放查找到的节点
        this.timeOut = undefined;
        this.preOrder = preOrder;   //遍历方式1
        this.inOrder = inOrder;   //遍历方式2
        this.postOrder = postOrder;   //遍历方式2
    }
    window.Tree = Tree;   //公开一个接口
    /**
     * 显示树遍历过程
     * @param searchValue 要查找的值，可选
     */
    function show(searchValue){
        //将this赋值t，如果直接用this，在经过setTimeout()函数后this会指向window
        var t = this;
        if(this.i <= this.orderNode.length){
            if(this.i > 0) {
                this.orderNode[this.i-1].data.style.backgroundColor = "#fff";
            }
            if(this.i < this.orderNode.length){
                this.orderNode[this.i].data.style.backgroundColor = "#0ff";
                if(searchValue){
                    if(this.orderNode[this.i].data.firstChild.data.trim() == searchValue){
                        this.searchResult.push(this.orderNode[this.i].data);
                        this.orderNode[this.i].data.style.color = "#f00";
                        this.orderNode[this.i].data.style.borderColor = "#f00";
                    }
                }console.log(this.orderNode[this.i].data.firstChild.data.trim())
            }
            this.i++;
            this.timeOut = setTimeout(function(){t.show(searchValue)},500)
        }else {
            if(searchValue){
                if(this.searchResult.length == 0){
                    alert("没要找到您要查询的内容！")
                }
            }
        }
    }
    /**
     * 用dom节点创建树
     * @param node 树的根节点
     */
    function createTree(node){//console.log(node);
        if(this.root == null){
            this.root = node;
        }
            var fch = new Node(node.data.firstElementChild,null,null),
                nsib = new Node(node.data.nextElementSibling,null,null);
        //如果当前节点有子节点
        if(node.data.children.length != 0){
            node.fch = fch;
            createTree(fch);
        }
        //如果当前节点右边有兄弟节点
        if(node.data.nextElementSibling != null){
            node.nsib = nsib;
            createTree(nsib);
        }
    }
    /**
     * 遍历方式1，类似于二叉树的先序遍历
     * @param node 需要遍历树的根节点
     */
    function preOrder(node){
        //默认参数为根节点
        node = ((typeof arguments[0]) == "undefined")? this.root:node;
        if(!(node == null)){
            this.orderNode.push(node);
            this.preOrder(node.fch);
            this.preOrder(node.nsib);
        }
    }
    /**
     * 遍历方式2，类似于二叉树的中序遍历
     * @param node 需要遍历树的根节点
     */
    function inOrder(node){
        node = ((typeof arguments[0]) == "undefined")? this.root:node;
        if(!(node == null)){
            this.inOrder(node.fch);
            this.orderNode.push(node) ;
            this.inOrder(node.nsib);
        }
    }
    /**
     * 遍历方式3，类似于二叉树的后序遍历
     * @param node 需要遍历树的根节点
     */
    function postOrder(node){
        node = ((typeof arguments[0]) == "undefined")? this.root:node;
        if(!(node == null)){
            this.postOrder(node.fch);
            this.postOrder(node.nsib);
            this.orderNode.push(node) ;
        }
    }

})();
/**
 * 监听按钮点击事件
 */
function clickBtn(target,tree){
    target.addEventListener("click",function(e){
        /**
         * @param tree 树实例
         * @param btn 当前点击的按钮
         */
        (function (tree,btn){
            //如果当前点击的不是输入框
            if(btn != "ipt"){
                //清除正在执行的遍历过程
                if(tree.timeOut){
                    clearTimeout(tree.timeOut);
                    if(tree.i > 0 && tree.i <= tree.orderNode.length){
                        tree.orderNode[tree.i-1].data.style.backgroundColor = "#fff";
                    }
                    tree.i = 0;
                    tree.orderNode = [];
                }
                //查找到的html样式还原
                if(tree.searchResult.length > 0){
                    for (var key in tree.searchResult){
                        console.log(tree.searchResult[key])
                        tree.searchResult[key].style.color = "#000";
                        tree.searchResult[key].style.borderColor = "#000";
                        tree.searchResult = [];
                    }
                }
                switch (btn){
                    case "searchBtn1":
                    case "preOrder":
                        tree.preOrder();
                        break;
                    case "searchBtn2":
                    case "inOrder":
                        tree.inOrder();
                        break;
                    case "searchBtn3":
                    case "postOrder":
                        tree.postOrder();
                        break;
                }
                switch (btn){
                    case "searchBtn1":
                    case "searchBtn2":
                    case "searchBtn3":
                        //如果点击的是查找按钮，show函数传递一个输入框的值作为参数
                        (function () {
                            var iptValue = document.getElementById("ipt").value;
                            if(iptValue == ""){
                                alert("请输入查找内容！")
                            }else {
                                tree.show(iptValue);
                            }
                        })();
                        break;
                    default:
                        tree.show();
                }
            }
        })(tree, e.target.id)
    })
}
/**
 * 初始化函数
 */
function init(){
    var root = document.getElementById("treeRoot"),
        btnBox = document.getElementById("btn-search-wrap");
    /*
     * 实例化一个Tree
     */
    var  bst = new Tree();

    /*
     * 将html中的dom节点存储为树
     */
    bst.createBinaryTree(new Node(root,null,null));
    clickBtn(btnBox,bst);
}
init();


