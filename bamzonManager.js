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
    // console.log("hello");
    start();
});
function start() {
    inquirer.prompt(
        {
            name: "start",
            type: "list",
            choices: ["View Products for Sale",
                "View Low Inventory",
                "Add to Inventory",
                "Add New Product"],
            message: "What would you like to do?"

        })
        .then(function (answer) {
            switch (answer.start) {
                case "View Products for Sale":
                    productsForSale();
                    break;

                case "View Low Inventory":
                    lowInventory();
                    break;

                case "Add to Inventory":
                    addInventory();
                    break;

                case "Add New Product":
                    addNewProducts();
                    break;

                case "exit":
                    connection.end();
                    break;
            }
        });
}
function productsForSale() {
    connection.query("SELECT * FROM products", function (err, result) {
        if (err) throw err;
        // console.log("hello", result)
        console.table(result);
        // start();
    })
}
function lowInventory() {
    connection.query("SELECT * FROM products WHERE stock_quantity < 5", function (err, result) {
        console.log(result)
        start();
    })
}
function addInventory() {
    productsForSale()
    inquirer.prompt([
        {
            name: "stockId",
            type: "input",
            message: "What is the id of the item you would like to add inventory to? "
        },
        {
            name: "quantity",
            type: "input",
            message: "How many would you like to add to stock?"
        }
    ])
        .then(function (answer) {
            var id = answer.stockId
            var updateStock = parseInt(answer.quantity);
            var query = ("UPDATE products SET ? WHERE ?")
            connection.query(query, function (err, result) {
                [
                    { stock_quantity: updateStock },
                    { id: id }];
                console.log("Updated!")
                if (err) throw err;
                start();
            })
        })
}
function addNewProducts() {
    inquirer.prompt([{
        name: "product",
        type: "input",
        message: "What is the product name? "
    },
    {
        name: "department",
        type: "input",
        message: "What department is the product?"
    },
    {
        name: "price",
        type: "input",
        message: "What is the price?"
    },
    {
        name: "quantity",
        type: "input",
        message: "How many would you like to add to stock?"
    },
    ])
        .then(function (answer) {
            console.log(answer.department)
            connection.query("INSERT INTO products SET ?",
                {
                    product_name: answer.product,
                    department_name: answer.department,
                    price: answer.price,
                    stock_quantity: answer.quantity
                });
            console.log("Added New Product")
            productsForSale()
        })
}
