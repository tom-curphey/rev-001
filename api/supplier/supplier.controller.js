const Supplier = require('./supplier.model');
const User = require('../auth/auth.model');
const { validationResult } = require('express-validator/check');

module.exports.getSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.find();

    console.log('SUPPLIERS', suppliers);

    if (suppliers.length === 0) {
      return res.status(400).json({
        errors: [
          {
            param: 'supplier',
            msg: 'You have no suppliers'
          }
        ]
      });
    }
    res.status(200).json(suppliers);
  } catch (err) {
    console.error(err);
    return res.status(500).send('Sever Error');
  }
};

module.exports.addOrEditSupplier = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    _id,
    displayName,
    email,
    phone,
    address,
    website
  } = req.body;

  const supplierData = {};
  supplierData.metrics = {};
  if (_id) supplierData._id = _id;
  supplierData.user = req.user.id;
  supplierData.displayName = displayName;
  supplierData.urlName = displayName
    .trim()
    .replace(/\s+/g, '-')
    .toLowerCase();
  supplierData.email = email;
  supplierData.phone = phone;
  supplierData.address = address;
  supplierData.website = website;

  try {
    if (_id) {
      const supplier = await Supplier.findById(_id);
    } else {
      let supplier = await Supplier.findOne({
        $or: [
          { urlName: supplierData.urlName },
          { email: supplierData.email }
        ]
      });
      if (supplier) {
        return res.status(400).json({
          errors: [
            {
              param: 'displayName',
              msg: 'There is already an supplier by this name..'
            }
          ]
        });
      }

      supplier = new Supplier(supplierData);

      await supplier.save();
      return res.status(200).json(supplier);
    }
  } catch (err) {
    console.error(err);
    return res.status(500).send('Sever Error');
  }
};
