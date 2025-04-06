const API_URL = "/ecommerce/api";

document.getElementById("loginForm")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");

    if (!emailInput || !passwordInput) {
        console.error("Login form elements not found.");
        alert("Login form is broken.");
        return;
    }

    const email = emailInput.value;
    const password = passwordInput.value;

    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Login failed: ${response.status} - ${errorText}`);
        }

        const user = await response.json();
        if (user && user.role) {
            localStorage.setItem("user", JSON.stringify(user));
            if (user.role === "admin") {
                window.location.href = "/ecommerce/admin-dashboard.html";
            } else {
                window.location.href = "/ecommerce/user-dashboard.html";
            }
        } else {
            throw new Error("Invalid user data received.");
        }
    } catch (error) {
        console.error("Login error:", error.message);
        alert(`Login failed: ${error.message}`);
    }
});

document.getElementById("productForm")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const nameInput = document.getElementById("name");
    const priceInput = document.getElementById("price");
    const descriptionInput = document.getElementById("description");
    const imageInput = document.getElementById("image");

    if (!nameInput || !priceInput || !descriptionInput || !imageInput) {
        console.error("Product form elements not found.");
        alert("Product form is broken.");
        return;
    }

    const product = {
        name: nameInput.value,
        price: parseFloat(priceInput.value) || 0,
        description: descriptionInput.value,
        image: imageInput.value,
    };

    try {
        const response = await fetch(`${API_URL}/products`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(product),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to add product: ${response.status} - ${errorText}`);
        }

        nameInput.value = "";
        priceInput.value = "";
        descriptionInput.value = "";
        imageInput.value = "";
        await fetchProducts();
    } catch (error) {
        console.error("Product addition error:", error.message);
        alert(`Error adding product: ${error.message}`);
    }
});

async function fetchProducts() {
    const productList = document.getElementById("productList");
    if (!productList) {
        console.error("Product list element not found.");
        return;
    }

    try {
        const response = await fetch(`${API_URL}/products`);
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to fetch products: ${response.status} - ${errorText}`);
        }

        const products = await response.json();
        let user = null;
        try {
            const userData = localStorage.getItem("user");
            if (userData) user = JSON.parse(userData);
        } catch (error) {
            console.error("Error parsing user from localStorage:", error.message);
        }

        productList.innerHTML = products.map(p => {
            const isAdmin = user && user.role === "admin";
            return `
                <div>
                    <h3>${p.name || "Unnamed Product"}</h3>
                    <p>$${p.price || 0}</p>
                    <p>${p.description || "No description"}</p>
                    <img src="${p.image || 'https://via.placeholder.com/100'}" alt="${p.name || 'Product'}" width="100">
                    ${isAdmin ? `<button class="delete-btn" data-id="${p.id}">Delete</button>` : ""}
                </div>
            `;
        }).join("");

        document.querySelectorAll(".delete-btn").forEach(button => {
            button.addEventListener("click", async () => {
                const id = button.getAttribute("data-id");
                await deleteProduct(id);
            });
        });
    } catch (error) {
        console.error("Fetch products error:", error.message);
        productList.innerHTML = `<p>Error loading products: ${error.message}</p>`;
    }
}

async function deleteProduct(id) {
    try {
        const response = await fetch(`${API_URL}/products/${id}`, { method: "DELETE" });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to delete product: ${response.status} - ${errorText}`);
        }
        await fetchProducts();
    } catch (error) {
        console.error("Delete product error:", error.message);
        alert(`Error deleting product: ${error.message}`);
    }
}

function logout() {
    localStorage.removeItem("user");
    window.location.href = "/ecommerce/login.html";
}

if (document.getElementById("productList")) {
    fetchProducts();
}
