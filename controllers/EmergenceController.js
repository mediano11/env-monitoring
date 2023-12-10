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
            mi, pi, ai, af, kt, kzi, af, knas, kf, q, gdk1, gdk2,
        });
    } catch (error) {
        res.render("pages/error", { error });
    }
}


async function getEmergencyZns(req, res) {
    const { id } = req.params;
    
    try {
        const concentration = await ConcentrationService.getConcentrationWithName(id);
        
        res.render(`pages/emergencies/calculate_zns`, {
            ...concentration,
            v: 100,
            t: 80,
            ssf: 0,
            sd: concentration.concentration_value,
            ai: 0,
            gdk: concentration.concentration_value,
            n: 17,
            h: 0,
            m: 0,
            zns: 0
    
        });
    } catch (error) {
        res.render("pages/error", { error });
    }
}

async function calculateEmergencyZns(req, res) {
    let { id, v, t, ssf, sd, ai, gdk, n, h, m, zns} = req.body;

    try {
        const concentration = await ConcentrationService.getConcentrationWithName(id[0]);
        if (v && t && ssf && sd && ai, n, h, m) {
            function calculateSum(value, n) {
                let sum = 0;

                for (let i = 10; i <= n; i++) {
                    sum += value;
                }

                return sum;
            }
            const sum = calculateSum(0.003 * ai * n, m)
            zns = !isNaN(v * t * ssf * sd * sum * h * Math.pow(10, -3)) ? formatter.format(v * t * ssf * sd * sum * h * Math.pow(10, -3)) : zns;
        }
        if (gdk) {
            ai = !isNaN(1 / gdk) ? formatter.format(1 / gdk) : ai;
            if (gdk > 1) {
                ai = !isNaN(10 / gdk) ? formatter.format(10 / gdk) : ai;
            }  
        }
        console.log(req.body);
        res.render(`pages/emergencies/calculate_zns`, {
            ...concentration,
            v, t, ssf, sd, ai, gdk, n, h, m, zns
        });
    } catch (error) {
        res.render("pages/error", { error });
    }
}


module.exports = {
    getEmergencies,
    getEmergencyAf,
    calculateEmergencyAf,
    getEmergencyZns,
    calculateEmergencyZns
}