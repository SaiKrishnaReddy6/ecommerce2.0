const {Grievance} = require('../models/grievance');

exports.fileGrievance = async (req, res) => {
  const { return_id, customer_email } = req.body;

  try {
    const grievance = await Grievance.create({ 
      return_id,
      customer_email
    });
    res.status(201).json({ message: 'Grievance created successfully', grievance });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server error' });
  }
};
exports.deleteGrievance = async (req, res) => {
  const { grievance_id } = req.body;
  try {
    const grievance = await Grievance.findOne({
      where: { grievance_id },
    });
    if (!grievance) {
      return res.status(404).json({ message: "Grievance not found" });
    }
    await grievance.destroy();
    return res.json({ message: "Grievance deleted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
