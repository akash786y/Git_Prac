const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const app = express()
app.use('/public', express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }))

mongoose.connect('mongodb+srv://sky14032003:mongodbatlas%40123@cluster0.tdnoozr.mongodb.net/todolistdb')
// , { useNewUrlParser: true }

const itemScehma = {
    name: String
}

const Item = mongoose.model('Item', itemScehma)

const item1 = new Item({
    name: "Welcome to your todo list"
})

const item2 = new Item({
    name: "Hit add to add this item"
})

const item3 = new Item({
    name: "Hit this to delete this item"
})

const defaultItems = [item1, item2, item3]

// Item.insertMany(defaultItems).then(function(){
//         console.log(err)
//     })
//     .catch(function(err)){
//         console.log("Successfully saved the items to the database")
//     })

// Item.insertMany(defaultItems)
//     .then(function () {
//         console.log("Successfully saved defult items to DB");
//     })
//     .catch(function (err) {
//         console.log(err);
//     });

// var items = []

const listSchema={          //list schema
    name:String,
    items:[itemScehma]
}

const List=mongoose.model('List',listSchema)    //creating mongoose list model


app.set('view engine', 'ejs')


app.get('/:customListName',(req,res)=>{
    // console.log(req.params.customListNam)
    const customListName=req.params.customListName


    // try {
    //     const guest = Item.findOne().where({
    //       name: customListName
    //     }).exec();
    //     console.log('Alredy exists')
    //     // your cond logic, and update the object
    //     // guest.save();
    //     // res.status(200).json(guest);
    //   } catch (error) {
    //     console.log('Doesnt exits')
    //     // handleError(res, error.message);
    //   }

    // const myData=Item.find({name:customListName})
    // Item.exists({name:customListName}).then(exist=>{
    //     // if(exist){
    //         console.log('It already exists')
    //     // }
    //     // else{
    //     //     console.log('Doesnt exists')
    //     // }
    // })
    // .catch(err=>{
    //     console.log('Doesnt exists')
    // })

    // Item.any({name:customListName})
    //     .then(foundList=>{
    //         // if(foundList){
    //             console.log('Exist')
    //         // }
    //         // else{
    //         //     console.log('Exists')
    //         // }
    //     })
    //     .catch(err=>{
    //         console.log('Doesnt exists')
    //     })

    const list=new List({
        name:customListName,
        items:defaultItems
    })


    list.save()
})

app.get('/', (req, res) => {

    var today = new Date()

    var options = {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
    }

    var day = today.toLocaleDateString('en-US', options)

    Item.find().then((data) => {
        // console.log(data)

        if (data.length === 0) {
            Item.insertMany(defaultItems)
                .then(function () {
                    console.log("Successfully saved defult items to DB");
                })
                .catch(function (err) {
                    console.log(err);
                });
            res.redirect('/')
        }
        else {
            res.render('list', {
                kindOfDay: day,
                tasks: data
            })
        }
    })

    // try{
    //     var allData=await Item.find({})
    //     console.log(allData)
    //     res.render('list',{
    //         kindOfDay: day,
    //         tasks:allData
    //     })
    // }
    // catch(err){
    //     console.log(err)
    // }

    // Item.find({},
    //     try(function(foundItems){
    //         console.log(foundItems)
    //         res.render('list',{
    //             tasks:foundItems
    //         })
    //     })
    //     .catch(function(err){
    //         console.log(err)
    //     })
    // )
})

app.post('/', (req, res) => {
    const itemName = req.body.newItem;


    const item=new Item({       //this is called a document of mongoose
            name:itemName,
            items:defaultItems
    })

    item.save()
    res.redirect('/')

    // items.push(item)
    // res.redirect('/')
})

app.post('/delete',(req,res)=>{
    // console.log(req.body.checkbox)

    const checkedItemId=req.body.checkbox
    Item.findByIdAndRemove(checkedItemId)
        .then(function(){
            console.log('Successfully deleted')
        })
        .catch(function(){
            console.log(err)
        })
    
        res.redirect('/')
})

app.listen(3000, (res) => {
    console.log('Server started on port 3000')
})