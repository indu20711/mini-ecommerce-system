const API_URL = "http://localhost:8080/api"; // Update to your deployed backend URL after deployment

document.getElementById("loginForm")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });
    const user = await response.json();

    if (user) {
        localStorage.setItem("user", JSON.stringify(user));
        if (user.role === "admin") {
            window.location.href = "admin-dashboard.html";
        } else {
            window.location.href = "user-dashboard.html";
        }
    } else {
        alert("Invalid credentials");
    }
});

document.getElementById("productForm")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const product = {
        name: document.getElementById("name").value,
        price: document.getElementById("price").value,
        description: document.getElementById("description").value,
        image: document.getElementById("image").value,
    };

    await fetch(`${API_URL}/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
    });
    fetchProducts();
});

async function fetchProducts() {
    const response = await fetch(`${API_URL}/products`);
    const products = await response.json();
    const productList = document.getElementById("productList");
    productList.innerHTML = products.map(p => `
        <div>
            <h3>${p.name}</h3>
            <p>$${p.price}</p>
            <p>${p.description}</p>
            <img src="${p.image}" alt="${p.name}" width="100">
            ${localStorage.getItem("user") && JSON.parse(localStorage.getItem("user")).role === "admin" ? 
                `<button onclick="deleteProduct(${p.id})">Delete</button>` : ""}
        </div>
    `).join("");
}

async function deleteProduct(id) {
    await fetch(`${API_URL}/products/${id}`, { method: "DELETE" });
    fetchProducts();
}

function logout() {
    localStorage.removeItem("user");
    window.location.href = "login.html";
}
