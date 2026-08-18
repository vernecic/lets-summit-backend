import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectToDatabase } from "./db.js";
import { ObjectId } from "mongodb";

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

app.get("/api/trips/:id", async (req, res) => {
  const { id } = req.params;
  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Neispravan ID izleta" });
  }
  try {
    const trip = await db
      .collection("Trips")
      .findOne({ _id: new ObjectId(id) });
    if (!trip) {
      return res.status(404).json({ message: "Izlet nije pronađen" });
    }
    const { _id, ...rest } = trip;
    return res.status(200).json({ id: _id.toString(), ...rest });
  } catch (error) {
    console.error("Greška pri dohvaćanju izleta:", error);
    return res.status(500).json({ message: "Greška pri dohvaćanju izleta" });
  }
});

app.post("/api/trips", async (req, res) => {
  const {
    title,
    description,
    shortDescription,
    difficulty,
    maxParticipants,
    country,
    elevation,
    location,
  } = req.body;

  const trip = {
    title,
    description,
    shortDescription,
    difficulty,
    maxParticipants,
    country,
    elevation,
    location,
  };
  try {
    await db.collection("Trips").insertOne(trip);
    return res.status(201).json({ message: "Izlet je uspješno kreiran" });
  } catch (error) {
    console.error("Greška pri kreiranju izleta:", error);
    return res.status(500).json({ message: "Greška pri kreiranju izleta" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
