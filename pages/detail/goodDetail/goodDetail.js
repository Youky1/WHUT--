// pages/detail/goodDetail/goodDetail.js
Page({

    // 页面的初始数据
    data: {
        goodData:{},
        pictures:[],
        solderInfo:{},
        collectUrl:'../../../img/collect.png',
        collectedStatus:false,
        isMine:false,
        actionNext:'',
        actionUrl:'',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onShow: function (options) {
        let self = this;
        let goodId = wx.getStorageSync('currentGoodid');
        console.log(goodId)

        let p = new Promise((resolve,rejected) => { // 获取物品信息
            wx.request({
                url:'http://123.57.249.95:8090/secondhand/goods/info',
                data:{
                    goodId
                },
                success(res){
                    console.log(res.data)
                    let goodData = res.data.data
                    let pictures = goodData.thumb.split(';');
                    pictures.pop()
                    let isMine = goodData.userid == wx.getStorageSync('openid')? true : false;
                    self.setData({
                        goodData,
                        pictures,
                        isMine
                    })
                    // 查询物品目前状态并设置可进行的操作
                    if(goodData.status == 1){
                        self.setData({
                            actionNext:'下架',
                            actionUrl:'../../../img/down.png'
                        })
                    }
                    else{
                        self.setData({
                            actionNext:'上架',
                            actionUrl:'../../../img/up.png'
                        })
                    }
                    resolve()
                }
            })
        })
        p.then(resolve =>{ // 获取卖家信息
            return new Promise(resolve => {
                wx.request({
                    url:'http://123.57.249.95:8090/secondhand/user/info',
                    data:{
                        openid:this.data.goodData.userid
                    },
                    success(res){
                        self.setData({
                            solderInfo:res.data.data
                        })
                        resolve()
                    }
                })
            })
        })
        .then(resolve => { // 查询该物品是否已收藏
            wx.request({
                url:'http://123.57.249.95:8090//secondhand/collection',
                data:{
                    userid:wx.getStorageSync('openid')
                },
                success(res){
                    res.data.data.forEach(item => {
                        if(item.id === self.data.goodData.id){
                            self.setData({
                                collectedStatus:true,
                                collectUrl:'../../../img/collected.png'
                            })
                        }
                    })
                }
            })
        })
        
    },

    // 擦亮物品（刷新上架时间）
    refresh(){
        if(!this.data.isMine){
            wx.showToast({
                title:'只能擦亮自己的商品哦',
                icon:'none'
            })
        }
        else{
            wx.request({
                url:'http://123.57.249.95:8090/secondhand/goods/lighten',
                method:'POST',
                header:{
                    'content-type':'application/x-www-form-urlencoded'
                },
                data:{
                    goodId:this.data.goodData.id,
                    openid:wx.getStorageSync('openid')
                },
                success(res){
                    if(res.data.status == 1){
                        wx.showToast({
                            title:'已刷新上架时间'
                        })
                    }
                    else{
                        console.log(res.data)
                        if(res.data.msg === "cant_lighten_twice_a_day"){
                            wx.showToast({
                                title:'一天只能擦亮一次哦',
                                icon:'none'
                            })
                        }
                        else{
                            wx.showToast({
                                title:'擦亮失败，请稍后再试',
                                icon:'none'
                            })
                        }
                    }
                }
            })
        }
    },

    // 上架/下架
    action(){
        let self = this;
        if(!this.data.isMine){
            wx.showToast({
                title:'只能修改自己的商品状态哦',
                icon:'none'
            })
        }
        else{
            let operation = this.data.actionNext == '下架' ? 'down' : 'up'
            wx.request({
                url:'http://123.57.249.95:8090/secondhand/goods/operate',
                method:'PUT',
                header:{
                    'content-type':'application/x-www-form-urlencoded'
                },
                data:{
                    goodid:this.data.goodData.id,
                    openid:wx.getStorageSync('openid'),
                    operation
                },
                success(res){
                    if(res.data.status == 1){
                        if(operation=='down'){
                            wx.showToast({
                                title:'下架成功'
                            })
                            self.setData({
                                actionNext:'上架',
                                actionUrl:'../../../img/up.png'
                            })
                            wx.switchTab({
                                url:'../../main/main'
                            })
                        }
                        else{
                            wx.showToast({
                                title:'上架成功'
                            })
                            self.setData({
                                actionNext:'下架',
                                actionUrl:'../../../img/down.png'
                            })
                            wx.switchTab({
                                url:'../../main/main'
                            })
                        }
                    }
                    else{
                        wx.showToast({
                            title:'修改失败，请稍后再试',
                            icon:'none'
                        })
                    }
                }
            })
        }
    },

    // 点击收藏按钮
    collect(){
        if(!wx.getStorageSync('userHasSignUp')){
            wx.showToast({
                title:'还未注册，不能收藏商品',
                icon:'none'
            })
            return;
        }
        let self = this;
        if(!this.data.collectedStatus){ // 如果还未收藏该商品
            wx.request({
                url:'http://123.57.249.95:8090//secondhand/collection',
                method:'POST',
                header:{
                    'content-type':'application/x-www-form-urlencoded'
                },
                data:{
                    openid:wx.getStorageSync('openid'),
                    goodId:self.data.goodData.id
                },
                success(res)
                {
                    if(res.data.status == 1){
                        self.setData({
                            collectUrl:'../../../img/collected.png',
                            collectedStatus:true
                        })
                        wx.showToast({
                            title:'添加成功！'
                        })
                    }
                    else{
                        console.log(res)
                        wx.showToast({
                            title:'添加失败！',
                            icon:'none'
                        })
                    }
                }
            })
        }
        else{ //该商品已收藏
            wx.request({
                url:'http://123.57.249.95:8090/secondhand/collection',
                method:'DELETE',
                header:{
                    'content-type':'application/x-www-form-urlencoded'
                },
                data:{
                    openid:wx.getStorageSync('openid'),
                    goodId:self.data.goodData.id
                },
                success(res){
                    if(res.data.status == 1){
                        wx.showToast({
                            title:'已取消收藏'
                        })
                        self.setData({
                            collectUrl:'../../../img/collect.png',
                            collectedStatus:false
                        })
                    }
                    else{
                        console.log(res.data)
                        wx.showToast({
                            title:'取消收藏失败',
                            icon:'none'
                        })
                    }
                }
            })
            this.setData({
                url:'../../../img/collect.png',
                collectedStatus:false
            })
        }
        
    },

    // 修改物品信息
    update(){
        if(this.data.isMine){
            wx.navigateTo({
                url:'../updateGood/updateGood'
            })
            wx.showToast({
                title:'请重新填写物品信息'
            })
        }
        else{
            wx.showToast({
                title:'只能修改自己的物品哦',
                icon:'none'
            })
        }
        
    },

    // 删除商品
    delete(){
        let self = this;
        if(this.data.isMine){
            wx.showModal({
                title:'删除物品',
                content:'确认要删除吗？',
                success(res){
                    if(res.confirm){// 用户点击确认删除
                        console.log('delete')
                        wx.request({
                            url:'http://123.57.249.95:8090/secondhand/goods/operate',
                            method:'PUT',
                            header:{
                                'content-type':'application/x-www-form-urlencoded'
                            }, 
                            data:{
                                openid:wx.getStorageSync('openid'),
                                goodid:self.data.goodData.id,
                                operation:'delete'
                            },
                            success(res){
                                console.log(res.data.status)
                                if(res.data.status == 1){
                                    wx.showToast({
                                        title:'删除成功'
                                    })
                                    setTimeout(()=>{
                                        wx.switchTab({
                                            url:'../../main/main',
                                        })
                                    },1000)
                                    
                                }
                                else{
                                    console.log(res.data)
                                    wx.showToast({
                                        title:'删除失败，请稍后再试',
                                        icon:'none'
                                    })
                                }
                            },
                            fail(res){
                                console.log('fail')
                            }
                        })
                    }
                    else if(res.cancel){ // 用户取消删除
                        return
                    }
                }
            })
        }
        else{
            wx.showToast({
                title:'只能删除自己的物品哦',
                icon:'none'
            })
        }
        
    },
})