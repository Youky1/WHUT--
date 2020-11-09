// components/goodItem/goodItem.js
Component({
	/**
	 * 组件的属性列表
	 */
	properties: {
		good:{
			type:'Object',
			value:{
				id:'',
				name:'name',
				amount:'',
				cat:'',
				description:'',
				thumb:'../../img/pictureNotFound.png',
				price:'',
				oriprice:'',
				area:'',
				status:'',
				cretime:'',
				views:'',
				v:'',
				type:'',
				uname:'',//卖家名称
				sex:'',
				userid:'',
			}
		},
		url:{
			type:'String',
		}
	},

	/**
	 * 组件的初始数据
	 */
	data: {
		firstPic:''
	},

	/**
	 * 组件的方法列表
	 */
	methods: {
		// 点击跳转至详情页面
		toGoodDetail(){
			let self = this;
			wx.setStorage({
				key:'currentGoodid',
				data:this.data.good.id,
				success(){
					wx.navigateTo({
						url:self.data.url
					})
				}
			})
		},
	},

	/**
	 * 对收藏信息做预处理：剪切URL，若没有图片显示默认图片
	 */
	lifetimes:{
		attached(){
			let good = this.properties.good;
			let firstPic = '';
			if(!good.thumb){
				firstPic = '../../img/pictureNotFound.png'
			}
			else{
				firstPic = good.thumb.split(';')[0];
			}
			this.setData({
				firstPic
			})
		}
	},

	
	
})
