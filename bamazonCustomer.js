var mysql = require("mysql");
var inquirer = require("inquirer");

//create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",
  port: 8889,

  //Your username
  user: "root",

  //Your password
  password: "root",
  database: "bamazon"
});

//console.log connection info
connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId + "\n");
  showProducts();
});

function showProducts() {
  var query = connection.query("SELECT * FROM products", function(err, res) {
    //error
    for (var i = 0; i < res.length; i++) {
      console.log(`${res[i].id}  | ${res[i].product_name}   | ${res[i].department_name}  | $${res[i].price}`);
    }
    //break line
    console.log("\n");
    // connection.end();
    purchaseItem();
  });
}

//select item you want to buy
function purchaseItem() {
  inquirer.prompt([
    {
      //user can select item id 
      name: "item",
      type: "input",
      message: "Enter product Id #: ",
      validate: function(value) {
      if (isNaN(value) === false) {
        return true;
      }
      return false;
      }
    },
    {
      //number ordered
      name: "amount",
      type: "input",
      message: "How many: ",
      validate: function(value) {
      if (isNaN(value) === false) {
        return true;
      }
      return false;
      }
    },
  ])
  .then(function(answer) {
      connection.query("SELECT * FROM products WHERE id = ?", [answer.item], function(err, results) {
    if (err) throw err;
      // console.log(results);
      // console.log(results[0]);
      if (answer.amount > results[0].stock_quantity) {
        console.log(`\n  Oh no, we do not have all ${answer.amount} units!
        \n  We only have ${results[0].stock_quantity} units in stock.
        \n  Please try again.`);
        keepShopping();
      } else {
        //rounding total price to 2 decimal places
        var num = results[0].price * answer.amount;
        var fixed_num = parseFloat(num).toFixed( 2 );
        console.log(`\n  Your Total was: $${fixed_num}
        \n  Thank you, your order has been placed! 
        \n  Estimated delivery time is 4-6 weeks.\n`);
        //update inventory with amount purchased
        connection.query("UPDATE products SET ? WHERE ?",
          [
            {
              stock_quantity: results[0].stock_quantity - answer.amount
            },
            {
              id: answer.item
            }
          ],
          function(err, results) {
              
          }
        );
        keepShopping();
      }
    })
  });
};
function keepShopping() {
  inquirer.prompt(
    {
      name: "choice",
      type: "confirm",
      message: "Continue shopping?"
    },
  ) .then(function(answer) {
      if (answer.choice) {
          purchaseItem();
      } else {
          connection.end();
      }
  })
};