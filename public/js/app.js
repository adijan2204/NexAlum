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
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value.toLowerCase();
            const password = document.getElementById('password').value;

            // DEFINED STATIC CREDENTIALS
            let role = '';
            let name = '';

            if (email === 'shruti@1007.com' && password === 'shruti') {
                role = 'admin';
                name = 'System Admin';
            } else if (email === 'vaishu@0910.com' && password === 'vaishu') {
                role = 'alumni';
                name = 'Vaishanavi ';
            } else if (email === 'mansi@1007.com' && password === 'mansi') {
                role = 'student';
                name = 'Mansi';
            } else {
                showToast('Invalid Email or Password!', 'error');
                return;
            }

            localStorage.setItem('token', 'static-token-nexalum');
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
});
