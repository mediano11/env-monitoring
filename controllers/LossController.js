const LossService = require("../services/LossService.js");
const ConcentrationService = require("../services/ConcentrationService.js");

async function getLoss(req, res) {
    const { id } = req.params;
    try {
        const loss = await LossService.getLossWithName(id);
        res.render(`pages/losses/losses`, {
            loss
        });
    } catch (error) {
        res.render("pages/error", { error });
    }
}

async function getLossMass(req, res) {
    const { id } = req.params;
    try {
        const concentration = await ConcentrationService.getConcentration(id);
        const loss = await LossService.getLossWithName(id);
        res.render("pages/losses/calculate_mass", {
            loss,
            mass: loss.mass,
            povi: concentration.concentration_value,
            povn: 200,
            qv: 300,
            t: 6000
        });
    } catch (error) {
        res.render("pages/error", { error });
    }
}

async function calculateLossMass(req, res) {
    const { id, mass, povi, povn, qv, t } = req.body;
    try {
        const loss = await LossService.getLossWithName(id);
        const mass = 3.6 * Math.pow(10, -6) * povi * povn * qv * t; 
        const updatedLoss = await LossService.updateLoss({
            concentration_id: id,
            mass,
            a: loss.a, kt: loss.kt, kzi: loss.kzi, z: loss.z
         }, id);
        res.render("pages/losses/calculate_mass", {
            loss,
            mass, povi, povn, qv, t,
        });
    } catch (error) {
        res.render("pages/error", { error });
    }
}

async function getLossA(req, res) {
    const { id } = req.params;
    try {
        const loss = await LossService.getLossWithName(id);
        res.render("pages/losses/calculate_a", {
            loss,
            a: loss.a,
            gdk: 0.04
        });
    } catch (error) {
        res.render("pages/error", { error });
    }
}

async function calculateLossA(req, res) {
    const { id, a, gdk } = req.body;
    try {
        const loss = await LossService.getLossWithName(id);
        let a = 1 / gdk;
        if (gdk > 1) {
            a = 10 / gdk;
        }
        const updatedLoss = await LossService.updateLoss({
            concentration_id: id,
            mass: loss.mass,
            a,
            kt: loss.kt,
            kzi: loss.kzi,
            z: loss.z
        }, id);
        res.render("pages/losses/calculate_a", {
            loss,
            a,
            gdk
        });
    } catch (error) {
        res.render("pages/error", { error });
    }
}

async function getLossKt(req, res) {
    const { id } = req.params;
    try {
        const loss = await LossService.getLossWithName(id);
        res.render("pages/losses/calculate_kt", {
            loss,
            knas: 1.35,
            kf: 1.25,
            kt: loss.kt
        });
    } catch (error) {
        res.render("pages/error", { error });
    }
}

async function calculateLossKt(req, res) {
    const { id, knas, kf, kt} = req.body;
    try {
        const loss = await LossService.getLossWithName(id);
        const kt = knas * kf;
        const updatedLoss = await LossService.updateLoss({
            concentration_id: id,
            mass: loss.mass,
            a: loss.a,
            kt,
            kzi: loss.kzi,
            z: loss.z
        }, id);
        res.render("pages/losses/calculate_kt", {
            loss,
            knas,
            kf,
            kt
        });
    } catch (error) {
        res.render("pages/error", { error });
    }
}

async function getLossKzi(req, res) {
    const { id } = req.params;
    try {
        const concentration = await ConcentrationService.getConcentration(id);
        const loss = await LossService.getLossWithName(id);
        res.render("pages/losses/calculate_kzi", {
            loss,
            povi: concentration.concentration_value,
            gdk: 0.04,
            kzi: loss.kzi
        });
    } catch (error) {
        res.render("pages/error", { error });
    }
}

async function calculateLossKzi(req, res) {
    const { id, povi, gdk, kzi } = req.body;
    try {
        const loss = await LossService.getLossWithName(id);
        let kzi = povi / gdk;
        if (gdk > povi) {
            kzi = 1;
        }
        const updatedLoss = await LossService.updateLoss({
            concentration_id: id,
            mass: loss.mass,
            a: loss.a,
            kt: loss.kt,
            kzi,
            z: loss.z
        }, id);
        res.render("pages/losses/calculate_kzi", {
            loss, povi, gdk, kzi
        });
    } catch (error) {
        res.render("pages/error", { error });
    }
}

async function getLossZ(req, res) {
    const { id } = req.params;
    try {
        const loss = await LossService.getLossWithName(id);
        res.render("pages/losses/calculate_z", {
            loss,
            mass: loss.mass,
            p: 6700,
            a: loss.a,
            kt: loss.kt,
            kzi: loss.kzi,
            z: loss.z
        });
    } catch (error) {
        res.render("pages/error", { error });
    }
}

async function calculateLossZ(req, res) {
    const { id, mass, p, a, kt, kzi, z } = req.body;
    try {
        const loss = await LossService.getLossWithName(id);
        const z = mass * 1.1 * p * a * kt * kzi;
        const updatedLoss = await LossService.updateLoss({
            concentration_id: id,
            mass: loss.mass,
            a: loss.a,
            kt: loss.kt,
            kzi: loss.kzi,
            z
        }, id);
        res.render("pages/losses/calculate_z", {
            loss, mass, p, a, kt, kzi, z
        });
    } catch (error) {
        res.render("pages/error", { error });
    }
}

module.exports = {
    getLoss,
    getLossMass,
    calculateLossMass,
    getLossA,
    calculateLossA,
    getLossKt,
    calculateLossKt,
    getLossKzi,
    calculateLossKzi,
    getLossZ,
    calculateLossZ
}