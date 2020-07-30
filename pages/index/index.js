//index.js
//获取应用实例
import { request } from '../../request/index.js'
const app = getApp()

Page({
  data: {
    swiperList: [],
    cateList: [],
    floorList: []
  },
  onLoad: function () {
    // wx.request({
    //   url: 'https://api-hmugo-web.itheima.net/api/public/v1/home/swiperdata',
    //   success: result => {
    //     this.setData({
    //       swiperList: result.data.message
    //     })
    //   }
    // })
    this.getSwiperList()
    this.getCateList()
    this.getFloorList()
  },
  // 获取轮播图数据
  getSwiperList () {
    request({
      url: '/home/swiperdata'
    }).then(result => {
        this.setData({
          swiperList: result.data.message
        })
      })
  },
  // 获取分类导航数据
  getCateList () {
    request({
      url: '/home/catitems'
    }).then(result => {
        this.setData({
          cateList: result.data.message
        })
      })
  },
  // 获取楼层数据
  getFloorList () {
    request({
      url: '/home/floordata'
    }).then(result => {
        this.setData({
          floorList: result.data.message
        })
      })
  }
})
