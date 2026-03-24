import http from 'http';

http.get('http://localhost:3000/api/master-items', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    console.log("Status:", res.statusCode);
    console.log("Response:", data.substring(0, 300) + '...');
  });
}).on("error", (err) => {
  console.log("Error: " + err.message);
});
