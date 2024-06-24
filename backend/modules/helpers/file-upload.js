'use strict';
const multer = require('multer');

const DIR = './public'

// Multer Mime Type Validation
let filter =  (req, file, cb) => {
  if (
    file.mimetype == 'image/png' ||
    file.mimetype == 'image/jpg' ||
    file.mimetype == 'image/jpeg'
  ) {
    cb(null, true)
  } else {
    cb(null, false)
    return cb(new Error('Only .png, .jpg and .jpeg format allowed!'))
  }
};
let filename = (req, file, cb) => {
  const fileName = Date.now() + Math.round(Math.random() * 10000) + '.' + file.originalname.split(".")[file.originalname.split(".").length - 1]
  cb(null, fileName)
};

let teacherImage = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, `${DIR}/teacher-image/`)
    },
    filename: filename
  }),
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter:filter
})
let bannerImage = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, `${DIR}/banner-image/`)
    },
    filename: filename
  }),
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter:filter
})
let subjectImage = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, `${DIR}/subject-image/`)
    },
    filename: filename
  }),
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter:filter
})
let adsImage = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, `${DIR}/ads-image/`)
    },
    filename: filename
  }),
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter:filter
})
let topperImage = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, `${DIR}/topper-image/`)
    },
    filename: filename
  }),
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter:filter
})
let testimonialImage = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, `${DIR}/testimonial-image/`)
    },
    filename: filename
  }),
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter:filter
})

module.exports = {
  teacherImage:teacherImage,
  bannerImage:bannerImage,
  subjectImage:subjectImage,
  adsImage:adsImage,
  topperImage:topperImage,
  testimonialImage:testimonialImage
}