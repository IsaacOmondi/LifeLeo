const htmlPage = document.getElementById('htmlPage');
const btnToggleLight = document.getElementById('btnToggleLight');
const btnToggleDark = document.getElementById('btnToggleDark');
btnToggleLight.addEventListener('click', toggleLightMode);
btnToggleDark.addEventListener('click', toggleDarkMode);

function toggleLightMode() {
  htmlPage.setAttribute('data-bs-theme', 'light');
  localStorage.setItem('theme', 'light');
  updateIconVisibility();
}

function toggleDarkMode() {
  htmlPage.setAttribute('data-bs-theme', 'dark');
  localStorage.setItem('theme', 'dark');
  updateIconVisibility();
}

// Message handling function
function showMessage(message, type) {
  const container = document.getElementById('messageContainer');
  const messageText = document.getElementById('messageText');
  
  messageText.textContent = message;
  messageText.className = `alert alert-${type}`;
  container.style.display = 'block';

  setTimeout(() => {
      container.style.display = 'none';
  }, 5000);
}

// Function to update the visibility of icons based on current theme
function updateIconVisibility() {
  const currentTheme = htmlPage.getAttribute('data-bs-theme');
  
  if (currentTheme === 'dark') {
      btnToggleLight.style.display = 'block';  // Show sun icon
      btnToggleDark.style.display = 'none';    // Hide moon icon
  } else {
      btnToggleLight.style.display = 'none';   // Hide sun icon
      btnToggleDark.style.display = 'block';   // Show moon icon
  }
}

// Enhanced JavaScript for form handling
document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('journalForm');
  const moodButtons = document.querySelectorAll('.mood-button');
  const moodInput = document.getElementById('moodInput');

  // Handle mood button clicks
  moodButtons.forEach(button => {
      button.addEventListener('click', () => {
          // Remove active class from all buttons
          moodButtons.forEach(btn => btn.classList.remove('active'));
          
          // Add active class to clicked button
          button.classList.add('active');
          
          // Set the mood value in hidden input
          moodInput.value = button.dataset.mood;
      });
  });

  // Form submission handling
  form.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Validate mood selection
      if (!moodInput.value) {
          showMessage('Please select a mood before submitting', 'danger');
          return;
      }

      try {
          const response = await fetch(form.action, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
                  // Include CSRF token in headers
                  'X-CSRF-TOKEN': document.querySelector('input[name="_csrf"]').value
              },
              body: JSON.stringify({
                  mood: parseInt(moodInput.value),
                  note: form.querySelector('textarea[name="note"]').value
              })
          });

          if (response.ok) {
            showMessage('Journal entry saved successfully!', 'success');
            form.reset();
            moodButtons.forEach(btn => btn.classList.remove('active'));
            moodInput.value = '';
          } else {
            showMessage(result.message || 'Failed to save journal entry', 'danger');
          }
      } catch (error) {
        showMessage('An error occurred while saving your journal entry', 'danger');
      }
  });
});

// Add this to initialize the theme from localStorage when the page loads
document.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
      htmlPage.setAttribute('data-bs-theme', savedTheme);
      updateIconVisibility();
  }
});

updateIconVisibility();
