document.getElementById('pickupDate').textContent = localStorage.getItem('pickupDate') || '';
document.getElementById('pickupTime').textContent = localStorage.getItem('pickupTime') || '';
document.getElementById('returnDate').textContent = localStorage.getItem('returnDate') || '';
document.getElementById('returnTime').textContent = localStorage.getItem('returnTime') || '';

// Smooth scroll if already on index
document.addEventListener("DOMContentLoaded", function() {
    // Smooth scroll on click
    document.querySelectorAll('a.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            console.log(this.hash);
            localStorage.setItem('hash', this.hash);
            window.location.href = "index.html";
        });
    });

});

document.getElementById('nextPage').addEventListener('click', () => {
    const fullName = document.getElementById('fullName').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const selectedCar = localStorage.getItem('selectedCar') || '';
    const pickupDate = localStorage.getItem('pickupDate') || '';
    const pickupTime = localStorage.getItem('pickupTime') || '';
    const returnDate = localStorage.getItem('returnDate') || '';
    const returnTime = localStorage.getItem('returnTime') || '';

    if (!fullName || !email || !phone) {
        alert("Please fill in all fields before continuing.");
        return; // stop navigation
    }

    // Optional: basic email format check
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        alert("Please enter a valid email address.");
        return;
    }

    // Optional: phone number validation
    if (phone.length < 7) {
        alert("Please enter a valid phone number.");
        return;
    }

    fetch("/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            name: fullName,
            email: email,
            phone: phone,
            car: selectedCar,
            pickupDate: pickupDate,
            pickupTime: pickupTime,
            returnDate: returnDate,
            returnTime: returnTime
        })
    })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                alert("✅ Email sent successfully!");
                // If all checks pass, move to next page
                window.location.href = "thankyou.html";
            } else {
                alert("❌ Failed to send email: " + data.error);
            }
        })
        .catch(err => {
            alert("❌ Error: " + err);
        });
});
