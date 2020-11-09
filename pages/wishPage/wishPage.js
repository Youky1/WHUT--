// pages/wishPage/wishPage.js
Page({

  /**
   * 页面的初始数据
   */
	data: {
		  wishArray:[],
		  currentPage:1,
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		wx.request({
			url:'http://123.57.249.95:8090/secondhand/purchase',
			data:{
				page:this.data.currentPage,
				size:5
			},
			success: res =>{
				if(res.data.status == 1){
					this.setData({
						wishArray:res.data.data,
						currentPage:2
					})
				}
				console.log('当前求购数量：',this.data.wishArray.length);
			}
		})
	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function () {
		wx.request({
			url:'http://123.57.249.95:8090/secondhand/purchase',
			data:{
				page:this.data.currentPage,
				size:5
			},
			success: res =>{
				if(res.data.status == 1){
					if(res.data.data.length == 0){
						wx.showToast({
							title:'没有更多啦',
							icon:'none'
						})
						return;
					}
					this.setData({
						wishArray:this.data.wishArray.concat(res.data.data),
						currentPage:this.data.currentPage + 1
					})
					console.log('当前求购数量：',this.data.wishArray.length);
				}
			}
		})
	},
})