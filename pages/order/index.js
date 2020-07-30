// pages/order/index.js
import { request } from '../../request/index.js'
import regeneratorRuntime from '../../lib/runtime/runtime'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [
      {
        id: 0,
        value: "全部",
        isActive: true
      },
      {
        id: 1,
        value: "代付款",
        isActive: false
      },
      {
        id: 2,
        value: "代发货",
        isActive: false
      },
      {
        id: 3,
        value: "退货/退款",
        isActive: false
      }
    ]
  },
  onShow (options) {
    // 判断缓存中有没有token
    const token = wx.getStorageSync("token")
    if (!token) {
      wx.navigateTo({
        url: '/pages/auth/index'
      })
      return ;
    }
    let pages = getCurrentPages();
    let currentPage = pages[pages.length - 1]
    const { type } = currentPage.options
    this.changeTitleByIndex(type - 1)
    this.getOrders(type)
  },
  // 获取订单列表
  async getOrders (type) {
    const res = await request({url: "/my/orders/all", data: { type }})
    console.log(res)
  },
  changeTitleByIndex (index) {
    // 2.修改原数组
    let { tabs }= this.data
    tabs.forEach((v,i)=>i===index?(v.isActive=true):(v.isActive=false));
    this.setData({
      tabs
    })
  },
  // 标题点击事件，从子组件中传过来的
  handleTabsItemChange (e) {
    const { index } = e.detail
    this.changeTitleByIndex(index)
    this.getOrders(index + 1)
  }
})