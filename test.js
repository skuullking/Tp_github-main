const { Basket, addToBasket, removeFromBasket } = require('./src/ecommerce');

describe('Basket', () => {
  test('should add item to basket and update total price', () => {
    const basket = new Basket();
    const item = { name: 'Book', price: 10 };
    addToBasket(basket, item);
    expect(basket.items).toContain(item);
    expect(basket.totalPrice).toBe(10);
  });

  test('should remove item from basket and update total price', () => {
    const basket = new Basket([{ name: 'Book', price: 10 }], 10);
    const item = { name: 'Book', price: 10 };
    removeFromBasket(basket, item);
    expect(basket.items).not.toContainEqual(item);
    expect(basket.totalPrice).toBe(0);
  });

  test('removing non-existent item does not change basket', () => {
    const basket = new Basket([{ name: 'Pen', price: 2 }], 2);
    const item = { name: 'Book', price: 10 };
    removeFromBasket(basket, item);
    expect(basket.items).toHaveLength(1);
    expect(basket.totalPrice).toBe(2);
  });
});
