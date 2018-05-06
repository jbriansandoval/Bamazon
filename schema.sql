DROP DATABASE IF EXISTS bamazon;
create database Bamazon;

USE Bamazon;

CREATE TABLE products (
  id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(100) NULL,
  department_name VARCHAR(100) NULL,
  price DECIMAL(10,4) NULL,
  stock_quantity integer NULL,
  PRIMARY KEY (ID)
);
