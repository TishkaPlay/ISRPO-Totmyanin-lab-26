document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('currencyForm');
    const amountInput = document.getElementById('amount');
    const fromSelect = document.getElementById('fromCurrency');
    const toSelect = document.getElementById('toCurrency');
    const resultBox = document.getElementById('result');
    const resultText = document.getElementById('resultText');
    const errorMsg = document.getElementById('errorMsg');

    //используем бесплатный открытый API (не требует ключа)
    const API_URL = "https://open.er-api.com/v6/latest/USD";

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        errorMsg.classList.add('hidden');
        resultBox.classList.add('hidden');

        const amount = parseFloat(amountInput.value);
        const from = fromSelect.value;
        const to = toSelect.value;

        //валидация
        if (!amount || amount <= 0) {
            errorMsg.textContent = "⚠ Введите корректную сумму больше 0";
            errorMsg.classList.remove('hidden');
            return;
        }

        try {
            //Fetch запрос
            const res = await fetch(API_URL);
            if (!res.ok) throw new Error("Ошибка загрузки курсов");
            
            const data = await res.json();
            const rates = data.rates;

            //логика конвертации
            const converted = (amount / rates[from]) * rates[to];
            
            resultText.textContent = `${amount} ${from} = ${converted.toFixed(2)} ${to}`;
            resultBox.classList.remove('hidden');
        } catch (err) {
            errorMsg.textContent = "❌ Не удалось получить данные. Проверьте интернет.";
            errorMsg.classList.remove('hidden');
            console.error(err);
        }
    });
});