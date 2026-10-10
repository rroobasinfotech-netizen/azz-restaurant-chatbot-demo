
const chatArea = document.getElementById("chatArea");
const messageInput = document.getElementById("messageInput");
const sendButton = document.getElementById("sendButton");

// =====================================================
// CART AND ORDER STATE
// =====================================================

let cart = [];
const quantities = {};
const DELIVERY_FEE = 5.00;

let currentOrder = {
    type: "",
    name: "",
    mobile: "",
    address: "",
    tableNumber: "",
    paymentMethod: "",
    subtotal: 0,
    deliveryFee: 0,
    total: 0,
    orderNumber: ""
};

// =====================================================
// HELPERS
// =====================================================

function formatMoney(amount) {
    return `S$${Number(amount).toFixed(2)}`;
}

function getSubtotal() {
    return cart.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );
}

function getOrderTypeName(type) {
    return {
        table: "Dine-in",
        carry: "Takeaway",
        delivery: "Delivery"
    }[type] || type;
}

function removeCurrentScreen() {
    const screen = document.querySelector(".menu-screen");
    if (screen) screen.remove();
}

function addScreen(className, html) {
    removeCurrentScreen();

    const screen = document.createElement("div");
    screen.className = `menu-screen ${className}`;
    screen.innerHTML = html;

    document.querySelector(".phone").appendChild(screen);
    return screen;
}

// =====================================================
// CHAT MESSAGES
// =====================================================

function addMessage(text, type = "received") {
    const row = document.createElement("div");
    row.className = `message-row ${type}`;

    const message = document.createElement("div");
    message.className =
        type === "sent" ? "message user-message" : "message bot-message";

    const content = document.createElement("div");
    content.innerHTML = text;

    const time = document.createElement("div");
    time.className = "message-time";
    time.textContent = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
    });

    message.appendChild(content);
    message.appendChild(time);
    row.appendChild(message);
    chatArea.appendChild(row);

    chatArea.scrollTop = chatArea.scrollHeight;
}

function sendMessage() {
    const text = messageInput.value.trim();
    if (!text) return;

    addMessage(text, "sent");
    messageInput.value = "";

    setTimeout(() => botReply(text), 400);
}

sendButton.addEventListener("click", sendMessage);

messageInput.addEventListener("keydown", event => {
    if (event.key === "Enter") sendMessage();
});

// =====================================================
// CHATBOT RESPONSES
// =====================================================

