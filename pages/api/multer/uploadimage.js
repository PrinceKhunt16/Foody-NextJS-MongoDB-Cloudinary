import multer from "multer";
import nc from "next-connect";
import path from "path";

export const config = {
    api: {
        bodyParser: false,
    }
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/user/images/dynamic/users")
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now() + Math.floor(Math.random() * 99999)}${path.parse(file.originalname).ext}`)
    }
})

const route = nc();

const upload = multer({ storage })

route.use(upload.single("avatar"))

route.post((req, res) => {
    return res.status(200).json({
        url: req.file.filename,
        success: true
    });
});

export default route;