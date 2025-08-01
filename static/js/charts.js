
// 全局变量存储图表实例
        let chartTagArticleBar, chartTagProjectBar;
        let chartTagArticlePie, chartTagProjectPie;
        let chartWeeklyTrend;
        
        // 初始化所有图表
        document.addEventListener('DOMContentLoaded', function() {
            initCharts();
            
            // 响应窗口变化
            window.addEventListener('resize', function() {
                resizeCharts();
            });
            
            // 初始加载数据
            loadAllData();
        });
        
        // 初始化图表
        function initCharts() {
            // 先初始化所有图表实例
            chartTagArticleBar = echarts.init(document.getElementById('chartTagArticleBar'));
            chartTagProjectBar = echarts.init(document.getElementById('chartTagProjectBar'));
            chartTagArticlePie = echarts.init(document.getElementById('chartTagArticlePie'));
            chartTagProjectPie = echarts.init(document.getElementById('chartTagProjectPie'));
            chartWeeklyTrend = echarts.init(document.getElementById('chartWeeklyTrend'));
            
            // 显示加载状态 - 使用ECharts内置方法
            chartTagArticleBar.showLoading();
            chartTagProjectBar.showLoading();
            chartTagArticlePie.showLoading();
            chartTagProjectPie.showLoading();
            chartWeeklyTrend.showLoading();
        }
        
        // 移除自定义的showLoading函数
        
        // 调整图表大小
        function resizeCharts() {
            chartTagArticleBar.resize();
            chartTagProjectBar.resize();
            chartTagArticlePie.resize();
            chartTagProjectPie.resize();
            chartWeeklyTrend.resize();
        }
        
        // 格式化饼图数据 (取前n个，其余归为其他)
        function formatPieData(data, n) {
            const topData = data.slice(0, n);
            const otherValue = data.slice(n).reduce((sum, item) => sum + item.value, 0);
            
            if (otherValue > 0) {
                return [
                    ...topData,
                    { name: '其他', value: otherValue }
                ];
            }
            return topData;
        }
        
        // 加载所有数据
        function loadAllData() {
            updateArticleData();
            updateProjectData();
            updateTrendData();
            updateStats();
        }
        
        // 更新文章数据
        function updateArticleData() {
          // 从API获取数据
          fetch("/api/v1/article-tags/")
            .then((response) => response.json())
            .then((data) => {
              // 处理数据并更新图表
              updateArticleChart(data.tags);
            })
            .catch((error) => {
              console.error("Error fetching article data:", error);
            });

          // 标准接口数据样例
        //   const mockArticleData = {
        //     tags: [
        //       { name: "后端", value: 285 },
        //       { name: "前端", value: 240 },
        //       { name: "JavaScript", value: 210 },
        //       { name: "Python", value: 195 },
        //       { name: "Java", value: 180 },
        //       { name: "AI编程", value: 165 },
        //       { name: "云原生", value: 150 },
        //       { name: "数据库", value: 135 },
        //       { name: "算法", value: 120 },
        //       { name: "Spring Boot", value: 105 },
        //       { name: "Vue.js", value: 90 },
        //       { name: "React.js", value: 85 },
        //       { name: "Node.js", value: 80 },
        //       { name: "Go", value: 75 },
        //       { name: "Linux", value: 70 },
        //     ],
        //   };

          // 更新图表
        //   updateArticleChart(mockArticleData.tags);
        }
        
        // 更新文章图表
        function updateArticleChart(articleTagData) {
            // 排序数据
            articleTagData.sort((a, b) => b.value - a.value);
            
            // 更新柱状图
            chartTagArticleBar.setOption({
                tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
                grid: { left: '3%', right: '4%', bottom: '15%', top: '10%', containLabel: true },
                xAxis: { type: 'category', data: articleTagData.slice(0, 10).map(item => item.name), axisLabel: { interval: 0, rotate: 30 } },
                yAxis: { type: 'value', name: '文章数量' },
                series: [{
                    name: '文章数量', type: 'bar', data: articleTagData.slice(0, 10).map(item => item.value),
                    itemStyle: { color: function(params) {
                        const colorList = ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc', '#1e88e5'];
                        return colorList[params.dataIndex];
                    }},
                    label: { show: true, position: 'top' }
                }]
            });
            
            // 隐藏加载状态
            chartTagArticleBar.hideLoading();
            
            // 更新饼图数据
            const articlePieData = formatPieData(articleTagData, 8);
            chartTagArticlePie.setOption({
                tooltip: { trigger: 'item', formatter: '{a} <br/>{b}: {c} ({d}%)' },
                legend: { orient: 'vertical', right: 10, bottom: 10, data: articlePieData.map(item => item.name) },
                series: [{
                    name: '文章标签', type: 'pie', radius: ['35%', '65%'], avoidLabelOverlap: false,
                    itemStyle: { borderRadius: 10, borderColor: '#fff', borderWidth: 2 },
                    label: { show: true, formatter: '{b}: {d}%', fontSize: 12 },
                    emphasis: { label: { show: true, fontSize: '14', fontWeight: 'bold' } },
                    labelLine: { length: 10, length2: 5, smooth: true },
                    data: articlePieData
                }]
            });
            
            // 隐藏加载状态
            chartTagArticlePie.hideLoading();
        }
        
        // 更新项目数据
        function updateProjectData() {
            fetch('/api/v1/project-tags/')
                .then(response => response.json())
                .then(data => {
                    // 处理数据并更新图表
                    updateProjectChart(data.tags);
                })
                .catch(error => {
                    console.error('Error fetching project data:', error);
                });

            
            // 标准样例数据
            // const mockProjectData = {
            //     tags: [
            //         { name: "后端", value: 185 },
            //         { name: "前端", value: 170 },
            //         { name: "JavaScript", value: 150 },
            //         { name: "Python", value: 145 },
            //         { name: "Java", value: 130 },
            //         { name: "AI编程", value: 125 },
            //         { name: "云原生", value: 110 },
            //         { name: "数据库", value: 95 },
            //         { name: "算法", value: 85 },
            //         { name: "Spring Boot", value: 75 },
            //         { name: "Vue.js", value: 70 },
            //         { name: "React.js", value: 65 },
            //         { name: "Node.js", value: 60 },
            //         { name: "Go", value: 55 },
            //         { name: "Linux", value: 50 }
            //     ]
            // };
            
            // 更新图表
            // updateProjectChart(dmockProjectData.tags);
        }
        
        // 更新项目图表
        function updateProjectChart(projectTagData) {
            // 排序数据
            projectTagData.sort((a, b) => b.value - a.value);
            
            // 更新柱状图
            chartTagProjectBar.setOption({
                tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
                grid: { left: '3%', right: '4%', bottom: '15%', top: '10%', containLabel: true },
                xAxis: { type: 'category', data: projectTagData.slice(0, 10).map(item => item.name), axisLabel: { interval: 0, rotate: 30 } },
                yAxis: { type: 'value', name: '项目数量' },
                series: [{
                    name: '项目数量', type: 'bar', data: projectTagData.slice(0, 10).map(item => item.value),
                    itemStyle: { color: function(params) {
                        const colorList = ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc', '#1e88e5'];
                        return colorList[params.dataIndex];
                    }},
                    label: { show: true, position: 'top' }
                }]
            });
            
            // 隐藏加载状态
            chartTagProjectBar.hideLoading();
            
            // 更新饼图数据
            const projectPieData = formatPieData(projectTagData, 8);
            chartTagProjectPie.setOption({
                tooltip: { trigger: 'item', formatter: '{a} <br/>{b}: {c} ({d}%)' },
                legend: { orient: 'vertical', right: 10, bottom: 10, data: projectPieData.map(item => item.name) },
                series: [{
                    name: '项目标签', type: 'pie', radius: ['35%', '65%'], avoidLabelOverlap: false,
                    itemStyle: { borderRadius: 10, borderColor: '#fff', borderWidth: 2 },
                    label: { show: true, formatter: '{b}: {d}%', fontSize: 12 },
                    emphasis: { label: { show: true, fontSize: '14', fontWeight: 'bold' } },
                    labelLine: { length: 10, length2: 5, smooth: true },
                    data: projectPieData
                }]
            });
            
            // 隐藏加载状态
            chartTagProjectPie.hideLoading();
        }
        
        // 更新趋势数据
        function updateTrendData() {
            fetch('/api/v1/trend-data')
                .then(response => response.json())
                .then(data => {
                    // 处理数据并更新图表
                    updateTrendChart(data);
                })
                .catch(error => {
                    console.error('Error fetching trend data:', error);
                });
            
            // 标准样例数据
            // const mockTrendData = {
            // weeks: ['。。。', '。。。', '。。。', '。。。', '。。。', '。。。', '上一周日期', '本周（日期）'],
            //     articles: [85, 92, 104, 112, 98, 120, 135, 142],
            //     projects: [62, 68, 75, 82, 78, 85, 92, 98],
            //     vulnerabilities: [35, 42, 38, 45, 52, 48, 56, 62]
            // };
            //
            // // 更新图表
            // updateTrendChart(mockTrendData)
        }
        
        // 更新趋势图表
        function updateTrendChart(trendData) {
            chartWeeklyTrend.setOption({
                tooltip: { trigger: 'axis' },
                legend: { data: ['新增文章', '新增项目', '新增漏洞'], bottom: 10 },
                grid: { left: '3%', right: '4%', bottom: '15%', top: '10%', containLabel: true },
                xAxis: { type: 'category', boundaryGap: false, data: trendData.weeks },
                yAxis: { type: 'value', name: '数量' },
                series: [
                    { name: '新增文章', type: 'line', smooth: true, data: trendData.articles, lineStyle: { width: 3 }, symbolSize: 8 },
                    { name: '新增项目', type: 'line', smooth: true, data: trendData.projects, lineStyle: { width: 3 }, symbolSize: 8 },
                    { name: '新增漏洞', type: 'line', smooth: true, data: trendData.vulnerabilities, lineStyle: { width: 3 }, symbolSize: 8 }
                ]
            });
            
            // 隐藏加载状态
            chartWeeklyTrend.hideLoading();
        }
        
        // 更新统计数据
