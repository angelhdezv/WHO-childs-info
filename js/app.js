const API_BASE_URL = 'https://script.google.com/macros/s/AKfycbwlrt_4NNHUF_IdsWjjhbFyF17COMUDRGZxUfbCEgh19Ju7cqKudxJnsCxu9hTcD4Uw8A/exec';

const form = document.getElementById('growthForm');
const loading = document.getElementById('loading');
const submitBtn = document.getElementById('submitBtn');
const errorBox = document.getElementById('errorBox');

const resultSection = document.getElementById('resultSection');
const mainStatus = document.getElementById('mainStatus');
const percentilEl = document.getElementById('percentil');
const zScoreEl = document.getElementById('zScore');
const zBucketEl = document.getElementById('zBucket');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    clearUI();
    showLoading();

    const sex = document.getElementById('sex').value;

    const birthDateValue = document.getElementById('birthDate').value;
    const evalDateValue = document.getElementById('evalDate').value;

    if (!birthDateValue || !evalDateValue) {
        throw new Error('Selecciona ambas fechas');
    }

    const birthDate = new Date(birthDateValue);
    const evalDate = new Date(evalDateValue);

    if (evalDate < birthDate) {
        throw new Error('La fecha de evaluación no puede ser menor a la de nacimiento');
    }

    const ageInDays = calculateAgeInDays(birthDate, evalDate);

    if (ageInDays > 1856) {
        throw new Error('La edad excede el rango OMS (0–5 años)');
    }

    const lengthCm = document.getElementById('lengthCm').value;

    try {
        const url = `${API_BASE_URL}?sex=${sex}&ageInDays=${ageInDays}&lengthCm=${lengthCm}`;
        const res = await fetch(url);
        const json = await res.json();

        if (json.error) throw new Error(json.error);

        const data = json.data;

        mainStatus.textContent = `Crecimiento ${data.interpretation}`;
        mainStatus.className =
            data.interpretation === 'Normal'
                ? 'text-center text-lg font-semibold text-green-600'
                : 'text-center text-lg font-semibold text-orange-500';

        percentilEl.textContent = data.percentil;
        zScoreEl.textContent = data.zScore;
        zBucketEl.textContent = data.zBucket;

        resultSection.classList.remove('hidden');

    } catch (err) {
        showError(err.message || 'Error al calcular');
    } finally {
        hideLoading();
    }
});

function calculateAgeInDays(birthDate, evalDate) {
    const msPerDay = 1000 * 60 * 60 * 24;
    return Math.floor((evalDate - birthDate) / msPerDay);
}
