function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });

    // Update active nav link
    document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('onclick') && link.getAttribute('onclick').includes(sectionId)) {
    link.classList.add('active');
}
});

    // Show the selected section
    const section = document.getElementById(sectionId);
    if (section) {
    section.classList.add('active');
}

    // Special case for login/signup buttons
    if (sectionId === 'login' || sectionId === 'signup') {
    document.querySelector('.nav-link[onclick*="home"]').classList.add('active');
}
}

    // Initialize with home section
    document.addEventListener('DOMContentLoaded', function() {
    showSection('home');
});
