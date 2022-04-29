const Shop = require("../models/shopModel");
const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ApiFeatures = require("../utils/apifeatures");
const cloudinary=require("cloudinary")

// create Shop -- admin  
exports.createShop = catchAsyncErrors (async (req,res,next) => {
  let images = [];

  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }

  const imagesLinks = [];

  for (let i = 0; i < images.length; i++) {
    const result = await cloudinary.v2.uploader.upload(images[i], {
      folder: "shops",
    });

    imagesLinks.push({
      public_id: result.public_id,
      url: result.secure_url,
    });
  }

    req.body.images = imagesLinks;
    req.body.user = req.user.id;
    
    const shop =  await Shop.create(req.body);

    res.status(201).json({
        success:true,
        shop
    })
})


// get all shops
exports.getAllShops = catchAsyncErrors ( async (req,res)=>{

    const resultPerPage = 6;

    const apiFeature = new ApiFeatures(Shop.find(),req.query).search().filter().pagination(resultPerPage);

    const shops = await apiFeature.query;

    //const shops = await Shop.find();
    res.status(200).json({
        success:true,
        shops
    })
})

// Get All Product (Admin)
exports.getAdminShops = catchAsyncErrors (async (req, res, next) => {
    const shops = await Shop.find();
  
    res.status(200).json({
      success: true,
      shops,
    });
  });


//get shop details

// exports.getShopDetails = async(req,res,next)=>{
//     const shop = await Shop.findById(req.params.id);

//     if(!shop){
//         return res.status(500).json({
//             success:false,
//             message:"Shop not found"
//         })

//     }
//     res.status(200).json({
//         success:true,
//         shop
//     })
// }

// //////////




// exports.getShopDetails = async(req,res,next)=>{
//     const shop = await Shop.findById(req.params.id);

//     if(!shop){
//         return res.status(500).json({
//             success:false,
//             message:"Shop not found"
//         })

//     }
//     res.status(200).json({
//         success:true,
//         shop
//     })
// }

//////////

exports.getShopDetails = catchAsyncErrors( async (req,res,next) => {

    const shop = await Shop.findById(req.params.id);

    if(!shop){
        return next(new ErrorHander("shop not found" , 404));
    }

    res.status(200).json({
        success:true,
        shop,
       // shopCount
    });

});

// update shop -- admin 

exports.updateShop = catchAsyncErrors (async (req,res,next)=>{

    let shop = Shop.findById(req.params.id);

    if(!shop){
        return next(new ErrorHander("shop not found" , 404));
    }


    shop = await Shop.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true,useFindAndModify:false});

    res.status(200).json({
        success:true,
        shop
    })
})

//  delete shop -- admin 

exports.deleteShop = catchAsyncErrors (async (req,res,next)=>{

    const shop = await Shop.findById(req.params.id);

    if(!shop){
        return next(new ErrorHander("Shop not found" , 404));
    }


    await shop.remove();

    res.status(200).json({
        success:true,
        message:"Shop deleted successfully"
    })
})


// Create New Review or Update the review
exports.createShopReview = catchAsyncErrors(async (req, res, next) => {
    const { rating, comment, shopId } = req.body;
  
    const review = {
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment,
    };
  
    const shop = await Shop.findById(shopId);
  
    const isReviewed = shop.reviews.find(
      (rev) => rev.user.toString() === req.user._id.toString()
    );
  
    if (isReviewed) {
      shop.reviews.forEach((rev) => {
        if (rev.user.toString() === req.user._id.toString())
          (rev.rating = rating), (rev.comment = comment);
      });
    } else {
      shop.reviews.push(review);
      shop.numOfReviews = shop.reviews.length;
    }
  
    let avg = 0;
  // 4,4,4,5,5,3,3,4 = 32/8 = 4 (overall rating)
    shop.reviews.forEach((rev) => {
      avg += rev.rating;
    });
  
    shop.ratings = avg / shop.reviews.length;
  
    await shop.save({ validateBeforeSave: false });
  
    res.status(200).json({
      success: true,
    });
  })

  // Get All Reviews of a shop
exports.getShopReviews = catchAsyncErrors(async (req, res, next) => {
    const shop = await Shop.findById(req.query.id);
  
    if (!shop) {
      return next(new ErrorHander("Shop not found", 404));
    }
  
    res.status(200).json({
      success: true,
      reviews: shop.reviews,
    });
  });
  
  // Delete Review
  exports.deleteReview = catchAsyncErrors(async (req, res, next) => {
    const shop = await Shop.findById(req.query.shopId);
  
    if (!shop) {
      return next(new ErrorHander("Shop not found", 404));
    }
  
    const reviews = shop.reviews.filter(
      (rev) => rev._id.toString() !== req.query.id.toString()
    );
  
    let avg = 0;
  
    reviews.forEach((rev) => {
      avg += rev.rating;
    });
  
    let ratings = 0;
  
    if (reviews.length === 0) {
      ratings = 0;
    } else {
      ratings = avg / reviews.length;
    }
  
    const numOfReviews = reviews.length;
  
    await Shop.findByIdAndUpdate(
      req.query.shopId,
      {
        reviews,
        ratings,
        numOfReviews,
      },
      {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      }
    );
  
    res.status(200).json({
      success: true,
    });
  });