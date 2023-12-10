const ExcessiveEmissionService = require("../services/ExcessiveEmissionService.js");
const ConcentrationService = require("../services/ConcentrationService.js");

const formatter = Intl.NumberFormat('en');

async function getExcessiveEmission(req, res) {
    const { id } = req.params;
    try {
        const excessive_emission= await ExcessiveEmissionService.getExcessiveEmissionWithName(id);
        res.render(`pages/excessiveEmissions/excessiveEmissions`, {
            ...excessive_emission,
            z: formatter.format(excessive_emission.z)
        });
    } catch (error) {
        res.render("pages/error", { error });
    }
}

async function getExcessiveEmissionMass(req, res) {
    const { id } = req.params;
    try {
        const concentration = await ConcentrationService.getConcentration(id);
        const excessive_emission= await ExcessiveEmissionService.getExcessiveEmissionWithName(id);
        res.render("pages/excessiveEmissions/calculate_mass", {
            excessive_emission,
            mass: excessive_emission.mass,
            povi: concentration.concentration_value,
            povn: 200,
            qv: 20,
            t: 1000
        });
    } catch (error) {
        res.render("pages/error", { error });
    }
}

async function calculateExcessiveEmissionMass(req, res) {
    const { id, mass, povi, povn, qv, t } = req.body;
    try {
        const excessive_emission= await ExcessiveEmissionService.getExcessiveEmissionWithName(id);
        const mass = 3.6 * Math.pow(10, -6) * povi * povn * qv * t; 
        const updatedExcessiveEmission = await ExcessiveEmissionService.updateExcessiveEmission({
            concentration_id: id,
            mass,
            a: excessive_emission.a, kt: excessive_emission.kt, kzi: excessive_emission.kzi, z: excessive_emission.z
         }, id);
        res.render("pages/excessiveEmissions/calculate_mass", {
            excessive_emission,
            mass, povi, povn, qv, t,
        });
    } catch (error) {
        res.render("pages/error", { error });
    }
}

async function getExcessiveEmissionA(req, res) {
    const { id } = req.params;
    try {
        const excessive_emission= await ExcessiveEmissionService.getExcessiveEmissionWithName(id);
        res.render("pages/excessiveEmissions/calculate_a", {
            excessive_emission,
            a: excessive_emission.a,
            gdk: 0.04
        });
    } catch (error) {
        res.render("pages/error", { error });
    }
}

async function calculateExcessiveEmissionA(req, res) {
    const { id, a, gdk } = req.body;
    try {
        const excessive_emission= await ExcessiveEmissionService.getExcessiveEmissionWithName(id);
        let a = 1 / gdk;
        if (gdk > 1) {
            a = 10 / gdk;
        }
        const updatedExcessiveEmission = await ExcessiveEmissionService.updateExcessiveEmission({
            concentration_id: id,
            mass: excessive_emission.mass,
            a,
            kt: excessive_emission.kt,
            kzi: excessive_emission.kzi,
            z: excessive_emission.z
        }, id);
        res.render("pages/excessiveEmissions/calculate_a", {
            excessive_emission,
            a,
            gdk
        });
    } catch (error) {
        res.render("pages/error", { error });
    }
}

async function getExcessiveEmissionKt(req, res) {
    const { id } = req.params;
    try {
        const excessive_emission= await ExcessiveEmissionService.getExcessiveEmissionWithName(id);
        res.render("pages/excessiveEmissions/calculate_kt", {
            excessive_emission,
            knas: 1.35,
            kf: 1.25,
            kt: excessive_emission.kt
        });
    } catch (error) {
        res.render("pages/error", { error });
    }
}

async function calculateExcessiveEmissionKt(req, res) {
    const { id, knas, kf, kt} = req.body;
    try {
        const excessive_emission= await ExcessiveEmissionService.getExcessiveEmissionWithName(id);
        const kt = knas * kf;
        const updatedExcessiveEmission = await ExcessiveEmissionService.updateExcessiveEmission({
            concentration_id: id,
            mass: excessive_emission.mass,
            a: excessive_emission.a,
            kt,
            kzi: excessive_emission.kzi,
            z: excessive_emission.z
        }, id);
        res.render("pages/excessiveEmissions/calculate_kt", {
            excessive_emission,
            knas,
            kf,
            kt
        });
    } catch (error) {
        res.render("pages/error", { error });
    }
}

async function getExcessiveEmissionKzi(req, res) {
    const { id } = req.params;
    try {
        const concentration = await ConcentrationService.getConcentration(id);
        const excessive_emission= await ExcessiveEmissionService.getExcessiveEmissionWithName(id);
        res.render("pages/excessiveEmissions/calculate_kzi", {
            excessive_emission,
            povi: concentration.concentration_value,
            gdk: 0.04,
            kzi: excessive_emission.kzi
        });
    } catch (error) {
        res.render("pages/error", { error });
    }
}

async function calculateExcessiveEmissionKzi(req, res) {
    const { id, povi, gdk, kzi } = req.body;
    try {
        const excessive_emission= await ExcessiveEmissionService.getExcessiveEmissionWithName(id);
        let kzi = povi / gdk;
        if (gdk > povi) {
            kzi = 1;
        }
        const updatedExcessiveEmission = await ExcessiveEmissionService.updateExcessiveEmission({
            concentration_id: id,
            mass: excessive_emission.mass,
            a: excessive_emission.a,
            kt: excessive_emission.kt,
            kzi,
            z: excessive_emission.z
        }, id);
        res.render("pages/excessiveEmissions/calculate_kzi", {
            excessive_emission, povi, gdk, kzi
        });
    } catch (error) {
        res.render("pages/error", { error });
    }
}

async function getExcessiveEmissionZ(req, res) {
    const { id } = req.params;
    try {
        const excessive_emission= await ExcessiveEmissionService.getExcessiveEmissionWithName(id);
        res.render("pages/excessiveEmissions/calculate_z", {
            excessive_emission,
            mass: excessive_emission.mass,
            p: 6700,
            a: excessive_emission.a,
            kt: excessive_emission.kt,
            kzi: excessive_emission.kzi,
            z: formatter.format(excessive_emission.z)
        });
    } catch (error) {
        res.render("pages/error", { error });
    }
}

async function calculateExcessiveEmissionZ(req, res) {
    const { id, mass, p, a, kt, kzi, z } = req.body;
    try {
        const excessive_emission= await ExcessiveEmissionService.getExcessiveEmissionWithName(id);
        const z = mass * 1.1 * p * a * kt * kzi;
        const updatedExcessiveEmission = await ExcessiveEmissionService.updateExcessiveEmission({
            concentration_id: id,
            mass: excessive_emission.mass,
            a: excessive_emission.a,
            kt: excessive_emission.kt,
            kzi: excessive_emission.kzi,
            z
        }, id);
        res.render("pages/excessiveEmissions/calculate_z", {
            excessive_emission, mass, p, a, kt, kzi, z: formatter.format(z)
        });
    } catch (error) {
        res.render("pages/error", { error });
    }
}

module.exports = {
    getExcessiveEmission,
    getExcessiveEmissionMass,
    calculateExcessiveEmissionMass,
    getExcessiveEmissionA,
    calculateExcessiveEmissionA,
    getExcessiveEmissionKt,
    calculateExcessiveEmissionKt,
    getExcessiveEmissionKzi,
    calculateExcessiveEmissionKzi,
    getExcessiveEmissionZ,
    calculateExcessiveEmissionZ
}