/* UI Helpers */

function showLoading() {
    loading.classList.remove('hidden');
    submitBtn.disabled = true;
    submitBtn.classList.add('opacity-60');
}

function hideLoading() {
    loading.classList.add('hidden');
    submitBtn.disabled = false;
    submitBtn.classList.remove('opacity-60');
}

function showError(msg) {
    errorBox.textContent = msg;
    errorBox.classList.remove('hidden');
}

function clearUI() {
    errorBox.classList.add('hidden');
    resultSection.classList.add('hidden');
}

/* Sexo Switch */

const sexSwitch = document.getElementById('sexSwitch');
const sexKnob = document.getElementById('sexKnob');
const sexInput = document.getElementById('sex');

let isMale = true;

function updateSexUI() {
    if (isMale) {
        sexKnob.style.transform = 'translateX(0)';
        sexKnob.classList.remove('bg-pink-500');
        sexKnob.classList.add('bg-blue-500');
        sexInput.value = 'M';
    } else {
        sexKnob.style.transform = 'translateX(100%)';
        sexKnob.classList.remove('bg-blue-500');
        sexKnob.classList.add('bg-pink-500');
        sexInput.value = 'F';
    }
}

sexSwitch.addEventListener('click', () => {
    isMale = !isMale;
    updateSexUI();
});

/* Inicializa estado correcto */
updateSexUI();
