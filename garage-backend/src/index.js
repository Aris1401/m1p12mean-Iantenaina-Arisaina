const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { verifyToken, isUtilisateur } = require("./middlewares/jwt");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connexion à MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connecté"))
  .catch((err) => console.log(err));

// Routes
const baseUrl = "/api/v1";

app.use(baseUrl, require("./controllers/auth.controller"));
app.get(baseUrl + "/test", [verifyToken, isUtilisateur], (req, res) => {
  res.status(200).send({ message: "Test réussi !" });
});

app.listen(PORT, () =>
  console.log(`Serveur démarré sur le port ${PORT}`)
);

// initialize();

// Initializing the database
function initialize() {
  const RoleUtilisateur = require("./model/roleUtilisateur");
  const Utilisateur = require("./model/utilisateur");

  const roles = [
    { role: "ROLE_USER" },
    { role: "ROLE_MECANICIEN" },
    { role: "ROLE_MANAGER" },
  ];

  RoleUtilisateur.insertMany(roles)
    .then((roles) => {
      const utilisateur = new Utilisateur({
        nom: "Doe",
        prenom: "John",
        email: "user1@gmail.com",
        mot_de_passe: "password",
        roles: [roles[0]._id],
      });
      utilisateur.save();

      const mecanicien = new Utilisateur({
        nom: "Smith",
        prenom: "Jane",
        email: "meca1@gmail.com",
        mot_de_passe: "password",
        roles: [roles[1]._id],
      });
      mecanicien.save();

      const manager = new Utilisateur({
        nom: "Doe",
        prenom: "Jane",
        email: "manager1@gmail.com",
        mot_de_passe: "password",
        roles: [roles[2]._id],
      });
      manager.save();
    })
}
