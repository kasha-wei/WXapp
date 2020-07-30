// pages/goods_list/index.js
import { request } from '../../request/index.js'
import regeneratorRuntime from '../../lib/runtime/runtime'

Page({
  data: {
    tabs: [
      {
        id: 0,
        value: "综合",
        isActive: true
      },
      {
        id: 1,
        value: "销量",
        isActive: false
      },
      {
        id: 2,
        value: "价格",
        isActive: false
      }
    ],
    goodsList: []
  },
  queryParams: {
    query: '',
    cid: '',
    pagesize: 10,
    pagenum: 1
  },
  // 总页数
  totalPages: 1,
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.queryParams.cid = options.cid || ""
    this.queryParams.query = options.query || ""
    this.getGoodsList()
  },
  // 获取商品数据列表
  async getGoodsList() {
    const res = await request({url: '/goods/search', data: this.queryParams})
    const total = res.data.message.total
    console.log(total)
    this.totalPages = Math.ceil(total / this.queryParams.pagesize)
    console.log(this.totalPages)
    this.setData({
      goodsList: [...this.data.goodsList, ...res.data.message.goods]
    })
    //关闭下拉刷新的窗口
    wx.stopPullDownRefresh()
  },
  // 标题点击事件，从子组件中传过来的
  handleTabsItemChange (e) {
    const { index } = e.detail
    // 2.修改原数组
    let { tabs }= this.data
    tabs.forEach((v,i)=>i===index?(v.isActive=true):(v.isActive=false));
    this.setData({
      tabs
    })
  },
  onReachBottom () {
    if (this.queryParams.pagenum >= this.totalPages) {
      wx.showToast({
        title: '已经到底了',
      })
    } else {
      this.queryParams.pagenum++
      this.getGoodsList()
    }
  },
  // 下拉刷新事件
  onPullDownRefresh () {
    // 1.重置数组
    this.setData({
      goodsList: []
    })
    // 2.重置页码
    this.queryParams.pagenum = 1
    // 3.发送请求
    this.getGoodsList()
  }
}) 