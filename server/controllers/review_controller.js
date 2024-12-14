const {reviewModel} = require("../models/review_model")

exports.getListreview = async (req, res, next) => {
    try {
        let listreview = await reviewModel.find({});
        res.json(listreview);
    } catch (error) {
        res.json({ status: "not found", result: error });
    }
};
exports.addreview = async (req, res, next) => {
    try {
        console.log(req.body.rating)
        console.log(req.body.comment)
        console.log(req.body.user_id)
        console.log(req.body.product_id)
        let obj = new reviewModel({
            rating: req.body.rating,
            comment: req.body.comment,
            user_id: req.body.user_id,
            product_id: req.body.product_id
        })
        console.log(obj)
        let result = await obj.save();
        res.json(result);
    } catch (error) {
        res.json({status: "Add failed" })
    }
}

exports.updatereview = async (req, res, next) => {
    try {
        let id = req.params.id;
        let obj = {};
        obj.rating= req.body.rating;
        obj.comment= req.body.comment;
        obj.user_id= req.body.user_id;
        let result = await reviewModel.findByIdAndUpdate(id, obj, { new: true });
        res.json({ status: "Update successfully", result: result });
    } catch (error) {
        res.json({ status: "Update falied", result: error });
    }
};

exports.deletereview = async (req, res, next) => {
    try {
        let id = req.params.id;
        let result = await reviewModel.findByIdAndDelete(id);
        res.json({ status: "Delete successfully", result: result });
    } catch (error) {
        res.json({ status: "Delete falied", result: error });
    }
};

exports.getreview = async (req, res, next) => {
    try {
        let id = req.params.id;
        let result = await reviewModel.findById(id);
        res.json({ status: "Successfully", result: result });
    } catch (error) {
        res.json({ status: "Not found", result: error });
    }
};

exports.getreviewById = async (req, res, next) => {
    try {
        let id = req.params.id;
        let result = await reviewModel.findById(id);
        res.json({ status: "Successfully", result: result });
    } catch (error) {
        res.json({ status: "Not found", result: error });
    }
};
exports.getReviewsByProductId = async (req, res, next) => {
    try {
        const productId = req.params.product_id; // Lấy product_id từ params
        // Tìm reviews theo product_id và populate thông tin user
        const reviews = await reviewModel.find({ product_id: productId })
            .populate('user_id', 'name avata') // Lấy name và avatar từ user_id

        if (reviews.length === 0) {
            return res.json({ status: "No reviews found", result: [] });
        }

        res.json({ status: "Successfully", result: reviews });
    } catch (error) {
        res.json({ status: "Error", result: error.message });
    }
};
