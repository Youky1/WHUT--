// pages/mine_publication/mine_publication.js
Page({

 	/**
 	 * 页面的初始数据
 	 */
 	data: {
		openid:'',
		goodStatus:true,
		color1:'#FFDEAD',
		color2:'white',
		size1:'18px',
		size2:'14px',
		soldingArray:[],
		soldoutArray:[],
		soldingPage:0,
		soldoutPage:0,
		soldingBlank:false,
		soldoutBlank:false,
 	},

 	/**
 	 * 生命周期函数--监听页面加载
	 * 获取已发布的商品
 	 */
 	onShow: function (options) {
		let openid = wx.getStorageSync('openid');
		this.setData({
			openid
		})
		let self = this;

		// 获取出售中物品
		wx.request({
			url:'http://123.57.249.95:8090/secondhand/goods/mine',
			data:{
				openid,
				page:this.data.soldingPage+1,
				size:5,
				status:1
			},
			success(res){
				let data = res.data.data;
				if(data.length === 0){
					self.setData({
						soldingBlank:true,
						soldingArray:data
					})
				}
				else{
					self.setData({
						soldingArray:data,
						soldingBlank:false
					})
				}
				
			}
		})

		// 获取已下架物品
		wx.request({
			url:'http://123.57.249.95:8090/secondhand/goods/mine',
			data:{
				openid,
				page:this.data.soldoutPage+1,
				size:5,
				status:2
			},
			success(res){
				let data = res.data.data;
				if(data.length === 0){
					self.setData({
						soldoutBlank:true,
						soldoutArray:data
					})
				}
				else{
					self.setData({
						soldoutArray:data,
						soldoutBlank:false
					})
				}
				
			}
		})
	},
	 
	// 选择出售中物品
	chooseSolding(){
		this.setData({
			goodStatus:true,
			color1:'#FFDEAD',
			color2:'white',
			size1:'18px',
		 	size2:'14px'
		})
	},

	// 选择已下架商品
	chooseSoldout(){
		this.setData({
			goodStatus:false,
			color1:'white',
			color2:'#FFDEAD',
			size1:'14px',
		 	size2:'18px'
		})
	},

	/**
     * 页面上拉触底事件的处理函数
	 * 加载更多物品
     */
    onReachBottom: function () {
		let self = this;
		let data = {
			openid: this.data.openid,
			size: 5,
			page: this.data.goodStatus? this.data.soldingPage+1 : this.data.soldoutPage+1,
			status: this.data.goodStatus ? 1 : 2
		}
		wx.request({
			url:'http://123.57.249.95:8090/secondhand/goods/mine',
			data,
			success(res){
				let data = res.data.data;
				console.log(data.length);
				if(self.data.goodStatus){
					let arr = self.data.soldingArray.concat(data);
					self.setData({
						soldingArray:arr,
						soldingPage:self.data.soldingPage + 1
					})
				}else{
					let arr = self.data.soldoutArray.concat(data);
					self.setData({
						soldoutArray:arr,
						soldoutPage:self.data.soldoutPage + 1
					})
				}
			}
		})
	},
})