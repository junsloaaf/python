// Membuat model sederhana: y = a*x + b
const model = tf.sequential();
model.add(tf.layers.dense({units: 1, inputShape: [1]}));
model.compile({loss: 'meanSquaredError', optimizer: 'sgd'});

// Data contoh (input dan label)
const xs = tf.tensor1d([1, 2, 3, 4]);
const ys = tf.tensor1d([1, 3, 5, 7]);  // misal linear: y = 2x - 1

document.getElementById('train').addEventListener('click', async () => {
  await model.fit(xs, ys, {epochs: 100});
  document.getElementById('output').innerText = 'Model sudah dilatih';
});

document.getElementById('predict').addEventListener('click', () => {
  const input = tf.tensor1d([5]);
  const output = model.predict(input);
  output.array().then(arr => {
    document.getElementById('output').innerText = `Prediksi untuk 5: ${arr[0]}`;
  });
});
