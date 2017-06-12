create database if not exists Bamazon;
use Bamazon;

-- Create products table
create table if not exists products(
  item_id integer(11) auto_increment not null,
  product_name VARCHAR(100) NULL,
  department_name VARCHAR(100) NULL,
  price float(10,2) NULL,
  stock_quantity int NULL,
  PRIMARY KEY (item_id)
);

-- Add product_sales column
ALTER TABLE products
ADD product_sales float(12,2) DEFAULT 0;

-- Create departments table
create table if not exists departments(
  department_id integer(11) auto_increment not null,
  department_name VARCHAR(100),
  over_head_costs float(10,2),
  total_sales float(10,2) DEFAULT 0,
  PRIMARY KEY (department_id)
);

-- Insert "mock" data rows into this database and tables
insert into products (product_name, department_name, price, stock_quantity) values ( "Fidget Spinner", "Toys", 5.50, 30);
insert into products (product_name, department_name, price, stock_quantity) values ( "Shopkins", "Toys", 7.88, 30);
insert into products (product_name, department_name, price, stock_quantity) values ( "Nerf Gun", "Toys", 12.99, 20);
insert into products (product_name, department_name, price, stock_quantity) values ( "Harry Potter and the Deathly Hallows", "Books", 9.19, 10);
insert into products (product_name, department_name, price, stock_quantity) values ( "Harry Potter And The Chamber Of Secrets", "Books", 6.93, 10);
insert into products (product_name, department_name, price, stock_quantity) values ( "Harry Potter and the Prisoner of Azkaban", "Books", 6.79, 10);
insert into products (product_name, department_name, price, stock_quantity) values ( "64GB USB 2.0", "Electronics", 15.99, 20);
insert into products (product_name, department_name, price, stock_quantity) values ( "32GB USB 3.0", "Electronics", 12.99, 10);
insert into products (product_name, department_name, price, stock_quantity) values ( "Wireless Mouse", "Electronics", 9.49, 20);
insert into products (product_name, department_name, price, stock_quantity) values ( "80GB External Hard drive", "Electronics", 21.99, 15);

insert into departments (department_name, over_head_costs) values ( "Toys", 200.00);
insert into departments (department_name, over_head_costs) values ( "Books", 300.00);
insert into departments (department_name, over_head_costs) values ( "Electronics", 400.00);

select * from products;
select * from departments;