const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create uploads directory if it doesn't exist
const createUploadDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = '';
    
    // Determine upload path based on file type
    if (file.fieldname === 'productImage') {
      uploadPath = 'uploads/products/';
    } else if (file.fieldname === 'userAvatar') {
      uploadPath = 'uploads/avatars/';
    } else if (file.fieldname === 'categoryImage') {
      uploadPath = 'uploads/categories/';
    } else {
      uploadPath = 'uploads/misc/';
    }
    
    createUploadDir(uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    const filename = file.fieldname + '-' + uniqueSuffix + extension;
    cb(null, filename);
  }
});

// File filter function
const fileFilter = (req, file, cb) => {
  // Check if file is an image
  if (file.mimetype.startsWith('image/')) {
    // Allowed image types
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPEG, PNG, GIF, and WebP images are allowed'), false);
    }
  } else {
    cb(new Error('Only image files are allowed'), false);
  }
};

// Multer configuration
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 5 // Maximum 5 files at once
  }
});

// @desc    Upload single product image
// @route   POST /api/upload/product
// @access  Admin
exports.uploadProductImage = async (req, res, next) => {
  const uploadSingle = upload.single('productImage');
  
  uploadSingle(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        error: err.message
      });
    }
    
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No file uploaded'
      });
    }
    
    const fileUrl = `/uploads/products/${req.file.filename}`;
    
    res.json({
      success: true,
      message: 'Product image uploaded successfully',
      data: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        url: fileUrl,
        fullUrl: `${req.protocol}://${req.get('host')}${fileUrl}`
      }
    });
  });
};

// @desc    Upload multiple product images
// @route   POST /api/upload/product-gallery
// @access  Admin
exports.uploadProductGallery = async (req, res, next) => {
  const uploadMultiple = upload.array('productImages', 5);
  
  uploadMultiple(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        error: err.message
      });
    }
    
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No files uploaded'
      });
    }
    
    const uploadedFiles = req.files.map(file => {
      const fileUrl = `/uploads/products/${file.filename}`;
      return {
        filename: file.filename,
        originalName: file.originalname,
        size: file.size,
        url: fileUrl,
        fullUrl: `${req.protocol}://${req.get('host')}${fileUrl}`
      };
    });
    
    res.json({
      success: true,
      message: `${req.files.length} product images uploaded successfully`,
      data: uploadedFiles
    });
  });
};

// @desc    Upload user avatar
// @route   POST /api/upload/avatar
// @access  Private
exports.uploadUserAvatar = async (req, res, next) => {
  const uploadSingle = upload.single('userAvatar');
  
  uploadSingle(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        error: err.message
      });
    }
    
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No file uploaded'
      });
    }
    
    const fileUrl = `/uploads/avatars/${req.file.filename}`;
    
    res.json({
      success: true,
      message: 'Avatar uploaded successfully',
      data: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        url: fileUrl,
        fullUrl: `${req.protocol}://${req.get('host')}${fileUrl}`
      }
    });
  });
};

// @desc    Upload category image
// @route   POST /api/upload/category
// @access  Admin
exports.uploadCategoryImage = async (req, res, next) => {
  const uploadSingle = upload.single('categoryImage');
  
  uploadSingle(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        error: err.message
      });
    }
    
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No file uploaded'
      });
    }
    
    const fileUrl = `/uploads/categories/${req.file.filename}`;
    
    res.json({
      success: true,
      message: 'Category image uploaded successfully',
      data: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        url: fileUrl,
        fullUrl: `${req.protocol}://${req.get('host')}${fileUrl}`
      }
    });
  });
};

// @desc    Delete uploaded file
// @route   DELETE /api/upload/:filename
// @access  Admin
exports.deleteFile = async (req, res, next) => {
  try {
    const { filename } = req.params;
    const { type = 'products' } = req.query; // products, avatars, categories
    
    const filePath = path.join(`uploads/${type}`, filename);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        error: 'File not found'
      });
    }
    
    // Delete the file
    fs.unlinkSync(filePath);
    
    res.json({
      success: true,
      message: 'File deleted successfully',
      deletedFile: filename
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Failed to delete file'
    });
  }
};

// @desc    Get file info
// @route   GET /api/upload/info/:filename
// @access  Public
exports.getFileInfo = async (req, res, next) => {
  try {
    const { filename } = req.params;
    const { type = 'products' } = req.query;
    
    const filePath = path.join(`uploads/${type}`, filename);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        error: 'File not found'
      });
    }
    
    const stats = fs.statSync(filePath);
    const fileUrl = `/uploads/${type}/${filename}`;
    
    res.json({
      success: true,
      data: {
        filename: filename,
        size: stats.size,
        createdAt: stats.birthtime,
        modifiedAt: stats.mtime,
        url: fileUrl,
        fullUrl: `${req.protocol}://${req.get('host')}${fileUrl}`
      }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Failed to get file info'
    });
  }
};

// @desc    List uploaded files
// @route   GET /api/upload/list
// @access  Admin
exports.listFiles = async (req, res, next) => {
  try {
    const { type = 'products', page = 1, limit = 20 } = req.query;
    const uploadDir = `uploads/${type}/`;
    
    if (!fs.existsSync(uploadDir)) {
      return res.json({
        success: true,
        data: [],
        total: 0,
        page: parseInt(page),
        totalPages: 0
      });
    }
    
    const files = fs.readdirSync(uploadDir);
    const fileList = files
      .filter(file => {
        const filePath = path.join(uploadDir, file);
        return fs.statSync(filePath).isFile();
      })
      .map(file => {
        const filePath = path.join(uploadDir, file);
        const stats = fs.statSync(filePath);
        const fileUrl = `/uploads/${type}/${file}`;
        
        return {
          filename: file,
          size: stats.size,
          createdAt: stats.birthtime,
          modifiedAt: stats.mtime,
          url: fileUrl,
          fullUrl: `${req.protocol}://${req.get('host')}${fileUrl}`
        };
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedFiles = fileList.slice(startIndex, endIndex);
    
    res.json({
      success: true,
      data: paginatedFiles,
      total: fileList.length,
      page: parseInt(page),
      totalPages: Math.ceil(fileList.length / limit)
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Failed to list files'
    });
  }
};