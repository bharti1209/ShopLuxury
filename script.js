// Sample product data (with Unsplash images)
const products = [
    {
        id: 1,
        name: "Chronograph Watch",
        price: 9999,
        category: "men",
        image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=880&q=80"
    },
    {
        id: 2,
        name: "Brown Bomber Jacket",
        price: 890,
        category: "men",
        image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=736&q=80"
    },
    {
        id: 3,
        name: "Designer Handbag",
        price: 180,
        category: "women",
        image: "https://images.unsplash.com/photo-1605733513597-a8f8341084e6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=736&q=80"
    },
    {
        id: 4,
        name: "Rose Gold Diamond Ring. ",
        price: 508999,
        category: "women",
        image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
    },
    {
        id: 5,
        name: "Aviator Sunglasses",
        price: 320,
        category: "accessories",
        image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=880&q=80"
    },
    {
        id: 6,
        name: "Silk Scarf",
        price: 150,
        category: "accessories",
        image: "https://media.istockphoto.com/id/621981082/photo/silk-scarf-on-a-black-background.webp?a=1&b=1&s=612x612&w=0&k=20&c=4dUWxfswUG6Fr_rrIyqwhsMmH7PtqFv3O0-9gXKN4VU="
    }
];

let cart = [];
let currentFilter = 'all';

// DOM Elements
const productGrid = document.getElementById('productGrid');
const cartItems = document.getElementById('cartItems');
const cartCount = document.getElementById('cartCount');
const emptyCartMsg = document.getElementById('emptyCartMsg');
const cartSubtotal = document.getElementById('cartSubtotal');
const cartModal = document.getElementById('cartModal');
const closeCart = document.getElementById('closeCart');
const themeToggle = document.getElementById('themeToggle');
const mobileMenuButton = document.getElementById('mobileMenuButton');
const mobileMenu = document.getElementById('mobileMenu');
const filterButtons = document.querySelectorAll('.filter-btn');

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    setupEventListeners();
    
    // Check for saved theme preference
    if (localStorage.getItem('theme') === 'dark' || 
        (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
    }
});

// Set up event listeners
function setupEventListeners() {
    // Theme toggle
    themeToggle.addEventListener('click', toggleTheme);
    
    // Mobile menu toggle
    mobileMenuButton.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });
    
    // Cart modal
    closeCart.addEventListener('click', () => {
        cartModal.classList.add('hidden');
    });
    
    // Filter buttons
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            currentFilter = button.dataset.filter;
            renderProducts();
        });
    });
    
    // Add ripple effect to buttons
    document.addEventListener('click', function(e) {
        if (e.target.closest('.ripple') || e.target.classList.contains('ripple')) {
            const button = e.target.closest('.ripple') || e.target;
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const ripple = document.createElement('span');
            ripple.classList.add('ripple-effect');
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            button.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        }
    });
}

// Toggle dark/light theme
function toggleTheme() {
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', document.documentElement.classList.contains('dark') ? 'dark' : 'light');
}

// Render products based on current filter
function renderProducts() {
    productGrid.innerHTML = '';
    
    const filteredProducts = currentFilter === 'all' 
        ? products 
        : products.filter(product => product.category === currentFilter);
    
    if (filteredProducts.length === 0) {
        productGrid.innerHTML = `
            <div class="col-span-full text-center py-12">
                <i class="fas fa-box-open text-4xl text-gray-400 mb-4"></i>
                <p class="text-gray-500">No products found in this category</p>
            </div>
        `;
        return;
    }
    
    filteredProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card bg-white dark:bg-gray-700 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300';
        productCard.innerHTML = `
            <div class="relative overflow-hidden group">
                <img src="${product.image}" alt="${product.name}" class="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105">
                <button class="absolute bottom-4 right-4 bg-luxury-gold text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform hover:scale-110" onclick="addToCart(${product.id}, event)">
                    <i class="fas fa-shopping-bag"></i>
                </button>
            </div>
            <div class="p-4">
                <h3 class="font-semibold text-lg mb-1">${product.name}</h3>
                <p class="text-luxury-gold font-bold">Rs.${product.price.toLocaleString()}</p>
                <div class="mt-3 flex justify-between items-center">
                    <button class="text-sm text-gray-500 hover:text-luxury-gold transition" onclick="showQuickView(${product.id})">
                        Quick View
                    </button>
                    <button class="text-sm bg-luxury-gold text-white px-3 py-1 rounded hover:bg-opacity-90 transition ripple" onclick="addToCart(${product.id}, event)">
                        Add to Cart
                    </button>
                </div>
            </div>
        `;
        productGrid.appendChild(productCard);
    });
}

