// var mysql = require("mysql");
// var inquirer = require("inquirer");
// var connection = mysql.createConnection({
//     host: "localhost",
//     // Your port; if not 3306
//     port: 8889,
//     // Your username
//     user: "root",
//     // Your password
//     password: "root",
//     database: "bamazonDB"
// });
// // connect to the mysql server and sql database
// connection.connect(function (err) {
//     if (err) throw err;
//     // run the start function after the connection is made to prompt the user
//     console.log("hello");
//     start();
// });
// function start() {
//     connection.query("SELECT * FROM products",
//         function (err, result) {
//             if (err) throw err;
//         })
// } inquirer.prompt(
//     {
//         name: "start",
//         type: "list",
//         choices: ["View Products for Sale",
//             "View Low Inventory",
//             "Add to Inventory",
//             "Add New Product"],
//         message: "What would you like to do?"
//     }
// // ).then(function () {
// //     switch (begin) {
// //         case: "View Products for Sale";
// //             products();
// //     }

// // })

// function products{
//     var choiceArray = [];
//     for (var i = 0; i < result.length; i++) {
//         choiceArray.push(result[i].product_name);
//     }
//     return choiceArray;
// }