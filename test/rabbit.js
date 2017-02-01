let fetch = require('node-fetch');
let template = require('es6-template-strings')

var args = process.argv.slice(2)
var orderBy = args[0] || "random"
var count = args[1] || "5"
var category = args[2] || "nerdy"

var url =  template("http://api.icndb.com/jokes/${orderBy}/${count}?limitTo=[${category}]",
{orderBy: orderBy, count: count, category: category})

console.log("Fetching "+url)

fetch(url)
    .then(function(res) {
        return res.json();
    }).then(function(body) {
        body.value.forEach((joke) => {
            console.log("- "+joke.joke)  
        })
    }).catch(function(err) {
        console.log("Huh? It works on my machine!")
        console.log(err)
    })