const ConcentrationService = require("../services/ConcentrationService.js");
const RiskService = require("../services/RiskService.js");

async function getRisk(req, res) {
    const { id } = req.params;
    try {
        const risk = await RiskService.getRiskWithName(id);
        res.render(`pages/risks/risks`, {
            risk
        });
    } catch (error) {
        res.render("pages/error", { error });
    }
}

async function getRiskAddLadd(req, res) {
    const { id } = req.params;
    try {
        const risk = await RiskService.getRiskWithName(id);
        res.render("pages/risks/calculate_add_ladd", {
            risk,
            ca: risk.concentration_value,
            ch: risk.concentration_value,
            tout: 8,
            tin: 16,
            vout: 1.4,
            vin: 0.63,
            ef: 350,
            ed: 30,
            bw: 70,
            at: 70,
            add_ladd: risk.add_ladd
        });
    } catch (error) {
        res.render("pages/error", { error });
    }
}

async function calculateRiskAddLadd(req, res) {
    const { id, ca, ch, tout, tin, vout, vin, ef, ed, bw, at, add_ladd } = req.body;
    try {
        const risk = await RiskService.getRiskWithName(id);
        const add_ladd = (((ca * tout * vout) + (ch * tin * vin)) * ef * ed) / (bw * at * 365);
        const updatedRisk = await RiskService.updateRisk({
            concentration_id: id,
            add_ladd,
            cr: risk.cr, pcr: risk.pcr, hq: risk.hq,
         }, id);
        res.render("pages/risks/calculate_add_ladd", {
            risk,
            ca, ch, tout, tin, vout, vin, ef, ed, bw, at, add_ladd,
        });
    } catch (error) {
        res.render("pages/error", { error });
    }
}

async function getRiskCr(req, res) {
    const { id } = req.params;
    try {
        const risk = await RiskService.getRiskWithName(id);
        res.render("pages/risks/calculate_cr", {
            risk,
            cr: risk.cr,
            sf: 3.2
        });
    } catch (error) {
        res.render("pages/error", { error });
    }
}

async function calculateRiskCr(req, res) {
    const { id, add_ladd, sf, cr } = req.body;
    try {
        const risk = await RiskService.getRiskWithName(id);
        const cr = add_ladd * sf;
        const updatedRisk = await RiskService.updateRisk({
            concentration_id: id,
            add_ladd: risk.add_ladd,
            cr,
            pcr: risk.pcr,
            hq: risk.hq
        }, id);
        res.render("pages/risks/calculate_cr", {
            risk,
            cr,
            sf
        });
    } catch (error) {
        res.render("pages/error", { error });
    }
}

async function getRiskPcr(req, res) {
    const { id } = req.params;
    try {
        const risk = await RiskService.getRiskWithName(id);
        res.render("pages/risks/calculate_pcr", {
            risk,
            pop: 270000,
            pcr: risk.pcr
        });
    } catch (error) {
        res.render("pages/error", { error });
    }
}

async function calculateRiskPcr(req, res) {
    const { id, cr, pop, pcr } = req.body;
    try {
        const risk = await RiskService.getRiskWithName(id);
        const pcr = cr * pop;
        const updatedRisk = await RiskService.updateRisk({
            concentration_id: id,
            add_ladd: risk.add_ladd,
            sf: risk.sf,
            cr: risk.cr,
            pcr,
            hq: risk.hq
        }, id);
        res.render("pages/risks/calculate_pcr", {
            risk,
            pop,
            pcr
        });
    } catch (error) {
        res.render("pages/error", { error });
    }
}

async function getRiskHq(req, res) {
    const { id } = req.params;
    try {
        const risk = await RiskService.getRiskWithName(id);
        res.render("pages/risks/calculate_hq", {
            risk,
            rfc: 0.04,
            hq: risk.hq
        });
    } catch (error) {
        res.render("pages/error", { error });
    }
}

async function calculateRiskHq(req, res) {
    const { id, c, rfc, hq } = req.body;
    try {
        const risk = await RiskService.getRiskWithName(id);
        const hq = c * rfc;
        const updatedRisk = await RiskService.updateRisk({
            concentration_id: id,
            add_ladd: risk.add_ladd,
            sf: risk.sf,
            cr: risk.cr,
            pcr: risk.pcr,
            hq
        }, id);
        res.render("pages/risks/calculate_hq", {
            risk,
            rfc,
            hq
        });
    } catch (error) {
        res.render("pages/error", { error });
    }
}

module.exports = {
    getRisk,
    getRiskAddLadd,
    calculateRiskAddLadd,
    getRiskCr,
    calculateRiskCr,
    getRiskPcr,
    calculateRiskPcr,
    getRiskHq,
    calculateRiskHq
}