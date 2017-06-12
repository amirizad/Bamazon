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
  showS_Menu();
});

var showS_Menu = () =>{
  inquirer.prompt(
	{
		type: "list",
		message: "Please choose your option:",
		choices: ["View Product Sales by Department", "Create New Department", new inquirer.Separator(), "Main Menu", "Exit"],
		name: "s_menu"
	}      
  ).then((answer) => {
	switch (answer.s_menu){
		case 'View Product Sales by Department':
			showDepartments();
			break;
		case 'Create New Department':
			addDepartment();
			break;
		case 'Main Menu':
			// showMenu();
			break;
		case 'Exit':
			connection.end();
			break;
	};
  });
};

var showDepartments = () => {
  var table = new Table({
	  head: ['Department ID', 'Department Name', 'Overhead costs', 'Product Sales', 'Total profit'],
	  colWidths: [20, 25, 25, 15, 15]
  });
  connection.query("SELECT * FROM departments", (err, res) => {
	for (var i = 0; i < res.length; i++) {
		var profit = parseFloat(res[i].total_sales - res[i].over_head_costs).toFixed(2);
		table.push(
			[res[i].department_id, res[i].department_name, res[i].over_head_costs, res[i].total_sales, profit]
		);    
	};
	console.log('\n' + table.toString() + '\n');
	showS_Menu();
  });
};

var addDepartment = () => {
  inquirer.prompt([
		{
			name: "name",
			type: "input",
			message: "Department Name: ",
		},
		{
			name: "cost",
			type: "input",
			message: "Overhead Cost: ",
			validate: (value) => {
			if (!isNaN(value)){
				return true;
			}
				return false;
			}
		}
	]).then((answer) => {
		var name  = answer.name.trim(),
				overhead = parseFloat(answer.cost).toFixed(2);
		
		connection.query("INSERT INTO departments SET ?", {
			department_name: name,
			over_head_costs: overhead
		}, (err, res) => {});
		showS_Menu();
  });
};
