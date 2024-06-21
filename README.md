# Front-End

This is the front-end MVP made to fullfill the requirements in the 'Assessment Requirements and Composition', it's a SPA (Single Page Application). This web application allows users to add, view, and delete products, it requires the back-end api to be up and running. -- The back-end has it own repository, the link for is below --


Back-end repository: https://github.com/RenatoSouzaAN/RenatoSouza/back-end-mvp

## Table of Contents

- [Getting Started](#getting-started)
- [Dependencies](#dependencies)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [License](#license)

## Getting Started

To get a local copy up and running follow these steps.

### Prerequisites

- A running backend server with RESTful API endpoints to handle product data.

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/RenatoSouzaAN/RenatoSouza/front-end-mvp
   ```
2. Navigate to the project directory
   ```sh
   cd RenatoSouza-back-end-mvp
   ```

## Dependencies

The project uses the following dependencies:

- Fetch API for HTTP requests

## Usage

1. Ensure your backend server is running and accessible at `http://127.0.0.1:5000/products`.
2. Open `index.html` in a web browser.

## API Endpoints

- `GET /products` - Retrieves all products.
- `POST /products` - Adds a new product.
- `DELETE /products/:id` - Deletes a product by ID.

## License

Distributed under the MIT License. See `LICENSE` for more information.
