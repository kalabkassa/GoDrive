document.querySelector('.newsletter-button').addEventListener('click', function(e) {
    e.preventDefault(); // Prevent default anchor navigation

    const emailInput = document.querySelector('.newsletter-input');
    const email = emailInput.value.trim();

    if (!email) {
        alert('Please enter your email.');
        return;
    }

    fetch('https://godriveet.com/newsletter', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Thank you for subscribing!');
                emailInput.value = ''; // Clear input
            } else {
                alert("❌ Failed to send email: " + data.error);
            }
        })
        .catch(err => {
            console.error(err);
            alert('Error sending subscription request.');
        });
});
