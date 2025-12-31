import 'dotenv/config';
import app from './src/app.js';
import connectDB from './src/config/db.js';

const port = process.env.PORT || 3000;

// Connect to Database
connectDB();

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});