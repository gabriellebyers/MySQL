DROP DATABASE IF EXISTS bamazon;

create database bamazon;
use bamazon;

DROP TABLE IF EXISTS products;

create table products (
  item_id INTEGER(11) AUTO_INCREMENT NOT NULL,
  product_name varchar(100),
  department_name VARCHAR(50),
  price decimal(10,2),
  stock_quantity integer(10),
  product_sales decimal(10,2),
  PRIMARY KEY (item_id));

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Ukulele", "Instruments", 59.99, 17),
("Robe", "Apparel", 24.50, 68),
("Foam Roller", "Sports", 23.50, 35),
("Dresser", "Furniture", 165.65, 38),
("Bed Frame", "Furniture", 224.50, 22),
("Treadmill", "Sports", 556.00, 5),
("Guitar", "Instruments", 146.50, 32),
("Blanket", "Home Goods", 34.50, 23),
("Laptop", "Technology", 999.99, 4),
("Rug","Home Goods",285.90, 5);

select * from products;

DROP TABLE IF EXISTS departments;

create table departments (
  department_id INTEGER(11) AUTO_INCREMENT NOT NULL,
  department_name VARCHAR(50),
  over_head_costs decimal(10,2),
  PRIMARY KEY (department_id));

select * from departments;

