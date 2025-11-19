const subscriptionKey = "YOUR_AZURE_TRANSLATOR_KEY";  // ganti dengan key-mu
const endpoint = "https://api.cognitive.microsofttranslator.com";

const location = "YOUR_RESOURCE_LOCATION"; // misalnya "global" atau lokasi resource mu

async function translateText(text) {
  const url = `${endpoint}/translate?api-version=3.0&from=en&to=id`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Ocp-Apim-Subscription-Key": subscriptionKey,
      "Ocp-Apim-Subscription-Region": location,
      "Content-Type": "application/json"
    },
    body: JSON.stringify([{ Text: text }])
  });

  const data = await response.json();
  // data akan jadi array dengan field translations
  return data[0].translations[0].text;
}

document.getElementById("translateBtn").addEventListener("click", async () => {
  const input = document.getElementById("inputText").value;
  if (!input) {
    document.getElementById("result").innerText = "Tulis sesuatu dulu ya.";
    return;
  }

  try {
    const translated = await translateText(input);
    document.getElementById("result").innerText = translated;
  } catch (err) {
    console.error(err);
    document.getElementById("result").innerText = "Terjadi error saat menerjemahkan.";
  }
});
