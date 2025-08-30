import { app } from "./app.js";
import { DB_CONNECTION } from "./database/db.js";

//After the database connection happened then only start the server
DB_CONNECTION()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`App is listening to port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log(err.message);
  });
