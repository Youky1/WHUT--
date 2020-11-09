// pages/need/need.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        nameInput:'',
        descriptionInput:'',
        originalPriceInput:'',
        priceInput:'',
        number:'',
        finalURL:'',//最终上传的外网可访问的url
        locationArray: ['余家头校区', '南湖校区','东院','西院','鉴湖校区'],
        locationIndex: 0,
        sortArray: ['教材书籍', '水卡票卷', '电子数码', '生活用品', '衣物服饰', '运动健身', '代步出行', '校用电器', '彩妆护肤', '其他分类'],
        sortIndex: 0,
        bargin:false,//是否可砍价
        inputImageArray: [],
        inputImageOff: true,//是否还能添加图片
        openid:'',
    },

    /**
     * 生命周期函数--监听页面加载
     * 获取openid
     */
    onLoad: function (options) {
        wx.getStorage({
            key: 'openid',
            success: (res)=> {
                if(res.data){
                    this.setData({
                        openid: res.data
                    })
                    console.log(this.data.openid);
                } else {
                    wx.showToast({
                        title: '获取Id失败请重新登录后重试',
                    })
                }
            },
        })
    },

    //获取物品名称
    bindNameInput(e){
        this.setData({
            nameInput: e.detail.value
        })
    },

    //获取物品描述
    bindDescriptionInput(e){
        this.setData({
            descriptionInput:e.detail.value
        })
    },

    //获取物品原价
    bindOriginalPriceInput(e){
        this.setData({
            originalPriceInput:e.detail.value
        })
    },

    //获取物品价格
    bindPriceInput(e){
        this.setData({
            priceInput:e.detail.value
        })
    },

    //获得物品数量
    bindNumberInput(e){
        this.setData({
            number:e.detail.value
        })
    },

    /**
     * 分类和校区改变后，改变相应的index值
     * e.detail.value是选中项在数组中的索引
     * e.target.id：locationIndex/sortIndex
     */
    pickerChange(e){
        this.setData({
            [e.target.id]: e.detail.value
        })
    },

    //选择图片
    inputPhoto(){
        let newArray = this.data.inputImageArray
        let count = 6 - newArray.length//还可以添加count张图片
        var self = this;
        wx.chooseImage({
            'count': count,
            success: (res) => {
                //如果选中图片的数量等于剩余容量，则不再显示添加图片按钮
                if (res.tempFilePaths.length == count){
                    this.setData({
                        'inputImageOff': false
                    })
                }

                //将选中图片加入数组
                res.tempFilePaths.forEach((item) => {
                    newArray.push(item)
                })

                self.setData({
                    inputImageArray: newArray
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
            inputImageArray:imageArray
        })
    },

    //发布商品
    release(e) {
        let form= e.detail.value;
        form.openid = this.data.openid;
        form.name = this.data.nameInput;
        form.amount = this.data.number;
        form.price = this.data.priceInput;
        form.oriprice = this.data.originalPriceInput;
        form.cat = form.cat + 1;
        form.area = this.data.locationArray[this.data.locationIndex];
        form.description = this.data.descriptionInput;
        if(this.data.nameInput.length > 10){
            wx.showToast({
                title: "标题不能超过十个字哦",
                icon:"none"
            })
            return;
        }
        //当信息填写不完整时进行提示
        if(!form.name){
            wx.showToast({
                title: "还未填写宝贝标题",
                icon:"none"
            })
        }
        else if(!form.description){
            wx.showToast({
                title: "还未填写宝贝描述",
                icon:"none"
            })
        }
        else if(!form.price){
            wx.showToast({
                title: "还未填写价格",
                icon:"none"
            })
        }
        else if(!form.oriprice){
            wx.showToast({
                title: "还未填写原价", 
                icon:"none"
            })
        }
        else if(this.data.inputImageArray.length === 0){
            wx.showToast({
                title: "还未添加宝贝图片", 
                icon:"none"
            })
        }
        else{
            let self = this;
            let app = getApp();
            app.processArray(this.data.inputImageArray,(value)=>{
                app.sendPic(self,value)
            })

            /**
             * 完成物品的最终发布
            */
            setTimeout(()=>{
                form.goodid = wx.getStorageSync('currentGoodid')
                form.picUrls = this.data.finalURL;
                wx.request({
                    method: 'POST',
                    header: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    url:'http://123.57.249.95:8090/secondhand/goods/modify',
                    data: form,
                    success: (res)=> {
                        //发布成功
                        if(res.data.status === 1){
                            wx.navigateBack();
                            wx.showToast({
                                title: "发布成功", 
                                icon:"success"
                            })
                        }
                        //出错
                        else{
                            wx.showToast({
                                title: "出错啦", 
                                icon:"none"
                            })
                        }
                    }
                })
            },1000)
            
             
        }

    },

    
})