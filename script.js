// Function to perform calculations and update the result
function calculateAndUpdateResult() {
    // User inputs
    const n1 = parseFloat(document.getElementById('n1').value);
    const n2 = parseFloat(document.getElementById('n2').value);
    const AUC0 = parseFloat(document.getElementById('AUC0').value);
    const AUC1 = parseFloat(document.getElementById('AUC1').value);
    const alpha = parseFloat(document.getElementById('alpha').value);

    // Calculations
    const Q1 = AUC1 / (2 - AUC1);
    const Q2 = 2 * AUC1 ** 2 / (1 + AUC1);
    const SE_AUC = Math.sqrt((AUC1 * (1 - AUC1) + (n1 - 1) * (Q1 - AUC1 ** 2) + (n2 - 1) * (Q2 - AUC1 ** 2)) / (n1 * n2));
    const z = (AUC1 - AUC0) / SE_AUC;
    const power = normCdf(z - normPpf(1 - alpha));

    // Display result
    document.getElementById('result').textContent = `Calculated power: ${power.toFixed(4)}`;
}

document.addEventListener('DOMContentLoaded', function() {
    // Initially calculate and update result
    calculateAndUpdateResult();

    // Add event listeners to each input field to recalculate when their values change
    document.getElementById('n1').addEventListener('input', calculateAndUpdateResult);
    document.getElementById('n2').addEventListener('input', calculateAndUpdateResult);
    document.getElementById('AUC0').addEventListener('input', calculateAndUpdateResult);
    document.getElementById('AUC1').addEventListener('input', calculateAndUpdateResult);
    document.getElementById('alpha').addEventListener('input', calculateAndUpdateResult);
});

// The erf, normCdf, and normPpf functions remain unchanged


// The erf, normCdf, and normPpf functions remain unchanged
function erf(x) {
    // constants
    const a1 =  0.254829592;
    const a2 = -0.284496736;
    const a3 =  1.421413741;
    const a4 = -1.453152027;
    const a5 =  1.061405429;
    const p  =  0.3275911;

    // Save the sign of x
    const sign = x >= 0 ? 1 : -1;
    x = Math.abs(x);

    // A&S formula 7.1.26
    const t = 1.0 / (1.0 + p * x);
    const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);

    return sign * y; // erf(-x) = -erf(x);
}

// Now, you can use erf function in your calculations


function normCdf(z) {
    // This implementation should closely replicate Python's scipy.stats.norm.cdf
    // Ensure this function is accurate by verifying against Python's output or consider using a library if precision is critical
    return (1.0 + erf(z / Math.sqrt(2))) / 2.0;
}

function normPpf(p) {
    // Coefficients in rational approximations
    const a = [
        -3.969683028665376e+01, 2.209460984245205e+02,
        -2.759285104469687e+02, 1.383577518672690e+02,
        -3.066479806614716e+01, 2.506628277459239e+00
    ];
    const b = [
        -5.447609879822406e+01, 1.615858368580409e+02,
        -1.556989798598866e+02, 6.680131188771972e+01,
        -1.328068155288572e+01
    ];
    const c = [
        -7.784894002430293e-03, -3.223964580411365e-01,
        -2.400758277161838e+00, -2.549732539343734e+00,
        4.374664141464968e+00, 2.938163982698783e+00
    ];
    const d = [
        7.784695709041462e-03, 3.224671290700398e-01,
        2.445134137142996e+00, 3.754408661907416e+00
    ];

    // Define break-points.
    const pLow = 0.02425;
    const pHigh = 1 - pLow;

    // Rational approximation for lower region
    if (p < pLow) {
        const q = Math.sqrt(-2 * Math.log(p));
        return (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) /
            ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
    }

    // Rational approximation for upper region
    if (p > pHigh) {
        const q = Math.sqrt(-2 * Math.log(1 - p));
        return -(((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) /
            ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
    }

    // Rational approximation for central region
    if (p >= pLow && p <= pHigh) {
        const q = p - 0.5;
        const r = q * q;
        return (((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q /
            (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1);
    }
}