function botReply(userText) {
    const text = userText.toLowerCase().trim();

    // 1. GREETINGS
    if (/^(hi|hello|hey|hi there|good morning|good afternoon|good evening)$/.test(text)) {
        addMessage(`
            Hello! 👋 Welcome to <strong>AZZ Food House</strong>! 😊<br><br>
            How can I help you today?
            <button class="chat-button" onclick="showMenu()">
                🍽️ View Menu
            </button>
        `);
        return;
    }

    // 2. THANK YOU
    if (text.includes("thank")) {
        addMessage("You're most welcome! 😊 Thank you for choosing AZZ Food House. Enjoy your meal!");
        return;
    }

    // 3. GOODBYE
    if (text === "bye" || text.includes("goodbye") || text.includes("see you")) {
        addMessage("Thank you for visiting AZZ Food House! 😊 Have a wonderful day. We hope to serve you soon!");
        return;
    }

    // 4. HUMAN SUPPORT
    if (
        text.includes("talk to a person") ||
        text.includes("human") ||
        text.includes("staff") ||
        text.includes("real person") ||
        text.includes("contact someone")
    ) {
        addMessage(`
            😊 Of course! Our restaurant team can help you with that.
            Please contact the restaurant directly for assistance.
            <br><br>
            📞 Contact number: Not available in this demo yet.
        `);
        return;
    }

    // 5. // OPENING HOURS AND TIME
    if (
    text.includes("hour") ||
    text.includes("opening") ||
    text.includes("what time") ||
    text.includes("close") ||
    text.includes("open today") ||
    text === "time" ||
    text === "current time" ||
    text === "business hours" ||
    text === "operating hours" ||
    text === "when are you open" ||
    text === "are you open"
    ) {
    addMessage(`
        🕒 <strong>AZZ Food House Opening Hours</strong><br><br>
        We are open daily from <strong>11:00 AM to 10:00 PM</strong>.<br><br>
        😊 How else can I help you?
    `);
    return;
    }

    // 6. HALAL
    if (text.includes("halal")) {
    addMessage(`
        ✅ AZZ Food House<br>
        Halal Certification: Demo information only.
        Actual certification has not been verified.
    `);
    return;
    }

    // 7. ALLERGIES
    if (
        text.includes("allergy") ||
        text.includes("allergic") ||
        text.includes("peanut") ||
        text.includes("food intolerance")
    ) {
        addMessage(`
            ❤️ Thank you for letting us know.
            Please check with our restaurant team about ingredients
            and possible cross-contamination before ordering.
            Your safety is important to us.
        `);
        return;
    }

    // 8. DELIVERY TIME
    if (
        text.includes("how long") ||
        text.includes("delivery time") ||
        text.includes("how many minutes") ||
        text.includes("when will it arrive")
    ) {
        addMessage(`
            🚚 The estimated delivery time is
            <strong>30–45 minutes</strong>, depending on your location.
            This is an estimate for our demo.
        `);
        return;
    }

    // 9. DELIVERY FEE
    if (
        text.includes("delivery fee") ||
        text.includes("delivery charge") ||
        text.includes("shipping fee") ||
        text.includes("how much for delivery")
    ) {
        addMessage(`
            🚚 The demo delivery fee is <strong>S$5.00</strong>.
            <br><br>
            Estimated delivery time is 30–45 minutes.
        `);
        return;
    }

    // 10. DELIVERY AREA / POSTAL CODE
    if (
        text.includes("delivery") ||
        text.includes("deliver") ||
        text.includes("postal code") ||
        text.includes("postcode")
    ) {
        addMessage(`
            🚚 Our demo is designed for delivery enquiries across Singapore.
            <br><br>
            Please share your postal code so the restaurant team
            can confirm whether delivery is available to your area.
            <br><br>
            Demo delivery fee: <strong>S$5.00</strong>
        `);
        return;
    }

    // 11. DINE-IN
    if (
        text.includes("dine in") ||
        text.includes("dine-in") ||
        text.includes("eat there") ||
        text.includes("eat at restaurant")
    ) {
        addMessage(`
            🍽️ Yes, you can explore the dine-in option in this demo.
            Please contact the restaurant to confirm seating availability.
        `);
        return;
    }

    // 12. TAKEAWAY
    if (
        text.includes("takeaway") ||
        text.includes("take away") ||
        text.includes("self collect") ||
        text.includes("pickup") ||
        text.includes("pick up")
    ) {
        addMessage(`
            🛍️ Takeaway is an available option in this demo.
            You can browse the menu and select your favourite dishes.
            <button class="chat-button" onclick="showMenu()">
                🍽️ View Menu
            </button>
        `);
        return;
    }

    // 13. PAYMENT METHODS
    if (
        text.includes("paynow") ||
        text.includes("payment") ||
        text.includes("pay method") ||
        text.includes("credit card") ||
        text.includes("debit card") ||
        text.includes("cash")
    ) {
        addMessage(`
            💳 Our demo payment options are:<br><br>
            • Dine-in / Takeaway: Card, PayNow or Cash<br>
            • Delivery: PayNow only<br><br>
            ⚠️ This is a demo. No real payment will be processed.
        `);
        return;
    }

    // 14. ONLINE PAYMENT / PAYMENT SECURITY
    if (
        text.includes("online payment") ||
        text.includes("secure payment") ||
        text.includes("received my payment") ||
        text.includes("payment successful")
    ) {
        addMessage(`
            🔒 This is a frontend demo only.
            It does not process real payments or confirm actual transactions.
        `);
        return;
    }

    // 15. OFFERS / DISCOUNTS
    if (
        text.includes("offer") ||
        text.includes("discount") ||
        text.includes("promotion") ||
        text.includes("promo code") ||
        text.includes("coupon")
    ) {
        addMessage(`
            🎉 Thank you for asking!
            We don't have any confirmed offers listed in this demo right now.
            Please check with the restaurant for current promotions.
        `);
        return;
    }

    // 16. RECOMMENDATIONS
    if (
        text.includes("recommend") ||
        text.includes("best seller") ||
        text.includes("best-selling") ||
        text.includes("popular dish") ||
        text.includes("what should i eat") ||
        text.includes("what do you suggest")
    ) {
        addMessage(`
            😋 Looking for something delicious?
            Here are some dishes you can explore:<br><br>
            🍛 Chicken Chettinad – S$12<br>
            🍗 Chicken 65 – S$10<br>
            🥘 Paneer Butter Masala – S$10<br>
            🍚 Veg Biryani – S$8<br><br>
            These are suggestions, not verified best-seller rankings.
            <button class="chat-button" onclick="showMenu()">
                🍽️ Explore Menu
            </button>
        `);
        return;
    }

    // 17. SPICY FOOD
    if (text.includes("spicy") || text.includes("hot food")) {
        addMessage(`
            🌶️ If you enjoy spicy food, you can explore
            Chicken Chettinad and Chicken 65 on our menu.
            Please ask the restaurant to confirm the spice level.
            <button class="chat-button" onclick="showMenu('nonveg')">
                🍗 View Non-Veg Menu
            </button>
        `);
        return;
    }

    // 18. VEGETARIAN MENU
    if (
        text.includes("vegetarian") ||
        text === "veg" ||
        text.includes("veg food")
    ) {
        addMessage(`
            🥗 Here are our vegetarian options:<br><br>
            Veg Biryani – S$8<br>
            Veg Fried Rice – S$7<br>
            Paneer Butter Masala – S$10<br>
            Butter Naan – S$3<br>
            Chapati – S$2
            <button class="chat-button" onclick="showMenu('veg')">
                🥗 View Vegetarian Menu
            </button>
        `);
        return;
    }

    // 19. NON-VEG MENU
    if (
        text.includes("non veg") ||
        text.includes("non-veg") ||
        text.includes("nonveg") ||
        text.includes("chicken dishes") ||
        text.includes("meat dishes")
    ) {
        addMessage(`
            🍗 Explore our non-vegetarian options:<br><br>
            Chicken Chettinad – S$12<br>
            Chicken Curry – S$11<br>
            Egg Biryani – S$9<br>
            Mutton Curry – S$14<br>
            Chicken 65 – S$10
            <button class="chat-button" onclick="showMenu('nonveg')">
                🍗 View Non-Veg Menu
            </button>
        `);
        return;
    }

    // 20. DRINKS
    if (
        text.includes("juice") ||
        text.includes("drink") ||
        text.includes("coffee") ||
        text.includes("beverage")
    ) {
        addMessage(`
            🍹 Refresh yourself with our drinks:<br><br>
            Fresh Lime Water – S$4<br>
            Orange Juice – S$5<br>
            Watermelon Juice – S$5<br>
            Pomegranate Juice – S$6<br>
            Cold Coffee – S$6
            <button class="chat-button" onclick="showMenu('juice')">
                🥤 View Drinks Menu
            </button>
        `);
        return;
    }

    // 21. FULL MENU
    if (
        text.includes("menu") ||
        text.includes("food") ||
        text.includes("items") ||
        text.includes("what do you have")
    ) {
        addMessage(`
            Of course! 😊 Browse our menu and choose your favourites.
            <button class="chat-button" onclick="showMenu()">
                🍽️ View Full Menu
            </button>
        `);
        return;
    }

    // 22. PRICE QUESTIONS
    const matchedItem = menuItems.find(item =>
        text.includes(item.name.toLowerCase())
    );

    if (
        matchedItem &&
        (
            text.includes("price") ||
            text.includes("cost") ||
            text.includes("how much") ||
            text.includes("多少钱")
        )
    ) {
        addMessage(`
            😊 <strong>${matchedItem.name}</strong> costs
            <strong>${formatMoney(matchedItem.price)}</strong>.
            <br><br>
            Would you like to add it to your order?
            <button class="chat-button" onclick="showMenu()">
                🍽️ Browse Menu
            </button>
        `);
        return;
    }

    // 23. ITEM AVAILABILITY
    if (
        text.includes("biryani") ||
        text.includes("naan") ||
        text.includes("chapati") ||
        text.includes("paneer") ||
        text.includes("curry") ||
        text.includes("fried rice") ||
        text.includes("chicken 65") ||
        text.includes("mutton")
    ) {
        if (matchedItem) {
            addMessage(`
                😊 Yes, <strong>${matchedItem.name}</strong>
                is listed on our demo menu for
                <strong>${formatMoney(matchedItem.price)}</strong>.
                <button class="chat-button" onclick="showMenu()">
                    🍽️ Browse Menu
                </button>
            `);
        } else {
            addMessage(`
                Sorry! 😔 That item is not listed on our current demo menu.
                Please browse our available dishes.
                <button class="chat-button" onclick="showMenu()">
                    🍽️ View Menu
                </button>
            `);
        }
        return;
    }

    // 24. ORDERING HELP
    if (
        text.includes("how can i order") ||
        text.includes("how to order") ||
        text.includes("place an order") ||
        text.includes("i want to order") ||
        text === "order"
    ) {
        addMessage(`
            🛍️ Ordering is easy!<br><br>
            1. Tap View Menu.<br>
            2. Choose your dishes.<br>
            3. Adjust quantities using + or −.<br>
            4. Open your cart and continue to checkout.<br><br>
            <button class="chat-button" onclick="showMenu()">
                🍽️ Start Ordering
            </button>
        `);
        return;
    }

    // 25. CART QUESTIONS
    if (
        text.includes("my cart") ||
        text.includes("cart total") ||
        text.includes("total price") ||
        text.includes("what is in my cart") ||
        text.includes("view cart")
    ) {
        addMessage(`
            🛒 You can view your selected items and order total
            in the cart section of this demo.
            Please open your cart to check the latest amount.
        `);
        return;
    }

    // 26. REMOVE / CHANGE ITEM
    if (
        text.includes("remove item") ||
        text.includes("delete item") ||
        text.includes("change quantity") ||
        text.includes("change my order") ||
        text.includes("cancel my order")
    ) {
        addMessage(`
            😊 Before checkout, you can adjust item quantities
            using the + and − controls in the menu or cart.
            <br><br>
            This demo does not support live cancellation or modification
            of orders already submitted.
        `);
        return;
    }

    // 27. LOCATION / ADDRESS
    if (
    text.includes("location") ||
    text.includes("address") ||
    text.includes("where are you") ||
    text.includes("where is the restaurant")
    ) {
    addMessage(`
        📍 <strong>AZZ Food House</strong><br>
        123 ABC Road, Singapore 123456<br><br>
        <small>This is a sample address for demonstration only.</small>
    `);
    return;
    }

    // 28. LIVE ORDER TRACKING
    if (
        text.includes("track my order") ||
        text.includes("order status") ||
        text.includes("where is my order") ||
        text.includes("on the way")
    ) {
        addMessage(`
            🚚 Live order tracking is not connected in this demo.
            Please contact the restaurant directly for a real order update.
        `);
        return;
    }

    // 29. RESERVATION
    if (
        text.includes("reservation") ||
        text.includes("book a table") ||
        text.includes("reserve a table")
    ) {
        addMessage(`
            🍽️ Please contact the restaurant directly to confirm
            table availability and make a reservation.
            Table booking is not connected in this demo.
        `);
        return;
    }

    // 30. CUSTOMER IS HUNGRY
    if (text.includes("hungry")) {
        addMessage(`
            😋 Let's find something delicious for you!
            Are you in the mood for vegetarian food, non-veg dishes,
            or a refreshing drink?
            <button class="chat-button" onclick="showMenu()">
                🍽️ Explore Menu
            </button>
        `);
        return;
    }

    // 31. BOT DOES NOT UNDERSTAND
    if (
        text.includes("not understand") ||
        text.includes("wrong answer") ||
        text.includes("you don't understand")
    ) {
        addMessage(`
            Sorry about that! 🙏 Let me help you another way.
            You can ask about our menu, prices, delivery, opening hours,
            payment or ordering.
            <button class="chat-button" onclick="showMenu()">
                🍽️ View Menu
            </button>
        `);
        return;
    }

    // 32. GENERAL FALLBACK
    addMessage(`
        I'm happy to help! 😊 You can ask me about:<br><br>
        🍽️ Menu and food prices<br>
        🥗 Vegetarian and non-vegetarian dishes<br>
        🚚 Delivery and takeaway<br>
        💳 Payment methods<br>
        🕒 Opening hours and location<br>
        🛒 How to order<br><br>
        Or browse our menu below.
        <button class="chat-button" onclick="showMenu()">
            🍽️ View Menu
        </button>
    `);
}


