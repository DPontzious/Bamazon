var mysql = require("mysql");
var inquirer = require("inquirer");
var connection = mysql.createConnection({
    host: "localhost",
    port: 8889,
    user: "root",
    password: "root",
    database: "bamazonDB"
});
// connect to the mysql server and sql database
connection.connect(function (err) {
    if (err) throw err;
    // run the start function after the connection is made to prompt the user
    console.log("hello");
    // itemsForSaleInq();
    start();
});
function start() {
    inquirer
        .prompt({
            name: "shopOrExit",
            type: "list",
            message: "Would you like to Shop for an item or Exit?",
            choices: ["SHOP", "EXIT"]
        })
        .then(function (answer) {
            // Based on the user's answer, this either calls the shop or the exit functions:
            if (answer.shopOrExit === "SHOP") {
                getItemsForSale();
                console.log("-------------------------------------")
                itemsForSaleInq();
            } else {
                connection.end();
            }
        });
}

function getItemsForSale() {
    connection.query("SELECT * FROM products", function (err, result) {
        if (err) throw err;
        console.table(result);
    })
}
function itemsForSaleInq(result) {
    inquirer.prompt([
        {
            name: "itemPurchased",
            type: "input",
            message: "What is the id of the item would you like to purchase?"
        },
        {
            name: "quantity",
            type: "input",
            message: "How many would you like to purchase?"
        },
    ])
        .then(function (answer) {
            // GET ITEM STOCK QUANTITY
            connection.query("SELECT stock_quantity, product_name FROM products WHERE id = ?", [answer.itemPurchased], function (err, result) {
                // COMPARE STOCK QUANTITY TO USER QUANTITY
                // IF USER QUANTITY IS > STOCK QUANTITY
                var quanGreaterThanStock = result[0].stock_quantity < parseInt(answer.quantity)
                // console.log(quanGreaterThanStock)
                if (quanGreaterThanStock) {
                    // THEN LOG ERROR
                    console.log("Sorry there are only " + result[0].stock_quantity + " left")

                }// ELSE 
                else {
                    // LOG SUCCESSFULL

                    console.log("Successfully purchased!")
                    // UPDATE STOCK QUANTITY 
                    var updateQuantity = (result[0].stock_quantity - parseInt(answer.quantity))
                    // console.log('updateQuantity', updateQuantity);
                    // console.log('answer.itemPurchased', answer.itemPurchased);
                    updateStockQuantity(updateQuantity, answer.itemPurchased)
                    customerTotal(answer.itemPurchased, answer.quantity);
                    // customerTotal();
                    // console.log("==============================")
                    start();
                }
            })
        });
};

function updateStockQuantity(newQuantity, stockId) {
    connection.query("UPDATE products SET ? WHERE ?",
        [{ stock_quantity: newQuantity },
        { id: stockId }])
    // start();
}
function customerTotal(stockId, newQuantity) {
    connection.query('SELECT price FROM products WHERE ?', { id: stockId },
        function (err, res) {
            for (var i = 0; i < res.length; i++) {
                if (err) throw err;
                // console.log(res[0].price)
                var priceTag = res[0].price;
                var total = priceTag * newQuantity;
                console.log("Your total is", total)
            }
        })
}
