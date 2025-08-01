// 只包含搜“github/文章页面的功能”

// 标签数据

const dpsTags = [
    "后端", "Java", "Go", "Kotlin", "Python", "Node.js", "Swift", "前端", 
    "JavaScript", "TypeScript", "Vue.js", "React.js", "HTML", "CSS", "three.js", 
    "Flutter", "Spring Boot", "Spring", "Android", "Jetpack", "Trae", "Cursor", 
    "MySQL", "数据库", "架构", "Linux", "HarmonyOS", "云原生", "云计算", "算法", 
    "Debug", "逆向", "源码", "开源", "编程语言", "AI编程", "爬虫"
];

// 初始化标签选择器
function initTagSelector() {
    const container = document.getElementById('dps-tag-container');
    dpsTags.forEach(tag => {
        const option = document.createElement('div');
        option.className = 'dps-tag-option';
        option.innerHTML = `
            <input type="checkbox" id="dps-tag-${tag}" value="${tag}">
            <label for="dps-tag-${tag}">${tag}</label>
        `;
        container.appendChild(option);
        
        // 添加选择事件
        const checkbox = option.querySelector('input');
        checkbox.addEventListener('change', function() {
            updateSelectedTags();
        });
    });
    
    // 标签选择器触发器
    document.getElementById('dps-tag-trigger').addEventListener('click', function(e) {
        e.stopPropagation();
        const container = document.getElementById('dps-tag-container');
        container.style.display = container.style.display === 'none' ? 'grid' : 'none';
    });
}

// 更新已选标签显示
function updateSelectedTags() {
    const container = document.getElementById('dps-selected-tags');
    container.innerHTML = '';
    
    const checkboxes = document.querySelectorAll('#dps-tag-container input[type="checkbox"]:checked');
    checkboxes.forEach(checkbox => {
        const tag = checkbox.value;
        const tagElement = document.createElement('div');
        tagElement.className = 'dps-selected-tag';
        tagElement.innerHTML = `
            ${tag} <i class="bi bi-x"></i>
        `;
        container.appendChild(tagElement);
        
        // 添加删除事件
        tagElement.querySelector('i').addEventListener('click', function() {
            checkbox.checked = false;
            updateSelectedTags();
        });
    });
}

// 初始化时间选择器
function initDatePicker() {
    const trigger = document.getElementById('dps-time-range-trigger');
    const picker = document.getElementById('dps-date-picker');
    const startDateInput = document.getElementById('dps-start-date');
    const endDateInput = document.getElementById('dps-end-date');
    
    trigger.addEventListener('click', function(e) {
        e.stopPropagation();
        picker.style.display = picker.style.display === 'none' ? 'block' : 'none';
    });
    
    // 最近7天按钮
    document.getElementById('dps-last-7-days').addEventListener('click', function() {
        const today = new Date();
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(today.getDate() - 7);
        
        startDateInput.value = formatDate(sevenDaysAgo);
        endDateInput.value = formatDate(today);
        
        // 触发change事件
        startDateInput.dispatchEvent(new Event('change'));
        endDateInput.dispatchEvent(new Event('change'));
        
        // 更新显示
        trigger.querySelector('span').textContent = `${formatDisplayDate(startDateInput.value)} 至 ${formatDisplayDate(endDateInput.value)}`;
    });
    
    // 最近30天按钮
    document.getElementById('dps-last-30-days').addEventListener('click', function() {
        const today = new Date();
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(today.getDate() - 30);
        
        startDateInput.value = formatDate(thirtyDaysAgo);
        endDateInput.value = formatDate(today);
        
        // 触发change事件
        startDateInput.dispatchEvent(new Event('change'));
        endDateInput.dispatchEvent(new Event('change'));
        
        // 更新显示
        trigger.querySelector('span').textContent = `${formatDisplayDate(startDateInput.value)} 至 ${formatDisplayDate(endDateInput.value)}`;
    });
    
    // 应用按钮
    document.getElementById('dps-apply-date').addEventListener('click', function() {
        const startDate = startDateInput.value;
        const endDate = endDateInput.value;
        
        if (startDate && endDate) {
            trigger.querySelector('span').textContent = `${formatDisplayDate(startDate)} 至 ${formatDisplayDate(endDate)}`;
            picker.style.display = 'none';
        } else {
            alert('请选择开始日期和结束日期');
        }
    });
    
    // 初始日期设置为最近30天
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);
    
    startDateInput.value = formatDate(thirtyDaysAgo);
    endDateInput.value = formatDate(today);
    trigger.querySelector('span').textContent = `${formatDisplayDate(startDateInput.value)} 至 ${formatDisplayDate(endDateInput.value)}`;
    
    // 监听日期变化
    startDateInput.addEventListener('change', function() {
        if (startDateInput.value && endDateInput.value) {
            trigger.querySelector('span').textContent = `${formatDisplayDate(startDateInput.value)} 至 ${formatDisplayDate(endDateInput.value)}`;
        }
    });
    
    endDateInput.addEventListener('change', function() {
        if (startDateInput.value && endDateInput.value) {
            trigger.querySelector('span').textContent = `${formatDisplayDate(startDateInput.value)} 至 ${formatDisplayDate(endDateInput.value)}`;
        }
    });
}

