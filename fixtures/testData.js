/**
 * testData.js
 *
 * Centralised test data for all specs.
 * Keeping credentials and form values in one place makes
 * maintenance easy — update once, affects all tests.
 */

const VALID_USER = {
  email: 'admin@admin.com',
  password: 'admin123',
};

const INVALID_USERS = [
  {
    description: 'wrong password',
    email: 'admin@admin.com',
    password: 'wrongpassword',
  },
  {
    description: 'wrong email',
    email: 'wrong@email.com',
    password: 'admin123',
  },
  {
    description: 'empty credentials',
    email: '',
    password: '',
  },
  {
    description: 'invalid email format',
    email: 'not-an-email',
    password: 'admin123',
  },
];

const SHIPPING_DETAILS = {
  phone: '0123456789',
  street: '123 Main Street',
  city: 'Charlotte',
  country: 'United States of America',
};

/** Products available in the shop (by their exact display names) */
const PRODUCTS = {
  IPHONE_12: 'Apple iPhone 12, 128GB, Black',
  HUAWEI_MATE_20: 'Huawei Mate 20 Lite, 64GB, Black',
  SAMSUNG_A32: 'Samsung Galaxy A32, 128GB, White',
  IPHONE_13: 'Apple iPhone 13, 128GB, Blue',
  NOKIA_105: 'Nokia 105, Black',
};

module.exports = { VALID_USER, INVALID_USERS, SHIPPING_DETAILS, PRODUCTS };
