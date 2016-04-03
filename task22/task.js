/**
 * Created by liulei on 2016/4/2.
 */
var root = document.getElementById("binaryTreeRoot"),
    btnBox = document.getElementById("btn-box");
/**
 * 创建Node类
 */
function Node(data,left,right){
    this.data = data;     //节点数据
    this.left = left;     //节点的左子树
    this.right = right;   //节点的右子树
}

/**
 * 创建BinaryTree类
 */
function BinaryTree(){
    this.root = null;     //初始化根节点为null
    this.createBinaryTree = createBinaryTree;    //创建二叉树函数
    this.show = show;    //显示二叉树遍历过程
    this.orderNode = [];    //按照遍历顺序存放二叉树遍历节点
    this.i = 0;
    this.timeOut = undefined;
    this.preOrder = preOrder;   //先序遍历
    this.inOrder = inOrder;   //中序遍历
    this.postOrder = postOrder;   //后序遍历
}

/**
 * 显示二叉树遍历过程
 */
function show(){
    //将this赋值t，如果直接用this，在经过setTimeout()函数后this会指向window
    var t = this;
    if(this.i <= this.orderNode.length){
        if(this.i > 0) {
            this.orderNode[this.i-1].data.style.backgroundColor = "#fff";
        }
        if(this.i < this.orderNode.length){
            this.orderNode[this.i].data.style.backgroundColor = "#0ff";
        }
        this.i++;
        this.timeOut = setTimeout(function(){t.show()},500)
    }
}

/**
 * 用dom节点创建二叉树
 * @param node 二叉树的根节点
 */
function createBinaryTree(node){
    if(this.root == null){
        this.root = node;
    }
    //如果当前节点有子节点
    if(node.data.children.length != 0){
        var left = new Node(node.data.firstElementChild,null,null),
            right = new Node(node.data.lastElementChild,null,null);
        node.left = left;
        node.right = right;
        createBinaryTree(left);
        createBinaryTree(right);
    }
}

/**
 * 先序遍历
 * @param node 需要遍历二叉树的根节点
 */
function preOrder(node){
    //默认参数为根节点
    node = ((typeof arguments[0]) == "undefined")? this.root:node;
    if(!(node == null)){
        this.orderNode.push(node);
        this.preOrder(node.left);
        this.preOrder(node.right);
    }
}

/**
 * 中序遍历
 * @param node 需要遍历二叉树的根节点
 */
function inOrder(node){
    node = ((typeof arguments[0]) == "undefined")? this.root:node;
    if(!(node == null)){
        this.inOrder(node.left);
        this.orderNode.push(node) ;
        this.inOrder(node.right);
    }
}

/**
 * 后序遍历
 * @param node 需要遍历二叉树的根节点
 */
function postOrder(node){
    node = ((typeof arguments[0]) == "undefined")? this.root:node;
    if(!(node == null)){
        this.postOrder(node.left);
        this.postOrder(node.right);
        this.orderNode.push(node) ;
    }
}

/*
* 实例化一个BinaryTree
*/
var  bst = new BinaryTree();

/*
* 将html中的dom节点存储为二叉树
*/
bst.createBinaryTree(new Node(root,null,null));

/**
 * 监听按钮点击事件
 */
function clickBtn(){
    btnBox.addEventListener("click",function(e){
        /**
         * @param tree 二叉树实例
         * @param btn 当前点击的按钮
         */
        (function (tree,btn){
            clearTimeout(tree.timeOut);
            if(tree.i > 0 && tree.i <= tree.orderNode.length){
                tree.orderNode[tree.i-1].data.style.backgroundColor = "#fff";
            }
            tree.i = 0;
            tree.orderNode = [];
            switch (btn){
                case "preOrder":
                    tree.preOrder();
                    break;
                case "inOrder":
                    tree.inOrder();
                    break;
                case "postOrder":
                    tree.postOrder();
                    break;
            }
            tree.show();
        })(bst, e.target.id)
    })
}

function init(){
    clickBtn();
}
init();

