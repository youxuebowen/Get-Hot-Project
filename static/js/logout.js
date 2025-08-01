// 退出登录功能
function logout() {
    // 发送AJAX请求到退出登录接口
    fetch('logout', {
        method: 'POST',
        credentials: 'same-origin', // 包含cookies
        headers: {
            'X-CSRFToken': getCSRFToken() // 获取CSRF令牌
        }
    })
    .then(response => {
        if (response.ok) {
            // 退出成功后重定向到登录页面
            window.location.href = 'login';
        } else {
            alert('退出登录失败，请重试1');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('退出登录失败，请重试2');
    });
}

// 获取CSRF令牌的函数
function getCSRFToken() {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // 只查找csrftoken cookie
            if (cookie.substring(0, 10) === 'csrftoken=') {
                cookieValue = decodeURIComponent(cookie.substring(10));
                break;
            }
        }
    }
    return cookieValue;
}