var mysql = require("mysql");
var inquirer = require("inquirer");
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
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "EXIT"]
        })
        .then(function (answer) {
            if (answer.options === "View Products for Sale") {
                viewProducts();
            }
            else if (answer.options === "View Low Inventory") {
                lowInventory();
            }
            else if (answer.options === "Add to Inventory") {
                addInventory();
            }
            else if (answer.options === "Add New Product") {
                addProduct();
            }
            else {
                connection.end();
            }
        });
}

//------------------------------------------------------------------------------------
function lowInventory() {
    connection.query("SELECT * FROM products where stock_quantity < 5", function (err, results) {
        if (err) throw err;
        for (var i = 0; i < results.length; i++) {
            console.log("Item ID: " + results[i].item_id + "|| Product Name: " + results[i].product_name + " || Price: " + results[i].price + " || Quantity: " + results[i].stock_quantity);
        }
        start();
    })
}
//---------------------------------------------------------------------------------------------------

function viewProducts() {
    connection.query("SELECT * FROM products", function (err, results) {
        if (err) throw err;
        for (var i = 0; i < results.length; i++) {
            console.log("Item ID: " + results[i].item_id + "|| Product Name: " + results[i].product_name + " || Price: " + results[i].price + " || Quantity: " + results[i].stock_quantity);
        }
        start();
    })
}
//-----------------------------------------------------------------------------------------------------------
function addInventory() {
    connection.query("SELECT * FROM products", function (err, results) {
        if (err) throw err;
        inquirer
            .prompt([
                {
                    name: "addinventory",
                    type: "rawlist",
                    choices: function () {
                        var choiceArray = [];
                        for (var i = 0; i < results.length; i++) {
                            choiceArray.push(results[i].product_name);
                        }
                        return choiceArray;
                    },
                    message: "Which item would you like to add more of?"
                },
                {
                    name: "quantity",
                    type: "input",
                    message: "How many would you like to add?"
                }
            ])

            .then(function (answer) {

                var chosenItem;
                for (var i = 0; i < results.length; i++) {
                    if (results[i].product_name === answer.addinventory) {
                        chosenItem = results[i];
                    }
                }

                var newquantity = chosenItem.stock_quantity + parseInt(answer.quantity);

                connection.query(
                    "UPDATE products SET ? WHERE ?",
                    [
                        {
                            stock_quantity: newquantity
                        },
                        {
                            item_id: chosenItem.item_id
                        }
                    ],
                    function (error) {
                        if (error) throw err;
                        console.log("Inventory Added! New stock quantity: " + newquantity);
                        start();
                    }
                );
            });
    });
}
//-------------------------------------------------------------------------------------------------

function addProduct() {
    inquirer
      .prompt([
        {
          name: "item",
          type: "input",
          message: "What is the name of the item you would like to add?"
        },
        {
          name: "department",
          type: "input",
          message: "Which department does the item belong to?"
        },
        {
          name: "price",
          type: "input",
          message: "What is the price of the item?"
        },
        {
            name: "stock",
            type: "input",
            message: "How many of the item are in stock?"
          }
      ])
      .then(function(answer) {
        connection.query(
          "INSERT INTO products SET ?",
          {
            product_name: answer.item,
            department_name: answer.department,
            price: parseFloat(answer.price),
            stock_quantity: parseInt(answer.stock)
          },
          function(err) {
            if (err) throw err;
            console.log("The item was created successfully!");
            start();
          }
        );
      });
  }