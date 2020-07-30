// pages/feedback/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [
      {
        id: 0,
        value: "体验问题",
        isActive: true
      },
      {
        id: 1,
        value: "商品，商家投诉",
        isActive: false
      }
    ],
    // 被选中的图片数组
    chooseImg: []
  },
  handleTabsItemChange (e) {
    const { index } = e.detail
    // 2.修改原数组
    let { tabs }= this.data
    tabs.forEach((v,i)=>i===index?(v.isActive=true):(v.isActive=false));
    this.setData({
      tabs
    })
  },
  // 点击+上传图片
  handleChooseImg () {
    // 调用api
    wx.chooseImage({
      // 同时选中的图片数量
      count: 9,
      // 图片的格式 原图 压缩
      sizeType: ['original','compressed'],
      // 图片的来源 相册 照相机
      sourceType: ['album','camera'],
      success: (res) => {
        this.setData({
          // 多次点击，图片拼接
          chooseImg: [...this.data.chooseImg, ...res.tempFilePaths]
        })
      }
    })
  },
  // 点击图片删除图片
  handleRemoveImg (e) {
    // 获取索引
    const { index } = e.currentTarget.dataset
    let { chooseImg } = this.data
    chooseImg.splice(index, 1)
    this.setData({
      chooseImg
    })
  }
})