// =====================================================
// RESTAURANT MENU
// =====================================================

const menuItems = [
    { id: 1, name: "Veg Biryani", category: "veg", description: "Fragrant basmati rice with fresh vegetables", price: 8, image: "images/veg-biryani.jpg" },
    { id: 2, name: "Veg Fried Rice", category: "veg", description: "Wok-fried rice with fresh vegetables", price: 7, image: "images/veg-fried-rice.jpg" },
    { id: 3, name: "Paneer Butter Masala", category: "veg", description: "Paneer in rich creamy tomato gravy", price: 10, image: "images/paneer-butter-masala.jpg" },
    { id: 4, name: "Butter Naan", category: "veg", description: "Soft naan brushed with butter", price: 3, image: "images/butter-naan.jpg" },
    { id: 5, name: "Chapati", category: "veg", description: "Freshly prepared soft Indian flatbread", price: 2, image: "images/chapati.jpg" },

    { id: 6, name: "Chicken Chettinad", category: "nonveg", description: "Spicy South Indian chicken curry", price: 12, image: "images/chicken-chettinad.jpg" },
    { id: 7, name: "Chicken Curry", category: "nonveg", description: "Tender chicken in traditional curry", price: 11, image: "images/chicken-curry.jpg" },
    { id: 8, name: "Egg Biryani", category: "nonveg", description: "Aromatic biryani with boiled eggs", price: 9, image: "images/egg-biryani.jpg" },
    { id: 9, name: "Mutton Curry", category: "nonveg", description: "Slow-cooked tender mutton curry", price: 14, image: "images/mutton-curry.jpg" },
    { id: 10, name: "Chicken 65", category: "nonveg", description: "Crispy spicy South Indian chicken", price: 10, image: "images/chicken-65.jpg" },

    { id: 11, name: "Fresh Lime Water", category: "juice", description: "Refreshing fresh lime drink", price: 4, image: "images/fresh-lime.jpg" },
    { id: 12, name: "Orange Juice", category: "juice", description: "Freshly squeezed orange juice", price: 5, image: "images/orange-juice.jpg" },
    { id: 13, name: "Watermelon Juice", category: "juice", description: "Fresh chilled watermelon juice", price: 5, image: "images/watermelon-juice.jpg" },
    { id: 14, name: "Pomegranate Juice", category: "juice", description: "Fresh natural pomegranate juice", price: 6, image: "images/pomegranate-juice.jpg" },
    { id: 15, name: "Cold Coffee", category: "juice", description: "Creamy chilled cold coffee", price: 6, image: "images/cold-coffee.jpg" }
];

