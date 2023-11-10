const fs = require("fs");
const { parse } = require("csv-parse");
const topNumber = 20;

let productObj = {
	id: "",
	name: "",
	category: "",
	brandId: "",
	quantitySold: 0,
};

let sortedProducts = [];
let linesProcessed = 0;

fs.createReadStream("./inventory.csv")
	.pipe(parse({ delimiter: ",", from_line: 2 }))
	.on("data", function (row) {
		linesProcessed++;
		let o = Object.create(productObj);
		o.id = row[0];
		o.name = row[1];
		o.category = row[2];
		o.brandId = row[3];
		o.quantitySold = getTotalSold(row);
		sortedProducts = insertProduct(o, sortedProducts);
		console.log(`${linesProcessed} lines processed`);
	})
	.on("error", function (error) {
		console.log(error.message);
	})
	.on("end", function () {
		for (let i = 0; i < topNumber; i++) {
			console.log(sortedProducts[i]);
		}
	});

function getTotalSold(inventory) {
	let total = 0;

	// Start at 5 because the first 4 rows are the headers and I want to compare backwards starting at the second value
	for (let i = 5; i < inventory.length; i++) {
		let prev = parseInt(inventory[i - 1]);
		let cur = parseInt(inventory[i]);

		if (prev != NaN && cur != NaN) {
			let delta = prev - cur;

			// Positive delta means the inventory decreased -> items sold
			if (delta > 0) {
				total += delta;
			}
		}
	}
	return total;
}

// Inserts a product into the sortedProducts array maintaining the descending order
function insertProduct(product, sp) {
	if (sp.length === 0) {
		return [product];
	}

	let sorted = [];
	for (let i = 0; i < sp.length; i++) {
		if (sp[i].quantitySold > product.quantitySold) {
			sorted.push(sp[i]);
		} else {
			let rest = sp.slice(i);
			sorted.push(product);
			sorted = sorted.concat(rest);
			return sorted;
		}
	}
	return sorted;
}
