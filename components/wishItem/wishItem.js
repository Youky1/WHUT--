// components/wishItem/wishItem.js
Component({
	/**
	 * 组件的属性列表
	 */
	properties: {
		wish:{
		    type:'Object',
		    value:{
		        id:'',
		        userid:'',
		        name:'title',
		        cretime:'2020/9/8',
		        description:'',
		        pics:'../../img/pictureNotFound.png'
		    }
		},
		url:{
			type:'String'
		}
	},
	data: {
		firstPic:''
	},
	methods: {
		toWishDetail(){
			let self = this;
			wx.setStorage({
				key:'currentWishid',
				data:this.data.wish.id,
				success(){
					wx.navigateTo({
						url:self.data.url
					})
				}
			})
		},
	},

	lifetimes:{
		/**
		 * 对求购信息做预处理：
		 * 1. 转换时间格式；
		 * 2. 检查是否有图片，若没有则显示默认图片
		 */
		attached(){
			let finalWish = this.properties.wish;
			let firstPic = '';
			if(!finalWish.pics){
				firstPic = '../../img/pictureNotFound.png'
			}
			else{
				firstPic = finalWish.pics.split(';')[0];
			}
			let time = new Date(Number(finalWish.cretime));
			let year = time.getFullYear();
			let month = time.getMonth() + 1;
			let day = time.getDate();
			let timeStr = year + '.' + month + '.' + day;
			console.log('finally time is ',timeStr)
			finalWish.cretime = timeStr;
			this.setData({
				wish:finalWish,
				firstPic
			})
		}
	}
})