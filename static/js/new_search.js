document.addEventListener('DOMContentLoaded', function() {
            // 初始化变量
            let cveCurrentPage = 1;
            const cvePageSize = 10;
            
            // 获取DOM元素
            const cveTimeTrigger = document.getElementById('cve-time-range-trigger');
            const cveDatePicker = document.getElementById('cve-date-picker');
            const cveStartDate = document.getElementById('cve-start-date');
            const cveEndDate = document.getElementById('cve-end-date');
            const cveDateDisplay = document.getElementById('cve-date-range-display');
            const cveApplyBtn = document.getElementById('cve-apply-date');
            const cveLast7Days = document.getElementById('cve-last-7-days');
            const cveLast30Days = document.getElementById('cve-last-30-days');
            const cveSearchBtn = document.getElementById('cve-search-button');
            const cveSearchInput = document.getElementById('cve-search-input');
            const cveDataBody = document.getElementById('cve-data-body');
            const cveLoadingIndicator = document.getElementById('cve-loading-indicator');
            const cveEndIndicator = document.getElementById('cve-end-indicator');
            const cvePrevPage = document.getElementById('cve-prev-page');
            const cveNextPage = document.getElementById('cve-next-page');
            const cvePageInfo = document.getElementById('cve-page-info');
            
            // 初始化页面
            cveLoadData();
            
            // 切换日期选择器显示
            cveTimeTrigger.addEventListener('click', function() {
                cveDatePicker.classList.toggle('active');
            });
            
            // 设置最近7天
            cveLast7Days.addEventListener('click', function() {
                const cveEnd = new Date();
                const cveStart = new Date();
                cveStart.setDate(cveEnd.getDate() - 7);
                
                cveStartDate.value = cveFormatDate(cveStart);
                cveEndDate.value = cveFormatDate(cveEnd);
            });
            
            // 设置最近30天
            cveLast30Days.addEventListener('click', function() {
                const cveEnd = new Date();
                const cveStart = new Date();
                cveStart.setDate(cveEnd.getDate() - 30);
                
                cveStartDate.value = cveFormatDate(cveStart);
                cveEndDate.value = cveFormatDate(cveEnd);
            });
            
            // 应用日期范围
            cveApplyBtn.addEventListener('click', function() {
                if (cveStartDate.value && cveEndDate.value) {
                    cveDateDisplay.textContent = `${cveFormatDisplayDate(cveStartDate.value)} 至 ${cveFormatDisplayDate(cveEndDate.value)}`;
                    cveDatePicker.classList.remove('active');
                    // 应用日期后重新搜索
                    cveCurrentPage = 1;
                    cveLoadData();
                } else {
                    alert('请选择开始日期和结束日期');
                }
            });
            
            // 搜索按钮事件
            cveSearchBtn.addEventListener('click', function() {
                cveCurrentPage = 1;
                cveLoadData();
            });
            
            // 上一页按钮事件
            cvePrevPage.addEventListener('click', function() {
                if (cveCurrentPage > 1) {
                    cveCurrentPage--;
                    cveLoadData();
                }
            });
            
            // 下一页按钮事件
            cveNextPage.addEventListener('click', function() {
                cveCurrentPage++;
                cveLoadData();
            });
            
            // 点击页面其他区域关闭日期选择器
            document.addEventListener('click', function(e) {
                if (!cveTimeTrigger.contains(e.target) && !cveDatePicker.contains(e.target)) {
                    cveDatePicker.classList.remove('active');
                }
            });
            
            // 加载CVE数据
            function cveLoadData() {
                // 显示加载状态
                if (cveCurrentPage === 1) {
                    cveDataBody.innerHTML = '<tr><td colspan="5" class="text-center"><i class="fas fa-spinner fa-spin"></i> 加载中...</td></tr>';
                } else {
                    cveLoadingIndicator.style.display = 'block';
                }
                
                // 隐藏结束提示
                cveEndIndicator.style.display = 'none';
                
                // 收集参数
                const cveId = cveSearchInput.value.trim() || 'all';
                let dateFrom = 'all';
                let dateTo = 'all';
                
                if (cveDateDisplay.textContent !== '选择日期范围') {
                    const dateRange = cveDateDisplay.textContent.split(' 至 ');
                    if (dateRange.length === 2) {
                        dateFrom = dateRange[0].replace(/\//g, '');
                        dateTo = dateRange[1].replace(/\//g, '');
                    }
                }
                
                // 构建URL
                const url = `cve_info_list?cveId=${encodeURIComponent(cveId)}&pageFrom=${cveCurrentPage}&pageSize=${cvePageSize}&dateFrom=${dateFrom}&dateTo=${dateTo}`;
                
                // 发送请求
                fetch(url)
                    .then(response => response.json())
                    .then(data => {
                        // 隐藏加载状态
                        cveLoadingIndicator.style.display = 'none';
                        
                        if (data.code === 200) {
                            // 更新表格数据
                            cveUpdateTable(data.data.detail);
                            
                            // 更新分页信息
                            cveUpdatePagination(data.data.result_num);
                        } else {
                            cveDataBody.innerHTML = `<tr><td colspan="5" class="text-center text-danger">${data.message || '加载失败'}</td></tr>`;
                        }
                    })
                    .catch(error => {
                        console.error('Error:', error);
                        cveLoadingIndicator.style.display = 'none';
                        cveDataBody.innerHTML = '<tr><td colspan="5" class="text-center text-danger">网络错误，请重试</td></tr>';
                    });
            }
            
            // 更新表格数据
            function cveUpdateTable(data) {
                // 清空表格内容，实现跳转而非追加
                cveDataBody.innerHTML = '';
                
                if (data.length === 0) {
                    cveDataBody.innerHTML = '<tr><td colspan="5" class="text-center">没有找到匹配的数据</td></tr>';
                    cveEndIndicator.style.display = 'block';
                    return;
                }
                
                data.forEach(item => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${item.id}</td>
                        <td>${item.cve_id}</td>
                        <td>${item.description_cn || item.description}</td>
                        <td><a href="${item.url}" target="_blank">查看详情</a></td>
                        <td>${cveFormatDateTime(item.created_time)}</td>
                    `;
                    cveDataBody.appendChild(row);
                });
            }
            
            // 更新分页信息
            function cveUpdatePagination(total) {
                const totalPages = Math.ceil(total / cvePageSize);
                cvePageInfo.textContent = `第 ${cveCurrentPage} 页 / 共 ${totalPages} 页 (${total} 条)`;
                
                // 禁用/启用分页按钮
                cvePrevPage.disabled = cveCurrentPage <= 1;
                cveNextPage.disabled = cveCurrentPage >= totalPages;
            }
            
            // 辅助函数：格式化日期为YYYY-MM-DD
            function cveFormatDate(date) {
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                return `${year}-${month}-${day}`;
            }
            
            // 辅助函数：格式化显示日期为YYYY/MM/DD
            function cveFormatDisplayDate(dateStr) {
                return dateStr.replace(/-/g, '/');
            }
            
            // 辅助函数：格式化日期时间
            function cveFormatDateTime(dateTimeStr) {
                if (!dateTimeStr) return '';
                const date = new Date(dateTimeStr);
                return date.toLocaleString('zh-CN', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                });
            }
        });