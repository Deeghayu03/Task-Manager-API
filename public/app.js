const API_BASE_URL = 'http://localhost/Task-Manager-API/api';

// Initialize the appropriate scripts based on the loaded page
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('loginForm')) {
        initLogin();
    }
    if (document.getElementById('tasksTable')) {
        initDashboard();
    }
});

// --- LOGIN PAGE LOGIC ---
function initLogin() {
    const loginForm = document.getElementById('loginForm');
    const loginError = document.getElementById('loginError');

    // If already logged in, redirect to dashboard
    if (localStorage.getItem('user_id')) {
        window.location.href = 'dashboard.html';
        return;
    }

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        loginError.textContent = '';

        try {
            const response = await fetch(`${API_BASE_URL}/login.php`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            // Check if response is successful based on the provided API response
            if (data.success && data.user && data.user.id) {
                // Save user id in localStorage
                localStorage.setItem('user_id', data.user.id);
                // Redirect to dashboard
                window.location.href = 'dashboard.html';
            } else {
                // If login fails: Show an alert with the error message
                const errorMsg = data.message || 'Login failed. Please check your credentials.';
                loginError.textContent = errorMsg;
                alert(errorMsg);
            }
        } catch (error) {
            console.error('Login error:', error);
            const errorMsg = 'An error occurred connecting to the API.';
            loginError.textContent = errorMsg;
            alert(errorMsg);
        }
    });
}

// --- DASHBOARD PAGE LOGIC ---
function initDashboard() {
    let userId = localStorage.getItem('user_id');

    // For testing purposes assume user_id = 1 if not set
    if (!userId) {
        userId = 1;
    }

    const logoutBtn = document.getElementById('logoutBtn');
    const taskForm = document.getElementById('taskForm');
    const tasksBody = document.getElementById('tasksBody');
    const taskMessage = document.getElementById('taskMessage');

    // Modal elements
    const updateModal = document.getElementById('updateModal');
    const closeBtn = document.querySelector('.close');
    const updateForm = document.getElementById('updateForm');

    // Initial load of tasks
    loadTasks();

    // Logout
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('user_id');
        window.location.href = 'login.html';
    });

    // Create a new task
    taskForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const title = document.getElementById('title').value;
        const description = document.getElementById('description').value;

        try {
            const response = await fetch(`${API_BASE_URL}/tasks.php`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    user_id: userId,
                    title: title,
                    description: description
                })
            });

            if (response.ok) {
                taskMessage.textContent = 'Task created successfully!';
                taskMessage.style.color = 'var(--success-color)';
                taskForm.reset();
                loadTasks();

                setTimeout(() => {
                    taskMessage.textContent = '';
                }, 3000);
            } else {
                const data = await response.json();
                taskMessage.textContent = data.message || 'Failed to create task.';
                taskMessage.style.color = 'var(--error-color)';
            }
        } catch (error) {
            console.error('Error creating task:', error);
            taskMessage.textContent = 'An error occurred while creating the task.';
            taskMessage.style.color = 'var(--error-color)';
        }
    });

    // Modal close event handlers
    closeBtn.addEventListener('click', () => {
        updateModal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === updateModal) {
            updateModal.style.display = 'none';
        }
    });

    // Update an existing task
    updateForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const id = document.getElementById('updateId').value;
        const title = document.getElementById('updateTitle').value;
        const description = document.getElementById('updateDescription').value;
        const status = document.getElementById('updateStatus').value;

        try {
            const response = await fetch(`${API_BASE_URL}/tasks.php`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: id,
                    title: title,
                    description: description,
                    status: status
                })
            });

            if (response.ok) {
                updateModal.style.display = 'none';
                loadTasks();
            } else {
                const data = await response.json().catch(() => ({}));
                alert(data.message || 'Failed to update task.');
            }
        } catch (error) {
            console.error('Error updating task:', error);
            alert('An error occurred while updating the task.');
        }
    });

    // Fetch and display lists
    async function loadTasks() {
        try {
            const response = await fetch(`${API_BASE_URL}/tasks.php?user_id=${userId}`);

            if (!response.ok) {
                throw new Error('Failed to fetch tasks');
            }

            const jsonResponse = await response.json();
            const tasks = jsonResponse.data || jsonResponse.tasks || jsonResponse || [];

            tasksBody.innerHTML = '';

            if (!Array.isArray(tasks) || tasks.length === 0) {
                // If API returns an error message instead of array, or an empty array
                tasksBody.innerHTML = '<tr><td colspan="5" style="text-align: center;">No tasks found. Begin by creating one above!</td></tr>';
                return;
            }

            tasks.forEach(task => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${task.id}</td>
                    <td>${escapeHTML(task.title)}</td>
                    <td>${escapeHTML(task.description)}</td>
                    <td>${escapeHTML(task.status || '')}</td>
                    <td>
                        <button class="btn btn-small btn-secondary update-btn">Update</button>
                        <button class="btn btn-small btn-danger delete-btn">Delete</button>
                    </td>
                `;

                tr.querySelector('.update-btn').addEventListener('click', () => {
                    openUpdateModal(task.id, task.title, task.description, task.status);
                });
                tr.querySelector('.delete-btn').addEventListener('click', () => {
                    deleteTask(task.id);
                });

                tasksBody.appendChild(tr);
            });
        } catch (error) {
            console.error('Error loading tasks:', error);
            tasksBody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: var(--error-color);">Error loading tasks. Please try again later.</td></tr>';
        }
    }

    // Modal open function
    function openUpdateModal(id, title, description, status) {
        document.getElementById('updateId').value = id;
        document.getElementById('updateTitle').value = title || '';
        document.getElementById('updateDescription').value = description || '';

        const statusSelect = document.getElementById('updateStatus');
        if (status) {
            const matchedOption = Array.from(statusSelect.options).find(opt => opt.value.toLowerCase() === status.toLowerCase());
            if (matchedOption) {
                statusSelect.value = matchedOption.value;
            } else {
                statusSelect.value = status;
            }
        }

        updateModal.style.display = 'block';
    }

    // Delete task function
    async function deleteTask(id) {
        if (!confirm('Are you sure you want to delete this task?')) return;

        try {
            const response = await fetch(`${API_BASE_URL}/tasks.php`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: id })
            });

            if (response.ok) {
                loadTasks();
            } else {
                const data = await response.json().catch(() => ({}));
                alert(data.message || 'Failed to delete task.');
            }
        } catch (error) {
            console.error('Error deleting task:', error);
            alert('An error occurred while deleting the task.');
        }
    }

    // --- Helper Functions to prevent script injection in the DOM ---
    function escapeHTML(str) {
        if (!str) return '';
        return String(str).replace(/[&<>'"]/g, tag => ({
            '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
        }[tag] || tag));
    }

    function unescapeHTML(str) {
        if (!str) return '';
        return String(str).replace(/&amp;|&lt;|&gt;|&#39;|&quot;/g, tag => ({
            '&amp;': '&', '&lt;': '<', '&gt;': '>', '&#39;': "'", '&quot;': '"'
        }[tag] || tag));
    }
}
