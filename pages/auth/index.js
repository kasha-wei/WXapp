// pages/auth/index.js
import { request } from '../../request/index.js'
import regeneratorRuntime from '../../lib/runtime/runtime'
import { login } from '../../utils/asyncWx'
Page({
  async handleGetUserInfo (e) {
    try {
      // 获取参数
      const { encryptedData, rawData, signature, iv } = e.detail
      const { code } = await login()
      const loginParams = { encryptedData, rawData, signature, iv, code }
      // 发送请求 获取用户的token
      const res = request({url: '/users/wxlogin', data: loginParams, method: "POST"})
      const token = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo"
      wx.setStorageSync("token", token)
      wx.navigateBack({
        delta: 1,
      })
    } catch (error) {
      console.log(error)
    }
  }
})