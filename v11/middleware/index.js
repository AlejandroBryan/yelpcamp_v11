const Campground = require('../models/campground')
const Comment = require('../models/comment')
const User = require('../models/user')

const middlewareObj = {}


middlewareObj.checkCampgroundsOwership = (req, res, next)=>{
        if(req.isAuthenticated()){
        Campground.findById(req.params.id, (err, foundCampground)=>{
        if(err){
        console.log(err)
        res.redirect('back')
        } else {
        if(foundCampground.author.id.equals(req.user._id) || req.user.isAdmin ){
            //console.log(`Successful operation!`)
            next()
        }else{
            res.redirect('back')
            //console.log(`You are not allowed to do this!`)
          }
         }
        })

      }else{
        req.flash('error', 'You aren\'t allowed to do that')
        res.redirect('back')
    }

    }

middlewareObj.checkCommentsOwership = (req, res, next)=>{
		if(req.isAuthenticated()){
		Comment.findById(req.params.comment_id, (err, foundedComment)=>{
		if(err){
		console.log(err)
		res.redirect('back')
		} else {
		if(foundedComment.author.id.equals(req.user._id) || req.user.isAdmin ){
			//console.log(`Successful operation!`)
			next()
		}else{
			res.redirect('back')
			//console.log(`You are not allowed to do this!`)
		  }
		 }
		})
	  }
	  else{
      req.flash('error', 'You aren\'t allowed to do that')
		res.redirect('back')
	}
    }
    middlewareObj.isloggeIn = (req, res, next)=>{
        if(req.isAuthenticated()){
            return next()
        }
        req.flash("error", "You need to be logged in to do that!!")
        res.redirect('/login')
        }

middlewareObj.profileOwner = (req, res, next)=>{
if(req.isAuthenticated()){
User.findById(req.params.user_id, (err, foundUser)=>{
  console.log(foundUser)
    if(foundUser){
      req.flash('success', 'Your account have been successfully deleted!!!')
      next()
    }else{
      req.flash("error", "You don't have permission to do that!");
       res.redirect("campgrounds");
    }
  });
}else{
  req.flash("error", "You need to be signed in to do that!");
  res.redirect("login");
}
}
module.exports = middlewareObj