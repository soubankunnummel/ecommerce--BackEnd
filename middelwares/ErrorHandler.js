const ErroHandler = (err, req, res, next) => {
    console.log("middleware Error Handling");
    const errStatus = req.statusCode || 500
    const errMsg = err.message || "Somthing went wrong"
    res.status(errStatus).json({
        succes:false,
        status:errStatus,
        message:errMsg,
        stack:process.env.NODE_ENV === "development" ? err.stack : {},
    })
}
module.exports = ErroHandler