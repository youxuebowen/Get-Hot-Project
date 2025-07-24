const pushedDataBody = document.getElementById('pushed-data-body');
        const pushedLoadingIndicator = document.getElementById('pushed-loading-indicator');
        const pushedEndIndicator = document.getElementById('pushed-end-indicator');
        // 推送管理分页元素
        const pushedPrevPageBtn = document.getElementById('pushed-prev-page');
        const pushedNextPageBtn = document.getElementById('pushed-next-page');
        const pushedPageInfo = document.getElementById('pushed-page-info');

        let pushedCurrentPage = 1;
        const pushedPageSize = 10; // 每页10条数据
        let pushedIsLoading = false;
        let pushedHasMoreData = true;
        let pushedTotalPages = 1;

        // 初始加载推送数据
        loadPushedData();


        // 添加推送管理页码按钮点击事件
        if (pushedPrevPageBtn) {
            pushedPrevPageBtn.addEventListener('click', function() {
                if (pushedCurrentPage > 1) {
                    pushedCurrentPage--;
                    resetAndLoadPushedData(false);
                }
            });
        }

        if (pushedNextPageBtn) {
            pushedNextPageBtn.addEventListener('click', function() {
                if (pushedCurrentPage < pushedTotalPages) {
                    pushedCurrentPage++;
                    resetAndLoadPushedData(false);
                }
            });
        }

        // 重置并加载推送管理第一页数据
        function resetAndLoadPushedData(resetPage = true) {
            if (resetPage) {
                pushedCurrentPage = 1;
            }
            pushedHasMoreData = true;
            pushedDataBody.innerHTML = '<tr class="loading-row"><td colspan="8">加载中...</td></tr>';
            pushedEndIndicator.style.display = "none";
            loadPushedData();
        }

        // 更新推送管理页码按钮状态
        function updatePushedPaginationButtons() {
            if (pushedPrevPageBtn) {
                pushedPrevPageBtn.disabled = pushedCurrentPage <= 1;
            }
            if (pushedNextPageBtn) {
                pushedNextPageBtn.disabled = pushedCurrentPage >= pushedTotalPages || !pushedHasMoreData;
            }
            if (pushedPageInfo) {
                pushedPageInfo.textContent = `第 ${pushedCurrentPage} 页 / 共 ${pushedTotalPages} 页`;
            }
        }

        // 辅助函数：根据类型值获取类型名称
        function getTypeName(type) {
            if (type === 1) return 'GitHub应用';
            if (type === 2) return '文章';
            return '文章'; // 默认为文章
        }

        // 辅助函数：HTML转义
        function escapeHtml(unsafe) {
            if (!unsafe) return "";
            return unsafe
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#039;");
        }

        // 辅助函数：截断长文本
        function truncateText(text, maxLength) {
            if (!text) return "";
            if (text.length <= maxLength) return text;
            return text.substring(0, maxLength) + "...";
        }

        // 辅助函数：格式化标签为徽章样式
        function formatTags(tagString) {
            if (!tagString) return "";
            return tagString
                .split(",")
                .map((tag) => {
                    tag = tag.trim();
                    return tag
                        ? `<span class="tag-badge">${escapeHtml(tag)}</span>`
                        : "";
                })
                .join("");
        }

        // 辅助函数：格式化日期
        function formatPushedDate(dateString) {
            if (!dateString) return "";
            const date = new Date(dateString);
            return date.toLocaleString("zh-CN", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
            });
        }

        // 加载推送管理数据函数
        function loadPushedData() {
            if (pushedIsLoading || !pushedHasMoreData) return;

            pushedIsLoading = true;
            pushedLoadingIndicator.style.display = "block";
            updatePushedPaginationButtons();

            // 构建查询参数，只查询if_chosen为1的数据
            let url = `/api/v1/get-chosen-content/?page=${pushedCurrentPage}&page_size=${pushedPageSize}&if_chosen=1`;
            console.log('main2.js API请求URL:', url);

            // 添加CSRF令牌获取逻辑
            function getCookie(name) {
                let cookieValue = null;
                if (document.cookie && document.cookie !== '') {
                    const cookies = document.cookie.split(';');
                    for (let i = 0; i < cookies.length; i++) {
                        const cookie = cookies[i].trim();
                        if (cookie.substring(0, name.length + 1) === (name + '=')) {
                            cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                            break;
                        }
                    }
                }
                return cookieValue;
            }

            const csrftoken = getCookie('csrftoken');

            // 发起API请求
            fetch(url,{headers: {
                        'X-CSRFToken': csrftoken
                    }})
                .then((response) => {
                    if (!response.ok) throw new Error("网络响应不正常");
                    return response.json();
                })
                .then((data) => {
                    pushedTotalPages = Math.ceil(data.count / pushedPageSize);
                    if (pushedCurrentPage === 1) pushedDataBody.innerHTML = "";

                    if (data.results.length === 0) {
                        if (pushedCurrentPage === 1) {
                            pushedDataBody.innerHTML = '<tr><td colspan="8">没有找到匹配的数据</td></tr>';
                        } else {
                            pushedHasMoreData = false;
                            pushedEndIndicator.style.display = "block";
                        }
                    } else {
                        // 添加数据行
                        data.results.forEach((item) => {
                            const row = document.createElement("tr");
                            row.innerHTML = `<td>${item.id}</td>
                            <td>${escapeHtml(item.name)}</td>
                            <td>${escapeHtml(truncateText(item.description, 50))}</td>
                            <td><a href="${escapeHtml(item.url)}" target="_blank">查看</a></td>
                            <td>${formatTags(item.tag)}</td>
                            <td>${getTypeName(item.type)}</td>
                            <td><button class="btn btn-clear" data-id="${item.id}">清除</button></td>
                            <td>${formatPushedDate(item.updated_time)}</td>`;
                            pushedDataBody.appendChild(row);

                            // 为清除按钮添加点击事件
                            const clearBtn = row.querySelector('.btn-clear');
                            clearBtn.addEventListener('click', function() {
                                const id = this.getAttribute('data-id');
                                clearItem(id, row);
                            });
                        });

                        if (data.next === null) {
                            pushedHasMoreData = false;
                            pushedEndIndicator.style.display = "block";
                        }
                    }
                    pushedPageInfo.textContent = `第 ${pushedCurrentPage} 页 / 共 ${pushedTotalPages} 页`;
                    updatePushedPaginationButtons();
                })
                .catch((error) => {
                    console.error("加载推送数据时出错:", error);
                    if (pushedCurrentPage === 1) {
                        pushedDataBody.innerHTML = '<tr><td colspan="8">加载数据失败，请刷新页面重试</td></tr>';
                    }
                })
                .finally(() => {
                    pushedIsLoading = false;
                    pushedLoadingIndicator.style.display = "none";
                });
        }

        //清除功能：将if_chosen设置为0
        function clearItem(id, row) {
            // 获取CSRF令牌
            function getCookie(name) {
                let cookieValue = null;
                if (document.cookie && document.cookie !== '') {
                    const cookies = document.cookie.split(';');
                    for (let i = 0; i < cookies.length; i++) {
                        const cookie = cookies[i].trim();
                        if (cookie.substring(0, name.length + 1) === (name + '=')) {
                            cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                            break;
                        }
                    }
                }
                return cookieValue;
            }

            const csrftoken = getCookie('csrftoken');

            // 发送请求到后端
            fetch('/api/v1/update-chosen/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrftoken
                },
                body: JSON.stringify({ ids: [id], if_chosen: 0 }) // 设置if_chosen为0
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    showToast(`成功清除 ID: ${id} 的数据`);
                    // 从表格中移除该行
                    row.remove();
                    // 如果表格为空，重新加载数据
                    if (pushedDataBody.children.length === 0) {
                        resetAndLoadPushedData();
                    }
                } else {
                    showToast('清除失败: ' + data.error);
                }
            })
            .catch(error => {
                console.error('清除出错:', error);
                showToast('清除过程中发生错误');
            });
        }
         // 显示提示消息
        function showToast(message) {
            // 创建toast元素
            const toast = document.createElement('div');
            toast.className = 'toast';
            toast.textContent = message;
            
            // 添加到页面
            document.body.appendChild(toast);
            
            // 设置样式
            toast.style.position = 'fixed';
            toast.style.bottom = '20px';
            toast.style.left = '50%';
            toast.style.transform = 'translateX(-50%)';
            toast.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
            toast.style.color = 'white';
            toast.style.padding = '10px 20px';
            toast.style.borderRadius = '4px';
            toast.style.zIndex = '1000';
            toast.style.transition = 'opacity 0.3s ease';
            
            // 3秒后移除
            setTimeout(() => {
                toast.style.opacity = '0';
                setTimeout(() => {
                    document.body.removeChild(toast);
                }, 300);
            }, 3000);
        }
        function escapeHtml(unsafe) {
            if (!unsafe) return "";
            return unsafe
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#039;");
        }

        // 辅助函数：截断长文本
        function truncateText(text, maxLength) {
            if (!text) return "";
            if (text.length <= maxLength) return text;
            return text.substring(0, maxLength) + "...";
        }

        // 辅助函数：格式化标签为徽章样式
        function formatTags(tagString) {
            if (!tagString) return "";
            return tagString
                .split(",")
                .map((tag) => {
                    tag = tag.trim();
                    return tag
                        ? `<span class="tag-badge">${escapeHtml(tag)}</span>`
                        : "";
                })
                .join("");
        }

        // 辅助函数：格式化日期
        function formatPushedDate(dateString) {
            if (!dateString) return "";
            const date = new Date(dateString);
            return date.toLocaleString("zh-CN", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
            });
        }
          // 辅助函数：根据类型值获取类型名称
        function getTypeName(type) {
            if (type === 1) return 'GitHub应用';
            if (type === 2) return '文章';
            return '文章'; // 默认为文章
        }
// 在文件末尾添加
// 监听推送数据更新事件，一但if_chosen改变，立刻更新数据
        document.addEventListener('pushedDataUpdated', function() {
    resetAndLoadPushedData();
});