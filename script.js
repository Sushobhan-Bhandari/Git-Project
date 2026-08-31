let cart = [];

let selectedProduct = null;

const products = document.querySelectorAll(".product");
const filters = document.querySelectorAll(".filter");
const searchInput = document.getElementById("search");

const cartElement = document.getElementById("cart");
const overlay = document.getElementById("overlay");
const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const totalElement = document.getElementById("total");


const embersLayer = document.getElementById("embers");

function spawnEmber() {

    if (!embersLayer) return; 
    const ember = document.createElement("span");
    ember.className = "ember";

    const size = 2 + Math.random() * 3;           
    const startX = Math.random() * 100;            
    const riseTime = 7 + Math.random() * 7;         
    const sidewaysDrift = (Math.random() * 80 - 40) + "px"; 

    ember.style.setProperty("--size", size + "px");
    ember.style.setProperty("--drift", sidewaysDrift);
    ember.style.left = startX + "vw";
    ember.style.animationDuration = riseTime + "s";

    embersLayer.appendChild(ember);

    setTimeout(() => {
        ember.remove();
    }, riseTime * 1000 + 200);
}

for (let i = 0; i < 12; i++) {
    setTimeout(spawnEmber, i * 350);
}

setInterval(spawnEmber, 900);

filters.forEach(filter => {

    filter.addEventListener("click", () => {

        filters.forEach(item => item.classList.remove("active"));
        filter.classList.add("active");

        const category = filter.dataset.category; 

        products.forEach((product, index) => {

            const matches =
                category === "all" ||
                product.dataset.category === category;

            if (matches) {
                product.style.display = "block";
                product.style.animation = "none";
                void product.offsetWidth; 
                product.style.animation =
                    `hauntedEntrance .8s ease ${index * .05}s forwards`;
            } else {
                product.style.display = "none";
            }
        });
    });
});

searchInput.addEventListener("input", () => {

    const search = searchInput.value.toLowerCase();

    products.forEach(product => {
        const name = product.dataset.name.toLowerCase();
        const matchesSearch = name.includes(search);
        product.style.display = matchesSearch ? "block" : "none";
    });
});


document.querySelectorAll(".heart").forEach(button => {

    button.addEventListener("click", () => {

        button.classList.toggle("liked");

        // swap the empty heart ♡ for a filled heart ♥ and back again
        button.innerHTML = button.classList.contains("liked") ? "♥" : "♡";
    });
});


document.querySelectorAll(".add").forEach(button => {

    button.addEventListener("click", () => {

        const product = button.closest(".product"); 
        addToCart(product);

        button.innerText = "✦ ADDED ✦";
        button.style.background = "#8f111b";

        setTimeout(() => {
            button.innerText = "ADD TO CART";
            button.style.background = "transparent";
        }, 900);
    });
});


function addToCart(product) {

    const name = product.dataset.name;
    const price = Number(product.dataset.price);
    const image = product.querySelector("img").src;

    // look for a matching item already in the cart
    const existingItem = cart.find(item => item.name === name);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ name, price, image, quantity: 1 });
    }

    updateCart();
    openCart();
}



function updateCart() {

    cartItems.innerHTML = ""; 

    let total = 0;
    let count = 0;

    if (cart.length === 0) {
        cartItems.innerHTML = `<p class="empty">Your cart is empty ✦</p>`;
    }

    cart.forEach((item, index) => {

        total += item.price * item.quantity;
        count += item.quantity;

        const row = document.createElement("div");
        row.className = "cart-item";

        row.innerHTML = `
            <img src="${item.image}">
            <div class="cart-info">
                <h4>${item.name}</h4>
                <p>$${item.price.toFixed(2)} AUD</p>
                <div class="quantity">
                    <button onclick="decreaseQuantity(${index})">−</button>
                    <span>${item.quantity}</span>
                    <button onclick="increaseQuantity(${index})">+</button>
                </div>
                <button class="remove" onclick="removeItem(${index})">REMOVE</button>
            </div>
        `;

        cartItems.appendChild(row);
    });

    cartCount.innerText = count;
    totalElement.innerText = "$" + total.toFixed(2);
}


function increaseQuantity(index) {
    cart[index].quantity++;
    updateCart();
}

function decreaseQuantity(index) {
    if (cart[index].quantity > 1) {
        cart[index].quantity--;
    } else {
        cart.splice(index, 1); 
    }
    updateCart();
}

function removeItem(index) {
    cart.splice(index, 1);
    updateCart();
}

document.getElementById("openCart").addEventListener("click", openCart);
document.getElementById("closeCart").addEventListener("click", closeCart);
overlay.addEventListener("click", closeCart); 

function openCart() {
    cartElement.classList.add("show");
    overlay.classList.add("show");
}

function closeCart() {
    cartElement.classList.remove("show");
    overlay.classList.remove("show");
}


const quickOverlay = document.getElementById("quickOverlay");
const quickImage = document.getElementById("quickImage");
const quickTitle = document.getElementById("quickTitle");
const quickCategory = document.getElementById("quickCategory");
const quickPrice = document.getElementById("quickPrice");

document.querySelectorAll(".quick").forEach(button => {

    button.addEventListener("click", () => {

        selectedProduct = button.closest(".product");

        quickImage.src = selectedProduct.querySelector("img").src;
        quickTitle.innerText = selectedProduct.dataset.name;
        quickCategory.innerText = selectedProduct.dataset.category.toUpperCase();
        quickPrice.innerText =
            "$" + Number(selectedProduct.dataset.price).toFixed(2) + " AUD";

        quickOverlay.classList.add("show");
    });
});

document.getElementById("closeQuick").addEventListener("click", () => {
    quickOverlay.classList.remove("show");
});

quickOverlay.addEventListener("click", event => {
    if (event.target === quickOverlay) {
        quickOverlay.classList.remove("show");
    }
});

document.getElementById("quickAdd").addEventListener("click", () => {
    if (selectedProduct) {
        addToCart(selectedProduct);
        quickOverlay.classList.remove("show");
    }
});

document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
        closeCart();
        quickOverlay.classList.remove("show");
    }
});