const jsonwebtoken = require('jsonwebtoken');
const config = require('../config/auth.config');

// Models
const Utilisateur = require('../model/utilisateur');
const RoleUtilisateur = require('../model/roleUtilisateur');

const verifyToken = async (req, res, next) => {
    let token = req.headers['authorization']

    if (!token) {
        return res.status(401).send({ message: "Aucun token fourni !" });
    }

    token = token.split(" ")[1];

    try {
        const decoded = await jsonwebtoken.verify(token, config.secret);
        req.utilisateurId = decoded.id;
        next();
    } catch (err) {
        console.log(err);
        return res.status(401).send({ message: "Non autorisé !" });
    }
};

const checkRole = async (req, res, next, role) => {
    try {
        const utilisateur = await Utilisateur.findById(req.utilisateurId).populate("roles", "-__v");

        console.log(utilisateur);

        if (!utilisateur) {
            return res.status(404).send({ message: "Utilisateur non trouvé !" });
        }

        const roles = await RoleUtilisateur.find({
            _id: { $in: utilisateur.roles }
        }).exec();

        for (let i = 0; i < roles.length; i++) {
            if (roles[i].role === role) {
                next();
                return;
            }
        }

        res.status(403).send({ message: `Nécessite un rôle de ${role.toLowerCase()} !` });
    } catch (err) {
        res.status(500).send({ message: err });
    }
};

const isUtilisateur = (req, res, next) => {
    checkRole(req, res, next, "ROLE_USER");
};

const isMecanicien = (req, res, next) => {
    checkRole(req, res, next, "ROLE_MECANICIEN");
};

const isManager = (req, res, next) => {
    checkRole(req, res, next, "ROLE_MANAGER");
};

const verifyJwt = {
    verifyToken,
    isUtilisateur,
    isMecanicien,
    isManager
};

module.exports = verifyJwt;