// =====================================================
// MENU SCREEN
// =====================================================

function showMenu(startCategory = "all") {
    const screen = addScreen("menu-main-screen", `
        <div class="menu-header">
            <button class="menu-back" onclick="closeMenu()">←</button>
            <div>
                <h2>Menu</h2>
                <span>AZZ Food House</span>
            </div>
            <button class="menu-cart" onclick="showCart()">
                🛒 <span id="cartCount">${getCartCount()}</span>
            </button>
        </div>

        <div class="category-tabs">
            <button class="category-tab ${startCategory === "all" ? "active" : ""}" onclick="filterMenu('all', this)">All</button>
            <button class="category-tab ${startCategory === "veg" ? "active" : ""}" onclick="filterMenu('veg', this)">🥗 Vegetarian</button>
            <button class="category-tab ${startCategory === "nonveg" ? "active" : ""}" onclick="filterMenu('nonveg', this)">🍗 Non-Veg</button>
            <button class="category-tab ${startCategory === "juice" ? "active" : ""}" onclick="filterMenu('juice', this)">🥤 Juices</button>
        </div>

        <div class="food-list" id="foodList"></div>
    `);

    renderFoodItems(startCategory);
}

function filterMenu(category, button) {
    document.querySelectorAll(".category-tab").forEach(btn => {
        btn.classList.remove("active");
    });
    button.classList.add("active");
    renderFoodItems(category);
}

