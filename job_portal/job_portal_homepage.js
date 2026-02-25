// Cart array to store job applications
let cart = [];

// Load cart from localStorage on page load
document.addEventListener('DOMContentLoaded', function() {
    loadCartFromStorage();
    updateCartCount();
    
    // Setup search functionality
    setupSearch();
    
    // Setup cart link click
    setupCartLink();
    
    // Setup apply buttons
    setupApplyButtons();
});

// Load cart from localStorage
function loadCartFromStorage() {
    const storedCart = localStorage.getItem('jobCart');
    if (storedCart) {
        cart = JSON.parse(storedCart);
    }
}

// Save cart to localStorage
function saveCartToStorage() {
    localStorage.setItem('jobCart', JSON.stringify(cart));
}

// Update cart count in header
function updateCartCount() {
    const cartLink = document.querySelector('a[href="#Cart"]');
    if (cartLink) {
        cartLink.textContent = `Cart (${cart.length})`;
    }
}

// Setup search functionality
function setupSearch() {
    const searchButton = document.querySelector('.search-box button');
    if (searchButton) {
        searchButton.addEventListener('click', performSearch);
    }
    
    // Also allow pressing Enter in search inputs
    const searchInputs = document.querySelectorAll('.search-box input');
    searchInputs.forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    });
}

// Perform search/filter
function performSearch() {
    const jobTitleInput = document.querySelector('.search-box input[type="text"]:first-of-type');
    const locationInput = document.querySelector('.search-box input[type="text"]:last-of-type');
    
    const titleFilter = jobTitleInput ? jobTitleInput.value.toLowerCase().trim() : '';
    const locationFilter = locationInput ? locationInput.value.toLowerCase().trim() : '';
    
    const jobCards = document.querySelectorAll('.job-card');
    
    jobCards.forEach(card => {
        const title = card.querySelector('h3')?.textContent.toLowerCase() || '';
        const location = card.querySelector('p')?.textContent.toLowerCase() || '';
        
        const matchesTitle = titleFilter === '' || title.includes(titleFilter);
        const matchesLocation = locationFilter === '' || location.includes(locationFilter);
        
        if (matchesTitle && matchesLocation) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
}

// Setup apply buttons for all job cards
function setupApplyButtons() {
    const applyButtons = document.querySelectorAll('.apply-btn');
    applyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const jobCard = this.closest('.job-card');
            addToCart(jobCard);
        });
    });
}

// Add job to cart
function addToCart(jobCard) {
    const title = jobCard.querySelector('h3')?.textContent || 'Unknown Job';
    const company = jobCard.querySelector('p strong')?.textContent || 'Unknown Company';
    const details = jobCard.querySelectorAll('p');
    const detailText = details.length > 1 ? details[1].textContent : '';
    
    // Check if job is already in cart
    const isAlreadyInCart = cart.some(item => item.title === title && item.company === company);
    
    if (isAlreadyInCart) {
        alert('This job is already in your cart!');
        return;
    }
    
    const jobItem = {
        id: Date.now(),
        title: title,
        company: company,
        details: detailText
    };
    
    cart.push(jobItem);
    saveCartToStorage();
    updateCartCount();
    alert('Job added to cart!');
}

// Setup cart link click handler
function setupCartLink() {
    const cartLink = document.querySelector('a[href="#Cart"]');
    if (cartLink) {
        cartLink.addEventListener('click', function(e) {
            e.preventDefault();
            showCartModal();
        });
    }
}

