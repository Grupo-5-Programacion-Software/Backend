import express from "express";
import cors from "cors";
import productRouter from "./routes/product.routes.js";
import categoryRouter from "./routes/category.routes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: "Saludo de la API",
    data: [],
    errors: [],
  });
})

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API funcionando correctamente",
    data: { uptime: process.uptime() },
    errors: [],
  });
});

app.use("/products", productRouter);
app.use("/categories", categoryRouter);

const PORT = 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor encendido en el puerto ${PORT}`);
});