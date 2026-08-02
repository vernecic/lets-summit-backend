import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectToDatabase } from "./db.js";

const PORT = process.env.PORT || 8000;
const app = express();

const db = await connectToDatabase();

app.use(cors());
app.use(express.json());

app.get("/api/trips", async (req, res) => {
  try {
    const allTrips = await db.collection("Trips").find().toArray();
    const trips = allTrips.map(({ _id, ...rest }) => ({
      id: _id.toString(),
      ...rest,
    }));
    return res.status(200).json(trips);
  } catch (error) {
    console.error("Greška pri dohvaćanju izleta:", error);
    return res.status(500).json({ message: "Greška pri dohvaćanju izleta" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