// 初始化类型选择器
function initTypeSelector() {
    const trigger = document.getElementById('dps-type-select');
    const container = document.getElementById('dps-type-container');
    const options = container.querySelectorAll('.dps-tag-option');
    
    trigger.addEventListener('click', function(e) {
        e.stopPropagation();
        container.style.display = container.style.display === 'none' ? 'grid' : 'none';
    });
    
    options.forEach(option => {
        option.addEventListener('click', function() {
            const value = this.getAttribute('data-value');
            trigger.querySelector('span').textContent = this.textContent;
            container.style.display = 'none';
        });
    });
}

// 格式化日期为YYYY-MM-DD
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// 格式化显示日期为YYYY/MM/DD
function formatDisplayDate(dateString) {
    return dateString.replace(/-/g, '/');
}

// 数据加载和分页逻辑
let currentPage = 1;
const pageSize = 10;
let isLoading = false;
let hasMoreData = true;
let totalPages = 1;
let allTags = new Set();

// 获取DOM元素
const dataBody = document.getElementById('data-body');
const loadingIndicator = document.getElementById('loading-indicator');
const endIndicator = document.getElementById('end-indicator');
const prevPageBtn = document.getElementById('prev-page');
const nextPageBtn = document.getElementById('next-page');
const pageInfo = document.getElementById('page-info');

// 初始化分页按钮事件
if (prevPageBtn) {
    prevPageBtn.addEventListener('click', function() {
        if (currentPage > 1) {
            currentPage--;
            performSearch(false);
        }
    });
}

if (nextPageBtn) {
    nextPageBtn.addEventListener('click', function() {
        if (currentPage < totalPages) {
            currentPage++;
            performSearch(false);
        }
    });
}

// 更新分页按钮状态
function updatePaginationButtons() {
    if (prevPageBtn) {
        prevPageBtn.disabled = currentPage <= 1;
    }
    if (nextPageBtn) {
        nextPageBtn.disabled = currentPage >= totalPages || !hasMoreData;
    }
    if (pageInfo) {
        pageInfo.textContent = `第 ${currentPage} 页 / 共 ${totalPages} 页`;
    }
}

