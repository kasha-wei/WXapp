// pages/search/index.js
import { request } from '../../request/index.js'
import regeneratorRuntime from '../../lib/runtime/runtime'
Page({
  data: {
    goods: [],
    inpValue: ''
  },
  TimeId: -1,
  // 输入框中得值改变就会触发得事件
  handleInput (e) {
    // 1.获取输入框得值
    const { value } = e.detail
    // 2.检查合法性
    if (!value.trim()) {
      this.setData({
        goods: []
      })
    }
    clearTimeout(this.TimeId)
    this.TimeId = setTimeout(() => {
      // 准备发送请求
    this.qsearch(value)
    }, 1000)
  },
  // 发送请求 获取搜索建议 数据
  async qsearch (query) {
    const res = await request({url: "/goods/qsearch", data: { query }})
    this.setData({
      goods: res
    })
  },
  // 点击取消
  handleCancle () {
    this.setData({
      inpValue: '',
      goods: []
    })
  }
})