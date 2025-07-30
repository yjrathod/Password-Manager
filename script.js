document.addEventListener("DOMContentLoaded", () => {
    const addTab = document.getElementById('addTab');
    const listTab = document.getElementById('listTab');
    const addSection = document.getElementById('addSection');
    const listSection = document.getElementById('listSection');

    const usernameInput = document.getElementById('usernameInput');
    const passwordInput = document.getElementById('passwordInput');
    const saveBtn = document.getElementById('saveBtn');
    const clearBtn = document.getElementById('clearBtn');
    const generateBtn = document.getElementById('generateBtn');
    const tableBody = document.getElementById('tableBody');

    // Switch tabs
    addTab.addEventListener('click', () => {
        addSection.style.display = 'block';
        listSection.style.display = 'none';
        addTab.style.backgroundColor = '#ffeb3b';
        listTab.style.backgroundColor = 'transparent';
    });

    listTab.addEventListener('click', () => {
        addSection.style.display = 'none';
        listSection.style.display = 'block';
        listTab.style.backgroundColor = '#ffeb3b';
        addTab.style.backgroundColor = 'transparent';
        renderTable(); // show updated table
    });

    // Clear form
    clearBtn.addEventListener('click', () => {
        usernameInput.value = '';
        passwordInput.value = '';
    });

    // Generate hard password
    generateBtn.addEventListener('click', () => {
        const strongPass = generateStrongPassword();
        passwordInput.value = strongPass;
    });

    // Save password
    saveBtn.addEventListener('click', () => {
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        if (!username || !password) {
            alert("Both fields are required!");
            return;
        }

        const saved = getSavedPasswords();
        saved.push({ username, password });
        localStorage.setItem('passwords', JSON.stringify(saved));

        usernameInput.value = '';
        passwordInput.value = '';
        alert("Saved!");

        renderTable();
    });

    // Generate a strong password
    function generateStrongPassword() {
        const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+[]{}|:;<>,.?/~";
        let pass = "";
        for (let i = 0; i < 12; i++) {
            const index = Math.floor(Math.random() * chars.length);
            pass += chars[index];
        }
        return pass;
    }

    // Get saved passwords from localStorage
    function getSavedPasswords() {
        return JSON.parse(localStorage.getItem('passwords')) || [];
    }

    // Render table rows
    function renderTable() {
        const saved = getSavedPasswords();
        tableBody.innerHTML = "";

        saved.forEach((entry, index) => {
            const tr = document.createElement('tr');

            const usernameTd = document.createElement('td');
            usernameTd.textContent = entry.username;

            const passwordTd = document.createElement('td');
            const hiddenPassword = '•'.repeat(entry.password.length);
            passwordTd.textContent = hiddenPassword;
            passwordTd.dataset.password = entry.password;
            passwordTd.dataset.hidden = "true";

            const actionsTd = document.createElement('td');

            const toggleBtn = document.createElement('button');
            toggleBtn.textContent = "Show";
            toggleBtn.addEventListener('click', () => {
                if (passwordTd.dataset.hidden === "true") {
                    passwordTd.textContent = passwordTd.dataset.password;
                    passwordTd.dataset.hidden = "false";
                    toggleBtn.textContent = "Hide";
                } else {
                    passwordTd.textContent = '•'.repeat(passwordTd.dataset.password.length);
                    passwordTd.dataset.hidden = "true";
                    toggleBtn.textContent = "Show";
                }
            });

            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = "Delete";
            deleteBtn.addEventListener('click', () => {
                saved.splice(index, 1);
                localStorage.setItem('passwords', JSON.stringify(saved));
                renderTable();
            });

            actionsTd.appendChild(toggleBtn);
            actionsTd.appendChild(deleteBtn);

            tr.appendChild(usernameTd);
            tr.appendChild(passwordTd);
            tr.appendChild(actionsTd);

            tableBody.appendChild(tr);
        });
    }

    // On page load
    renderTable();
});
