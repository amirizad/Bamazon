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
  showProducts();
});

var getOrder = () => {
  inquirer.prompt([
    {
      name: "id",
      type: "input",
      message: "What is the product ID you would like to buy?",
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
      message: "How many units of the product you would like to buy?",
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
      if ( res[0].stock_quantity >= qty ){
        var totalCost  = (qty * res[0].price).toFixed(2),
            remainingQty = res[0].stock_quantity - qty,
            productSales = res[0].product_sales + totalCost,
            department = res[0].department_name;
        connection.query("UPDATE products SET ? WHERE ?", [{
          stock_quantity: remainingQty,
          product_sales : productSales
        }, {
          item_id: id
        }], (err, res) => {});

        updateDepartment(department, totalCost);

        console.log(`Total cost of your purchase is $${totalCost}`)
        continueShopping();
      } else {
        console.log(`\nInsufficient quantity for ${res[0].product_name} in stuck!\n`);
        getOrder();
      }
    });
  });
}

var updateDepartment = (department, totalSale) => {
  var query = "SELECT total_sales FROM departments WHERE ?";
  connection.query(query, { department_name: department }, (err, res) => {
    totalSale += res[0].total_sales;
    connection.query("UPDATE departments SET ? WHERE ?", [{
      total_sales : totalSale
    }, {
      department_name: department
    }], (err, res) => {});
  });    
};

var showProducts = () => {
  var table = new Table({
      head: ['Item ID', 'Product Name', 'Price ($)'],
      colWidths: [10, 50, 15]
  });
  var query = "SELECT item_id, product_name, price, stock_quantity FROM products";
  connection.query(query, (err, res) => {
    for (var i = 0; i < res.length; i++) {
      if ( res[i].stock_quantity > 0 ){
        table.push(
            [res[i].item_id, res[i].product_name, res[i].price]
        );    
      };
    };
    console.log('\n' + table.toString() + '\n');
    getOrder();
  });
};

var continueShopping = () => {
  inquirer.prompt(
	{
		type: "confirm",
		message: "Do you want to purchase more items?",
		name: "continue"
	}).then((answer) => {
    if (answer.continue){
      getOrder();
    } else {
      connection.end();
    };
  });
}