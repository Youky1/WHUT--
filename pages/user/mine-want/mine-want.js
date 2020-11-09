// pages/mine-want/mine-want.js
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		openid:'',
		wishArray:[],
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onShow: function (options) {
		let self = this;
		let openid = wx.getStorageSync('openid');
		this.setData({
			openid
		})
		console.log(this.data.openid)
		wx.request({
			url:'http://123.57.249.95:8090/secondhand/purchase/mine',
			data:{
				openid:this.data.openid
			},
			success(res){
				let data = res.data.data;
				console.log(data)
				data.forEach(item => console.log(item.cretime))
				self.setData({
					wishArray:data
				})
			}
		})
	},
})