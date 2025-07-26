function login() {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  fetch('http://localhost:3000/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  })
  .then(response => response.json())
  .then(data => {
    if (data.message) {
      window.location.href = 'home1.html'; // Redirect to home on success
    } else {
      document.getElementById('login-error').textContent = data.error;
    }
  })
  .catch(err => {
    console.error('Error during login:', err);
    document.getElementById('login-error').textContent = 'Login failed. Please try again.';
  });

  return false; // Prevent page reload
}
