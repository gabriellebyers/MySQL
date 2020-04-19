var mysql = require("mysql");
var inquirer = require("inquirer");
var consoletable = require("console.table");
//------------------------------------------------------------
var connection = mysql.createConnection({
    host: "localhost",

    port: 3306,

    user: "root",

    password: "Olthevu7y.",
    database: "bamazon"
});
//--------------------------------------------------------------
connection.connect(function (err) {
    if (err) throw err;
    start();
});
//----------------------------------------------------------
function start() {
    inquirer
        .prompt({
            name: "options",
            type: "list",
            message: "Select action:",
            choices: ["View Product Sales by Department", "Create New Department", "EXIT"]
        })
        .then(function (answer) {
            if (answer.options === "View Product Sales by Department") {
                viewProducts();
            }
            
            else if (answer.options === "Create New Department") {
                addProduct();
            }
            else {
                connection.end();
            }
        });
}

///---------------------------------------------------------------------------------------------------

function viewProducts() {
    connection.query("SELECT distinct department_id, a.department_name, over_head_costs, case when sum(product_sales) is null then 0 else sum(product_sales) end as  Product_Sales, case when ((sum(product_sales)-over_head_costs)) is null then (0-over_head_costs) else ((sum(product_sales)-over_head_costs)) end as Total_Profit FROM departments a left join products b on a.department_name = b.department_name group by 1,2,3", function (err, results) {
     
        if (err) throw err;
     console.table(results);
       
        start();
    })
}
//------------------------------------------------------------------------------------------------------


function addProduct() {
    inquirer
      .prompt([
        {
          name: "name",
          type: "input",
          message: "What is the name of the department you would like to add?"
        },
        {
          name: "overhead",
          type: "input",
          message: "What is the department's overhead cost?"
        }       
        
      ])
      .then(function(answer) {
        connection.query(
          "INSERT INTO departments SET ?",
          {
            department_name: answer.name,
            over_head_costs: parseFloat(answer.overhead)
        
          },
          function(err) {
            if (err) throw err;
            console.log("The department was created successfully!");
            start();
          }
        );
      });
  }