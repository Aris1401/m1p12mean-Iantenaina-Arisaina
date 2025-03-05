const RoleUtilisateur = require("../model/roleUtilisateur");
const Utilisateur = require("../model/utilisateur");

const checkDuplicateEmail = (req, res, next) => {
    // Email
    Utilisateur.findOne({
        email: req.body.email
    }).exec((err, utilisateur) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }

        if (utilisateur) {
            res.status(400).send({ message: "Cet email est déjà utilisé !" });
            return;
        }

        next();
    });
}

const checkRolesExisted = (req, res, next) => {
    if (req.body.roles) {
        for (let i = 0; i < req.body.roles.length; i++) {
            if (!RoleUtilisateur.findOne({ role: req.body.roles[i] })) {
                res.status(400).send({
                    message: `Le rôle ${req.body.roles[i]} n'existe pas !`
                });
                return;
            }
        }
    }

    next();
}

const verifySignUp = {
    checkDuplicateEmail,
    checkRolesExisted
};

module.exports = verifySignUp;