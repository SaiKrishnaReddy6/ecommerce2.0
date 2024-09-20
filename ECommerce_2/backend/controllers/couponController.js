const { Coupon } = require('../models/coupon');
const {Advertiser} = require('../models/advertiser');
// controller to add a new coupon for an advertiser
const addCoupon = async (req, res) => {
    try {
        const coupon = await Coupon.create(req.body);
        res.status(201).json(coupon);
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
      }
};

// Delete a bank by ID
const deleteCoupon = async (req, res) => {
    //   console.log("Out of delete");
      try {
      //console.log("In delete");
      const {advertiser_id,coupon_name} = req.body;
      const bank = await Coupon.destroy({ where: { advertiser_id,coupon_name } });
      if (bank === 0) {
        res.status(404).json({ message: "Coupon not found" });
      } else {
        res.status(200).json({ message: "Coupon deleted successfully" });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  
  // Get a list of all Coupon
const getAllCoupons = async (req, res) => {
    try {
      const coupon = await Coupon.findAll();
      res.status(200).json(coupon);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  };

  module.exports = {
    addCoupon,deleteCoupon,getAllCoupons
  };