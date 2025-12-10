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

const sexSwitch = document.getElementById('sexSwitch');
const sexKnob = document.getElementById('sexKnob');
const sexInput = document.getElementById('sex');

let isMale = true;

sexSwitch?.addEventListener('click', () => {
    isMale = !isMale;

    if (isMale) {
        sexKnob.style.left = '0.25rem';
        sexKnob.classList.replace('bg-pink-500', 'bg-blue-500');
        sexInput.value = 'M';
    } else {
        sexKnob.style.left = 'calc(100% - 2.25rem)';
        sexKnob.classList.replace('bg-blue-500', 'bg-pink-500');
        sexInput.value = 'F';
    }
});

