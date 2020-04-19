var mysql = require("mysql");
var inquirer = require("inquirer");


var connection = mysql.createConnection({
  host: "localhost",

  port: 3306,

  user: "root",

  password: "Olthevu7y.",
  database: "bamazon"
});

connection.connect(function(err) {
  if (err) throw err;
   start();
});

function start() {
          connection.query("SELECT * FROM products", function(err, results) {
            if (err) throw err;
            for (var i = 0; i < results.length; i++) {
                console.log("Product Name: " + results[i].product_name + " || Item ID: " + results[i].item_id + " || Price: " + results[i].price);
              } 
          
            inquirer
              .prompt([
                {
                  name: "buyitem",
                  type: "rawlist",
                  choices: function() {
                    var choiceArray = [];
                    for (var i = 0; i < results.length; i++) {
                      choiceArray.push(results[i].product_name);
                    }
                    return choiceArray;
                  },
                  message: "Which item would you like to buy?"
                },
                {
                  name: "quantity",
                  type: "input",
                  message: "How many would you like to buy?"
                }
              ])


              .then(function(answer) {
               
                var chosenItem;
                for (var i = 0; i < results.length; i++) {
                  if (results[i].product_name === answer.buyitem) {
                    chosenItem = results[i];
                  }
                }
               
                if (chosenItem.stock_quantity > parseInt(answer.quantity)) {
                    var newquantity = chosenItem.stock_quantity - parseInt(answer.quantity);
                    var productsales =  (answer.quantity*chosenItem.price)     
                    var newproductsales = productsales + chosenItem.product_sales            
                  connection.query(
                    "UPDATE products SET ? WHERE ?",
                    [
                      {
                        stock_quantity: newquantity,
                        product_sales: newproductsales
                      },
                      {
                        item_id: chosenItem.item_id
                      }
                    ],
                    function(error) {
                      if (error) throw err;
                      console.log("Order Successful! Total Cost: " + productsales );
                      start();
                    }
                  );
                }
                else {
                  console.log("Insufficient quantity!");
                  start();
              }
             });
          });
        }

