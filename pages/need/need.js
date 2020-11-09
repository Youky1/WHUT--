// pages/release/release.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        locationArray: ['余家头校区','南湖校区','西院','东院','鉴湖校区'],
        locationIndex: 0,
        inputImageArray: [],
        inputImageOff: true,
        openid:'',
        name:'',
        description:'',
        finalURL:''
    },

    //获取openid
    onLoad: function (options) {
        wx.getStorage({
            key: 'openid',
            success: (res) => {
                if (res.data) {
                    this.setData({
                        openid: res.data
                    })
                } else {
                    wx.showToast({
                        title: '获取Id失败请重新登录后重试',
                    })
                }
            },
        })
    },

    //获取物品名称
    bindName(e){
        this.setData({
            name:e.detail.value
        })
    },

    //获取物品描述
    bindDescription(e){
        this.setData({
            description:e.detail.value
        })
    },

    //添加图片
    inputPhoto() {
        let inputImageArray = this.data.inputImageArray
        let count = 3 - inputImageArray.length
        wx.chooseImage({
            'count': count,
            success: (res) => {
                //如果没有可选cout关闭添加
                if (res.tempFilePaths.length == count) {
                    this.setData({
                        'inputImageOff': false
                    })
                }
                res.tempFilePaths.forEach((item) => {
                    inputImageArray.push(item)
                })
                this.setData({
                    'inputImageArray': inputImageArray
                })
            }
        })
    },

    //删除已选图片
    deletePhoto(event){
        let index = event.target.dataset.index;//要删除的图片位置
        console.log(this.data.inputImageArray);
        let imageArray = this.data.inputImageArray;
        imageArray.splice(index,1);
        this.setData({
            inputImageArray:imageArray,
            inputImageOff:true
        })
    },

    //发布求购信息
    need(e){
        if(!wx.getStorageSync('userHasSignUp')){
            wx.showToast({
                title:'还未注册，不能发布求购',
                icon:'none'
            })
            return;
        }
        let form = e.detail.value;
        form.openid = this.data.openid;
        form.area = this.data.locationArray[form.area];
        form.name = this.data.name;
        form.description = this.data.description;
        if(form.name.length > 10){
            wx.showToast({
                title:'名称不能超过十个字哦',
                icon:'none'
            })
            return;
        }
        //当填写信息不完整时进行提醒
        if(!form.name){
            wx.showToast({
                title:'还未填写求购物品名称',
                icon:'none'
            })
        }
        else if(!form.description){
            wx.showToast({
                title: "还未填写求购物品信息",
                icon:"none"
            })
        }
        //信息填写完整时，发布求购请求
        else {
            //提交图片，获取最终的图片URL
            let self = this;
            let app = getApp();
            if(this.data.inputImageArray.length > 0){
                let p = app.sendAllArray(this.data.inputImageArray,0,'')
                p.then(url => {
                    form.picUrls = url;
                    //完成最终发布的请求
                    wx.request({
                        method: 'POST',
                        url: 'http://123.57.249.95:8090/secondhand/purchase',
                        header: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        data: form,
                        success: (res) => {
                            //清空用户输入
                            self.setData({
                                locationIndex: 0,
                                inputImageArray: [],
                                inputImageOff: true,
                                openid:'',
                                name:'',
                                description:'',
                                finalURL:''
                            })
                            console.log('发布求购后的URL为：',res.data.data.pics);
                            //提示成功
                            wx.showToast({
                                title:'发布成功',
                                icon:'none'
                            })
                        }
                    })
                })
            }
        }
            
    },

})