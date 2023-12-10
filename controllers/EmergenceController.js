const ConcentrationService = require("../services/ConcentrationService.js");
const EmergenceService = require("../services/EmergenceService.js");
const formatter = Intl.NumberFormat('en');

function calculateSum(value, from, n) {
    let sum = 0;

    for (let i = from; i <= n; i++) {
        sum += value;
    }

    return sum;
}

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
    let { id, mi, pi, ai, af, kt, kf, knas, kzi, q, gdk1, gdk2, btn } = req.body;
    try {
        const concentration = await ConcentrationService.getConcentrationWithName(id[0]);
        if (btn === 'calcAf') {
            af = !isNaN(mi * pi * ai * kt * kzi) ? formatter.format(mi * pi * ai * kt * kzi) : af;
        }
        if (btn === 'calcKt')
            kt = !isNaN(knas * kf) ? formatter.format(knas * kf) : kt;
        if (btn === 'calcKzi') {
            kzi = !isNaN(q / gdk1) ? formatter.format(q / gdk1) : kzi;
            if (q > gdk1) {
                kzi = 1;
            }
        }
        if (btn === 'calcAi') {
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
            const sum = calculateSum(0.003 * ai * n, 10, m)
            zns = !isNaN(v * t * ssf * sd * sum * h * Math.pow(10, -3)) ? formatter.format(v * t * ssf * sd * sum * h * Math.pow(10, -3)) : zns;
        }
        if (gdk) {
            ai = !isNaN(1 / gdk) ? formatter.format(1 / gdk) : ai;
            if (gdk > 1) {
                ai = !isNaN(10 / gdk) ? formatter.format(10 / gdk) : ai;
            }  
        }
        res.render(`pages/emergencies/calculate_zns`, {
            ...concentration,
            v, t, ssf, sd, ai, gdk, n, h, m, zns
        });
    } catch (error) {
        res.render("pages/error", { error });
    }
}

async function getEmergencyMr(req, res) {
    const { id } = req.params;
    
    try {
        const concentration = await ConcentrationService.getConcentrationWithName(id);
        
        res.render(`pages/emergencies/calculate_mr`, {
            ...concentration,
            fv: 0, fg: 0, pr: 0, prs: 0, sn: 0, mdg: 0, 
            mr: 0, pi: 0, ka: 0, n: 0, lv: 0,
            pi1: 0, ka1: 0, n1: 0, lv1: 0,
        });
    } catch (error) {
        res.render("pages/error", { error });
    }
}

async function calculateEmergencyMr(req, res) {
    let { id, fv, fg, pr, prs, sn, mdg, mr, pi, ka, n, lv, pi1, ka1, n1, lv1} = req.body;

    try {
        const concentration = await ConcentrationService.getConcentrationWithName(id[0]);
        if (fv && fg && pr && prs && sn && mdg) {
            const res = +fv + +fg + +pr + +prs + +sn + +mdg;
            mr = !isNaN(res) ? formatter.format(res) : mr;
        }
        if (pi && ka && n && lv) {
            const sum1 = calculateSum(pi * ka, 1, n);
            fv = !isNaN(sum1 - lv) ? sum1 - lv : fv;
        }
        if (pi1 && ka1 && n1 && lv1) {
            const sum2 = calculateSum(pi1 * ka1, 1, n1);
            fg = !isNaN(sum2 - lv1) ? sum2 - lv1 : fg;
        }
        res.render(`pages/emergencies/calculate_mr`, {
            ...concentration,
            fv, fg, pr, prs, sn, mdg, mr, pi, ka, n, lv, pi1, ka1, n1, lv1
        });
    } catch (error) {
        res.render("pages/error", { error });
    }
}

async function getEmergencyNr(req, res) {
    const { id } = req.params;
    
    try {
        const concentration = await ConcentrationService.getConcentrationWithName(id);
        
        res.render(`pages/emergencies/calculate_nr`, {
            ...concentration,
            vtrr: 0, vdp: 0, vvtg: 0, nr: 0, ml: 0, mt: 0, mi: 0, mz: 0
        });
    } catch (error) {
        res.render("pages/error", { error });
    }
}

async function calculateEmergencyNr(req, res) {
    let { id, vtrr, vdp, vvtg, nr, ml, mt, mi, mz} = req.body;

    try {
        const concentration = await ConcentrationService.getConcentrationWithName(id[0]);
        if (vtrr && vdp && vvtg) {
            const res = +vtrr + +vvtg + +vdp;
            nr = !isNaN(res) ? formatter.format(res) : nr;
        }
        if (ml && mt && mi && mz) {
            const res = 0.28 * ml + 6.5 * mt + 37 * mi + 47 * mz;
            vtrr = !isNaN(res) ? formatter.format(res) : vtrr;
        }
        res.render(`pages/emergencies/calculate_nr`, {
            ...concentration,
            vtrr, vdp, vvtg, nr, ml, mt, mi, mz
        });
    } catch (error) {
        res.render("pages/error", { error });
    }
}


async function getEmergencyZf(req, res) {
    const { id } = req.params;
    
    try {
        const concentration = await ConcentrationService.getConcentrationWithName(id);
        
        res.render(`pages/emergencies/calculate_zf`, {
            ...concentration,
            yn: 0, n: 17, m: 0, l: 0, zf: 0
        });
    } catch (error) {
        res.render("pages/error", { error });
    }
}

async function calculateEmergencyZf(req, res) {
    let { id, yn, n, m, l, zf} = req.body;

    try {
        const concentration = await ConcentrationService.getConcentrationWithName(id[0]);
        if (yn && n && m && l) {
            const res = yn * n * m * l;
            zf = !isNaN(res) ? formatter.format(res) : zf;
        }
        res.render(`pages/emergencies/calculate_zf`, {
            ...concentration,
            yn, n, m, l, zf
        });
    } catch (error) {
        res.render("pages/error", { error });
    }
}


async function getEmergencyTotal(req, res) {
    const { id } = req.params;
    
    try {
        const concentration = await ConcentrationService.getConcentrationWithName(id);
        
        res.render(`pages/emergencies/calculate_total`, {
            ...concentration,
            nr: 0, mr: 0, mp: 0, rsg: 0, mtv: 0, rlg: 0, rrg: 0, rrek: 0, rpzf: 0, af: 0, vf: 0, zf: 0, z: 0
        });
    } catch (error) {
        res.render("pages/error", { error });
    }
}

async function calculateEmergencyTotal(req, res) {
    let { id, nr, mr, mp, rsg, mtv, rlg, rrg, rrek, rpzf, af, vf, zf, z } = req.body;

    try {
        const concentration = await ConcentrationService.getConcentrationWithName(id[0]);
        if (nr && mr && mp && rsg && mtv && rlg && rrg && rrek && rpzf && af && vf && zf) {
            const res = +nr + +mr + +mp + +rsg + +mtv + +rlg + +rrg + +rrek + +rpzf + +af + +vf + +zf;
            z = !isNaN(res) ? formatter.format(res) : z;
        }
        
        res.render(`pages/emergencies/calculate_total`, {
            ...concentration,
            nr, mr, mp, rsg, mtv, rlg, rrg, rrek, rpzf, af, vf, zf, z
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
    calculateEmergencyZns,
    getEmergencyMr,
    calculateEmergencyMr,
    getEmergencyNr,
    calculateEmergencyNr,
    getEmergencyZf,
    calculateEmergencyZf,
    getEmergencyTotal,
    calculateEmergencyTotal
}