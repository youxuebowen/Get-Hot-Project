// 设置当前日期
        const now = new Date();
        const options = {
            year: "numeric",
            month: "long",
            day: "numeric",
            weekday: "long",
        };
        document.getElementById("current-date").textContent = now.toLocaleDateString("zh-CN", options);

        // 切换内容区域
        window.switchContent = function(target) {
            // 隐藏所有内容区域
            document.querySelectorAll('.content-section').forEach(section => {
                section.classList.remove('active');
            });
            
            // 显示目标内容区域
            const targetSection = document.getElementById(target + '-content');
            if (targetSection) {
                targetSection.classList.add('active');
            }
            
            // 更新导航项激活状态
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
            });
            
            const targetLink = document.querySelector(`.nav-link[data-target="${target}"]`);
            if (targetLink) {
                targetLink.classList.add('active');
            }
            
            // 如果是移动端，关闭侧边栏
            if (window.innerWidth <= 768) {
                document.querySelector('.sidebar').classList.remove('show');
            }
            
            // 滚动到顶部
            window.scrollTo(0, 0);
        }

        // 切换侧边栏（移动端）
        function toggleSidebar() {
            document.querySelector('.sidebar').classList.toggle('show');
        }

        // 显示退出确认对话框
        function confirmLogout() {
            const logoutModal = new bootstrap.Modal(document.getElementById('logoutModal'));
            logoutModal.show();
        }

        // 初始化函数
        document.addEventListener('DOMContentLoaded', function() {
            // 默认显示第一个内容区域
            switchContent('home');
            
            // 添加卡片点击效果
            document.querySelectorAll('.article-card, .project-item').forEach(card => {
                card.addEventListener('click', function(e) {
                    if (!e.target.closest('.btn')) {
                        this.classList.toggle('active');
                    }
                });
            });
            
            // 添加发送按钮功能
            document.querySelectorAll('.btn-send, .btn-add-to-send').forEach(btn => {
                btn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    const card = this.closest('.card');
                    const title = card.querySelector('.card-title').textContent;
                    
                    // 更新状态
                    const badge = card.querySelector('.badge:not(.sent-badge):not(.not-sent-badge)');
                    if (badge) {
                        badge.classList.remove('bg-secondary');
                        badge.classList.add('sent-badge', 'bg-success');
                        badge.textContent = '已发送';
                    }
                    
                    // 禁用按钮
                    this.disabled = true;
                    this.textContent = '已发送';
                    
                    // 显示通知
                    showToast(`"${title}"已成功发送`);
                });
            });
            
            // 截断文章简介至100字
            const excerpts = document.querySelectorAll('.article-excerpt');
            excerpts.forEach(excerpt => {
                const text = excerpt.textContent;
                if (text.length > 100) {
                    excerpt.textContent = text.substring(0, 100) + '...';
                }
            });
        });
