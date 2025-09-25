document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const uploadForm = document.getElementById('uploadForm');
    const logoutBtn = document.getElementById('logoutBtn');
    const filesList = document.getElementById('filesList');
    const welcomeUser = document.getElementById('welcomeUser');

    const handleResponse = async (response) => {
        const data = await response.json();
        if (data.success) {
            alert(data.message);
            return true;
        } else {
            alert(`Error: ${data.message}`);
            return false;
        }
    };
    
    const checkLoginStatus = async () => {
        const response = await fetch('/check-login');
        const data = await response.json();
        if (data.loggedIn) {
            if (welcomeUser) {
                welcomeUser.textContent = `Halo, ${data.username}`;
            }
            if (window.location.pathname.endsWith('dashboard.html')) {
                fetchFiles();
            }
        } else {
            if (window.location.pathname !== '/login.html' && window.location.pathname !== '/register.html') {
                window.location.href = 'login.html';
            }
        }
    };

    checkLoginStatus();

    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = registerForm.username.value;
            const password = registerForm.password.value;
            const response = await fetch('/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            if (await handleResponse(response)) {
                window.location.href = 'login.html';
            }
        });
    }

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = loginForm.username.value;
            const password = loginForm.password.value;
            const response = await fetch('/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            if (await handleResponse(response)) {
                window.location.href = 'dashboard.html';
            }
        });
    }

    if (uploadForm) {
        uploadForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const fileInput = document.getElementById('fileInput');
            const file = fileInput.files[0];
            if (!file) {
                alert('Pilih file untuk diunggah.');
                return;
            }
            const formData = new FormData();
            formData.append('myFile', file);
            const response = await fetch('/upload', {
                method: 'POST',
                body: formData
            });
            if (await handleResponse(response)) {
                fileInput.value = '';
                fetchFiles();
            }
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            const response = await fetch('/logout', { method: 'POST' });
            if (await handleResponse(response)) {
                window.location.href = 'login.html';
            }
        });
    }

    const fetchFiles = async () => {
        if (!filesList) return;
        const response = await fetch('/files');
        if (response.status === 401) {
            window.location.href = 'login.html';
            return;
        }
        const files = await response.json();
        filesList.innerHTML = '<h3>File Saya</h3>';
        if (files.length === 0) {
            filesList.innerHTML += '<p>Anda belum mengunggah file.</p>';
            return;
        }
        files.forEach(file => {
            const fileItem = document.createElement('div');
            fileItem.classList.add('file-item');
            
            const fileInfo = document.createElement('div');
            fileInfo.classList.add('file-info');

            const fileLink = document.createElement('a');
            fileLink.href = `/uploads/${file.file_name}`;
            fileLink.classList.add('file-name');
            fileLink.textContent = file.file_name;
            fileLink.target = '_blank';
            
            const fileDate = document.createElement('span');
            const date = new Date(file.upload_date).toLocaleString();
            fileDate.classList.add('file-date');
            fileDate.textContent = `Diunggah: ${date}`;

            const fileActions = document.createElement('div');
            fileActions.classList.add('file-actions');

            const renameBtn = document.createElement('button');
            renameBtn.textContent = 'Ganti Nama';
            renameBtn.classList.add('action-btn', 'rename-btn');
            renameBtn.addEventListener('click', () => handleRenameFile(file.id, file.file_name));

            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Hapus';
            deleteBtn.classList.add('action-btn', 'delete-btn');
            deleteBtn.addEventListener('click', () => handleDeleteFile(file.id, file.file_name));

            fileInfo.appendChild(fileLink);
            fileInfo.appendChild(fileDate);
            fileActions.appendChild(renameBtn);
            fileActions.appendChild(deleteBtn);
            fileItem.appendChild(fileInfo);
            fileItem.appendChild(fileActions);
            filesList.appendChild(fileItem);
        });
    };

    const handleRenameFile = async (fileId, currentFileName) => {
        const newFileName = prompt(`Masukkan nama baru untuk file "${currentFileName}":`);
        if (newFileName && newFileName.trim() !== '' && newFileName !== currentFileName) {
            const response = await fetch(`/files/${fileId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ newFileName })
            });
            if (await handleResponse(response)) {
                fetchFiles();
            }
        }
    };

    const handleDeleteFile = async (fileId, fileName) => {
        if (confirm(`Apakah Anda yakin ingin menghapus file "${fileName}"?`)) {
            const response = await fetch(`/files/${fileId}`, {
                method: 'DELETE'
            });
            if (await handleResponse(response)) {
                fetchFiles();
            }
        }
    };
});