function renderFoodItems(category) {
    const foodList = document.getElementById("foodList");
    if (!foodList) return;

    const items = category === "all"
        ? menuItems
        : menuItems.filter(item => item.category === category);

    foodList.innerHTML = "";

    items.forEach(item => {
        const currentQuantity = quantities[item.id] ?? 1;
        const card = document.createElement("div");
        card.className = "food-card";

        card.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="food-image"
                 onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1547592180-85f173990554?w=600'">

            <div class="food-details">
                <div class="food-name">${item.name}</div>
                <div class="food-description">${item.description}</div>

                <div class="food-bottom">
                    <div class="food-price">${formatMoney(item.price)}</div>
                    <div class="quantity-control">
                        <button onclick="changeQuantity(${item.id}, -1)">−</button>
                        <span id="qty-${item.id}">${currentQuantity}</span>
                        <button onclick="changeQuantity(${item.id}, 1)">+</button>
                    </div>
                </div>

                <button class="add-cart-button" onclick="addToCart(${item.id}, this)">
                    Add to Cart
                </button>
            </div>
        `;

        foodList.appendChild(card);
    });
}

function changeQuantity(id, change) {
    const current = quantities[id] ?? 1;
    quantities[id] = Math.max(1, current + change);

    const element = document.getElementById(`qty-${id}`);
    if (element) element.textContent = quantities[id];
}


function addToCart(id, button) {
    const item = menuItems.find(product => product.id === id);
    if (!item) return;

    const quantity = quantities[id] ?? 1;
    const existing = cart.find(product => product.id === id);

    
    if (existing) {
    existing.quantity = quantity;
    } else {
    cart.push({ ...item, quantity });
    }


    // Keep the selected quantity visible in the menu
    const quantityElement = document.getElementById(`qty-${id}`);
    if (quantityElement) {
        quantityElement.textContent = quantities[id] ?? 1;
    }

    updateCartCount();

    button.textContent = "✓ Added";
    button.style.backgroundColor = "#d9fdd3";
    button.style.color = "#075e54";
}

function getCartCount() {
    return cart.reduce((total, item) => total + item.quantity, 0);
}

function updateCartCount() {
    const element = document.getElementById("cartCount");
    if (element) element.textContent = getCartCount();
}

function closeMenu() {
    removeCurrentScreen();
}

// =====================================================
// CART: FOOD SUBTOTAL ONLY
// =====================================================

function showCart() {
    if (cart.length === 0) {
        alert("Your cart is empty.");
        return;
    }

    const subtotal = getSubtotal();

    const itemsHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}" class="cart-item-image"
                 onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1547592180-85f173990554?w=300'">

            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-description">${item.description}</div>

                <div class="cart-item-bottom">
                    <strong>${formatMoney(item.price * item.quantity)}</strong>

                    <div class="cart-quantity">
                        <button onclick="changeCartQuantity(${item.id}, -1)">−</button>
                        <span>${item.quantity}</span>
                        <button onclick="changeCartQuantity(${item.id}, 1)">+</button>
                    </div>
                </div>
            </div>
        </div>
    `).join("");

    addScreen("cart-screen", `
        <div class="cart-header">
            <button class="cart-back" onclick="showMenu()">←</button>
            <h2>Cart</h2>
            <button class="cart-delete" onclick="clearCart()">🗑️</button>
        </div>

        <div class="cart-items">${itemsHTML}</div>

        <div class="cart-summary">
            <div class="summary-row">
                <span>Food subtotal</span>
                <strong>${formatMoney(subtotal)}</strong>
            </div>
            <div class="summary-row">
                <span>Delivery fee</span>
                <strong>Depends on order type</strong>
            </div>
            <div class="summary-line"></div>
            <div class="summary-row total-row">
                <span>Food subtotal</span>
                <strong>${formatMoney(subtotal)}</strong>
            </div>
        </div>

        <button class="checkout-button" onclick="showOrderType()">
            Continue - ${formatMoney(subtotal)}
        </button>
    `);
}

function changeCartQuantity(id, change) {
    const item = cart.find(product => product.id === id);
    if (!item) return;

    item.quantity += change;

    if (item.quantity <= 0) {
        cart = cart.filter(product => product.id !== id);
    }

    updateCartCount();

    if (cart.length === 0) {
        showMenu();
    } else {
        showCart();
    }
}

function clearCart() {
    cart = [];
    updateCartCount();
    showMenu();
}

// =====================================================
// SELECT ORDER TYPE
// =====================================================

function showOrderType() {
    addScreen("checkout-screen", `
        <div class="checkout-header">
            <button onclick="showCart()">←</button>
            <h2>Order Details</h2>
        </div>

        <div class="checkout-content">
            <h3>How would you like to receive your order?</h3>

            <button class="order-type-card" onclick="selectOrderType('table')">
                🍽️
                <div>
                    <strong>Dine-in</strong>
                    <span>Enjoy your meal at our restaurant</span>
                </div>
            </button>

            <button class="order-type-card" onclick="selectOrderType('carry')">
                🛍️
                <div>
                    <strong>Takeaway</strong>
                    <span>Collect your order from us</span>
                </div>
            </button>

            <button class="order-type-card" onclick="selectOrderType('delivery')">
                🚚
                <div>
                    <strong>Delivery</strong>
                    <span>Delivery fee: ${formatMoney(DELIVERY_FEE)}</span>
                </div>
            </button>
        </div>
    `);
}

// =====================================================
// CUSTOMER DETAILS
// =====================================================

function selectOrderType(type) {
    currentOrder = {
        type,
        name: "",
        mobile: "",
        address: "",
        tableNumber: "",
        paymentMethod: "",
        subtotal: getSubtotal(),
        deliveryFee: type === "delivery" ? DELIVERY_FEE : 0,
        total: getSubtotal() + (type === "delivery" ? DELIVERY_FEE : 0),
        orderNumber: ""
    };

    let title = "";
    let fields = "";

    if (type === "table") {
        title = "Dine-in Details";
        fields = `
            <label for="tableNumber">Table Number</label>
            <input id="tableNumber" type="number" min="1"
                   placeholder="Enter your table number" required>
        `;
    } else if (type === "carry") {
        title = "Takeaway Details";
        fields = `
            <label for="customerName">Your Name</label>
            <input id="customerName" type="text" placeholder="Enter your name" required>

            <label for="customerMobile">Mobile Number</label>
            <input id="customerMobile" type="tel" placeholder="Enter your mobile number" required>
        `;
    } else if (type === "delivery") {
        title = "Delivery Details";
        fields = `
            <div class="cart-summary">
                <div class="summary-row">
                    <span>Food subtotal</span>
                    <strong>${formatMoney(currentOrder.subtotal)}</strong>
                </div>
                <div class="summary-row">
                    <span>Delivery fee</span>
                    <strong>${formatMoney(DELIVERY_FEE)}</strong>
                </div>
                <div class="summary-line"></div>
                <div class="summary-row total-row">
                    <span>Total</span>
                    <strong>${formatMoney(currentOrder.total)}</strong>
                </div>
            </div>

            <label for="customerAddress">Full Address</label>
            <textarea id="customerAddress"
                      placeholder="Block, street, unit number, postal code"
                      required></textarea>

            <label for="customerName">Your Name</label>
            <input id="customerName" type="text" placeholder="Enter your name" required>

            <label for="customerMobile">Mobile Number</label>
            <input id="customerMobile" type="tel" placeholder="Enter your mobile number" required>
        `;
    }

    addScreen("checkout-screen", `
        <div class="checkout-header">
            <button onclick="showOrderType()">←</button>
            <h2>${title}</h2>
        </div>

        <div class="checkout-content">
            ${fields}
            <button class="continue-button" onclick="saveCustomerDetails()">
                Continue to Order Summary
            </button>
        </div>
    `);
}

function saveCustomerDetails() {
    const type = currentOrder.type;

    if (type === "table") {
        const tableNumber = document.getElementById("tableNumber").value.trim();

        if (!tableNumber || Number(tableNumber) < 1) {
            alert("Please enter a valid table number.");
            return;
        }

        currentOrder.tableNumber = tableNumber;
    } else {
        const name = document.getElementById("customerName").value.trim();
        const mobile = document.getElementById("customerMobile").value.trim();

        if (!name) {
            alert("Please enter your name.");
            return;
        }

        if (!mobile || mobile.replace(/\D/g, "").length < 8) {
            alert("Please enter a valid mobile number.");
            return;
        }

        currentOrder.name = name;
        currentOrder.mobile = mobile;

        if (type === "delivery") {
            const address = document.getElementById("customerAddress").value.trim();

            if (!address) {
                alert("Please enter your full delivery address.");
                return;
            }

            currentOrder.address = address;
        }
    }

    showOrderSummary();
}

// =====================================================
// FINAL ORDER SUMMARY
// =====================================================

function showOrderSummary() {
    currentOrder.subtotal = getSubtotal();
    currentOrder.deliveryFee =
        currentOrder.type === "delivery" ? DELIVERY_FEE : 0;
    currentOrder.total =
        currentOrder.subtotal + currentOrder.deliveryFee;

    let customerDetails = "";

    if (currentOrder.type === "table") {
        customerDetails = `
            <div class="summary-row">
                <span>Table number</span>
                <strong>${escapeHTML(currentOrder.tableNumber)}</strong>
            </div>
        `;
    } else {
        customerDetails = `
            <div class="summary-row">
                <span>Name</span>
                <strong>${escapeHTML(currentOrder.name)}</strong>
            </div>
            <div class="summary-row">
                <span>Mobile</span>
                <strong>${escapeHTML(currentOrder.mobile)}</strong>
            </div>
        `;

        if (currentOrder.type === "delivery") {
            customerDetails += `
                <div class="summary-row">
                    <span>Delivery address</span>
                    <strong>${escapeHTML(currentOrder.address)}</strong>
                </div>
            `;
        }
    }

    const itemRows = cart.map(item => `
        <div class="summary-row">
            <span>${escapeHTML(item.name)} × ${item.quantity}</span>
            <strong>${formatMoney(item.price * item.quantity)}</strong>
        </div>
    `).join("");

    addScreen("checkout-screen", `
        <div class="checkout-header">
            <button onclick="selectOrderType('${currentOrder.type}')">←</button>
            <h2>Order Summary</h2>
        </div>

        <div class="checkout-content">
            <h3>Review your order</h3>

            <div class="cart-summary">
                ${itemRows}
                <div class="summary-line"></div>

                <div class="summary-row">
                    <span>Food subtotal</span>
                    <strong>${formatMoney(currentOrder.subtotal)}</strong>
                </div>

                <div class="summary-row">
                    <span>Delivery fee</span>
                    <strong>${formatMoney(currentOrder.deliveryFee)}</strong>
                </div>

                <div class="summary-line"></div>

                <div class="summary-row total-row">
                    <span>Final total</span>
                    <strong>${formatMoney(currentOrder.total)}</strong>
                </div>
            </div>

            <div class="cart-summary">
                <h3>Customer Details</h3>
                <div class="summary-row">
                    <span>Order type</span>
                    <strong>${getOrderTypeName(currentOrder.type)}</strong>
                </div>
                ${customerDetails}
            </div>

            <button class="continue-button" onclick="showPayment()">
                Proceed to Payment - ${formatMoney(currentOrder.total)}
            </button>
        </div>
    `);
}

function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[char]);
}

