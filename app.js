const cartBtn = document.querySelector('.cart-btn');
console.log(cartBtn);
const closeCartBtn = document.querySelector('.close-cart');
console.log(closeCartBtn);
const clearCartBtn = document.querySelector('.clear-cart');
console.log(clearCartBtn);
const cartDOM = document.querySelector('.cart');
console.log(cartDOM);
const cartOverlay = document.querySelector('.cart-overlay');
console.log(cartOverlay);
const cartItems = document.querySelector('.cart-items');
console.log(cartItems);
const cartTotal = document.querySelector('.cart-total');
console.log(cartTotal);
const cartContent = document.querySelector('.cart-content');
console.log(cartContent);
const productsDOM = document.querySelector('.products-center');
console.log(productsDOM);

let cart = [];
//getting data
class Products {
  async getProducts() {
    try {
      let result = await fetch('products.json');
      let data = await result.json();
      let products = data.items;
      products = products.map(item => {
        const { title, price } = item.fields;
        const { id } = item.sys;
        const {
          image: {
            fields: {
              file: { url },
            },
          },
        } = item.fields;
        return { title, price, id, url };
      });
      return products;
    } catch (error) {
      console.log(error);
    }
  }
}
//display products
class UI {
  displayProducts(products) {
    let result = '';
    products.forEach(item => {
      result += `
      <arctical class="product"> 
          <div class="img-container">
            <img
              src=${item.url}
              alt="product"
              class="product-img"
            />
            <button class="bag-btn" data-id=${item.id}>
              <i class="fas fa-shopping-cart"></i>
              add to bag
            </button>
          </div>
          <h3>${item.title}</h3>
          <h4>$${item.price}</h4>
          </arctical>
    `;
    });
    productsDOM.innerHTML = result;
  }
}

//local storage

class Storage {}

document.addEventListener('DOMContentLoaded', () => {
  const ui = new UI();
  const products = new Products();
  //get all products
  products.getProducts().then(products => ui.displayProducts(products));
});
