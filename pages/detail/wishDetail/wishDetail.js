// pages/detail/wishDetail/wishDetail.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        wishData:{},
        pictures:[],
        solderInfo:{},
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onShow: function (options) {
        let wishid = wx.getStorageSync('currentWishid');
        let p = new Promise(resolve => { // 查询求购信息
            wx.request({
                url:'http://123.57.249.95:8090/secondhand/purchase/info',
                data:{
                    purchaseId:wishid
                },
                success: res => {
                    let data = res.data.data;
                    let pictures = data.pics.split(';');
                    pictures.pop();
                    this.setData({
                        wishData:data,
                        pictures
                    })
                    resolve(data.userid);
                }
            })
        })
        p.then(userid => { // 查询卖家信息
            wx.request({
                url:'http://123.57.249.95:8090/secondhand/user/info',
                data:{
                    openid:userid
                },
                success: res => {
                    let isMine = res.data.data.id === wx.getStorageSync('openid');
                    this.setData({
                        solderInfo:res.data.data,
                        isMine
                    })
                }
            })
        })
        
    },

    // 删除求购
    deleteWish(){
        let self = this;
        // 判断是否是自己的求购
        if(!isMine){
            wx.showToast({
                title:'只能删除自己的求购哦',
                icon:'none'
            })
            return;
        }
        wx.showModal({
            title:'删除求购',
            content:'确认要删除吗？',
            success(res){
                if(res.confirm){
                    // 发送删除请求
                    wx.request({
                        url:'http://123.57.249.95:8090/secondhand/purchase',
                        method:'DELETE',
                        header:{
                            'Content-Type':'application/x-www-form-urlencoded'
                        },
                        data:{
                            openid,
                            purchaseId:self.data.wishData.id
                        },
                        success: res => {
                            if(res.data.status == 1){
                                wx.switchTab({
                                    url:'../../user/mine/mine'
                                })
                                wx.showToast({
                                    title:'删除成功！'
                                })
                            }
                        }
                    })
                }
                else return;
            }
        })
        
    },

    // 修改求购
    updateWish(){
        // 判断是否是自己的求购
        if(!isMine){
            wx.showToast({
                title:'只能修改自己的求购哦',
                icon:'none'
            })
            return;
        }
        // 跳转至更新求购的页面
        wx.navigateTo({
            url:'../updateWish/updateWish'
        })
    },
})