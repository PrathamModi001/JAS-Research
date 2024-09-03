import { app } from "./app.js";

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server version up and running on port ${PORT}`));
