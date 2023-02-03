// require("dotenv").config();
// const googleChartAPI = "https://chart.googleapis.com/chart?";
const HttpError = require("../models/http-error");
const QRCode = require("qrcode");

//   const opts = new URLSearchParams({
//     cht: qr, // Chart type
//     chs: height + "x" + width, // QR code dimensions
//     chl: data, // Data embedded in QR code
//     choe: output_encoding,
//     chld: margin,
//     chof: output_format,
//     chco: color,
//   });

const generateQRCode = async (data) => {
  var opts = {
    errorCorrectionLevel: "M",
    type: "terminal",
    quality: 0.3,
    margin: 0.92,
    color: {
      dark: "#010599FF",
      light: "#FFBF60FF",
    },
  };

  if (!data) {
    const error = new HttpError("Data need to be provided", 402);
    return next(error);
  }

  let stringdata = JSON.stringify(data);
  try {
    const QRCodeResponse = await QRCode.toString(stringdata, opts);
    console.log("QRCodeResponse", QRCodeResponse);
  } catch (err) {
    const error = new HttpError("An Error ocurred", 402);
    return next(error);
  }

  // Converting the data into base64
  QRCode.toDataURL(stringdata, function (err, code) {
    if (err) return console.log("error occurred");

    // Printing the code
    console.log(code);
  });
};

module.exports = generateQRCode;