// Show cart modal
function showCartModal() {
    // Remove existing modal if any
    const existingModal = document.querySelector('.cart-modal');
    if (existingModal) {
        document.body.removeChild(existingModal);
    }
    
    const modal = document.createElement('div');
    modal.className = 'cart-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 2000;
    `;
    
    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
        background: white;
        padding: 20px;
        border-radius: 8px;
        width: 500px;
        max-width: 90%;
        max-height: 80vh;
        overflow-y: auto;
    `;
    
    let cartHTML = `
        <h2>Your Cart</h2>
        <p style="margin-bottom: 15px;">Jobs you've applied for:</p>
    `;
    
    if (cart.length === 0) {
        cartHTML += '<p>Your cart is empty!</p>';
    } else {
        cart.forEach((item, index) => {
            cartHTML += `
                <div class="cart-item" style="
                    border: 1px solid #ddd;
                    padding: 15px;
                    margin-bottom: 10px;
                    border-radius: 5px;
                    background: #f9f9f9;
                ">
                    <h3 style="color: #005AA7; margin-bottom: 5px;">${item.title}</h3>
                    <p><strong>Company:</strong> ${item.company}</p>
                    <p><strong>Details:</strong> ${item.details}</p>
                    <button class="remove-btn" data-index="${index}" style="
                        background: #ff4444;
                        color: white;
                        border: none;
                        padding: 8px 15px;
                        border-radius: 4px;
                        cursor: pointer;
                        margin-top: 10px;
                    ">Remove</button>
                </div>
            `;
        });
    }
    
    cartHTML += `
        <button id="closeCart" style="
            background: #626568;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 4px;
            cursor: pointer;
            margin-top: 15px;
        ">Close</button>
    `;
    
    modalContent.innerHTML = cartHTML;
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    
    // Close modal handler
    document.getElementById('closeCart').addEventListener('click', function() {
        document.body.removeChild(modal);
    });
    
    // Close on outside click
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
    
    // Remove item handlers
    const removeButtons = document.querySelectorAll('.remove-btn');
    removeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            removeFromCart(index);
            showCartModal(); // Refresh the modal
        });
    });
}

// Remove item from cart
function removeFromCart(index) {
    if (index >= 0 && index < cart.length) {
        cart.splice(index, 1);
        saveCartToStorage();
        updateCartCount();
    }
}

// Original add job form code
let addSection = document.querySelector("Add");
if (addSection) {
    addSection.addEventListener("click", function() {
        showJobForm();
    });
}

function showJobForm() {
    let formContainer = document.createElement("div");
    formContainer.className = "job-form-container";
    formContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    `;

    // Create form
    let form = document.createElement("form");
    form.className = "job-form";
    form.style.cssText = `
        background: white;
        padding: 20px;
        border-radius: 8px;
        width: 400px;
        max-width: 90%;
    `;

    form.innerHTML = `
        <h2>Add New Job</h2>
        <div>
            <label for="jobTitle">Job Title:</label>
            <input type="text" id="jobTitle" name="jobTitle" required>
        </div>
        <div>
            <label for="companyName">Company Name:</label>
            <input type="text" id="companyName" name="companyName" required>
        </div>
        <div>
            <label for="location">Location:</label>
            <input type="text" id="location" name="location" required>
        </div>
        <div>
            <label for="description">Description:</label>
            <textarea id="description" name="description" rows="4" required></textarea>
        </div>
        <button type="submit">Add Job</button>
        <button type="button" class="cancel-btn">Cancel</button>
    `;

    formContainer.appendChild(form);
    document.body.appendChild(formContainer);

    // Handle form submission
    form.addEventListener("submit", function(e) {
        e.preventDefault();
        createJobCard({
            title: document.getElementById("jobTitle").value,
            company: document.getElementById("companyName").value,
            location: document.getElementById("location").value,
            description: document.getElementById("description").value
        });
        document.body.removeChild(formContainer);
    });
    
    // Handle cancel button
    const cancelBtn = form.querySelector('.cancel-btn');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', function() {
            document.body.removeChild(formContainer);
        });
    }
}

function createJobCard(jobData) {
    let jobCard = document.createElement("div");
    jobCard.className = "job-card";
    jobCard.style.cssText = `
        border: 1px solid #ddd;
        padding: 15px;
        margin: 10px;
        border-radius: 5px;
        background: white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    `;

    jobCard.innerHTML = `
        <h3>${jobData.title}</h3>
        <p><strong>Company: ${jobData.company}</p>
        <p><strong>Location: ${jobData.location}</p>
        <p><strong>Description: ${jobData.description}</p>
    `;
    
    // Add apply button to dynamically created job card
    const applyBtn = document.createElement('button');
    applyBtn.className = 'apply-btn';
    applyBtn.textContent = 'Apply';
    applyBtn.addEventListener('click', function() {
        addToCart(jobCard);
    });
    jobCard.appendChild(applyBtn);
    
    let jobsContainer = document.querySelector(".container") || document.body;
    jobsContainer.appendChild(jobCard);
}
