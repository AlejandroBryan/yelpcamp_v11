const express        = require('express'),
	  router         = express.Router(),
	  Campground     = require('../models/campground'),
	  middleware  = require('../middleware')


//show all campgrounds
router.get("/", (req, res) => {
	Campground.find({}, (err, allCampgrounds) => {
		if (err) {

			console.log("error");
		} else {
			res.render("campgrounds/index", {campgrounds: allCampgrounds, page: 'campgrounds'})
		}
	})
})
// create new campgrounds
router.post("/", middleware.isloggeIn,(req, res) => {
	//get data from form and add it to campgroungs array
	let name = req.body.name
	let image = req.body.image
	let desc = req.body.description
	let price = req.body.price
	let author= {
		id: req.user._id,
		username: req.user.username
	}
	let newCampground = {
		name: name,
		image: image,
		description: desc,
		price: price,
		author: author
	}
	Campground.create(newCampground, (err, newlyCreated) => {
		if (err) {
			console.log(err)
			req.flash('error', `You musst be to log in first!`)
		} else {
			//redirect back to page
			req.flash('success', `Successful created!`)
			res.redirect("/campgrounds")

		}
	})

})
router.get("/new",middleware.isloggeIn, (req, res) => {

	res.render("campgrounds/new")
})


router.get("/:id", (req, res) => {
	//find the campground with the provided ID
	Campground.findById(req.params.id).populate('comments').exec((err, item_id) => {

		if (err) {
			console.log(err)
		} else {
			res.render("campgrounds/show", {campground: item_id})}
	})
})

router.get('/:id/edit', middleware.checkCampgroundsOwership, (req, res)=>{
	Campground.findById(req.params.id, (err, foundCampground)=>{
		if(err){
			console.log(err)
			req.flash('error', err.message)
			res.redirect('/campgrounds')
		} else{
			req.flash('success', 'Successful edited it!!')
			res.render('campgrounds/edit', {campground: foundCampground})
    	}
	})	
})

router.put('/:id',middleware.checkCampgroundsOwership, (req, res)=>{
	Campground.findByIdAndUpdate(req.params.id,
		 req.body.campground, (err, updatedCampground)=>{

			if(err){
				console.log(err)
				req.flash('error', err.message)
			}
			else{
				req.flash('success', 'Successful edited!!')
				res.redirect('/campgrounds/' + req.params.id)
			}
	 })
})

router.delete('/:id',middleware.checkCampgroundsOwership, (req, res)=>{
Campground.findByIdAndRemove(req.params.id, (err)=>{
	if(err){
		console.log(err)
		res.redirect('/campgrounds')
	}else{
		req.flash('success', 'Successful delete!!')
		res.redirect('/campgrounds')
	}
})
	
})





module.exports = router

