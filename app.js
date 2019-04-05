const cartBtn = document.querySelector('.cart-btn');
const closeCartBtn = document.querySelector('.close-cart');
const clearCartBtn = document.querySelector('.clear-cart');
const cartDOM = document.querySelector('.cart');
const cartOverlay = document.querySelector('.cart-overlay');
const cartItems = document.querySelector('.cart-items');
const cartTotal = document.querySelector('.cart-total');
const cartContent = document.querySelector('.cart-content');
const productsDOM = document.querySelector('.products-center');

let cart = [];
let buttonsDOM = [];
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
  getBagButtons() {
    const buttons = [...document.querySelectorAll('.bag-btn')];
    buttonsDOM = buttons;
    buttons.forEach(button => {
      let id = button.dataset.id;
      let inCart = cart.map(itme => itme.id === id); /* Storage.getCart(id); */
      if (inCart) {
        button.innerText = 'In Cart';
        button.disabled = true;
      }
      button.addEventListener('click', event => {
        event.target.innerText = 'In Cart';
        event.target.disabled = true;
        //get product from products
        let cartItem = { ...Storage.getProduct(id), amount: 1 };
        //add product to the cart
        cart = [...cart, cartItem];
        //save cart in local storage
        Storage.saveCart(cart);
        //set cart values
        this.setCartValue(cart);
        //display cart item
        this.addCartItem(cartItem);
        //show the cart
        this.showCart();
      });
    });
  }
  setCartValue(cart) {
    let tempTotal = 0;
    let itemsTotal = 0;
    cart.map(item => {
      tempTotal += item.price * item.amount;
      itemsTotal += item.amount;
    });
    cartTotal.innerText = parseFloat(tempTotal.toFixed(2));
    cartItems.innerText = itemsTotal;
  }
  addCartItem(item) {
    const div = document.createElement('div');
    div.classList.add('cart-item');
    div.innerHTML = `<img src=${item.url} alt="product" srcset="" />

      <div>
        <h4>${item.title}</h4>
        <h5>$${item.price}</h5>

        <span class="remove-item" data-id=${item.id}>remove</span>
      </div>
      <div>
        <i class="fas fa-chevron-up"data-id=${item.id}></i>
        <p class="item-amount"data-id=${item.id}>${item.amount}</p>
        <i class="fas fa-chevron-down"data-id=${item.id}></i>
      </div>
              </div >`;
    cartContent.appendChild(div);
  }
  showCart() {
    cartOverlay.classList.add('transparentBcg');
    console.log(cartOverlay);
    cartDOM.classList.add('showCart');
    console.log(cartDOM);
  }
}

//local storage

class Storage {
  static saveProducts(products) {
    localStorage.setItem('products', JSON.stringify(products));
  }
  static getProduct(id) {
    let products = JSON.parse(localStorage.getItem('products'));
    return products.find(product => product.id === id);
  }
  static saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
  }
  static getCart(id) {
    let cart = JSON.parse(localStorage.getItem('cart'));
    return cart.find(item => item.id === id);
  }
}
document.addEventListener('DOMContentLoaded', () => {
  const ui = new UI();
  const products = new Products();
  //get all products
  products
    .getProducts()
    .then(products => {
      ui.displayProducts(products);
      Storage.saveProducts(products);
    })
    .then(() => {
      ui.getBagButtons();
    });
});
