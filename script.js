// ========================================
// HOTEL MANAGEMENT SYSTEM - JAVASCRIPT
// ========================================

// ========== FORM VALIDATION ==========

/**
 * Validates email format
 */
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Validates password strength
 */
function validatePassword(password) {
    if (password.length < 6) {
        return {
            valid: false,
            message: "Password must be at least 6 characters long"
        };
    }
    return { valid: true, message: "" };
}

/**
 * Validates full name (minimum 3 characters)
 */
function validateFullName(name) {
    const trimmedName = name.trim();
    if (trimmedName.length < 3) {
        return {
            valid: false,
            message: "Full name must be at least 3 characters long"
        };
    }
    return { valid: true, message: "" };
}

/**
 * Validates room number
 */
function validateRoomNumber(roomNumber) {
    if (roomNumber.trim().length === 0) {
        return {
            valid: false,
            message: "Room number cannot be empty"
        };
    }
    return { valid: true, message: "" };
}

/**
 * Validates price (must be positive number)
 */
function validatePrice(price) {
    if (isNaN(price) || parseFloat(price) <= 0) {
        return {
            valid: false,
            message: "Price must be a positive number"
        };
    }
    return { valid: true, message: "" };
}

/**
 * Validates check-in and check-out dates
 */
function validateDates(checkIn, checkOut) {
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (checkInDate < today) {
        return {
            valid: false,
            message: "Check-in date cannot be in the past"
        };
    }

    if (checkOutDate <= checkInDate) {
        return {
            valid: false,
            message: "Check-out date must be after check-in date"
        };
    }

    return { valid: true, message: "" };
}

// ========== FORM EVENT LISTENERS ==========

document.addEventListener('DOMContentLoaded', function () {
    attachFormValidationListeners();
    attachDeleteConfirmation();
    setMinCheckInDate();
});

/**
 * Attach validation listeners to signup form
 */
function attachFormValidationListeners() {
    // Find all forms on the page
    const forms = document.querySelectorAll('form');

    forms.forEach(form => {
        form.addEventListener('submit', function (e) {
            const action = form.getAttribute('action') || '';

            // Signup form validation
            if (action.includes('signup') || form.querySelector('input[name="full_name"]')) {
                if (!validateSignupForm(form)) {
                    e.preventDefault();
                }
            }

            // Add room form validation
            if (action.includes('add_room') || form.querySelector('input[name="room_number"]')) {
                if (!validateAddRoomForm(form)) {
                    e.preventDefault();
                }
            }

            // Book room form validation
            if (action.includes('book_room') || form.querySelector('input[name="check_in"]')) {
                if (!validateBookRoomForm(form)) {
                    e.preventDefault();
                }
            }
        });
    });
}

/**
 * Validates signup form
 */
function validateSignupForm(form) {
    const fullName = form.querySelector('input[name="full_name"]')?.value || '';
    const email = form.querySelector('input[name="email"]')?.value || '';
    const password = form.querySelector('input[name="password"]')?.value || '';

    // Validate full name
    const nameValidation = validateFullName(fullName);
    if (!nameValidation.valid) {
        showAlert(nameValidation.message, 'error');
        return false;
    }

    // Validate email
    if (!validateEmail(email)) {
        showAlert('Please enter a valid email address', 'error');
        return false;
    }

    // Validate password
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
        showAlert(passwordValidation.message, 'error');
        return false;
    }

    return true;
}

/**
 * Validates add room form
 */
function validateAddRoomForm(form) {
    const roomNumber = form.querySelector('input[name="room_number"]')?.value || '';
    const roomType = form.querySelector('input[name="room_type"]')?.value || '';
    const price = form.querySelector('input[name="price"]')?.value || '';

    // Validate room number
    const roomNumberValidation = validateRoomNumber(roomNumber);
    if (!roomNumberValidation.valid) {
        showAlert(roomNumberValidation.message, 'error');
        return false;
    }

    // Validate room type
    if (roomType.trim().length === 0) {
        showAlert('Please enter a room type', 'error');
        return false;
    }

    // Validate price
    const priceValidation = validatePrice(price);
    if (!priceValidation.valid) {
        showAlert(priceValidation.message, 'error');
        return false;
    }

    return true;
}

/**
 * Validates book room form
 */
function validateBookRoomForm(form) {
    const checkIn = form.querySelector('input[name="check_in"]')?.value || '';
    const checkOut = form.querySelector('input[name="check_out"]')?.value || '';

    // Validate dates
    const datesValidation = validateDates(checkIn, checkOut);
    if (!datesValidation.valid) {
        showAlert(datesValidation.message, 'error');
        return false;
    }

    return true;
}

// ========== DELETE CONFIRMATION ==========

/**
 * Attach delete confirmation to delete links
 */
