// pages/mine-collection/mine-collection.js
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		collectionArray:[],
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onShow: function (options) {
		let self = this;
		let openid = wx.getStorageSync('openid');
		wx.request({
			url:'http://123.57.249.95:8090/secondhand/collection',
			data:{
				openid
			},
			success(res){
				let data = res.data.data;
				console.log('collection array is ',data);
				self.setData({
					collectionArray:data
				})
			}
		})	
	},
})