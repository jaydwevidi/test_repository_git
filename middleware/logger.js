
const moment = require("moment")


const logger = (req, res, next) => {
    console.log("Logger Logged" + JSON.stringify(req.body) + moment().format() );
    next();
}



module.exports = logger;