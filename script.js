console.log('bcrypt:', typeof bcrypt !== 'undefined' ? 'Loaded' : 'Not Loaded');

document.addEventListener('DOMContentLoaded', () => {
    const baseUrl = 'http://localhost:3000'; // Adjust this if necessary

    // Utility functions for cookies
    function setCookie(name, value, days) {
        let expires = "";
        if (days) {
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "") + expires + "; path=/";
    }

    function getCookie(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

    function eraseCookie(name) {
        document.cookie = name + '=; Max-Age=-99999999;';
    }

    // Show/hide sections
    function showSection(sectionId) {
        document.querySelectorAll('main > section').forEach(section => {
            section.classList.add('hidden');
        });
        document.getElementById(sectionId).classList.remove('hidden');
    }

    // Navigation click events
    document.getElementById('nav-home').addEventListener('click', () => showSection('repo-list'));
    document.getElementById('nav-repos').addEventListener('click', () => showSection('repo-list'));
    document.getElementById('nav-login').addEventListener('click', () => showSection('login-section'));
    document.getElementById('nav-signup').addEventListener('click', () => showSection('signup-section'));
    document.getElementById('nav-logout').addEventListener('click', () => {
        eraseCookie('username');
        showSection('login-section');
        document.getElementById('nav-logout').style.display = 'none';
    });

    // Hash password
    async function hashPassword(password) {
        const saltRounds = 10;
        return new Promise((resolve, reject) => {
            bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
                if (err) reject(err);
                else resolve(hashedPassword);
            });
        });
    }

    // Compare password
    async function comparePassword(password, hashedPassword) {
        return new Promise((resolve, reject) => {
            bcrypt.compare(password, hashedPassword, (err, isMatch) => {
                if (err) reject(err);
                else resolve(isMatch);
            });
        });
    }

    // Handle Sign-Up
    document.getElementById('signupForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        const username = document.getElementById('signup-username').value;
        const password = document.getElementById('signup-password').value;

        try {
            const response = await fetch(`${baseUrl}/users`);
            const users = await response.json();

            if (users.some(user => user.username === username)) {
                alert('Username already exists');
                return;
            }

            const hashedPassword = await hashPassword(password);

            const addUserResponse = await fetch(`${baseUrl}/users`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password: hashedPassword }),
            });

            if (addUserResponse.ok) {
                alert('Sign-Up Successful');
                showSection('login-section');
            } else {
                alert('Sign-Up Failed');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });

    // Handle Login
    document.getElementById('loginForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;

        try {
            const response = await fetch(`${baseUrl}/users`);
            const users = await response.json();

            const user = users.find(user => user.username === username);

            if (user && await comparePassword(password, user.password)) {
                setCookie('username', username, 1); // Store username in cookie for session
                alert('Login Successful');
                showSection('repo-list');
                document.getElementById('nav-logout').style.display = 'block';
                loadProfile(username);
            } else {
                alert('Invalid Username or Password');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });

    // Handle Add Repository
    document.getElementById('addRepoForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        const name = document.getElementById('name').value;
        const description = document.getElementById('description').value;
        const owner = document.getElementById('owner').value;

        try {
            const response = await fetch(`${baseUrl}/repositories`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, description, owner }),
            });

            if (response.ok) {
                alert('Repository Added');
                loadRepositories(); // Reload the list of repositories
            } else {
                alert('Failed to Add Repository');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });

    // Load Repositories
    async function loadRepositories() {
        try {
            const response = await fetch(`${baseUrl}/repositories`);
            const repos = await response.json();

            const reposList = document.getElementById('repos');
            reposList.innerHTML = '';

            repos.forEach(repo => {
                const listItem = document.createElement('li');
                listItem.textContent = `${repo.name}: ${repo.description}`;
                reposList.appendChild(listItem);
            });
        } catch (error) {
            console.error('Error:', error);
        }
    }

    // Load Profile
    async function loadProfile(username) {
        try {
            const response = await fetch(`${baseUrl}/users?username=${username}`);
            const users = await response.json();
            
            if (users.length > 0) {
                const user = users[0];
                // You can display user profile details here
                console.log('User Profile:', user);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    // Check if user is logged in on page load
    const loggedInUsername = getCookie('username');
    if (loggedInUsername) {
        showSection('repo-list');
        document.getElementById('nav-logout').style.display = 'block';
        loadProfile(loggedInUsername);
    } else {
        showSection('login-section');
    }

    // Initial load of repositories
    loadRepositories();
});
