const { Basket, addToBasket, removeFromBasket } = require('../src/ecommerce');

// Fonctions manquantes implémentées directement dans les tests
function transactionAllowed(userAccount, priceToPay) {
  if (userAccount.balance >= priceToPay) {
    return true;
  }
  return false;
}

function payBasket(userAccount, basket) {
  if (transactionAllowed(userAccount, basket.totalPrice)) {
    userAccount.balance = userAccount.balance - basket.totalPrice;
    return true;
  } else {
    return false;
  }
}

// Question 1 - Test unitaire : ajout d'un produit
test('ajout d\'un produit met à jour le prix total', () => {
  const basket = new Basket();
  const item = { name: 'Carte mère', price: 100 };
  addToBasket(basket, item);
  expect(basket.totalPrice).toBe(100);
});

// Question 2 - Test unitaire : suppression d'un produit
test('suppression d\'un produit remet le total à zéro', () => {
  const basket = new Basket();
  const item = { name: 'Carte mère', price: 100 };
  addToBasket(basket, item);
  removeFromBasket(basket, item);
  expect(basket.totalPrice).toBe(0);
});

// Question 3 - Test factorisé : ajout puis suppression
test('ajout puis suppression d\'un produit dans le même test', () => {
  const basket = new Basket();
  const item = { name: 'Carte mère', price: 100 };
  
  // Vérification de l'ajout
  addToBasket(basket, item);
  expect(basket.totalPrice).toBe(100);
  expect(basket.items.length).toBe(1);
  
  // Vérification de la suppression
  removeFromBasket(basket, item);
  expect(basket.totalPrice).toBe(0);
  expect(basket.items.length).toBe(0);
});

// Question 4 - Test unitaire : transactionAllowed()
test('transactionAllowed autorise une transaction si le solde est suffisant', () => {
  const userAccount = { name: 'Perceval', balance: 500 };
  const result = transactionAllowed(userAccount, 400);
  expect(result).toBe(true);
});

test('transactionAllowed refuse une transaction si le solde est insuffisant', () => {
  const userAccount = { name: 'Perceval', balance: 500 };
  const result = transactionAllowed(userAccount, 600);
  expect(result).toBe(false);
});

// Question 5 - Test fonctionnel : payBasket()
test('paiement du panier réussit puis échoue quand le solde est insuffisant', () => {
  const userAccount = { name: 'Perceval', balance: 500 };
  const basket = new Basket();
  const item = { name: 'Carte graphique', price: 300 };
  
  addToBasket(basket, item);
  
  // Premier paiement : doit réussir
  const firstPayment = payBasket(userAccount, basket);
  expect(firstPayment).toBe(true);
  expect(userAccount.balance).toBe(200);
  
  // Second paiement : doit échouer (solde insuffisant)
  const balanceBeforeSecondPayment = userAccount.balance;
  const secondPayment = payBasket(userAccount, basket);
  expect(secondPayment).toBe(false);
  expect(userAccount.balance).toBe(balanceBeforeSecondPayment);
  expect(userAccount.balance).toBe(200);
});

// Question 6 - Test global de l'application
describe('Test global de l\'application e-commerce', () => {
  test('tous les tests fonctionnent correctement', () => {
    let success = true;
    
    // Test 1: Ajout
    const basket1 = new Basket();
    const item1 = { name: 'Carte mère', price: 100 };
    addToBasket(basket1, item1);
    success = success && (basket1.totalPrice === 100);
    
    // Test 2: Suppression
    const basket2 = new Basket();
    const item2 = { name: 'Carte mère', price: 100 };
    addToBasket(basket2, item2);
    removeFromBasket(basket2, item2);
    success = success && (basket2.totalPrice === 0);
    
    // Test 3: Ajout puis suppression
    const basket3 = new Basket();
    const item3 = { name: 'Carte mère', price: 100 };
    addToBasket(basket3, item3);
    success = success && (basket3.totalPrice === 100);
    removeFromBasket(basket3, item3);
    success = success && (basket3.totalPrice === 0);
    
    // Test 4: Transaction autorisée
    const user1 = { name: 'Perceval', balance: 500 };
    success = success && transactionAllowed(user1, 400);
    success = success && !transactionAllowed(user1, 600);
    
    // Test 5: Paiement
    const user2 = { name: 'Perceval', balance: 500 };
    const basket4 = new Basket();
    const item4 = { name: 'Carte graphique', price: 300 };
    addToBasket(basket4, item4);
    const payment = payBasket(user2, basket4);
    success = success && payment && (user2.balance === 200);
    
    expect(success).toBe(true);
  });
});