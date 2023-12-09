const ConcentrationService = require("../services/ConcentrationService.js");
const EmergenceService = require("../services/EmergenceService.js");
const formatter = Intl.NumberFormat('en');

async function getEmergencies(req, res) {
    const { id } = req.params;
    try {
        const concentration = await ConcentrationService.getConcentrationWithName(id);
        res.render(`pages/emergencies/emergencies`, {
            ...concentration,
        });
    } catch (error) {
        res.render("pages/error", { error });
    }
}

async function getEmergencyAf(req, res) {
    const { id } = req.params;
    
    try {
        const concentration = await ConcentrationService.getConcentrationWithName(id);
        res.render(`pages/emergencies/calculate_af`, {
            ...concentration,
            mi: 0,
            pi: 0,
            ai: 0,
            kt: 0,
            kzi: 0,
            af: 0,
            knas: 1.35,
            kf: 1.25,
            q: concentration.concentration_value,
            gdk1: 0.04,
            gdk2: 0.04
        });
    } catch (error) {
        res.render("pages/error", { error });
    }
}

async function calculateEmergencyAf(req, res) {
    let { id, mi, pi, ai, af, kt, kf, knas, kzi, q, gdk1, gdk2} = req.body;

    try {
        const concentration = await ConcentrationService.getConcentrationWithName(id[0]);
        if (mi && pi && ai && kt && kzi) {
            af = !isNaN(mi * pi * ai * kt * kzi) ? formatter.format(mi * pi * ai * kt * kzi) : af;
        }
        if (knas && kf)
            kt = !isNaN(knas * kf) ? formatter.format(knas * kf) : kt;
        if (q && gdk1) {
            kzi = !isNaN(q / gdk1) ? formatter.format(q / gdk1) : kzi;
            if (q > gdk1) {
                kzi = 1;
            }
        }
        if (gdk2) {
            ai = !isNaN(1 / gdk2) ? formatter.format(1 / gdk2) : ai;
            if (gdk2 > 1) {
                ai = !isNaN(10 / gdk2) ? formatter.format(10 / gdk2) : ai;
            }  
        }
            
        res.render(`pages/emergencies/calculate_af`, {
            ...concentration,
            mi,
            pi,
            ai,
            af,
            kt,
            kzi,
            af,
            knas,
            kf,
            q,
            gdk1,
            gdk2,
  
        });
    } catch (error) {
        res.render("pages/error", { error });
        console.log(error);
    }
}



module.exports = {
    getEmergencies,
    getEmergencyAf,
    calculateEmergencyAf
}