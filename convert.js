var markdownpdf = require("markdown-pdf")
  , fs = require("fs")

fs.createReadStream("./docker管理员系列：在Windows8上部署docker环境.md")
  .pipe(markdownpdf())
  .pipe(fs.createWriteStream("./docker管理员系列：在Windows8上部署docker环境.pdf"))

// --- OR ---

// markdownpdf().from("/path/to/document.md").to("/path/to/document.pdf", function () {
//   console.log("Done")
// })