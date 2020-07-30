// pages/goods_detail/index.js
import { request } from '../../request/index.js'
import regeneratorRuntime from '../../lib/runtime/runtime'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsObj: {},
    // 商品是否被收藏
    isCollect: false
  },
  // 商品对象
  GoodsInfo: {},
  /**
   * 生命周期函数--监听页面加载
   */
  onShow () {
    let pages = getCurrentPages()
    let currentPage = pages[pages.length - 1]
    let options = currentPage.options
    const { goods_id } = options
    this.getGoodDetail(goods_id)
  },
  // 获取商品详情数据
  async getGoodDetail(goods_id) {
    const res = await request({url: "/goods/detail",data:{goods_id}})
    this.GoodsInfo = res.data.message
    let goodsObj = res.data.message
    // 1.获取缓存中的商品收藏数组
    let collect = wx.getStorageSync("collect") || []
    // 2.判断当前商品是否被收藏
    let isCollect = collect.some(v => v.goods_id === this.GoodsInfo.goods_id) 
    this.setData({
      goodsObj: {
        goods_name: goodsObj.goods_name,
        goods_price: goodsObj.goods_price,
        // 临时替换.webp转换为.jpg
        goods_introduce: goodsObj.goods_introduce.replace(/\.webp/g,'.jpg'),
        pics: goodsObj.pics
      },
      isCollect
    })
  },
  // 点击商品图标
  handleCollect () {
    let isCollect = false
    // 1.获取缓存中的商品收藏数组
    let collect = wx.getStorageSync("collect") || []
    // 2.判断该商品是否被收藏
    let index = collect.findIndex(v => v.goods_id === this.GoodsInfo.goods_id)
    if (index !== -1) {
      // 能找到说明已经收藏过,在数组中删除商品
      collect.splice(index, 1)
      isCollect = false
      wx.showToast({
        title: '已取消收藏',
        icon: 'success',
        mask: true
      })
    } else {
      // 没找到，说明没被收藏过
      collect.push(this.GoodsInfo)
      isCollect = true
      wx.showToast({
        title: '收藏成功',
        icon: 'success',
        mask: true
      })
    }
    wx.setStorageSync("collect", collect)
    this.setData({
      isCollect
    })
  },
  handlePreviewImage (e) {
    // 1.先构造预览图片的数组
    const urls = this.GoodsInfo.pics.map(v => v.pics_mid)
    const current = e.currentTarget.dataset.url;
    wx.previewImage({
      current,
      urls
    })
  },
  handleCartAdd () {
    let cart = wx.getStorageSync('cart') || []
    let index = cart.findIndex(v => v.goods_id === this.GoodsInfo.goods_id)
    if (index === -1) {
      // 不存在
      this.GoodsInfo.num = 1
      this.GoodsInfo.checked = true
      cart.push(this.GoodsInfo)
    } else {
      // 存在
      cart[index].num++
    }
    // 把购物车重新添加至缓存
    wx.setStorageSync("cart", cart)
    // 弹窗提示
    wx.showToast({
      title: '添加购物车成功',
      icon: 'success',
      mask: true
    })
  }
})