
// 日期显示
        document.addEventListener('DOMContentLoaded', function() {
            const now = new Date();
            const options = { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                weekday: 'long'
            };
            document.getElementById('login-current-date').textContent = now.toLocaleDateString('zh-CN', options);
            
            // 高级粒子背景效果
            const canvas = document.getElementById('login-particle-canvas');
            const ctx = canvas.getContext('2d');
            
            // 设置canvas尺寸
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            
            // 粒子数组
            const particles = [];
            const particleCount = 80;
            
            // 粒子类
            class Particle {
                constructor() {
                    this.x = Math.random() * canvas.width;
                    this.y = Math.random() * canvas.height;
                    this.size = Math.random() * 5 + 1;
                    this.speedX = Math.random() * 3 - 1.5;
                    this.speedY = Math.random() * 3 - 1.5;
                    this.color = `rgba(${Math.floor(Math.random() * 100 + 100)}, 
                                      ${Math.floor(Math.random() * 150 + 100)}, 
                                      ${Math.floor(Math.random() * 255)}, 
                                      ${Math.random() * 0.5 + 0.2})`;
                    this.glow = Math.random() * 10 + 5;
                }
                
                update() {
                    this.x += this.speedX;
                    this.y += this.speedY;
                    
                    // 边界检查
                    if (this.x > canvas.width || this.x < 0) this.speedX = -this.speedX;
                    if (this.y > canvas.height || this.y < 0) this.speedY = -this.speedY;
                    
                    // 随机改变方向
                    if (Math.random() < 0.05) {
                        this.speedX = Math.random() * 3 - 1.5;
                        this.speedY = Math.random() * 3 - 1.5;
                    }
                }
                
                draw() {
                    ctx.beginPath();
                    
                    // 创建发光效果
                    const gradient = ctx.createRadialGradient(
                        this.x, this.y, 0,
                        this.x, this.y, this.glow
                    );
                    gradient.addColorStop(0, this.color);
                    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
                    
                    ctx.fillStyle = gradient;
                    ctx.arc(this.x, this.y, this.glow, 0, Math.PI * 2);
                    ctx.fill();
                    
                    // 绘制粒子核心
                    ctx.beginPath();
                    ctx.fillStyle = this.color;
                    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
            
            // 创建粒子
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
            
            // 动画循环
            function animate() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                
                // 绘制半透明覆盖层
                ctx.fillStyle = 'rgba(15, 23, 42, 0.3)';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                
                // 更新和绘制粒子
                for (let i = 0; i < particles.length; i++) {
                    particles[i].update();
                    particles[i].draw();
                    
                    // 绘制粒子间的连线
                    for (let j = i; j < particles.length; j++) {
                        const dx = particles[i].x - particles[j].x;
                        const dy = particles[i].y - particles[j].y;
                        const distance = Math.sqrt(dx * dx + dy * dy);
                        
                        if (distance < 100) {
                            ctx.beginPath();
                            ctx.strokeStyle = `rgba(219, 234, 254, ${0.2 * (1 - distance/100)})`;
                            ctx.lineWidth = 0.5;
                            ctx.moveTo(particles[i].x, particles[i].y);
                            ctx.lineTo(particles[j].x, particles[j].y);
                            ctx.stroke();
                        }
                    }
                }
                
                requestAnimationFrame(animate);
            }
            
            animate();
            
            // 窗口大小调整
            window.addEventListener('resize', function() {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
            });
            
            // 表单提交处理
            document.querySelector('.login-form').addEventListener('submit', function(e) {
                e.preventDefault();
                
                // 获取表单数据
                const formData = new FormData(this);
                const account = formData.get('account');
                
                // 登录按钮动画
                const btn = document.querySelector('.login-btn');
                btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 登录中...';
                btn.disabled = true;
                
                // 清除之前的错误信息
                document.querySelectorAll('.login-error-message, .login-field-error').forEach(el => {
                    el.textContent = '';
                    el.style.display = 'none';
                });
                
                // 创建粒子爆炸效果
                createLoginEffect();
                
                // 发送登录请求
                fetch('', {
                    method: 'POST',
                    body: formData
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        // 添加登录成功动画
                        document.querySelector('.login-card').style.animation = 'login-pulse 0.5s';
                        
                        setTimeout(() => {
                            // 登录成功后根据服务器返回的URL跳转
                        window.location.href = data.redirect_url || '/apps/v1/index';
                        }, 1000);
                    } else {
                        // 显示弹窗提示
                        alert('账号不存在或者密码不正确');

                        // 显示错误信息
                        if (data.errors.non_field_errors) {
                            const errorEl = document.querySelector('.login-error-message');
                            errorEl.textContent = data.errors.non_field_errors[0];
                            errorEl.style.display = 'flex';
                        }
                        
                        // 显示字段错误
                        Object.keys(data.errors).forEach(field => {
                            if (field !== 'non_field_errors') {
                                const fieldEl = document.getElementById(`id_${field}`);
                                if (fieldEl) {
                                    fieldEl.style.borderColor = '#ef4444';
                                    fieldEl.style.boxShadow = '0 0 0 4px rgba(239, 68, 68, 0.25)';
                                    
                                    const errorEl = document.createElement('div');
                                    errorEl.className = 'login-field-error';
                                    errorEl.textContent = data.errors[field][0];
                                    fieldEl.parentNode.appendChild(errorEl);
                                    
                                    setTimeout(() => {
                                        fieldEl.style.borderColor = '';
                                        fieldEl.style.boxShadow = '';
                                    }, 3000);
                                }
                            }
                        });
                        
                        // 添加粒子震动效果
                        for (let i = 0; i < particles.length; i++) {
                            particles[i].speedX = (Math.random() - 0.5) * 10;
                            particles[i].speedY = (Math.random() - 0.5) * 10;
                        }
                    }
                })
                .catch(error => {
                    console.error('登录错误:', error);
                    const errorEl = document.querySelector('.login-error-message');
                    errorEl.textContent = '登录过程中发生错误，请稍后重试';
                    errorEl.style.display = 'flex';
                })
                .finally(() => {
                    btn.innerHTML = '<i class="fas fa-sign-in-alt"></i> 登录系统';
                    btn.disabled = false;
                });
            });
            
            // 登录成功粒子效果
            function createLoginEffect() {
                const centerX = canvas.width / 2;
                const centerY = canvas.height / 2;
                
                // 创建爆炸粒子
                for (let i = 0; i < 50; i++) {
                    const particle = new Particle();
                    particle.x = centerX;
                    particle.y = centerY;
                    particle.size = Math.random() * 3 + 1;
                    particle.speedX = (Math.random() - 0.5) * 10;
                    particle.speedY = (Math.random() - 0.5) * 10;
                    particle.color = 'rgba(219, 234, 254, 0.8)';
                    particle.glow = Math.random() * 15 + 10;
                    
                    // 添加到数组开头
                    particles.unshift(particle);
                }
                
                // 限制粒子数量
                if (particles.length > 200) {
                    particles.splice(200, particles.length - 200);
                }
            }
            
            // 输入框动画
            const inputs = document.querySelectorAll('.login-input');
            inputs.forEach(input => {
                input.addEventListener('focus', function() {
                    this.parentElement.style.transform = 'translateY(-5px)';
                });
                
                input.addEventListener('blur', function() {
                    this.parentElement.style.transform = '';
                });
            });
        });
