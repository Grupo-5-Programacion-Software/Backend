import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import productRouter from "./routes/product.routes.js";
import categoryRouter from "./routes/category.routes.js";
import userRouter from "./routes/user.routes.js";
import taskRouter from "./routes/task.routes.js";
import pqrsRouter from "./routes/pqrs.routes.js";
import adminRouter from "./routes/admin.routes.js";

// Carga las variables de entorno (.env) antes que cualquier configuración.
dotenv.config();

const app = express();

// Middlewares globales de la API.
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ruta raíz de bienvenida.
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Saludo de la API",
    data: [],
    errors: [],
  });
});

// Endpoint de salud para verificar que la API responde.
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API funcionando correctamente",
    data: { uptime: process.uptime() },
    errors: [],
  });
});

// Montaje de los routers por recurso.
app.use("/products", productRouter);
app.use("/categories", categoryRouter);
app.use("/users", userRouter);
app.use("/tasks", taskRouter);
app.use("/pqrs", pqrsRouter);
app.use("/admin", adminRouter);

// Respuesta en formato JSON para rutas no definidas.
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Ruta no encontrada: ${req.method} ${req.originalUrl}`,
    data: [],
    errors: [],
  });
});

// El puerto se puede definir con la variable de entorno PORT.
const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor encendido en el puerto ${PORT}`);
});

export default app;