// 更新统计数据
        function updateStats() {
            fetch('/api/v1/stats-data/')
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    // 更新统计数字
                    document.getElementById('chartHotArticlesTotal').textContent = data.hotArticlesTotal || '0';
                    document.getElementById('chartHotProjectsTotal').textContent = data.hotProjectsTotal || '0';
                    document.getElementById('chartPushedTotal').textContent = data.pushedTotal || '0';
                    document.getElementById('chartToPushTotal').textContent = data.toPushTotal || '0';
                    document.getElementById('chartVulnerabilitiesTotal').textContent = data.vulnerabilitiesTotal || '0';
                    document.getElementById('chartYesterdayVulns').textContent = data.yesterdayVulns || '0';
                    
                    // 更新百分比变化
                    document.getElementById('chartHotArticlesChange').textContent = data.hotArticlesChange || '暂无数据';
                    document.getElementById('chartHotProjectsChange').textContent = data.hotProjectsChange || '暂无数据';
                    document.getElementById('chartPushedChange').textContent = data.pushedChange || '暂无数据';
                    document.getElementById('chartToPushChange').textContent = data.toPushChange || '暂无数据';
                    document.getElementById('chartVulnerabilitiesChange').textContent = data.vulnerabilitiesChange || '暂无数据';
                    document.getElementById('chartYesterdayVulnsChange').textContent = data.yesterdayVulnsChange || '暂无数据';
                    
                    // 更新时间
                    const now = new Date();
                    document.getElementById('chartUpdateTime').textContent = 
                        `${now.getFullYear()}年${now.getMonth()+1}月${now.getDate()}日 ` + 
                        `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
                })
                .catch(error => {
                    console.error('Error fetching stats data:', error);
                    // 显示错误信息
                    alert('获取统计数据失败: ' + error.message);
                    
                    // 使用默认值
                    document.getElementById('chartHotArticlesTotal').textContent = '0';
                    document.getElementById('chartHotProjectsTotal').textContent = '0';
                    document.getElementById('chartPushedTotal').textContent = '0';
                    document.getElementById('chartToPushTotal').textContent = '0';
                    document.getElementById('chartVulnerabilitiesTotal').textContent = '0';
                    document.getElementById('chartYesterdayVulns').textContent = '0';
                    
                    document.getElementById('chartHotArticlesChange').textContent = '获取失败';
                    document.getElementById('chartHotProjectsChange').textContent = '获取失败';
                    document.getElementById('chartPushedChange').textContent = '获取失败';
                    document.getElementById('chartToPushChange').textContent = '获取失败';
                    document.getElementById('chartVulnerabilitiesChange').textContent = '获取失败';
                    document.getElementById('chartYesterdayVulnsChange').textContent = '获取失败';
                });
        }
        
        // 模拟动态数据更新
        setInterval(() => {
            // updateArticleData();
            // updateProjectData();
            // updateTrendData();
            // updateStats();
        }, 30000); // 每30秒更新一次
