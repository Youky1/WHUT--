// pages/mine/mine.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
	openid:'',
	userInfo:{},
        joinTime:'',
        location: '',
        soldNum:'',
        collectNum:'',
		wantingNum:'',
		hasSign:false,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onShow: function (options) 
    {
		
		// if(!wx.getStorageSync('userHasSignUp')){
        //     wx.navigateTo({
		// 		url:'../../entry/signUp/signUp'
		// 	})
        //     return;
		// }
		this.setData({
			hasSign:wx.getStorageSync('userHasSignUp')
		})
		let self = this;
		//从储存中获取用户wx资料
		wx.getStorage({
			key: 'userInfo',
			success: (res) => {
			    this.setData({
					userInfo: res.data
			    })
			},
		})		
		
		let promise = new Promise(resolve=>{//读取openid
		        wx.getStorage({
		            key:'openid',
		            success(res){
		                self.setData({
		                    openid:res.data
		                })
		                resolve();
		            }
		        });
		})
		promise.then(()=>{//查询用户的注册信息：加入时间、联系方式等
			return new Promise(resolve=>{
				wx.request({
					url: 'http://123.57.249.95:8090/secondhand/user/info',
					data:{
					    openid:this.data.openid
					},
					success(res){
					    let data = res.data.data;
					    wx.setStorage({
						key:'marketInfo',
						data:data
					    })
					    console.log(res);
					    self.setData({
						joinTime:data.cretime,
						location:data.area,
					    })
					}
				})
				resolve()
			})
		})
		.then(()=>{//获取用户已发布的出售中商品
			return new Promise(resolve=>{
				wx.request({
					url:'http://123.57.249.95:8090/secondhand/goods/mine',
					data:{
					    openid:this.data.openid,
					    page:1,
					    size:256,
					    status:1
					},
					success(res){
						if(res.data.data){
							console.log(res.data.data);
							let length = res.data.data.length;
							self.setData({
								soldNum:length
							})
						}
					}
				})
				resolve()
			})
		})
		.then(()=>{
			return new Promise(resolve=>{
				wx.request({
					url:'http://123.57.249.95:8090/secondhand/goods/mine',
					data:{
					    openid:this.data.openid,
					    page:1,
					    size:256,
					    status:2
					},
					success(res){
						if(res.data.data){
							console.log(res.data.data);
							let length = self.data.soldNum + res.data.data.length;
							self.setData({
								soldNum:length
							})
						}
					}
				})
				resolve()
			})
		})
		.then(()=>{//获取用户收藏中的物品
			return new Promise(resolve=>{
				wx.request({
					url:'http://123.57.249.95:8090/secondhand/collection',
					data:{
					    openid:this.data.openid
					},
					success(res){
					    let arr = res.data.data;
					    console.log('collect array is ',arr)
					    self.setData({
						    collectNum:arr.length
					    })
					    wx.setStorage({
						    key:'collectionArray',
						    data:arr
					    })
					}
				})
				resolve()
			})
		})
		.then(()=>{//获取用户求购中的物品
			wx.request({
				url:'http://123.57.249.95:8090/secondhand/purchase/mine',
				data:{
				    openid:this.data.openid
				},
				success(res){
					let arr = res.data.data;
					self.setData({
						wantingNum:arr.length
					})
					wx.setStorage({
						key:'wantingArray',
						data:arr
					})
				}
			})
		})
    }
})