// =====================================================
// PAYMENT
// =====================================================

function showPayment() {
    const type = currentOrder.type;
    let paymentOptions = "";

    if (type === "delivery") {
        paymentOptions = `
            <button class="payment-option" onclick="completeOrder('PayNow')">
                🟢
                <div>
                    <strong>PayNow</strong>
                    <span>Demo payment - ${formatMoney(currentOrder.total)}</span>
                </div>
            </button>
        `;
    } else {
        paymentOptions = `
            <button class="payment-option" onclick="completeOrder('Card')">
                💳
                <div>
                    <strong>Card</strong>
                    <span>Pay by card - ${formatMoney(currentOrder.total)}</span>
                </div>
            </button>

            <button class="payment-option" onclick="completeOrder('PayNow')">
                🟢
                <div>
                    <strong>PayNow</strong>
                    <span>Pay by PayNow - ${formatMoney(currentOrder.total)}</span>
                </div>
            </button>

            <button class="payment-option" onclick="completeOrder('Cash')">
                💵
                <div>
                    <strong>Cash</strong>
                    <span>Pay at the restaurant</span>
                </div>
            </button>
        `;
    }

    addScreen("checkout-screen", `
        <div class="checkout-header">
            <button onclick="showOrderSummary()">←</button>
            <h2>Payment</h2>
        </div>

        <div class="checkout-content">
            <div class="cart-summary">
                <div class="summary-row">
                    <span>Order total</span>
                    <strong>${formatMoney(currentOrder.total)}</strong>
                </div>
            </div>

            <h3>Select Payment Method</h3>
            ${paymentOptions}

            <p style="font-size:12px;color:#777;margin-top:12px;">
                This is a demo. No real payment will be processed.
            </p>
        </div>
    `);
}

