import express from "express";
import emailRoutes from "./routes/email.routes.js";
import authRoutes from "./routes/auth.routes.js";
import ExpressError from "./utils/ExpressError.js";
import permissionRoutes from "./routes/permission.routes.js";
import roleRoutes from "./routes/role.routes.js";
import blogRoutes from "./routes/blog.routes.js";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");

app.use(express.static("public"));
// welcome to backend
app.get("/", (req, res) => {
  res.send("Welcome to Backend");
});

app.use("/api/v1/email", emailRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/permissions", permissionRoutes);
app.use("/api/v1/roles", roleRoutes);
app.use("/api/v1/blogs", blogRoutes);

app.all(/(.*)/, (req, res, next) => {
  next(new ExpressError(404, "Page Not Found!", false));
});

app.use((err, req, res, next) => {
  let {
    status = 500,
    message = "Internal server issue",
    success = false,
  } = err;
  res.status(status).send({ message, success });
});

export default app;
