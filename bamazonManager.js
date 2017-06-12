var Table = require('cli-table');
var inquirer = require('inquirer');
var mysql = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'password',
  database : 'Bamazon'
});
 
connection.connect((err) => {
  if (err) throw err;
  showM_Menu();
});

var showM_Menu = () =>{
  inquirer.prompt(
	{
		type: "list",
		message: "Please choose your option:",
		choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", new inquirer.Separator(), "Exit"],
		name: "m_menu"
	}      
  ).then((answer) => {
	switch (answer.m_menu){
		case 'View Products for Sale':
			showProducts();
			break;
		case 'View Low Inventory':
			showLowInventory();
			break;
		case 'Add to Inventory':
			addToInventory();
			break;
		case 'Add New Product':
			addNewProduct();
			break;
		case 'Exit':
			connection.end();
			break;
	};
  });
};

var showProducts = () => {
  var table = new Table({
	  head: ['Item ID', 'Product Name', 'Price ($)', 'Quantities'],
	  colWidths: [10, 50, 15, 15]
  });
  var query = "SELECT item_id, product_name, price, stock_quantity FROM products";
  connection.query(query, (err, res) => {
	for (var i = 0; i < res.length; i++) {
		table.push(
			[res[i].item_id, res[i].product_name, res[i].price, res[i].stock_quantity]
		);    
	};
	console.log(table.toString());
	showM_Menu();
  });
};

var showLowInventory = () => {
  var table = new Table({
	  head: ['Item ID', 'Product Name', 'Quantities'],
	  colWidths: [10, 50, 15]
  });
  var query = "SELECT item_id, product_name, stock_quantity FROM products";
  connection.query(query, (err, res) => {
	for (var i = 0; i < res.length; i++) {
	  if ( res[i].stock_quantity < 5 ){        
		table.push(
			[res[i].item_id, res[i].product_name, res[i].stock_quantity]
		);
	  };
	};
	console.log(table.toString());
	showM_Menu();
  });
};

var addToInventory = () => {
  inquirer.prompt([
		{
			name: "id",
			type: "input",
			message: "What is the product id?",
		},
		{
			name: "qty",
			type: "input",
			message: "How many of this product you want to add?",
			validate: (value) => {
			if (!isNaN(value)){
				return true;
			}
				return false;
			}
		}
	]).then((answer) => {
		var id  = parseInt(answer.id),
				qty = parseInt(answer.qty);
		
		var query = "SELECT * FROM products WHERE ?";
    connection.query(query, { item_id: id }, (err, res) => {
			var newQty = res[0].stock_quantity + qty;
			connection.query("UPDATE products SET ? WHERE ?", [{
				stock_quantity: newQty
			}, {
				item_id: id
			}], (err, res) => {});
			showProducts();
		});	
  });
};

var addNewProduct = () => {
  inquirer.prompt([
		{
			name: "name",
			type: "input",
			message: "What is the product name?",
		},
		{
			name: "dep",
			type: "input",
			message: "What is the department name for this product?",
		},
		{
			name: "price",
			type: "input",
			message: "What is the price of this product?",
			validate: (value) => {
			if (!isNaN(value)){
				return true;
			}
				return false;
			}
		},
		{
			name: "qty",
			type: "input",
			message: "What is the quantity of this product?",
			validate: (value) => {
			if (!isNaN(value)){
				return true;
			}
				return false;
			}
		}
  ]).then((answer) => {
	var name  = answer.name.trim(),
			dep   = answer.dep.trim(),
			price = parseFloat(answer.price).toFixed(2),
			qty   = parseInt(answer.qty);

	connection.query("INSERT INTO products SET ?", {
			product_name: name,
			department_name: dep,
			price: price,
			stock_quantity: qty
		}, (err, res) => {});
		showProducts();
  });
};