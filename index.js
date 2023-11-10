const fs = require("fs");
const { parse } = require("csv-parse");

fs.createReadStream("./inventory.csv")
	.pipe(parse({ delimiter: ",", from_line: 2 }))
	.on("data", function (row) {
		console.log(row);
	})
	.on("error", function (error) {
		console.log(error.message);
	})
	.on("end", function () {
		console.log("finished");
	});
