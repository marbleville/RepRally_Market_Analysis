const fs = require("fs");
const { parse } = require("csv-parse");

let productObj = {
	id: "",
	name: "",
	category: "",
	brandId: "",
	quantitySold: 0,
};

let sortedProducts = [];

fs.createReadStream("./inventory.csv")
	.pipe(parse({ delimiter: ",", from_line: 2 }))
	.on("data", function (row) {
		let o = Object.create(productObj);
		o.id = row[0];
		o.name = row[1];
		o.category = row[2];
		o.brandId = row[3];
		o.quantitySold = getTotalSold(row);
		insertProduct(o);
	})
	.on("error", function (error) {
		console.log(error.message);
	})
	.on("end", function () {
		console.log("finished");
	});

function getTotalSold(inventory) {
	let total = 0;

	// Start at 5 because the first 4 rows are the headers and I want to compare backwards starting at the second value
	for (let i = 5; i < inventory.length; i++) {
		let delta = 0;
		if (inventory[i - 1] != "" && inventory[i] != "") {
			delta = pareseInt(inventory[i - 1]) - pareseInt(inventory[i]);
		}

		// Positive delta means the inventroy decreased -> items sold
		if (delta > 0) {
			total += delta;
		}
	}

	return total;
}

function insertProduct(product) {
	let index = 0;
	for (let i = 0; i < sortedProducts.length; i++) {
		if (product.quantitySold > sortedProducts[i].quantitySold) {
			index = i;
			break;
		}
	}

	sortedProducts.splice(index, 0, product);
}
