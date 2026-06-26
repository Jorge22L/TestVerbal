import express from "express";
import cors from "cors";
import testRoutes from "./routes/test.routes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.use("/api", testRoutes);

const port = Number(process.env.PORT || 3000);

app.listen(port, () => {
    console.log(`Servidor iniciado en http://localhost:${port}`);
});