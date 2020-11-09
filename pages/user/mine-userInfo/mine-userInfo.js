// pages/userInfo/userInfo.js
Page({
    /**
     * 页面的初始数据
     */
    data: {
	openid:'',
	userInfo:'',
    marketInfo:{
		id:"ID",
		name:"姓名",
		sex:"性别",
		qq:"qq",
		schmail:"邮箱",
		area:"区域",
		cretime:"创建时间",
		phone:"手机号",
		schcard:"校园卡号",
		vx:"微信号"
	},
	listData : [
		{ "code": "qq", "text": '' },
		{ "code": "邮箱", "text": '' },
		{ "code": "创建时间", "text": '' },
		{ "code": "手机号", "text": ''},
		{ "code": "校园卡号", "text": ''},
		{ "code": "微信号", "text": ''},
	],
	infoItem:['qq','schmail']
    },

    /**
     * 生命周期函数--监听页面加载
     */
    	onLoad: function (options) {
		let self = this;
		let userInfo = wx.getStorageSync('userInfo');
		let marketInfo = wx.getStorageSync('marketInfo');
		this.setData({
			userInfo,
			marketInfo
		})
    	},
})