// Add to cart with animation
function addToCart(productId, event) {
    const product = products.find(p => p.id === productId);
    cart.push(product);
    updateCart();
    
    // Update cart count with animation
    cartCount.textContent = cart.length;
    cartCount.classList.add('animate-bounce');
    setTimeout(() => cartCount.classList.remove('animate-bounce'), 1000);
    
    // Create flying item animation
    if (event) {
        const button = event.target.closest('button');
        const buttonRect = button.getBoundingClientRect();
        const cartRect = document.querySelector('[href="#cart"]').getBoundingClientRect();
        
        const flyingItem = document.createElement('div');
        flyingItem.className = 'flying-item';
        flyingItem.innerHTML = `<img src="${product.image}" alt="${product.name}" class="w-full h-full object-cover rounded-full">`;
        
        // Calculate animation end position
        const tx = cartRect.left + cartRect.width/2 - (buttonRect.left + buttonRect.width/2);
        const ty = cartRect.top + cartRect.height/2 - (buttonRect.top + buttonRect.height/2);
        
        flyingItem.style.setProperty('--tx', `${tx}px`);
        flyingItem.style.setProperty('--ty', `${ty}px`);
        flyingItem.style.left = `${buttonRect.left + buttonRect.width/2 - 25}px`;
        flyingItem.style.top = `${buttonRect.top + buttonRect.height/2 - 25}px`;
        
        document.body.appendChild(flyingItem);
        
        // Remove after animation completes
        setTimeout(() => {
            flyingItem.remove();
        }, 800);
    }
    
    // Show toast notification
    showToast(`${product.name} added to cart`);
}

// Update cart UI
function updateCart() {
    if (cart.length === 0) {
        emptyCartMsg.style.display = 'block';
        cartItems.innerHTML = '';
        cartSubtotal.textContent = 'Rs.0.00';
        return;
    }
    
    emptyCartMsg.style.display = 'none';
    
    // Generate cart items
    cartItems.innerHTML = '';
    const itemCount = {};
    
    cart.forEach(item => {
        itemCount[item.id] = (itemCount[item.id] || 0) + 1;
    });
    
    Object.keys(itemCount).forEach(id => {
        const item = products.find(p => p.id === parseInt(id));
        const quantity = itemCount[id];
        const subtotal = item.price * quantity;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700';
        cartItem.innerHTML = `
            <div class="flex items-center">
                <img src="${item.image}" alt="${item.name}" class="w-16 h-16 object-cover rounded mr-4">
                <div>
                    <h4 class="font-medium">${item.name}</h4>
                    <p class="text-sm text-gray-500">Rs.${item.price.toLocaleString()} × ${quantity}</p>
                </div>
            </div>
            <div class="flex items-center">
                <span class="font-medium mr-4">Rs.${subtotal.toLocaleString()}</span>
                <button class="text-red-500 hover:text-red-700" onclick="removeFromCart(${item.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        cartItems.appendChild(cartItem);
    });
    
    // Calculate total
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    cartSubtotal.textContent = `Rs. ${total.toLocaleString()}`;
}

// Remove item from cart
function removeFromCart(productId) {
    const index = cart.findIndex(item => item.id === productId);
    if (index !== -1) {
        cart.splice(index, 1);
        updateCart();
        
        // Update cart count
        cartCount.textContent = cart.length;
        
        // Show toast notification
        const product = products.find(p => p.id === productId);
        showToast(`${product.name} removed from cart`);
    }
}

// Show quick view modal (placeholder)
function showQuickView(productId) {
    const product = products.find(p => p.id === productId);
    alert(`Quick view for ${product.name}\nPrice: Rs.${product.price.toLocaleString()}`);
}

// Show toast notification
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-md shadow-lg flex items-center';
    toast.innerHTML = `
        <i class="fas fa-check-circle text-luxury-gold mr-2"></i>
        <span>${message}</span>
    `;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('opacity-0', 'translate-y-2');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Open cart modal
document.querySelector('[href="#cart"]').addEventListener('click', (e) => {
    e.preventDefault();
    cartModal.classList.remove('hidden');
    updateCart();
});