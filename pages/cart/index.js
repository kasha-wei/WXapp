// pages/cart/index.js
import {getSetting, chooseAddress, openSetting, showModal, showToast} from '../../utils/asyncWx'
import regeneratorRuntime from '../../lib/runtime/runtime'
Page({
  data: {
    address: {},
    cart: [],
    allChecked: false,
    totalPrice: 0,
    totalNum: 0
  },
  onShow () {
    // 获取缓存中的地址信息
    const address = wx.getStorageSync("address")
    // 获取缓存中得购物车数据
    const cart = wx.getStorageSync("cart") || []
    // const allChecked = cart.length ? cart.every(v => v.checked) : false
    this.setData({
      address
    })
    this.setCart(cart)
  },
  async handleChooseAddress () {
    try {
      // 1.获取状态
      const res1 = await getSetting();
      const scopeAddress = res1.authSetting["scope.address"]
      // 2.判断 权限状态
      if (scopeAddress === false) {
        await openSetting()
      }
      // 3.调用获取收货地址
      const address = await chooseAddress()
      address.all = address.provinceName + address.cityName + address.countyName + address.detailInfo
      wx.setStorageSync('address',address)
    } catch (error) {
      console.log(error)
    }
  },
  handleItemChange (e) {
    // 获取被修改商品的id
    const goods_id = e.currentTarget.dataset.id
    // 获取购物车数组
    let { cart } = this.data
    // 找到被修改的商品对象
    const index = cart.findIndex(v => v.goods_id === goods_id)
    // 选中状态取反
    cart[index].checked = !cart[index].checked
    // 把购物车数据重新设置回data中和缓存中
    this.setCart(cart)
  },
  handleItemAllcheck () {
    let { cart, allChecked } = this.data
    allChecked = !allChecked
    cart.forEach(v => v.checked = allChecked)
    this.setCart(cart)
  },
  // 商品数量的编辑
  async handleItemNumEdit (e) {

    // 获取传递过来的参数
    const { operation, id } = e.currentTarget.dataset
    // 获取购物车数据
    let { cart } = this.data
    const index = cart.findIndex(v => v.goods_id === id)
    // 判断num为1，且点击的是减
    if (cart[index].num === 1 && operation === -1) {
      // 弹窗提示
      const res = await showModal ({content: "你是否删除该商品？"})
      if (res.confirm) {
        cart.splice(index, 1)
        this.setCart(cart)
      }
    } else {
      cart[index].num += operation
      this.setCart(cart)
    }
  },
  async handlePay () {
    const { address, totalNum } = this.data
    // 判断用户是否填写了地址
    if (!address.userName) {
      await showToast({title: "您还没有选择收货地址"})
      return ;
    }
    // 判断用户是否选择了商品

    if (totalNum === 0) {
      await showToast({title: "您还没有选择商品"})
      return ;
    }
    // 跳转到支付页面
    wx.navigateTo({
      url: '/pages/pay/index',
    })
  },
  // 设置购物车状态，重新计算
  setCart(cart) {
    let allChecked = true
    let totalPrice = 0
    let totalNum = 0
    cart.forEach(v => {
      if (v.checked) {
        totalPrice += v.num * v.goods_price
        totalNum += v.num
      } else {
        allChecked = false
      }
    })
    allChecked = cart.length!=0?allChecked:false
    this.setData({
      cart,
      allChecked,
      totalPrice,
      totalNum
    })
    wx.setStorageSync("cart", cart)
  }
})