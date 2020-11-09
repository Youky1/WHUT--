// pages/signUp/signUp.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        userInfo:{},
        schmail:'',
        encdata:'',
        iv:'',
        sexArray:['男','女'],
        sexIndex:0,
        areaArray:['余家头校区','南湖校区','西院','东院','鉴湖校区','升升公寓'],
        areaIndex:0,
        buttonDisabled:false,
    },

    /**
     * 生命周期函数--监听页面加载
     * 读取用户userInfo
     */
    onLoad: function (options) {
        console.log('已跳转到注册页面')
        let userInfo = wx.getStorageSync('userInfo');
        this.setData({
            userInfo
        })
    },

    // 当性别或校区改变后，改变其相应的index值
    pickerChange(e){
        this.setData({
            [e.target.id]: e.detail.value
        })
    },

    // 绑定邮箱
    mailInput(e){
        this.setData({
            schmail:e.detail.value
        })
    },

    // 获取验证码
    getVcode(){
        // 未填写邮箱
        if(!this.data.schmail){
            wx.showToast({
                title:'还未填写邮箱',
                icon:'none'
            })
            return
        }

        // 设置按钮不可选中
        this.setData({
            buttonDisabled:true
        })
        var self = this;
        // 间隔一分钟后再试
        setTimeout(function(){
            self.setData({
                buttonDisabled:false
            })
        },6000)
        console.log(`注册邮箱为：${this.data.schmail}`)
        wx.request({
            url:'http://123.57.249.95:8090/secondhand/user/register/vcode',
            method:'POST',
            header:{
                'content-type': 'application/x-www-form-urlencoded'
            },
            data:{
                schmail:this.data.schmail
            },
            success(res){
                console.log('success  ',res.data)
                if(res.data.status === 1){
                    wx.showToast({
                        title:'验证码已成功发送'
                    })
                }
                else if(res.data.msg === 'invalid_mail'){
                    wx.showToast({
                        title:'该邮箱非武理邮箱',
                        icon:'none'
                    })
                }
                else if(res.data.msg === 'invalid_email_format'){
                    wx.showToast({
                        title:'邮箱格式出错',
                        icon:'none'
                    })
                }
                else if(res.data.msg === 'user_already_exist'){
                    wx.showToast({
                        title:'该邮箱已被注册',
                        icon:'none'
                    })
                }
                else{
                    console.log(res)
                    wx.showToast({
                        title:'服务器繁忙，请稍后再试',
                        icon:'none'
                    })
                }
            },
            fail(res){
                console.log('failed, ',res)
                wx.showToast({
                    title:'服务器繁忙，请稍后再试',
                    icon:'none'
                })
            }
        })
    },

    // 提交注册信息
    signUp(e){
        let data = Object.assign({},
            e.detail.value,
            {
                openid:wx.getStorageSync('openid'),
                // encdata:this.data.encdata,
                // iv:this.data.iv,
                // code:wx.getStorageSync('code')
            }
        )
        // 检查必填信息
        if(!data.name){
            wx.showToast({
                title:'还未填昵称哦',
                icon:'none'
            })
        }
        else if(!data.schmail){
            wx.showToast({
                title:'还未填邮箱哦',
                icon:'none'
            })
        }
        else if(!data.vcode){
            wx.showToast({
                title:'还未填验证码哦',
                icon:'none'
            })
        }
        else{ // 所有信息填写完毕
            // 检测昵称长度
            let str = data.name;
            let bytesCount = 0;
            for (var i = 0; i < str.length; i++){
                var c = str.charAt(i);
                if (/^[\u0000-\u00ff]$/.test(c)){ //匹配双字节
                    bytesCount += 1;
                }
                else{
                    bytesCount += 2;
                }
            }
            console.log(bytesCount)
            if(bytesCount > 18){
                wx.showToast({
                    title:'昵称过长',
                    icon:'none'
                })
                return
            }
            console.log('注册信息为：')
            console.log(data);
            wx.request({
                url:"http://123.57.249.95:8090/secondhand/user/register/verify",
                method:'POST',
                header:{
                    'content-type': 'application/x-www-form-urlencoded'
                },
                data,
                success(res){
                    console.log(res.data.msg)
                    if(res.data.status === 1){ // 注册成功
                        wx.showToast({
                            title:'注册成功',
                            icon:'none'
                        })
                        // 注册成功后，跳转页面
                        wx.navigateTo({
                            url:"../index/index"
                        })
                    }
                    else{ // 注册失败
                        if(res.data.msg === 'vcode_not_match'){
                            wx.showToast({
                                title:'验证码错误',
                                icon:'none'
                            })
                        }
                        else{
                            wx.showToast({
                                title:'未知错误，请稍后再试',
                                icon:'none'
                            })
                        }
                    }
                }
            })
        }
    }

})