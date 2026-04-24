const query = `[out:json][timeout:25];(node["amenity"="hospital"](around:5000,12.9716,77.5946););out center body;`;

const servers = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter'
];

async function test() {
  for (const url of servers) {
    try {
      const res = await fetch(url, {
        method: 'POST',
        body: 'data=' + encodeURIComponent(query),
        headers: { 
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json'
        }
      });
      console.log(url, res.status);
      if (res.ok) {
        const data = await res.json();
        console.log('Results:', data.elements.length);
      } else {
        const text = await res.text();
        console.log('Error text:', text.substring(0, 100));
      }
    } catch (e) {
      console.log(url, 'Error', e.message);
    }
  }
}
test();
