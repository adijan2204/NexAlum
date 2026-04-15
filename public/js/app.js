document.addEventListener('DOMContentLoaded', () => {
    // Check if running as a local file
    if (window.location.protocol === 'file:') {
        alert('Warning: You are opening this app as a file. Please use http://localhost:3000 to ensure all features work correctly.');
    }

    const loginForm = document.getElementById('loginForm');

    // Toast System
    window.showToast = (message, type = 'info') => {
        const toast = document.createElement('div');
        toast.className = `fixed bottom-8 right-8 px-6 py-4 rounded-2xl text-white font-bold shadow-2xl transition duration-500 transform translate-y-20 z-[100] ${type === 'success' ? 'bg-purple-600' : type === 'error' ? 'bg-red-500' : 'bg-purple-600'
            }`;
        toast.innerText = message;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.classList.remove('translate-y-20');
        }, 100);

        setTimeout(() => {
            toast.classList.add('opacity-0', 'translate-y-10');
            setTimeout(() => toast.remove(), 500);
        }, 3000);
    };

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value.toLowerCase();
            const password = document.getElementById('password').value;
            let role, name;

            // 1. PRIORITY: Check Static Users First (Instant Login for Vaishu, Shruti, Mansi)
            if (email === 'shruti@1007.com' && password === 'shruti') {
                role = 'admin';
                name = 'System Admin';
            } else if (email === 'vaishu@0910.com' && password === 'vaishu') {
                role = 'alumni';
                name = 'Vaishanavi Maraskolhe';
            } else if (email === 'mansi@1007.com' && password === 'mansi') {
                role = 'student';
                name = 'Mansi Mate';
            }

            // If it's a static user, we bypass the API
            if (role) {
                return proceedToLogin(role, name);
            }

            // 2. DEMO MODE: Check Local Storage Before API (Faster than waiting for DB timeout)
            const localUsers = JSON.parse(localStorage.getItem('approvedUsers') || '[]');
            const localUser = localUsers.find(u => u.email === email && u.password === password);
            if (localUser) {
                return proceedToLogin(localUser.role, localUser.fullName);
            }

            // 3. TRY BACKEND LOGIN (For real users in DB)
            try {
                const response = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });
                const data = await response.json();
                if (response.ok) {
                    role = data.role;
                    name = data.fullName;
                    localStorage.setItem('token', data.token);
                    proceedToLogin(role, name);
                } else if (data.message && data.message.includes('pending')) {
                    showToast(data.message, 'error');
                } else {
                    showToast(data.message || 'Invalid Email or Password!', 'error');
                }
            } catch (error) {
                console.error('Login Error:', error);
                showToast('Login failed! Check your connection or try again.', 'error');
            }
        });
    }

    function proceedToLogin(role, name) {
        if (!localStorage.getItem('token')) {
            localStorage.setItem('token', 'static-token-nexalum');
        }
        localStorage.setItem('role', role);
        localStorage.setItem('fullName', name);

        showToast(`Welcome back, ${name}!`, 'success');
        setTimeout(() => {
            if (role === 'admin') {
                window.location.href = 'public/dashboards/admin.html';
            } else if (role === 'alumni') {
                window.location.href = 'public/dashboards/alumni.html';
            } else {
                window.location.href = 'public/dashboards/student.html';
            }
        }, 800);
    }

    // DYNAMIC REGISTRATION LOGIC
    const registrationForm = document.getElementById('modalRegisterForm');
    if (registrationForm) {
        registrationForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const fullName = document.getElementById('regFullName').value;
            const email = document.getElementById('regEmail').value;
            const phone = document.getElementById('regPhone').value;
            const college = document.getElementById('regCollege').value;
            const graduationYear = document.getElementById('regGradYear').value;
            const role = document.getElementById('regRole').value;
            const password = document.getElementById('regPassword').value;

            if (!role) {
                return showToast('Please select a role (Student or Alumni)', 'error');
            }

            try {
                const response = await fetch('/api/auth/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        fullName, email, phone, college, graduationYear, role, password
                    })
                });

                const data = await response.json();

                if (response.ok) {
                    showToast(data.message, 'success');
                    setTimeout(() => {
                        window.location.reload();
                    }, 2000);
                } else {
                    if (response.status === 500) {
                        savePendingLocally({ fullName, email, phone, college, graduationYear, role, password });
                        return;
                    }
                    showToast(data.message || 'Registration failed!', 'error');
                }
            } catch (error) {
                console.error('Registration Error:', error);
                savePendingLocally({ fullName, email, phone, college, graduationYear, role, password });
            }
        });
    }

    function savePendingLocally(userData) {
        let pending = JSON.parse(localStorage.getItem('pendingRegistrations') || '[]');
        if (pending.some(u => u.email === userData.email)) {
            return showToast('This email is already registered locally.', 'error');
        }
        pending.push({ ...userData, _id: 'local_' + Date.now() });
        localStorage.setItem('pendingRegistrations', JSON.stringify(pending));
        showToast('Registration successful! Waiting for admin approval.', 'success');
        setTimeout(() => {
            window.location.reload();
        }, 2000);
    }
});
