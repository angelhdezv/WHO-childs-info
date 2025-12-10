const API_BASE_URL =
    'https://script.google.com/macros/s/AKfycbwlrt_4NNHUF_IdsWjjhbFyF17COMUDRGZxUfbCEgh19Ju7cqKudxJnsCxu9hTcD4Uw8A/exec';

/* Elements */
const form = document.getElementById('growthForm');
const loading = document.getElementById('loading');
const errorBox = document.getElementById('errorBox');

const resultSection = document.getElementById('resultSection');
const mainStatus = document.getElementById('mainStatus');
const percentilEl = document.getElementById('percentil');
const zScoreEl = document.getElementById('zScore');
const zBucketEl = document.getElementById('zBucket');
const marker = document.getElementById('zMarker');

/* Submit */
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    clearUI();
    showLoading();

    try {
        /* Inputs */
        const sex = document.getElementById('sex').value;
        const birthDateValue = document.getElementById('birthDate').value;
        const evalDateValue = document.getElementById('evalDate').value;
        const lengthCm = document.getElementById('lengthCm').value;

        /* Validations */
        if (!birthDateValue || !evalDateValue) {
            throw new Error('Selecciona ambas fechas');
        }

        if (!lengthCm || Number(lengthCm) <= 0) {
            throw new Error('Ingresa una estatura válida');
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

        /* API call */
        const url = `${API_BASE_URL}?sex=${sex}&ageInDays=${ageInDays}&lengthCm=${lengthCm}`;
        const res = await fetch(url);
        const json = await res.json();

        if (json.error) {
            throw new Error(json.error);
        }

        const data = json.data;

        /* UI mappings */
        const interpretationMap = {
            'Normal': {
                text: 'Crecimiento dentro de los parámetros esperados según la OMS',
                color: 'text-green-600'
            },
            'Desnutrición': {
                text: 'Crecimiento por debajo del rango esperado para la edad',
                color: 'text-orange-500'
            },
            'Desnutrición severa': {
                text: 'Crecimiento muy por debajo del rango esperado para la edad',
                color: 'text-red-600'
            },
            'Sobrepeso': {
                // LHFA no usa IMC → reinterpretación OMS
                text: 'Talla alta para la edad según la OMS',
                color: 'text-yellow-600'
            },
            'Obesidad': {
                // Mantenido solo por compatibilidad
                text: 'Talla muy alta para la edad según la OMS',
                color: 'text-red-600'
            }
        };


        /* Main status */
        const status = interpretationMap[data.interpretation];
        mainStatus.textContent = status.text;
        mainStatus.className = `text-center text-base font-medium ${status.color}`;

        /* Numerical values */
        percentilEl.textContent = data.percentil;
        zScoreEl.textContent = data.zScore;
        zBucketEl.textContent = data.zBucket;

        /* Marker position (0–100%) */
        const position = zScoreToPercent(data.zScore);
        marker.style.left = `clamp(0%, ${position}%, 100%)`;


        resultSection.classList.remove('hidden');
        zBucketEl.classList.add('hidden')
    } catch (err) {
        showError(err.message || 'Error al calcular');
    } finally {
        hideLoading();
    }
});

/* Helpers */

function calculateAgeInDays(birthDate, evalDate) {
    const msPerDay = 1000 * 60 * 60 * 24;
    return Math.floor((evalDate - birthDate) / msPerDay);
}

/**
 * Maps z-score (-4 to +4) to percentage (0%–100%)
 * Marker is centered via CSS (translateX(-50%))
 */
function zScoreToPercent(z) {
    // Anchos reales de la barra
    const segments = [
        { min: -Infinity, max: -3, start: 0, width: 15 },   // Desnut. severa
        { min: -3, max: -2, start: 15, width: 15 },         // Desnutrición
        { min: -2, max: 2, start: 30, width: 40 },          // Normal
        { min: 2, max: 4, start: 70, width: 30 }     // Talla alta
    ];

    const segment = segments.find(s => z >= s.min && z <= s.max);

    const clampedZ = Math.min(segment.max, Math.max(segment.min, z));
    const ratio = (clampedZ - segment.min) / (segment.max - segment.min);

    return segment.start + ratio * segment.width;
}
