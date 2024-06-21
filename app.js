document.addEventListener('DOMContentLoaded', function() {
    const apiUrl = 'http://127.0.0.1:5000/products';

    function getProducts() {
        fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                const allProductsBox = document.getElementById('allProductsBox');
                allProductsBox.innerHTML = '';
                console.log('Fetched products:', data);
                

                if (data.length === 0) {
                    allProductsBox.innerHTML = '<p>Sem produtos disponíveis, experimente adicionar um.</p>';
                } else {
                    data.forEach(product => {
                        const individualProductBox = document.createElement('div');
                        individualProductBox.className = 'individualProductBox';
                    
                        const productImageDiv = document.createElement('div');
                        productImageDiv.className = 'productImage';
                    
                        const productImage = document.createElement('img');
                        productImage.src = "images/placeholderimage.jpg";
                        productImage.alt = "product-image";
                        productImage.className = "productImage";
                    
                        const deleteProductButton = document.createElement('button');
                        deleteProductButton.className = "deleteButton";
                    
                        const deleteIcon = document.createElement('img');
                        deleteIcon.src = "https://cdn-icons-png.flaticon.com/512/126/126468.png";
                        deleteIcon.width = 15;
                        deleteIcon.height = 15;
                        deleteProductButton.appendChild(deleteIcon);
                        deleteProductButton.onclick = function () {
                            console.log('Deleting product:', product.id);
                            deleteProduct(product.id);
                        };
                    
                        productImageDiv.appendChild(productImage);
                        productImageDiv.appendChild(deleteProductButton);
                    
                        const productNameDiv = document.createElement('div');
                        productNameDiv.className = 'productName';
                        productNameDiv.innerHTML = `<h2>${product.name}</h2>`;
                    
                        const productAdditionalInfoDiv = document.createElement('div');
                        productAdditionalInfoDiv.className = 'productAdditionalInformation';
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
    
                        allProductsBox.appendChild(individualProductBox);
                    });
                }
            })
            .catch(error => console.error('Error fetching products:', error));
    }
            
    function addProduct(event) {
        event.preventDefault(); 
    
        const formData = new FormData(event.target);
        const priceValue = formData.get('price');
    
        // Validate price
        if (!isValidPrice(priceValue)) {
            alert('Please enter a valid price.');
            return;
        }
    
        const product = {
            name: formData.get('name'),
            description: formData.get('description'),
            price: parseFloat(priceValue.replace(/[^\d,-]/g, '').replace(',', '.')), // Parsing price correctly
            quantity: formData.get('quantity')
        };
    
        console.log('Product to add:', product);
    
        fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(product)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Product added:', data);
            getProducts();
            event.target.reset();
        })
        .catch(error => console.error('Error adding product:', error));
    }
    document.getElementById('addProductForm').addEventListener('submit', addProduct);
    
    function deleteProduct(productId) {
        fetch(`${apiUrl}/${productId}`, { method: 'DELETE' })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to delete product');
                }
                return response.text().then(text => text ? JSON.parse(text) : {});
            })
            .then(() => {
                console.log(`Product ${productId} deleted successfully`);
                getProducts();
            })
            .catch(error => console.error('Error deleting product:', error));
    }
    document.getElementById('deleteProductForm').addEventListener('submit', function(event) {
        event.preventDefault();
        const productId = document.getElementById('productId').value;
        deleteProduct(productId);
    });
    
    const openPopupButton = document.getElementById('openPopupButton');
    const popupContainer = document.getElementById('popupContainer');
    const closePopup = document.getElementById('closePopup');
    const addProductForm = document.getElementById('addProductForm');
    const priceInput = document.getElementById('price');
    
    openPopupButton.addEventListener('click', function () {
        clearFormFields();
        popupContainer.style.display = 'block'; 
    });
    
    closePopup.addEventListener('click', function() {
        popupContainer.style.display = 'none'; 
    });
    
    addProductForm.addEventListener('submit', function(event) {
        event.preventDefault(); 
        popupContainer.style.display = 'none';
    });
    
    priceInput.addEventListener('input', function(event) {
        let value = event.target.value;
        value = value.replace(/[^\d]/g, ''); // Remove non-digit characters
        if (value) {
            event.target.value = formatCurrency(value); // Apply formatting
        }
    });
    
    priceInput.addEventListener('blur', function(event) {
        let value = event.target.value.replace(/[^\d]/g, ''); // Ensure only numeric values
        if (value) {
            event.target.value = formatCurrency(value); // Apply formatting
        } else {
            event.target.value = ''; // Clear input if empty
        }
    });
    
    function formatCurrency(value) {
        if (typeof value === 'number') {
            value = value.toFixed(2).toString(); // Convert number to string with two decimal places
        } else if (typeof value !== 'string') {
            return value; // Return the value as is if it's neither a number nor a string
        }
        
        let formattedValue = value.replace(/\D/g, '');
        formattedValue = (formattedValue / 100).toFixed(2).replace('.', ',');
    
        let parts = formattedValue.split(',')
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.')
        return 'R$ ' + parts.join(',')
    }
    
    function isValidPrice(value) {
        const numericValue = value.replace(/[^\d,-]/g, '').replace(',', '.');
        return !isNaN(parseFloat(numericValue)) && isFinite(numericValue);
    }

    function clearFormFields() {
        document.getElementById('addProductForm').reset();
    }
    
    getProducts(); 
});
