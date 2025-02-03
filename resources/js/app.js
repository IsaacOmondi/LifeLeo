function toggleLightMode() {
  const html = document.getElementById('htmlPage')
  html.setAttribute('data-bs-theme', 'light')
}

function toggleDarkMode() {
  const html = document.getElementById('htmlPage')
  html.setAttribute('data-bs-theme', 'dark')
}

const btnToggleLight = document.getElementById('btnToggleLight');
const btnToggleDark = document.getElementById('btnToggleDark');
btnToggleLight.addEventListener('click', toggleLightMode)
btnToggleDark.addEventListener('click', toggleDarkMode)

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
          alert('Please select a mood before submitting');
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
              // Handle successful submission
              const result = await response.json();
              alert('Journal entry saved successfully!');
              // Optional: Reset form
              form.reset();
              moodButtons.forEach(btn => btn.classList.remove('active'));
              moodInput.value = '';
          } else {
              // Handle errors
              const error = await response.json();
              alert(error.message || 'Failed to save journal entry');
          }
      } catch (error) {
          console.error('Error:', error);
          alert('An error occurred while saving your journal entry');
      }
  });
});