// 执行搜索/加载数据
function performSearch(resetPage = true) {
    if (resetPage) {
        currentPage = 1;
    }

    // 显示加载状态
    if (currentPage === 1) {
        dataBody.innerHTML = '<tr><td colspan="8" class="text-center"><i class="fas fa-spinner fa-spin"></i> 加载中...</td></tr>';
    } else {
        loadingIndicator.style.display = 'block';
    }

    // 收集搜索条件
    const keyword = document.querySelector('.dps-search-input') ? document.querySelector('.dps-search-input').value.trim() : '';
    const startDate = document.getElementById('dps-start-date') ? document.getElementById('dps-start-date').value : '';
    const endDate = document.getElementById('dps-end-date') ? document.getElementById('dps-end-date').value : '';
    const typeText = document.getElementById('dps-type-select') ? document.getElementById('dps-type-select').querySelector('span').textContent : '所有类型';

    // 转换类型文本为对应的值
    let typeValue = '';
    if (typeText === 'GitHub应用') {
        typeValue = '1';
    } else if (typeText === '文章') {
        typeValue = '2';
    }

    // 收集选中的标签
    const selectedTags = [];
    const checkboxes = document.querySelectorAll('#dps-tag-container input:checked');
    checkboxes.forEach(checkbox => {
        selectedTags.push(checkbox.value);
    });
    const tags = selectedTags.join(',');

    // 构建API请求URL
    let url = `/api/v1/content-table/?page=${currentPage}&page_size=${pageSize}`;
    if (keyword) url += `&content=${encodeURIComponent(keyword)}`;
    if (startDate) url += `&from_date=${encodeURIComponent(startDate)}`;
    if (endDate) url += `&to_date=${encodeURIComponent(endDate)}`;
    if (typeValue) url += `&type=${encodeURIComponent(typeValue)}`;
    if (tags) url += `&tag=${encodeURIComponent(tags)}`;

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

    // 发送API请求
    fetch(url, {
        headers: {
            'X-CSRFToken': csrftoken
        }
    })
    .then(response => {
        if (!response.ok) throw new Error('网络响应错误');
        return response.json();
    })
    .then(data => {
        // 计算总页数
        totalPages = Math.ceil(data.count / pageSize);

        // 清空数据体
        dataBody.innerHTML = '';

        if (data.results && data.results.length > 0) {
            // 渲染搜索结果
            data.results.forEach(item => {
                const row = document.createElement('tr');
                row.innerHTML = `
                            <td>${item.id}</td>
                            <td>${escapeHtml(item.name)}</td>
                            <td>${escapeHtml(truncateText(item.description, 50))}</td>
                            <td><a href="${escapeHtml(item.url)}" target="_blank">查看</a></td>
                            <td>${formatTags(item.tag)}</td>
                            <td>${getTypeName(item.type)}</td>
                            <td>${escapeHtml(item.status)}</td>
                            <td>${formatDateTime(item.updated_time)}</td>
                        `;
                        dataBody.appendChild(row);

                        // 收集所有标签用于筛选
                        if (item.tag) {
                            item.tag.split(',').forEach((tag) => {
                                if (tag.trim()) allTags.add(tag.trim());
                            });
                        }
                    });

                    hasMoreData = data.next !== null;
                    if (!hasMoreData) {
                        endIndicator.style.display = 'block';
                    } else {
                        endIndicator.style.display = 'none';
                    }
                } else {
                    // 没有找到结果
                    dataBody.innerHTML = '<tr><td colspan="9" class="text-center">没有找到匹配的结果</td></tr>';
                    hasMoreData = false;
                    endIndicator.style.display = 'block';
                }

                // 更新分页信息
                updatePaginationButtons();
            })
            .catch(error => {
                console.error('搜索出错:', error);
                if (currentPage === 1) {
                    dataBody.innerHTML = '<tr><td colspan="9" class="text-center">搜索过程中发生错误，请重试</td></tr>';
                }
            })
            .finally(() => {
                isLoading = false;
                loadingIndicator.style.display = 'none';
            });
        }
        
        // 辅助函数：格式化日期时间
        function formatDateTime(dateString) {
            if (!dateString) return '';
            const date = new Date(dateString);
            return date.toLocaleString('zh-CN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            });
        }
        
        // 辅助函数：格式化标签
        function formatTags(tagString) {
            if (!tagString) return '';
            return tagString
                .split(',')
                .map(tag => {
                    tag = tag.trim();
                    return tag ? `<span class="tag-badge">${escapeHtml(tag)}</span>` : '';
                })
                .join('');
        }
        
        // 辅助函数：截断文本
        function truncateText(text, maxLength) {
            if (!text) return '';
            if (text.length <= maxLength) return text;
            return text.substring(0, maxLength) + '...';
        }
        
        // 辅助函数：HTML转义
        function escapeHtml(unsafe) {
            if (!unsafe) return '';
            return unsafe
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#039;');
        }
        
        // 辅助函数：获取类型名称
        function getTypeName(type) {
            if (type === 1) return 'GitHub应用';
            if (type === 2) return '文章';
            return '未知类型';
        }
        
        // 初始化页面
        document.addEventListener('DOMContentLoaded', function() {
            initTagSelector();
            initDatePicker();
            initTypeSelector();
            
            // 点击页面其他地方关闭面板
            document.addEventListener('click', function(e) {
                const datePicker = document.getElementById('dps-date-picker');
                const tagContainer = document.getElementById('dps-tag-container');
                const typeContainer = document.getElementById('dps-type-container');
                
                if (datePicker && !datePicker.contains(e.target) && e.target.id !== 'dps-time-range-trigger') {
                    datePicker.style.display = 'none';
                }
                
                if (tagContainer && !tagContainer.contains(e.target) && e.target.id !== 'dps-tag-trigger') {
                    tagContainer.style.display = 'none';
                }
                
                if (typeContainer && !typeContainer.contains(e.target) && e.target.id !== 'dps-type-select') {
                    typeContainer.style.display = 'none';
                }
            });
            
            // 初始加载30天数据
            performSearch(true);
        });
        
        // 搜索按钮事件
        const searchBtn = document.querySelector('.dps-search-btn');
        if (searchBtn) {
            searchBtn.addEventListener('click', performSearch);
        } else {
            console.error('未找到搜索按钮元素 (.dps-search-btn)');
        }
        
        // 按Enter键搜索
        document.querySelector('.dps-search-input').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });