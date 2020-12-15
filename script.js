const express=require("express");
const bodyparser=require("body-parser");
const app=express();
const mongoose=require('mongoose')
const _=require("lodash");



app.use(express.static("puplic"))

app.use(bodyparser.urlencoded({extended:true}))
app.set('view engine','ejs');

mongoose.connect("mongodb+srv://admin-saif:saifhoney@cluster0.mss6k.mongodb.net/listdb")


itemSchema=new mongoose.Schema({
	name:String
})





Item=mongoose.model('item',itemSchema);




item1=new Item({
	name:"welcome to your todo list"
});
item2=new Item({
	name:"hit the + button to add"
})


const listSchema={
	name:String,
	itemss:[itemSchema]
}

 const List=mongoose.model('list',listSchema);






app.get("/",function(req,res){
	
	Item.find({},function (err,found) {
		
			if(found.length===0){
							Item.insertMany([item1,item2],function (err) {
							if (err){
								console.log(err)

							}else{
								console.log('succesfully saved')
							}
	/* body... */
							})
							res.redirect("/")
						}else{


			
			res.render('list',{kindofday:"Today",listitem:found});
		
		/* body... */
	}})






});

app.post("/",function(req,res){
	var enter=req.body.n1;
	var but=req.body.list;

	item3=new Item({
		name:enter
	})

	if(but==="Today"){
		item3.save();
		res.redirect("/");

	}else{
		List.findOne({name:but},function (err,found) {
			found.itemss.push(item3)
			found.save();
			res.redirect("/"+but)

			/* body... */
		})
	}

	
	

})
app.post("/delete",function (req,res) {
	const checkid=(req.body.check)
	const bh=req.body.list
	if (bh==="Today"){

	Item.findByIdAndRemove(checkid,function (err) {
		/* body... */if(err){
			console.log(err)
		}else {
			console.log("succesfully delete")
			res.redirect("/");

		}
	})
}else{
	List.findOneAndUpdate({name:bh},{$pull:{itemss:{_id:checkid}}},function (err,found) {
		if(!err){
			res.redirect("/"+bh)

		}
		/* body... */
	})
}


})

app.get("/:topic",function(req,res){
	const topic=_.capitalize(req.params.topic)
	List.findOne({name:topic},function (err,found) {
		if(!err)
			{
			if (!found){
			const list =new List({
			name:topic,
			itemss:item1,item2
		
	});
				list.save()
				res.redirect("/"+topic)

		}
		else{
			res.render('list',{kindofday:found.name,listitem:found.itemss});
		}
	}
	})

	





})

app.get("/about",function(req,res){
	res.render('about');

})

let port=process.env.PORT;
if(port==null || port==""){
	port=3000;
}


app.listen(port,function(){
	console.log("srever is runing 3000");
})