function attachDeleteConfirmation() {
    const deleteLinks = document.querySelectorAll('a[href*="delete_room"]');

    deleteLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            if (!confirmDelete('Are you sure you want to delete this room?')) {
                e.preventDefault();
            }
        });
    });
}

/**
 * Show delete confirmation dialog
 */
function confirmDelete(message) {
    return confirm(message);
}

// ========== ALERTS & NOTIFICATIONS ==========

/**
 * Display alert message with type
 */
function showAlert(message, type = 'info') {
    // Create alert element
    const alertDiv = document.createElement('div');
    alertDiv.className = `message ${type}`;
    alertDiv.textContent = message;
    alertDiv.style.animation = 'slideIn 0.3s ease';

    // Insert at the top of the container
    const container = document.querySelector('body');
    container.insertBefore(alertDiv, container.firstChild);

    // Auto-remove after 5 seconds
    setTimeout(() => {
        alertDiv.style.opacity = '0';
        alertDiv.style.transition = 'opacity 0.3s ease';
        setTimeout(() => alertDiv.remove(), 300);
    }, 5000);
}

// ========== DATE PICKER ==========

/**
 * Set minimum check-in date to today
 */
function setMinCheckInDate() {
    const checkInInputs = document.querySelectorAll('input[name="check_in"]');

    checkInInputs.forEach(input => {
        const today = new Date().toISOString().split('T')[0];
        input.setAttribute('min', today);

        // When check-in date changes, update check-out minimum
        input.addEventListener('change', function () {
            const checkOutInput = this.closest('form')?.querySelector('input[name="check_out"]');
            if (checkOutInput) {
                const checkInDate = new Date(this.value);
                checkInDate.setDate(checkInDate.getDate() + 1);
                const minCheckOut = checkInDate.toISOString().split('T')[0];
                checkOutInput.setAttribute('min', minCheckOut);
            }
        });
    });
}

// ========== CALCULATIONS & UTILITIES ==========

/**
 * Calculate number of days between two dates
 */
function calculateDays(checkIn, checkOut) {
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const timeDifference = checkOutDate - checkInDate;
    return Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
}

/**
 * Format currency
 */
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

/**
 * Format date
 */
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// ========== TABLE ENHANCEMENTS ==========

/**
 * Add search functionality to tables
 */
function enableTableSearch(tableId, searchInputId) {
    const searchInput = document.getElementById(searchInputId);
    const table = document.getElementById(tableId);

    if (!searchInput || !table) return;

    searchInput.addEventListener('keyup', function () {
        const filter = this.value.toLowerCase();
        const rows = table.querySelectorAll('tbody tr');

        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            row.style.display = text.includes(filter) ? '' : 'none';
        });
    });
}

/**
 * Sort table by column
 */
function sortTableByColumn(tableId, columnIndex) {
    const table = document.getElementById(tableId);
    const tbody = table.querySelector('tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));

    rows.sort((a, b) => {
        const aValue = a.cells[columnIndex].textContent.trim();
        const bValue = b.cells[columnIndex].textContent.trim();

        if (isNaN(aValue)) {
            return aValue.localeCompare(bValue);
        } else {
            return parseFloat(aValue) - parseFloat(bValue);
        }
    });

    rows.forEach(row => tbody.appendChild(row));
}

// ========== SESSION MANAGEMENT ==========

/**
 * Check if session exists
 */
function isSessionActive() {
    return document.body.innerHTML.includes('Welcome');
}

/**
 * Redirect to login if session expired
 */
function checkSessionTimeout() {
    setTimeout(() => {
        if (!isSessionActive()) {
            window.location.href = 'login.php';
        }
    }, 30 * 60 * 1000); // 30 minutes
}

// ========== EXPORT DATA ==========

/**
 * Export table to CSV
 */
function exportTableToCSV(tableId, filename = 'data.csv') {
    const table = document.getElementById(tableId);
    let csv = [];

    // Get headers
    const headers = table.querySelectorAll('thead th');
    const headerRow = Array.from(headers).map(h => `"${h.textContent.trim()}"`).join(',');
    csv.push(headerRow);

    // Get rows
    const rows = table.querySelectorAll('tbody tr');
    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        const rowData = Array.from(cells).map(cell => `"${cell.textContent.trim()}"`).join(',');
        csv.push(rowData);
    });

    // Create download link
    const csvContent = csv.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
}

// ========== UTILITY ANIMATIONS ==========

/**
 * Fade in element
 */
function fadeIn(element, duration = 300) {
    element.style.opacity = '0';
    element.style.transition = `opacity ${duration}ms ease`;
    setTimeout(() => {
        element.style.opacity = '1';
    }, 10);
}

/**
 * Fade out element
 */
function fadeOut(element, duration = 300) {
    element.style.opacity = '1';
    element.style.transition = `opacity ${duration}ms ease`;
    setTimeout(() => {
        element.style.opacity = '0';
    }, 10);
}