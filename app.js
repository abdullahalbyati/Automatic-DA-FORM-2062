const express = require('express')
const bparser = require('body-parser')
const app = express()
const port = process.env.PORT || 8080
app.set('view engine','ejs')
app.use(express.static('public'))
app.use(bparser.urlencoded({extended : true}))


//pdf related

const ejs = require('ejs')
const fs = require('fs')
var pdf = require('html-pdf')
var compiled = ejs.compile(fs.readFileSync('./pdf.html', 'utf8'));


app.get("/",(req,res)=>{
	res.render('index',{title : "Automatic DA Form 2062 Generator"})
})
app.post('/',(req,res)=>{
	var names = req.body.namep
	var numbers = req.body.number
	var nam = names.split("\n")
	var num = numbers.split("\n")

	var from = req.body.from
	var snumbers = req.body.snumber
	var idescriptions = req.body.idescription
	var quantity = req.body.quantity


	if(nam.length!=num.length){
		res.send({
			type : 'error',
			msg : "Number of names and serails number must match i.e if you enter 5 names you must enter 5 numbers"
		})
	}
	else{
			var hx = ''
		num.forEach((data,i)=>{
			var namz = nam[i]
			var html = compiled({ number : data, name : namz ,from,snumbers,idescriptions,quantity});
			hx+=html
			if(i!==num.length-1){
				hx+=`<br><div style="page-break-after:always;"></div>`
			}
		})
			var filname = new Date().getTime()+(Math.random()+1)*100000
			var options = { 'width' : '35in', 'height' : '30in'};
			pdf.create(hx, options).toFile(`./public/${filname}.pdf`, function(err, res) {
			  if (err) return console.log(err);			 	
			});
			res.send({
		 		type : 'success',
		 		msg : `Your forms has been created !! Click <a href="/${filname}.pdf" target = "_blank">here</a> to view the file and <a href="/${filname}.pdf" target="_blank" download> here </a> to download`
		 	})
	
	}
})

app.listen(port,(err)=>{
	if(err){console.log("Error starting server !! ",err)}
	else{
		console.log('App up and running at port ',port)
	}
})