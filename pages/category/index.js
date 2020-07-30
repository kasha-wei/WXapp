// pages/category/index.js
import { request } from '../../request/index.js'
import regeneratorRuntime from '../../lib/runtime/runtime'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 左侧数据
    leftMenuList: [],
    // 右侧数据
    rightContent: [],
    currentIndex: 0,
    scrollTop: 0
  },
  // 接口的返回数据
  Cates: [],
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const Cates = wx.getStorageSync("Cates")
    if (!Cates) {
      this.getCateList()
    } else {
      if ((Date.now() - Cates.time) > (1000*10)) {
        // 重新发送请求
        this.getCateList()
      } else {
        // 使用旧数据
        this.Cates = Cates.data
        let leftMenuList = this.Cates.map(v => v.cat_name)
        let rightContent = this.Cates[0].children
        this.setData({
          leftMenuList,
          rightContent
        })
      }
    }
  },
  async getCateList () {
    // request({
    //   url: '/categories'
    // }).then(res => {
    //   this.Cates = res.data.message
    //   // 把接口的数据存入到本地存储中
    //   wx.setStorageSync("Cates",{time: Date.now(),data: this.Cates})
    //   let leftMenuList = this.Cates.map(v => v.cat_name)
    //   let rightContent = this.Cates[0].children
    //   this.setData({
    //     leftMenuList,
    //     rightContent
    //   })
    // }) 
    const res = await request({url: '/categories'})
    this.Cates = res.data.message
    wx.setStorageSync("Cates",{time: Date.now(),data: this.Cates})
      let leftMenuList = this.Cates.map(v => v.cat_name)
      let rightContent = this.Cates[0].children
      this.setData({
        leftMenuList,
        rightContent
      })
  },
  handleItemTap (e) {
    const { index } = e.currentTarget.dataset
    let rightContent = this.Cates[index].children
    this.setData({
      currentIndex:index,
      rightContent,
      scrollTop: 0
    })
  }
})