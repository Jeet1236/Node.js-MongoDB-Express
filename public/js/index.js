import { login } from './login.js';
import { displayMap } from './leaflet.js';

const leaflet = document.getElementById('map');
const loginForm = document.querySelector('form');
if (leaflet) {
  const locations = JSON.parse(
    document.getElementById('map').dataset.locations
  );
  displayMap(locations);
}

if (loginForm) {
  console.log('hi');
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    console.log('Hello World');
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });
}
