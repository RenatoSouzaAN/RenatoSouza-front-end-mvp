document.addEventListener("DOMContentLoaded", function () {
    const apiUrl = "http://127.0.0.1:5000/products";
    const allProductsBox = document.getElementById("allProductsBox");
    const addProductForm = document.getElementById("addProductForm");
    const editProductForm = document.getElementById("editProductForm");
    let currentProductId = null;

    // Function to create a product component
    function createProductComponent(product) {
        const individualProductBox = document.createElement("div");
        individualProductBox.className = "individualProductBox";

        const productImageDiv = document.createElement("div");
        productImageDiv.className = "productImage";

        const productImage = document.createElement("img");
        productImage.src = "images/placeholderimage.jpg";
        productImage.alt = "product-image";
        productImage.className = "productImage";

        const deleteProductButton = document.createElement("button");
        deleteProductButton.className = "deleteButton";

        const deleteIcon = document.createElement("img");
        deleteIcon.src = "https://cdn-icons-png.flaticon.com/512/126/126468.png";
        deleteIcon.width = 15;
        deleteIcon.height = 15;
        deleteProductButton.appendChild(deleteIcon);
        deleteProductButton.onclick = function () {
            console.log("Deleting product:", product.id);
            deleteProduct(product.id);
        };

        const editProductButton = document.createElement("button");
        editProductButton.className = "editButton";

        const editIcon = document.createElement("img");
        editIcon.src = "https://cdn-icons-png.flaticon.com/512/1159/1159633.png";
        editIcon.width = 15;
        editIcon.height = 15;
        editProductButton.appendChild(editIcon);
        editProductButton.onclick = function () {
            console.log("Editing product:", product.id);
            openEditPopup(product);
        };

        productImageDiv.appendChild(productImage);
        productImageDiv.appendChild(deleteProductButton);
        productImageDiv.appendChild(editProductButton);

        const productNameDiv = document.createElement("div");
        productNameDiv.className = "productName";
        productNameDiv.innerHTML = `<h2>${product.name}</h2>`;

        const productAdditionalInfoDiv = document.createElement("div");
        productAdditionalInfoDiv.className = "productAdditionalInformation";
        productAdditionalInfoDiv.innerHTML = `
            <div class="productPrice">
                <h2>Preço: ${formatCurrency(product.price)}</h2>
            </div>
            <div class="productQuantity">
                <h2>Quantidade: ${product.quantity}</h2>
            </div>
            <div class="productDescription">
                <h2>Descrição: ${product.description}</h2>
            </div>
        `;

        individualProductBox.appendChild(productImageDiv);
        individualProductBox.appendChild(productNameDiv);
        individualProductBox.appendChild(productAdditionalInfoDiv);

        return individualProductBox;
    }

    // Function to fetch and display products
    function getProducts() {
        fetch(apiUrl)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then((data) => {
                allProductsBox.innerHTML = "";
                console.log("Fetched products:", data);

                if (!Array.isArray(data) || data.length === 0) {
                    allProductsBox.innerHTML =
                        "<p>Sem produtos disponíveis, experimente adicionar um.</p>";
                } else {
                    data.forEach((product) => {
                        const productComponent = createProductComponent(product);
                        allProductsBox.appendChild(productComponent);
                    });
                }
            })
            .catch((error) => console.error("Error fetching products:", error));
    }

    // Function to add a product
    function addProduct(event) {
        const formData = new FormData(event.target);
        const priceValue = formData.get("price");

        // Validate price
        if (!isValidPrice(priceValue)) {
            alert("Please enter a valid price.");
            return;
        }

        const product = {
            name: formData.get("name"),
            description: formData.get("description"),
            price: parseFloat(priceValue.replace(/[^\d,-]/g, "").replace(",", ".")), // Parsing price correctly
            quantity: formData.get("quantity"),
        };

        console.log("Product to add:", product);

        fetch(`${apiUrl}/create`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(product),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log("Product added:", data);
                getProducts();
                togglePopup(false, "add");
                event.target.reset();
            })
            .catch((error) => console.error("Error adding product:", error));
    }

    // Function to edit a product
    function editProduct(event) {
        const formData = new FormData(event.target);
        const priceValue = formData.get("price");

        // Validate price
        if (!isValidPrice(priceValue)) {
            alert("Please enter a valid price.");
            return;
        }

        const product = {
            description: formData.get("description"),
            price: parseFloat(priceValue.replace(/[^\d,-]/g, "").replace(",", ".")), // Parsing price correctly
            quantity: formData.get("quantity"),
        };

        console.log("Product to edit:", product);

        fetch(`${apiUrl}/${currentProductId}/update`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(product),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log("Product edited:", data);
                getProducts();
                togglePopup(false, "edit");
                event.target.reset();
            })
            .catch((error) => console.error("Error editing product:", error));
    }

    // Function to delete a product
    function deleteProduct(productId) {
        fetch(`${apiUrl}/${productId}/delete`, { method: "DELETE" })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to delete product");
                }
                return response
                    .text()
                    .then((text) => (text ? JSON.parse(text) : {}));
            })
            .then(() => {
                console.log(`Product ${productId} deleted successfully`);
                getProducts();
            })
            .catch((error) => console.error("Error deleting product:", error));
    }

    // Function to show/hide the popup
    function togglePopup(display, type) {
        const addPopupContainer = document.getElementById("addPopupContainer");
        const editPopupContainer = document.getElementById("editPopupContainer");

        if (type === "add") {
            addPopupContainer.style.display = display ? "block" : "none";
        } else if (type === "edit") {
            editPopupContainer.style.display = display ? "block" : "none";
        }
        if (!display) {
            clearFormFields();
        }
    }

    // Function to open the popup for editing a product
    function openEditPopup(product) {
        currentProductId = product.id;
        document.getElementById("editName").innerText = product.name;
        document.getElementById("editDescription").value = product.description;
        document.getElementById("editPrice").value = formatCurrency(product.price);
        document.getElementById("editQuantity").value = product.quantity;
        togglePopup(true, "edit");
    }

    // Function to open the popup for adding a product
    function openAddPopup() {
        currentProductId = null;
        togglePopup(true, "add");
    }

    // Handlers for add and edit forms
    function handleAddProduct(event) {
        event.preventDefault();
        addProduct(event);
    }

    function handleEditProduct(event) {
        event.preventDefault();
        editProduct(event);
    }

    // Event listener for opening the popup to add a product
    const openPopupButton = document.getElementById("openPopupButton");
    openPopupButton.addEventListener("click", openAddPopup);

    // Event listener for closing the add popup
    const closeAddPopup = document.getElementById("closeAddPopup");
    closeAddPopup.addEventListener("click", function () {
        togglePopup(false, "add");
    });

    // Event listener for closing the edit popup
    const closeEditPopup = document.getElementById("closeEditPopup");
    closeEditPopup.addEventListener("click", function () {
        togglePopup(false, "edit");
    });

    // Event listener for adding a product
    addProductForm.addEventListener("submit", handleAddProduct);

    // Event listener for editing a product
    editProductForm.addEventListener("submit", handleEditProduct);

    // Event listener for deleting a product
    deleteProductForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const productId = document.getElementById("productId").value;
        deleteProduct(productId);
    });

    const priceInput = document.getElementById("addPrice");
    priceInput.addEventListener("input", function (event) {
        let value = event.target.value;
        value = value.replace(/[^\d]/g, ""); // Remove non-digit characters
        if (value) {
            event.target.value = formatCurrency(value); // Apply formatting
        }
    });

    priceInput.addEventListener("blur", function (event) {
        let value = event.target.value.replace(/[^\d]/g, ""); // Ensure only numeric values
        if (value) {
            event.target.value = formatCurrency(value); // Apply formatting
        } else {
            event.target.value = ""; // Clear input if empty
        }
    });

    // Function to attach formatting listeners to an input
    function attachPriceFormattingListeners(inputElement) {
        inputElement.addEventListener("input", function (event) {
            let value = event.target.value;
            value = value.replace(/[^\d]/g, ""); // Remove non-digit characters
            if (value) {
                event.target.value = formatCurrency(value); // Apply formatting
            }
        });

        inputElement.addEventListener("blur", function (event) {
            let value = event.target.value.replace(/[^\d]/g, ""); // Ensure only numeric values
            if (value) {
                event.target.value = formatCurrency(value); // Apply formatting
            } else {
                event.target.value = ""; // Clear input if empty
            }
        });
    }

    // Attach formatting listeners to the price input fields
    attachPriceFormattingListeners(document.getElementById("addPrice"));
    attachPriceFormattingListeners(document.getElementById("editPrice"));

    // Function to format currency
    function formatCurrency(value) {
        if (typeof value === "number") {
            value = value.toFixed(2).toString(); // Convert number to string with two decimal places
        } else if (typeof value !== "string") {
            return value; // Return the value as is if it's neither a number nor a string
        }

        let formattedValue = value.replace(/\D/g, "");
        formattedValue = (formattedValue / 100)
            .toFixed(2)
            .replace(".", ",");

        let parts = formattedValue.split(",");
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        return "R$ " + parts.join(",");
    }

    // Function to validate price
    function isValidPrice(value) {
        const numericValue = value.replace(/[^\d,-]/g, "").replace(",", ".");
        return !isNaN(parseFloat(numericValue)) && isFinite(numericValue);
    }

    // Function to clear form fields
    function clearFormFields() {
        addProductForm.reset();
        editProductForm.reset();
    }

    // Initial fetch of products
    getProducts();
});