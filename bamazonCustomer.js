var mysql = require("mysql");
var inquirer = require("inquirer");

// var WordTable = require('word-table');

// create the connection information for the sql database
var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 8889,

    // Your username
    user: "root",

    // Your password
    password: "root",
    database: "bamazonDB"
});
// connect to the mysql server and sql database
connection.connect(function (err) {
    if (err) throw err;
    // run the start function after the connection is made to prompt the user
    // console.log("hello");z
    itemsForSaleInq();
});

function itemsForSaleInq(result) {
    inquirer.prompt([
        // {
        // name: "choice",
        // type: "rawlist",
        // choices: function () {
        //     var choiceArray = [];
        //     for (var i = 0; i < result.length; i++) {
        //         choiceArray.push(result[i].product_name);
        //     }
        //     return choiceArray;
        //     // console.table(choiceArray);
        // },
        // message: "What would you like to purchase??? "
        // },
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
                    updateStockQuantity(updateQuantity, answer.itemPurchased)
                }
            })
        });
};

function updateStockQuantity(newQuantity, stockid) {
    console.log(newQuantity)
    connection.query("UPDATE products SET stock_quantity = ? WHERE id = ?"
    [newQuantity, stockid])
}

function getItemsForSale() {
    connection.query("SELECT * FROM products", function (err, result) {
        if (err) throw err;
        itemsForSaleInq(result);
        console.log("TEST")
        // console.log("hello", results)
    })
}