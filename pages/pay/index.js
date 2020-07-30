// pages/cart/index.js
import regeneratorRuntime from '../../lib/runtime/runtime'
import { request } from '../../request/index'
import { requestPayment, showToast } from '../../utils/asyncWx'
Page({
  data: {
    address: {},
    cart: [],
    totalPrice: 0,
    totalNum: 0
  },
  onShow () {
    // 获取缓存中的地址信息
    const address = wx.getStorageSync("address")
    // 获取缓存中得购物车数据
    let cart = wx.getStorageSync("cart") || []
    // const allChecked = cart.length ? cart.every(v => v.checked) : false
    // 过滤后的购物车数组
    cart = cart.filter(v => v.checked)
    let totalPrice = 0
    let totalNum = 0
    cart.forEach(v => {
        totalPrice += v.num * v.goods_price
        totalNum += v.num
    })
    this.setData({
      cart,
      totalPrice,
      totalNum,
      address
    })
  },
  // 点击支付
  async handleOrderPay () {
    try {
      // 判断缓存中有没有token
      const token = wx.getStorageSync("token")
      if (!token) {
        wx.navigateTo({
          url: '/pages/auth/index'
        })
        return ;
      }
      // 创建订单
      // 请求头参数
      const header = { Authorization: token } 
      // 请求体参数
      const order_price = this.data.totalPrice
      const consignee_addr = this.data.address.all
      const cart = this.data.cart
      let goods = []
      cart.forEach(v => goods.push({
        goods_id: v.goods_id,
        goods_number: v.num,
        goods_price: v.goods_price
      }))
      const orderParams = { order_price, consignee_addr, goods }
      // 发送请求创建订单
      const { order_number } = await request({ 
          url: '/my/orders/create',
          method: 'POST',
          data: orderParams,
          header
        })
      // 发起预支付接口
      const { pay } = await request({
        url: '/my/orders/req_unifiedorder',
        method: 'POST',
        data: { order_number },
        header
      })
      // 发起微信支付
      await requestPayment(pay)
      // 查询后台，订单状态
      const res = await request({
        url: '/my/orders/chkOrder',
        method: 'POST',
        data:{ order_number },
        header
      })
      await showToast({title: "支付成功"})
      // 支付成功，跳转到订单页面
      wx.navigateTo({
        url: '/pages/order/index'
      })
    } catch (error) {
      await showToast({title: "支付失败"})
      console.log(error)
    }
  }
})