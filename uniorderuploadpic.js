var g_image_key_token = {};
var g_image_url = {};
function GetImageKey() {
    MyPost(G_CGI_PHP.qiniu.newtoken,
        {
            category: "license_driving",
            extra_data: "order_id," + GetUrlPara('order_id')
        },
        ShowLoading,
        HideLoading,
        function (data) {
            $.each(data, function (i) {
                    if (data[i] && data[i]['type']) {
                        var key_token = {};
                        key_token['key'] = data[i]['key'];
                        key_token['token'] = data[i]['token'];
                        g_image_key_token[data[i]['type']] = key_token;
                        console.log(key_token)
                        console.log(g_image_key_token)
                    }
                }
            );
        },
        function (data, code, msg) {
            PopBadAlert('操作失败1！');
        });
}

function FitImgUpload() {
    var _imgs = {
        'img_license_front': '',
        'img_license_back': '',
        'img_driving_front': '',
        'img_driving_back': ''
    };
    for (var id in _imgs) {

        $('#' + id).localResizeIMG({
            id: id,
            width: 500,
            quality: 0.8,
            before: function (blob, file) {
                ShowLoading();
            },
            success: function (result) {
                var _id = this.id;
                var type = _id.substr(_id.indexOf('_') + 1);
                console.log("type=" + type);
                QiniuUploadImage2(g_image_key_token[type]['key'],
                    g_image_key_token[type]['token'],
                    result.clearBase64,
                    function (data) {
                        $('#_' + _id).attr('src',result.base64).show();
                        //$('#' + _id).parent().find('span').html('更换图片');
                        PopAlert('上传成功');
                        if($(".img_show[src]").length>0)
                        {
                            $("button").removeClass("btn-submit02").addClass("btn-submit01").removeAttr("disabled");
                        }else{
                            $("button").removeClass("btn-submit01").addClass("btn-submit02").attr("disabled","disabled");
                        }
                    },
                    function (data, msg, code) {
                        PopAlert('上传失败');
                    }
                )
            }
        });
    }

}

function initImage() {

    g_image_url = {};
    MyPost(G_CGI_PHP.order.query_order_pictures,
        {
            order_id: GetUrlPara('order_id')
        },
        ShowLoading,
        HideLoading,
        function (data) {
            $.each(data, function (i) {
                    if (data[i] && data[i]['type']) {
                        g_image_url[data[i]['type']] = data[i]['url'];
                    }
                }
            );
            var _imgs = [
                'img_license_front',
                'img_license_back',
                'img_driving_front',
                'img_driving_back'
            ];
            for (var i = 0; i < _imgs.length; i++) {
                var _id = _imgs[i];
                var type = _id.substr(_id.indexOf('_') + 1);
                $('#_' + _id).attr('src',g_image_url[type]).show();
            }
            if($(".img_show[src]").length>0)
            {
                $("button").removeClass("btn-submit02").addClass("btn-submit01").removeAttr("disabled");
            }else{
                $("button").removeClass("btn-submit01").addClass("btn-submit02").attr("disabled","disabled");
            }
        },
        function (data, code, msg) {
        });


}

function Submit(){
    if($(".license .img_show[src]").length == 0){
        PopAlert('身份证信息不能为空！');
        return false;
    }

    if($(".driving .img_show[src]").length == 0){
        PopAlert('驾驶证信息不能为空！');
        return false;
    }

    if(window.navigator.onLine==true){

        if($(".img_show[src]").length<4)
        {
            PopConfirm({
                width:"80%",
                title:'确认提醒',
                content:'请确认已经上传所有资料，提交后将无法修改。',
                ybtn:'是',
                nbtn:'否',
                onyes:function(i)
                {
                    layer.close(i);
                    //  $("button").removeClass("btn-submit01").addClass("btn-submit02").attr("disabled","disabled");
                    PopGoodAlert('提交成功，请耐心等待保险公司配送！');
                    confirmPicUploadStatus(true);
                }
            });
        }else{
            // $("button").removeClass("btn-submit01").addClass("btn-submit02").attr("disabled","disabled");
            PopGoodAlert('提交成功，请耐心等待保险公司配送！');
            confirmPicUploadStatus(false);
        }
    }
    else{
        PopAlert('网络异常，请稍后再试！');
    }


}

function confirmPicUploadStatus(shouldWaitSeconds)
{
    MyPost(G_CGI_PHP.order.set_order_pictures,
        {
            order_id:GetUrlPara('order_id')
        },
        null,
        null,
        function()
        {
            if (shouldWaitSeconds) {
                setTimeout(function(){
                   JumpUrl('uniorderlist.html');
                },3000)
            } else {
                JumpUrl('uniorderlist.html');
            }
        },
        function()
        {
        }
    );
}

function onload() {
    GetImageKey();
    FitImgUpload();
    initImage();

}

$(function () {
    onload();
});