// =====================================================
// COMPLETE ORDER
// =====================================================

function completeOrder(paymentMethod) {
    currentOrder.paymentMethod = paymentMethod;
    currentOrder.orderNumber = String(
        Math.floor(1000 + Math.random() * 9000)
    );

    const isCash = paymentMethod === "Cash";

    const deliveryInfo = currentOrder.type === "delivery"
        ? `<div><span>Delivery fee</span><strong>${formatMoney(currentOrder.deliveryFee)}</strong></div>`
        : "";

    const customerInfo = currentOrder.type === "table"
        ? `<div><span>Table</span><strong>${escapeHTML(currentOrder.tableNumber)}</strong></div>`
        : `<div><span>Customer</span><strong>${escapeHTML(currentOrder.name)}</strong></div>
           <div><span>Mobile</span><strong>${escapeHTML(currentOrder.mobile)}</strong></div>`;

    const addressInfo = currentOrder.type === "delivery"
        ? `<div><span>Address</span><strong>${escapeHTML(currentOrder.address)}</strong></div>`
        : "";

    addScreen("success-screen", `
        <div class="success-content">
            <div class="success-icon">✓</div>
            <h1>Order Confirmed!</h1>

            <p class="success-message">
                ${isCash
                    ? "Your order has been placed. Please pay when you receive your order."
                    : "Your demo order is confirmed. No real payment has been processed."}
            </p>

            <div class="order-number">
                Order #${currentOrder.orderNumber}
            </div>

            <div class="success-info">
                <div><span>Order type</span><strong>${getOrderTypeName(currentOrder.type)}</strong></div>
                ${customerInfo}
                ${addressInfo}
                <div><span>Food subtotal</span><strong>${formatMoney(currentOrder.subtotal)}</strong></div>
                ${deliveryInfo}
                <div><span>Total</span><strong>${formatMoney(currentOrder.total)}</strong></div>
                <div><span>Payment method</span><strong>${paymentMethod}</strong></div>
                <div><span>Status</span><strong>${isCash ? "Order Confirmed" : "Demo Completed"}</strong></div>
            </div>

            <p class="chat-confirmation">
                💬 Your order summary is shown here in this demo.
            </p>

            <button class="continue-button" onclick="finishOrder()">
                Back to Chat
            </button>
        </div>
    `);

    cart = [];
    updateCartCount();
}

function finishOrder() {
    removeCurrentScreen();

    currentOrder = {
        type: "",
        name: "",
        mobile: "",
        address: "",
        tableNumber: "",
        paymentMethod: "",
        subtotal: 0,
        deliveryFee: 0,
        total: 0,
        orderNumber: ""
    };

    addMessage(`
        ✅ <strong>Thank you for ordering from AZZ Food House!</strong><br><br>
        Your demo order has been completed. Have a wonderful day! 😊
        <button class="chat-button" onclick="showMenu()">🍽️ Order Again</button>
    `);
}