// Cart functionality
let cart = [];
let total = 0;

// DOM elements
const cartIcon = document.querySelector('.cart-icon');
const cartBadge = document.querySelector('.cart-badge');
const cartSidebar = document.querySelector('.cart-sidebar');
const closeCartBtn = document.querySelector('.close-cart');
const cartItemsContainer = document.querySelector('.cart-items');
const cartTotal = document.querySelector('.cart-total');
const clearCartBtn = document.querySelector('.clear-cart-btn');
const proceedBtn = document.querySelector('.proceed-btn');
const addToCartBtns = document.querySelectorAll('.add-to-cart-btn');

// Course data
const courses = {
    python: { title: 'Python Programming', price: 49.99, thumbnail: '🐍' },
    cpp: { title: 'C++ Programming', price: 59.99, thumbnail: '⚡' },
    java: { title: 'Java Programming', price: 54.99, thumbnail: '☕' },
    webdev: { title: 'Web Development', price: 69.99, thumbnail: '🌐' },
    digitalmarketing: { title: 'Digital Marketing', price: 39.99, thumbnail: '📈' }
};

// Event listeners
cartIcon.addEventListener('click', toggleCart);
closeCartBtn.addEventListener('click', closeCart);
clearCartBtn.addEventListener('click', clearCart);
proceedBtn.addEventListener('click', proceedToCheckout);

addToCartBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        const courseCard = e.target.closest('.course-card');
        const courseId = courseCard.dataset.course;
        addToCart(courseId, e.target);
    });
});

// Functions
function toggleCart() {
    cartSidebar.classList.toggle('open');
}

function closeCart() {
    cartSidebar.classList.remove('open');
}

function addToCart(courseId, button) {
    const course = courses[courseId];
    const existingItem = cart.find(item => item.id === courseId);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            id: courseId,
            title: course.title,
            price: course.price,
            thumbnail: course.thumbnail,
            quantity: 1
        });
    }

    updateCartBadge();
    updateCartDisplay();
    updateTotal();
    button.textContent = 'In Cart';
    button.disabled = true;
}

function updateCartBadge() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartBadge.textContent = totalItems;
    cartBadge.style.display = totalItems > 0 ? 'block' : 'none';
}

function updateCartDisplay() {
    cartItemsContainer.innerHTML = '';

    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-thumbnail">${item.thumbnail}</div>
            <div class="cart-item-details">
                <h4>${item.title}</h4>
                <p>₹${item.price.toFixed(2)}</p>
            </div>
            <div class="cart-item-quantity">
                <button class="quantity-btn minus">-</button>
                <span class="quantity">${item.quantity}</span>
                <button class="quantity-btn plus">+</button>
            </div>
            <a href="#" class="remove-item">Remove</a>
        `;

        // Add event listeners for quantity buttons and remove link
        const minusBtn = cartItem.querySelector('.minus');
        const plusBtn = cartItem.querySelector('.plus');
        const removeLink = cartItem.querySelector('.remove-item');

        minusBtn.addEventListener('click', () => changeQuantity(item.id, -1));
        plusBtn.addEventListener('click', () => changeQuantity(item.id, 1));
        removeLink.addEventListener('click', (e) => {
            e.preventDefault();
            removeItem(item.id);
        });

        cartItemsContainer.appendChild(cartItem);
    });
}

function changeQuantity(courseId, change) {
    const item = cart.find(item => item.id === courseId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeItem(courseId);
        } else {
            updateCartBadge();
            updateCartDisplay();
            updateTotal();
        }
    }
}

function removeItem(courseId) {
    cart = cart.filter(item => item.id !== courseId);
    updateCartBadge();
    updateCartDisplay();
    updateTotal();

    // Re-enable the add to cart button
    const courseCard = document.querySelector(`[data-course="${courseId}"]`);
    const button = courseCard.querySelector('.add-to-cart-btn');
    button.textContent = 'Add to Cart';
    button.disabled = false;
}

function updateTotal() {
    total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = `Your Total: ₹${total.toFixed(2)}`;
}

function clearCart() {
    cart.forEach(item => {
        const courseCard = document.querySelector(`[data-course="${item.id}"]`);
        const button = courseCard.querySelector('.add-to-cart-btn');
        button.textContent = 'Add to Cart';
        button.disabled = false;
    });

    cart = [];
    updateCartBadge();
    updateCartDisplay();
    updateTotal();
}

function proceedToCheckout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    alert(`Proceeding to checkout with total: ₹${total.toFixed(2)}`);
    // In a real application, this would redirect to a checkout page
}
