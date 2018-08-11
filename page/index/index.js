// pages/menu/menu.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    swiperTitle: [{
      text: "点菜",
      id: 1
    }, {
      text: "评价",
      id: 2
    }, {
      text: "商家",
      id: 3
    }, {
      text: "我的",
      id: 3
    }],
    menu: [],           //店铺的菜单
    orderMenu: [],      //已经选择的菜单
    currentPage: 0,     //当前显示的tab
    selected: 0,        //选择的tab
    cost: 0,            //总价钱
    orderNum : 0,       //选择商品的总数量
    shopHeader:{},      //店铺头部信息
    height: "",      //设置滚动的高度和底部购买的高度
    viewHeight : "",     //设置滚动的高度
    orderMenuHeight : "", //设置订单列表高度
    maskhide : true,
    orderlisthide : true
  },
  //增加商品数量
  addToTrolley: function (e) {
    var info = this.data.menu;
    var orderNum = this.data.orderNum;
    orderNum++;
    var listItem = info[this.data.selected].menuContent[e.currentTarget.dataset.index];
    listItem.numb++;
    var orderMenu = this.data.orderMenu;
    let isHave = false;
    for (let i = 0; i < orderMenu.length; i++) {
      if (orderMenu[i].goodsid == listItem.goodsid) {
        isHave = true; //存在
        orderMenu[i].numb++;
      }
    }
    //根据isHave的值判断订单列表中是否已经有此商品
    if (!isHave) {
      //不存在就推入数组
      listItem.classify = this.data.selected;
      listItem.index = e.currentTarget.dataset.index;
      orderMenu.push(listItem);
    }
    if (orderMenu.length<3){
      var orderMenuHeight = 120 * orderMenu.length;
    }else{
      var orderMenuHeight = 360;
    }
    this.setData({
      cost: this.data.cost + this.data.menu[this.data.selected].menuContent[e.currentTarget.dataset.index].price,
      menu: info,
      orderNum: orderNum,
      orderMenu: orderMenu,
      orderMenuHeight: orderMenuHeight
    })
  },
  //减少商品数量
  removeFromTrolley: function (e) {
    var info = this.data.menu;
    var listItem = info[this.data.selected].menuContent[e.currentTarget.dataset.index];
    var orderMenu = this.data.orderMenu;
    var orderNum = this.data.orderNum;
    orderNum--;
    if (listItem.numb != 0) {
      listItem.numb--;
      for (let i = 0; i < orderMenu.length; i++) {
        if (orderMenu[i].goodsid == listItem.goodsid) {
          orderMenu[i].numb--;
          if (orderMenu[i].numb == 0){
            orderMenu.splice(i,1)
          }
        }
      }
      if (orderMenu.length < 3) {
        var orderMenuHeight = 120 * orderMenu.length;
      } else {
        var orderMenuHeight = 360;
      }
      this.setData({
        cost: this.data.cost - this.data.menu[this.data.selected].menuContent[e.currentTarget.dataset.index].price,
        menu: info,
        orderNum: orderNum,
        orderMenu: orderMenu,
        orderMenuHeight: orderMenuHeight
      })
    }
  },
  //点击切换tab
  turnPage: function (e) {
    this.setData({
      currentPage: e.currentTarget.dataset.index
    })
  },
  //滑动切换tab
  turnTitle: function (e) {
    console.log(e.detail.source)
    // if (e.detail.source == "touch") {
      this.setData({
        currentPage: e.detail.current
      })
    // }
  },
  //点击切换点菜的分类
  turnMenu: function (e) {
    this.setData({
      selected: e.currentTarget.dataset.index
    })
  },
  //显示订单列表
  showOrderList(){
    var orderMenu = this.data.orderMenu;
    if (orderMenu.length != 0){
      if (this.data.orderlisthide){
        this.setData({
          maskhide: false,
          orderlisthide: false
        })
      }else{
        this.setData({
          maskhide: true,
          orderlisthide: true
        })
      }
    }
  },
  //增加购物车内商品数量
  addOrderToTrolley: function (e) {
    var classify = e.currentTarget.dataset.classify;
    var ind = e.currentTarget.dataset.index;
    // console.log(classify)
    // console.log(ind)
    var orderNum = this.data.orderNum;
    orderNum++;
    var info = this.data.menu;
    var listItem = info[classify].menuContent[ind];
    listItem.numb++;
    var orderMenu = this.data.orderMenu;
    for (let i = 0; i < orderMenu.length; i++) {
      if (orderMenu[i].goodsid == listItem.goodsid) {
        orderMenu[i].numb++;
      }
    }
    this.setData({
      cost: this.data.cost + this.data.menu[this.data.selected].menuContent[e.currentTarget.dataset.index].price,
      menu: info,
      orderNum: orderNum,
      orderMenu: orderMenu
    })
  },
  //减少购物车内商品数量
  removeOrderFromTrolley: function (e) {
    var classify = e.currentTarget.dataset.classify;
    var ind = e.currentTarget.dataset.index;
    var orderNum = this.data.orderNum;
    // console.log(orderNum)
    var info = this.data.menu;
    var orderMenu = this.data.orderMenu;
    var listItem = info[classify].menuContent[ind];


    if (listItem.numb != 0) {
      listItem.numb--;
      orderNum--;
      for (let i = 0; i < orderMenu.length; i++) {
        if (orderMenu[i].goodsid == listItem.goodsid) {
          orderMenu[i].numb--;
          if (orderMenu[i].numb == 0) {
            orderMenu.splice(i, 1);
            if (orderMenu.length < 3) {
              var orderMenuHeight = 120 * orderMenu.length;
            } else {
              var orderMenuHeight = 360;
            }
            if (!orderMenu.length){
              this.setData({
                maskhide: true,
                orderlisthide: true,
              })
            }
          }
        }
      }

      this.setData({
        cost: this.data.cost - this.data.menu[this.data.selected].menuContent[e.currentTarget.dataset.index].price,
        menu: info,
        orderNum: orderNum,
        orderMenu: orderMenu,
        orderMenuHeight: orderMenuHeight
      })
    }
  },
  //清空购物车
  clearCart(){
    var menu = this.data.menu;
    for(var i=0,len=menu.length;i<len;i++){
      var con = menu[i].menuContent;
      for (var j = 0, leng = con.length; j < leng; j++){
        con[j].numb = 0;
      }
    }
    var orderMenu = [];
    this.setData({
      menu: menu,
      orderMenu: orderMenu,
      maskhide: true,
      orderlisthide: true,
      orderNum: 0,
      cost : 0
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //菜单信息
    var menu = [
      {
        "typeName": "快餐类",
        "menuContent": [
          {
            "name": "炸鸡",
            "abstract": "圆茄子、尖椒、番茄、鸡肉、鸭腿肉、菜心、圆茄子、尖椒、番茄、鸡肉、鸭腿肉、菜心",
            "src": "../../images/goods/slider-pic1.jpeg",
            "sales": 22,
            "rating": 3,
            "price": 15,
            "numb": 0,
            "goodsid":"001"
          },
          {
            "name": "汉堡",
            "abstract": "圆茄子、尖椒、番茄、鸡肉、鸭腿肉、菜心",
            "src": "../../images/goods/slider-pic2.jpeg",
            "sales": 22,
            "rating": 3,
            "price": 10,
            "numb": 0,
            "goodsid": "002"
          },
          {
            "name": "鸡翅",
            "abstract": "番茄炒蛋盖浇饭番茄炒蛋盖浇饭番茄炒蛋盖浇饭",
            "src": "../../images/goods/slider-pic3.jpeg",
            "sales": 22,
            "rating": 3,
            "price": 11,
            "numb": 0,
            "goodsid": "003"
          },
          {
            "name": "薯条",
            "abstract": "番茄炒蛋盖浇饭番茄炒蛋盖浇饭番茄炒蛋盖浇饭",
            "src": "../../images/goods/slider-pic4.jpeg",
            "sales": 22,
            "rating": 3,
            "price": 32,
            "numb": 0,
            "goodsid": "004"
          },
          {
            "name": "鸡翅",
            "abstract": "圆茄子、尖椒、番茄、鸡肉、鸭腿肉、菜心",
            "src": "../../images/goods/slider-pic5.jpeg",
            "sales": 22,
            "rating": 3,
            "price": 11,
            "numb": 0,
            "goodsid": "005"
          },
           {
            "name": "鸡翅",
            "abstract": "圆茄子、尖椒、番茄、鸡肉、鸭腿肉、菜心",
            "src": "../../images/goods/slider-pic6.jpeg",
            "sales": 22,
            "rating": 3,
            "price": 11,
            "numb": 0,
            "goodsid": "006"
          },
           {
             "name": "鸡翅",
             "abstract": "圆茄子、尖椒、番茄、鸡肉、鸭腿肉、菜心",
             "src": "../../images/goods/slider-pic7.jpeg",
             "sales": 22,
             "rating": 3,
             "price": 11,
             "numb": 0,
             "goodsid": "007"
           },
           {
             "name": "鸡翅",
             "abstract": "圆茄子、尖椒、番茄、鸡肉、鸭腿肉、菜心",
             "src": "../../images/goods/slider-pic5.jpeg",
             "sales": 22,
             "rating": 3,
             "price": 11,
             "numb": 0,
             "goodsid": "008"
           },
           {
             "name": "鸡翅",
             "abstract": "圆茄子、尖椒、番茄、鸡肉、鸭腿肉、菜心",
             "src": "../../images/goods/slider-pic5.jpeg",
             "sales": 22,
             "rating": 3,
             "price": 11,
             "numb": 0,
             "goodsid": "009"
           }
        ]
      },
      {
        "typeName": "盖浇饭类",
        "menuContent": [
          {
            "name": "土豆牛肉盖浇饭",
            "abstract": "圆茄子、尖椒、番茄、鸡肉、鸭腿肉、菜心",
            "src": "../../images/goods/slider-pic1.jpeg",
            "sales": 22,
            "rating": 3,
            "price": 9,
            "numb": 0,
            "goodsid": "010"
          },
          {
            "name": "肉末茄子盖浇饭",
            "abstract": "圆茄子、尖椒、番茄、鸡肉、鸭腿肉、菜心",
            "src": "../../images/goods/slider-pic2.jpeg",
            "sales": 22,
            "rating": 3,
            "price": 21,
            "numb": 0,
            "goodsid": "011"
          },
          {
            "name": "番茄炒蛋盖浇饭",
            "abstract": "圆茄子、尖椒、番茄、鸡肉、鸭腿肉、菜心",
            "src": "../../images/goods/slider-pic5.jpeg",
            "sales": 22,
            "rating": 3,
            "price": 50,
            "numb": 0,
            "goodsid": "012"
          }
        ]
      },
      {
        "typeName": "养生粥类",
        "menuContent": [
          {
            "name": "桂圆莲子粥",
            "abstract": "番茄炒蛋盖浇饭番茄炒蛋盖浇饭番茄炒蛋盖浇饭",
            "src": "../../images/goods/slider-pic5.jpeg",
            "sales": 22,
            "rating": 3,
            "price": 15,
            "numb": 0,
            "goodsid": "013"
          },
          {
            "name": "皮蛋瘦肉粥",
            "abstract": "番茄炒蛋盖浇饭番茄炒蛋盖浇饭番茄炒蛋盖浇饭",
            "src": "../../images/goods/slider-pic1.jpeg",
            "sales": 22,
            "rating": 3,
            "price": 12,
            "numb": 0,
            "goodsid": "014"
          }
        ]
      },
      {
        "typeName": "小吃类",
        "menuContent": [
          {
            "name": "肉夹馍",
            "abstract": "番茄炒蛋盖浇饭番茄炒蛋盖浇饭番茄炒蛋盖浇饭",
            "src": "../../images/goods/slider-pic5.jpeg",
            "sales": 22,
            "rating": 3,
            "price": 4,
            "numb": 0,
            "goodsid": "015"
          }
        ]
      }
    ]
    that.setData({
      menu : menu
    })
    //店铺头部信息
    var shopHeader = {
      logo : "../../images/logo.png",
      start : 0,    //起送
      deliver : 9,  //配送
      time : 30,    //配送时间
      grade : 4,    //店铺等级
      stars : 4,    //店铺星级
      activity : [
        "新用户立减17元",
        "满100减55"
      ]
    } 
    that.setData({
      shopHeader: shopHeader
    })


    // console.log(this.data)
    //改变滚动区域的高度
    wx.getSystemInfo({
      success: function(res) {
        // console.log(res.windowHeight);
        var viewHeight = res.windowHeight - 120;
        var heightScroll = viewHeight - 50;
        that.setData({
          height: viewHeight,
          heightScroll: heightScroll
        })
        // that.setData({
        //   height: auto,
        //   heightScroll: auto
        // })
      },
    })
    // wx.request({
    //   url: "https://www.easy-mock.com/mock/596257bc9adc231f357c4664/restaurant/menu",
    //   method: "GET",
    //   success: function (res) {
    //     that.setData({
    //       menu: res.data,
    //     })
    //   }
    // });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // console.log(this.data)
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})