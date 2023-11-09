const express = require("express")
const router = express.Router()
const admin = require("../controllers/adminController")

// middlewares
const tryCatchMiddleware = require("../middelwares/tryChatchMiddleware")
const verifyToken = require("../middelwares/adminAuthMiddelware")
const imageUplod = require("../middelwares/imageUplod/imageUpload")
router.use(express.json())

router
.post("/login",tryCatchMiddleware(admin.login))

// apk middleware  start

.use(verifyToken)

// apk middleware  end

.get("/users",tryCatchMiddleware(admin.allUsers))
.get("/user/:id", tryCatchMiddleware(admin.useById))
.post("/products",imageUplod, tryCatchMiddleware(admin.creatProduct))
.get("/products", tryCatchMiddleware(admin.allProducts))
.get("/products/:id", tryCatchMiddleware(admin.productsById)) 
.delete("/products", tryCatchMiddleware(admin.deleteProduct))
.put("/products", tryCatchMiddleware(admin.updateProduct))
.get("/orders",tryCatchMiddleware(admin.orderDtails))
.get("/status",tryCatchMiddleware(admin.status))





module.exports = router

