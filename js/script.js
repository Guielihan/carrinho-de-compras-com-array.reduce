const products = [
    { id: 1, name: 'Notebook', image: 'assets/notebook.png', price: 2500 },
    { id: 2, name: 'Mouse', image: 'assets/mouse.png', price: 89.90 },
    { id: 3, name: 'Teclado Mecânico', image: 'assets/teclado-mecanico.png', price: 350 },
    { id: 4, name: 'Monitor 27"', image: 'assets/monitor-27.png', price: 1200 },
    { id: 5, name: 'Webcam HD', image: 'assets/webcam-hd.png', price: 250 },
    { id: 6, name: 'Headset Gamer', image: 'assets/headset-gamer.png', price: 450 },
    { id: 7, name: 'SSD 1TB', image: 'assets/ssd-1tb.png', price: 400 },
    { id: 8, name: 'Memória RAM 16GB', image: 'assets/memoria-ram-16gb.png', price: 300 },
];

const DISCOUNT_PERCENTAGE = 10;
const CURRENCY = 'BRL';
const LOCALE = 'pt-BR';

const currencyFormatter = new Intl.NumberFormat(LOCALE, {
    style: 'currency',
    currency: CURRENCY,
});
let cart = [];

function formatCurrency(value) {
    return currencyFormatter.format(value);
}

function calculateSubtotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

function calculateDiscount(subtotal) {
    return subtotal * (DISCOUNT_PERCENTAGE / 100);
}

function getTotalItemCount() {
    return cart.reduce((count, item) => count + item.quantity, 0);
}

function calculateTotals() {
    const subtotal = calculateSubtotal();
    const discount = calculateDiscount(subtotal);
    const total = subtotal - discount;
    return { subtotal, discount, total };
}

function renderProducts() {
    const productsGrid = document.getElementById('productsGrid');
    const productCount = document.getElementById('productCount');

    productCount.textContent = products.length;

    productsGrid.innerHTML = products
        .map(product => `
            <div class="product-card">
                <div class="product-icon">
                    <img src="${product.image}" alt="${product.name}" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 120 120%22%3E%3Crect fill=%22%23f3f4f6%22 width=%22120%22 height=%22120%22/%3E%3C/svg%3E'">
                </div>
                <div class="product-name">${product.name}</div>
                <div class="product-price">${formatCurrency(product.price)}</div>
                <button class="add-btn" onclick="addToCart(${product.id})">Adicionar</button>
            </div>
        `)
        .join('');
}

function renderCartItems() {
    const cartItemsContainer = document.getElementById('cartItems');

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-state">
                <p class="empty-icon">🛒</p>
                <p class="empty-text">Seu carrinho está vazio</p>
            </div>
        `;
        return;
    }

    cartItemsContainer.innerHTML = cart
        .map(item => {
            const itemTotal = item.price * item.quantity;
            return `
                <div class="cart-item">
                    <div class="item-info">
                        <div class="item-name">${item.name}</div>
                        <div class="item-details">${formatCurrency(item.price)} × ${item.quantity}</div>
                    </div>
                    <div class="item-controls">
                        <button class="quantity-btn" onclick="decreaseQuantity(${item.id})">−</button>
                        <span class="quantity-display">${item.quantity}</span>
                        <button class="quantity-btn" onclick="increaseQuantity(${item.id})">+</button>
                    </div>
                    <div class="item-price">${formatCurrency(itemTotal)}</div>
                    <button class="remove-btn" onclick="removeFromCart(${item.id})" title="Remover" aria-label="Remover item">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            <line x1="10" y1="11" x2="10" y2="17"></line>
                            <line x1="14" y1="11" x2="14" y2="17"></line>
                        </svg>
                    </button>
                </div>
            `;
        })
        .join('');
}

function updateCartSummary() {
    const { subtotal, discount, total } = calculateTotals();
    const itemCount = getTotalItemCount();

    document.getElementById('itemCount').textContent = itemCount;
    document.getElementById('subtotal').textContent = formatCurrency(subtotal);
    document.getElementById('discount').textContent = formatCurrency(discount);
    document.getElementById('total').textContent = formatCurrency(total);
    document.getElementById('checkoutBtn').disabled = cart.length === 0;
}

function updateCart() {
    renderCartItems();
    updateCartSummary();
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    updateCart();
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
}

function increaseQuantity(productId) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity++;
        updateCart();
    }
}

function decreaseQuantity(productId) {
    const item = cart.find(item => item.id === productId);
    if (item && item.quantity > 1) {
        item.quantity--;
        updateCart();
    }
}

document.addEventListener('DOMContentLoaded', function() {
    renderProducts();
    updateCartSummary();
    document.getElementById('checkoutBtn').addEventListener('click', handleCheckout);
});

function handleCheckout() {
    if (cart.length === 0) return;

    const { subtotal, discount, total } = calculateTotals();
    const itemCount = getTotalItemCount();

    const message = `Compra concluída ✨

Seu pagamento foi confirmado e o pedido está finalizado com sucesso.

Resumo da compra:
• Itens: ${itemCount}  
• Subtotal: ${formatCurrency(subtotal)}  
• Desconto (${DISCOUNT_PERCENTAGE}%): ${formatCurrency(discount)}  

💰 Total: ${formatCurrency(total)}

Obrigado por confiar na GoDevs.  
Seguimos juntos 🚀

© GoDevs 2026`;

    alert(message);
    cart = [];
    updateCart();
}