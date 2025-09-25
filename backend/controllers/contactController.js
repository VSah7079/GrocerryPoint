// Contact and Newsletter Controller
// const nodemailer = require('nodemailer'); // Commented out - not used yet

// @desc    Handle contact form submission
// @route   POST /api/contact
// @access  Public
exports.contact = async (req, res, next) => {
  try {
    const { name, email, message } = req.body;
    // Here you would send an email or store the message
    // Example: send email using nodemailer (setup required)
    res.json({ message: 'Contact form submitted successfully' });
  } catch (err) {
    next(err);
  }
};

// @desc    Handle newsletter subscription
// @route   POST /api/newsletter
// @access  Public
exports.subscribeNewsletter = async (req, res, next) => {
  try {
    const { email } = req.body;
    // Here you would add the email to your newsletter list
    res.json({ message: 'Subscribed to newsletter successfully' });
  } catch (err) {
    next(err);
  }
};
