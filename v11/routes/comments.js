
const express       = require('express'),
	  router        = express.Router({mergeParams: true}),
	  Campground    = require('../models/campground'),
	  Comment       = require('../models/comment'),
	  middleware    = require('../middleware')



//==comments routes=====
router.get("/new", middleware.isloggeIn, (req, res) => {
	//find the campground with the provided ID
	Campground.findById(req.params.id, (err, campground) => {

		if (err) {
			console.log(err)
		} else {
			res.render("comments/new", {campground: campground})

		}
	})
})
router.post("/",middleware.isloggeIn, (req, res)=>{
	//lookup campground using ID
	Campground.findById(req.params.id, (err, campground)=>{
		if(err){
			console.log(err)
			res.redirect("/campgrounds")
		} else {
		 Comment.create(req.body.comment, (err, comment)=>{
			if(err){
				console.log(err)
			} else {
				comment.author.id = req.user._id
				comment.author.username = req.user.username
				comment.save()
				campground.comments.push(comment)
				campground.save()
				res.redirect('/campgrounds/' + campground._id)
			}
		 })
	}
	})
 })

 //edit routes
router.get('/:comment_id/edit',middleware.checkCommentsOwership, (req, res)=>{	
 Comment.findById(req.params.comment_id, (err, foundedComment)=>{
	 if(err){
		 req.flash('error', 'You aren\'t allowed to edit comment')
		 res.redirect('back')
	 } else {
		req.flash('success', `success!`)
		 res.render('comments/edit', {campground_id: req.params.id, comment: foundedComment})
	 }

   })
})
router.put('/:comment_id', (req, res)=>{
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment)=>{
		if(err){
			res.redirect('back')

		} else {
			res.redirect('/campgrounds/' + req.params.id)

		}	
	})
})
// comment destroy routes
router.delete('/:comment_id', middleware.checkCommentsOwership, (req, res)=>{
	Comment.findByIdAndRemove(req.params.comment_id, (err)=>{

		if(err){
			res.redirect('back')

		} else{
			req.flash('success', 'Created a comment!');
			res.redirect('/campgrounds/' + req.params.id)
		}
	})

})



 

module.exports = router