console.log("1. Starting imports...");

try {
  console.log("2. Importing express...");
  import("express")
    .then((express) => {
      console.log("3. Express imported successfully");

      console.log("4. Importing cors...");
      import("cors")
        .then((cors) => {
          console.log("5. CORS imported successfully");

          console.log("6. Importing Prisma...");
          import("@prisma/client")
            .then((prisma) => {
              console.log("7. Prisma imported successfully");

              console.log("8. Creating app...");
              const app = express.default();
              const port = 5001;

              console.log("9. Setting up middleware...");
              app.use(cors.default());
              app.use(express.default.json());

              console.log("10. Setting up routes...");
              app.get("/api/health", (req: any, res: any) => {
                res.json({ status: "OK", message: "Debug server running" });
              });

              console.log("11. Starting server...");
              app.listen(port, () => {
                console.log(
                  `✅ Debug server running at http://localhost:${port}`
                );
              });
            })
            .catch((err) => console.error("Prisma import error:", err));
        })
        .catch((err) => console.error("CORS import error:", err));
    })
    .catch((err) => console.error("Express import error:", err));
} catch (err) {
  console.error("General error:", err);
}
