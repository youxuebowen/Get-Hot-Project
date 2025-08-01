
        document.addEventListener('DOMContentLoaded', function() {
            const uploadForm = document.getElementById('uploadForm');
            const submitBtn = document.getElementById('submitBtn');
            const submitText = document.getElementById('submitText');
            const spinner = document.getElementById('spinner');
            const fileInput = document.getElementById('id_excel_file');
            const fileName = document.getElementById('fileName');

            if (uploadForm) {
                uploadForm.addEventListener('submit', function() {
                    submitBtn.disabled = true;
                    submitText.textContent = '处理中...';
                    spinner.classList.remove('d-none');
                });
            }

            if (fileInput) {
                fileInput.addEventListener('change', function(e) {
                    if (e.target.files.length > 0) {
                        fileName.textContent = `已选择: ${e.target.files[0].name}`;
                        fileName.style.display = 'block';
                    } else {
                        fileName.textContent = '未选择文件';
                    }
                });
                
                // 拖拽功能
                const dropArea = document.querySelector('.file-input-wrapper');
                
                ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
                    dropArea.addEventListener(eventName, preventDefaults, false);
                });
                
                function preventDefaults(e) {
                    e.preventDefault();
                    e.stopPropagation();
                }
                
                ['dragenter', 'dragover'].forEach(eventName => {
                    dropArea.addEventListener(eventName, highlight, false);
                });
                
                ['dragleave', 'drop'].forEach(eventName => {
                    dropArea.addEventListener(eventName, unhighlight, false);
                });
                
                function highlight() {
                    dropArea.style.backgroundColor = '#d1eaff';
                }
                
                function unhighlight() {
                    dropArea.style.backgroundColor = '';
                }
                
                dropArea.addEventListener('drop', handleDrop, false);
                
                function handleDrop(e) {
                    const dt = e.dataTransfer;
                    const files = dt.files;
                    fileInput.files = files;
                    
                    // 触发change事件
                    const event = new Event('change');
                    fileInput.dispatchEvent(event);
                }
            }
        });