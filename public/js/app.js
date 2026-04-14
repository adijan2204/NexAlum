document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');

    // Toast System
    window.showToast = (message, type = 'info') => {
        const toast = document.createElement('div');
        toast.className = `fixed bottom-8 right-8 px-6 py-4 rounded-2xl text-white font-bold shadow-2xl transition duration-500 transform translate-y-20 z-[100] ${type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-purple-600'
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
        loginForm.addEventListener('submit', async (e) => { // Added async
            e.preventDefault();
            const email = document.getElementById('email').value.toLowerCase();
            const password = document.getElementById('password').value;

            // TRY BACKEND LOGIN FIRST
            try {
                const response = await fetch('http://localhost:3000/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });
                const data = await response.json();
                if (response.ok) {
                    role = data.role;
                    name = data.fullName;
                    localStorage.setItem('token', data.token);
                } else if (email === 'shruti@1007.com' && password === 'shruti') {
                    // STATIC FALLBACK
                    role = 'admin';
                    name = 'System Admin';
                } else if (email === 'vaishu@0910.com' && password === 'vaishu') {
                    role = 'alumni';
                    name = 'Vaishanavi Maraskolhe';
                } else if (email === 'mansi@1007.com' && password === 'mansi') {
                    role = 'student';
                    name = 'Mansi Mate';
                } else if (email === 'tony@stark.com' && password === 'ironman') {
                    role = 'alumni';
                    name = 'Tony Stark';
                } else if (email === 'steve@rogers.com' && password === 'cap') {
                    role = 'alumni';
                    name = 'Steve Rogers';
                } else {
                    showToast(data.message || 'Invalid Email or Password!', 'error');
                    return;
                }
            } catch (error) {
                // NETWORK ERROR OR SERVER DOWN - TRY STATIC FALLBACK
                if (email === 'shruti@1007.com' && password === 'shruti') {
                    role = 'admin';
                    name = 'System Admin';
                } else if (email === 'vaishu@0910.com' && password === 'vaishu') {
                    role = 'alumni';
                    name = 'Vaishanavi Maraskolhe';
                } else if (email === 'mansi@1007.com' && password === 'mansi') {
                    role = 'student';
                    name = 'Mansi Mate';
                } else if (email === 'tony@stark.com' && password === 'ironman') {
                    role = 'alumni';
                    name = 'Tony Stark';
                } else if (email === 'steve@rogers.com' && password === 'cap') {
                    role = 'alumni';
                    name = 'Steve Rogers';
                } else {
                    showToast('Connection failed!', 'error');
                    return;
                }
            }

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
        });
    }

    // STATIC REGISTRATION LOGIC (NO BACKEND REQUIRED)
    const registrationForm = document.getElementById('modalRegisterForm');
    if (registrationForm) {
        registrationForm.onsubmit = (event) => {
            event.preventDefault();

            // Collect dummy data
            const role = document.getElementById('regRole').value;
            const name = document.getElementById('regFullName').value;

            if (!role) {
                return showToast('Please select a role (Student or Alumni)', 'error');
            }

            // SIMULATE SUCCESSFUL REGISTRATION
            showToast(`Welcome ${name}! Registration successful.`, 'success');

            // Optional: Store registration info locally to simulate persistence
            localStorage.setItem('isRegistered', 'true');
            localStorage.setItem('registeredRole', role);

            setTimeout(() => {
                window.location.reload();
            }, 1500);
        };
    }
});

