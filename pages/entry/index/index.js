const app = getApp()

Page({
    data: {
        userInfo: {},
        hasUserInfo: false,
        openid:''
    },
    
    getInfo()
    {
        let self = this;

        /**
         * 获取userInfo并存储
         */
        let promise = new Promise((resolve,rejected) => {  
	        wx.getUserInfo({
	        	success(res){
	        	    if(res.userInfo) {
	        		    self.setData({
	        		        userInfo: res.userInfo,
	        		        hasUserInfo: true
	        		    })
	        		    wx.setStorage({
	        		        key: 'userInfo',
	        		        data: res.userInfo,
                        })
                        resolve()
	        	    }
	        	}
	        })
        })
        /**
         * 调用login 获取用户的code用于登录，登录后获得openid并存储
         */
	    promise.then(resolve => { 
            return new Promise(resolve => {
                wx.login({
                    success: (res)=> {
                        let code = res.code;
                        wx.setStorage({
                            key:'code',
                            data:code
                        })
                        resolve()
                    }
                })
                
            })
        })
        /**
         * 获取openid并存储
         * 为方便调试，目前在此处将openid置为1
         * 正常使用时需修改
         */
        .then(resolve => {
            return new Promise(resolve => {
                wx.request({
                    url: 'http://123.57.249.95:8090/secondhand/user/login',
                    method: 'GET',
                    data: {
                        code:wx.getStorageSync('code')
                    },
                    success: (res)=> {
                        if (res.data.status == 1){
                            let openid = res.data.data.openid;//正常赋值
                            // let openid = 1; // 使用测试账号
                            wx.setStorage({
                                key: 'openid',
                                data: openid,
                            })
                            self.setData({
                                openid
                            })
                            resolve()
                        } else {
                            wx.showToast({
                                title: '服务器繁,请稍后重试',
                                icon:'loading'
                            })
                        }
                    }
                })
            })
        })
        /**
         * 检查用户是否已注册，并将该参数储存为userHasSignUp
         * 跳转至主页面
         */
        .then(resolve => {
            wx.request({
                url: 'http://123.57.249.95:8090/secondhand/user/check',
                data:{
                    openid:self.data.openid
                },
                success(res){
                    //已完成注册
                    if(res.data.status === 1){
                        wx.setStorageSync('userHasSignUp',true)
                        //查询用户注册信息marketInfo
                        wx.request({
                            url:'http://123.57.249.95:8090/secondhand/user/info',
                            data:{
                                openid:self.data.openid
                            },
                            success(res){
                                wx.setStorage({
                                    key:'marketInfo',
                                    data:res.data.data
                                })
                            }
                        })
                    }
                    //未注册
                    else{
                        wx.setStorageSync('userHasSignUp',false);
                        wx.showToast({
                            title:'还未注册，以游客模式进入',
                            icon:'none'
                        })
                    }
                    // 跳转至主界面
                    wx.switchTab({
                        url: '../../main/main',
                    })
                }
            })
    
        })
        
    }
}) 