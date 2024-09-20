const { Bank } = require("../models/bank");

// Add a new bank
exports.addBank = async (req, res) => {
  try {
    const bank = await Bank.create(req.body);
    res.status(201).json(bank);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update an existing bank by ID
exports.updateBank = async (req, res) => {
  try {
    const { bank_id, name, customer_care_number } = req.body;
    const item = await Bank.findByPk(bank_id);

    if (!item) {
      return res.status(404).json({ message: "Bank id not found" });
    }

    await item.update({ name, customer_care_number });

    return res
      .status(200)
      .json({ message: "Bank details updated successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

// Delete a bank by ID
exports.deleteBank = async (req, res) => {
    console.log("Out of delete");
    try {
    console.log("In delete");
    const bank = await Bank.destroy({ where: { bank_id: req.body } });
    if (bank === 0) {
      res.status(404).json({ message: "Bank not found" });
    } else {
      res.status(200).json({ message: "Bank deleted successfully" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get a list of all banks
exports.getAllBanks = async (req, res) => {
  try {
    const banks = await Bank.findAll();
    res.status(200).json(banks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};
