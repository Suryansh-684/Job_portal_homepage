// Simple Cart Array
let cart = [];

// ---------------- APPLY BUTTON ----------------
let applyButtons = document.querySelectorAll(".apply-btn");

applyButtons.forEach(function(button) {
    button.addEventListener("click", function() {
        let jobCard = this.parentElement;
        let title = jobCard.querySelector("h3").innerText;

        // check duplicate
        if (!cart.includes(title)) {
            cart.push(title);
            alert("Job Added to Cart");
        } else {
            alert("Already Added");
        }
    });
});

// ---------------- CART SHOW ----------------
let cartLink = document.querySelector('a[href="#Cart"]');

cartLink.addEventListener("click", function(e) {
    e.preventDefault();

    let message = "Your Cart:\n\n";

    if (cart.length === 0) {
        message += "Cart is empty";
    } else {
        cart.forEach(function(job, index) {
            message += (index + 1) + ". " + job + "\n";
        });
    }

    alert(message);
});

// ---------------- DELETE FROM CART ----------------
document.addEventListener("keydown", function(e) {

    // press D key to delete last item (simple way)
    if (e.key === "d") {
        if (cart.length > 0) {
            cart.pop();
            alert("Last job removed from cart");
        } else {
            alert("Cart already empty");
        }
    }
});

// ---------------- SEARCH FUNCTION ----------------
let searchButton = document.querySelector(".search-box button");

searchButton.addEventListener("click", function() {

    let searchInput = document.querySelector(".search-box input");
    let searchValue = searchInput.value.toLowerCase();

    let jobCards = document.querySelectorAll(".job-card");

    jobCards.forEach(function(card) {

        let title = card.querySelector("h3").innerText.toLowerCase();

        if (title.includes(searchValue)) {
            card.style.display = "flex";
        } else {
            card.style.display = "none";
        }

    });
});