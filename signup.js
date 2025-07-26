document.getElementById('signup-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission

    const username = document.getElementById('new-username').value;
    const password = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    // Check if passwords match
    if (password !== confirmPassword) {
        document.getElementById('signup-error').textContent = 'Passwords do not match';
        return;
    }

    // Prepare data to be sent to the server
    const userData = {
        username: username,
        password: password
    };

    // Send data to the server
    fetch('http://localhost:3000/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Redirect to login page upon successful signup
            window.location.href = 'login.html';
        } else {
            document.getElementById('signup-error').textContent = data.error || 'An error occurred. Please try again.';
        }
    })
    .catch(error => {
        document.getElementById('signup-error').textContent = 'Failed to connect to the server. Please try again.';
        console.error('Error:', error);
    });
});
