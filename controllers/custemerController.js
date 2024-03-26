const Custemer = require('../models/Custemer');
const jwt = require('jsonwebtoken');
 secretKey="vintique"
exports.createCustemers = async (req, res) => {
  try {
    const newCostemer = new Custemer(req.body);
    const custemer = await newCostemer.save();
    const token = jwt.sign({ custemerId: custemer.id}, secretKey, { expiresIn: '1h' });
    res.json({ token });
    res.json({ message: 'Custemer created successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
}

exports.loginCustemers = async (req, res) => {
  let email = req.body.email;
  let password = req.body.password;
  
  const custemer = await Custemer.findOne({ email });

  if (custemer && password === custemer.password) {
    const token = jwt.sign({ custemerId: custemer.id}, secretKey, { expiresIn: '1h' });
    res.cookie('jwt', token, { httpOnly: true });


    
    res.json({ message: 'Login successful' });
  } else {
    res.status(401).json({ message: 'Invalid data' });
  }
}
/*
exports.loginCustemers  = async (req, res) => {
  let email = req.body.email;
  let password = req.body.password;
  
  const custemer = await Custemer.findOne({ email });

  if (custemer) {
    bcrypt.compare(password, custemer.password, async (err, result) => {
      if (err) {
        res.status(500).json({ message: 'Internal server error' });
      } else if (result) {
        const token = jwt.sign({ custemerId: custemer.id }, secretKey, { expiresIn: '1h' });
        res.json({ token, message: 'Login successful' });
      } else {
        res.status(401).json({ message: 'Invalid email or password' });
      }
    });
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
}
*/
 
exports.logoutCustemers = async (req, res) => {
  try {
   
    res.clearCookie('jwt');
    res.json({ message: 'Logout successful' });
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
}

exports.getAllCustemers = async (req, res) => {
  try {
    const custemer = await Custemer.find();
    res.json(custemer);
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
}

exports.getCustemersById = async (req, res) => {
  try {
    const custemer = await Custemer.findById(req.params.id);
    if (!custemer) {
      res.status(404).json("Custemer not found");
    }
    res.json(custemer);
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
}

exports.updateCustemers = async (req, res) => {
  try {
    req.body.updatedAt = new Date();
    const custemerUpdated = await Custemer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!custemerUpdated) {
      res.status(404).json("Custemer not found");
    }
    res.json(custemerUpdated);
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
}

exports.deleteCustemers = async (req, res) => {
  try {
    const deletedCustemer = await Custemer.findByIdAndDelete(req.params.id);
    if (!deletedCustemer) {
      return res.status(404).json({ error: 'Custemer not found' });
    }
    res.json('custemer deleted successful');
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
}
