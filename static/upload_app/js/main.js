document.addEventListener('DOMContentLoaded', function() {
    const uploadForm = document.getElementById('uploadForm');
    const submitBtn = document.getElementById('submitBtn');
    const submitText = document.getElementById('submitText');
    const spinner = document.getElementById('spinner');

    if (uploadForm) {
        uploadForm.addEventListener('submit', function() {
            // 显示加载状态
            submitBtn.disabled = true;
            submitText.textContent = '处理中...';
            spinner.classList.remove('d-none');
        });
    }

    // 文件选择时显示文件名
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) {
        fileInput.addEventListener('change', function(e) {
            const fileName = e.target.files[0]?.name || '未选择文件';
            const label = fileInput.nextElementSibling;
            if (label) {
                label.textContent = `已选择: ${fileName}`;
            }
        });
    }
});