import "./src/setup.js";
import app from "./src/app.js";

app.listen(process.env.PORT || 4000, () => {
  console.log("Server listen in port 4000");
});
