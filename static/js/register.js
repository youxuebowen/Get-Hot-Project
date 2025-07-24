function captchaBtnClick(){
    const captchaBtn= document.getElementById('captcha-btn')
    // 绑定事件
    captchaBtn.addEventListener('click',function(event){
        // 获取值
        const email=document.querySelector("input[name='email']").value
        console.log(email)
        // 检查费控
        if(!email){
            alert('邮箱不能为空')
            return;
        }
        // 禁用按钮反复点击
        captchaBtn.removeEventListener('click',arguments.callee)
        // 发送ajax请求（）jquery
        $.ajax('captcha?email='+email,{
            method:'GET',
            success:function(result){
                if(result['code']==200){
                    alert('验证码发送成功，请注意查收')
                }else{
                    alert(result['message'])
                }
            },
            fail:function(error){
                console.log(error)
            }
        })
        // 倒计时
        let count=3
        const timer=setInterval(function(){
            // 倒计时结束回复按钮
            if(count<=0){
                captchaBtn.textContent='获取验证码'
                clearInterval(timer)//清空计时器
                captchaBtnClick()//重新绑定点击事件
            }else{
                //计时器没有结束
                captchaBtn.textContent=count+'秒'
                count--
            }
        },1000)//每1000毫秒执行一次这个函数
    })
}
//初始化点击事件
captchaBtnClick();