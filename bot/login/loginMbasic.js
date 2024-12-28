// loginMbasic.js

const axios = require('axios');
const qs = require('qs');

// Définir l'URL de base pour les requêtes
const BASE_URL = 'https://www.facebook.com'; // Mise à jour de l'URL

// Fonction pour effectuer la connexion
async function login(email, password) {
  try {
    // Obtenir la page de connexion pour récupérer les cookies et les tokens nécessaires
    const response = await axios.get(`${BASE_URL}/login`);
    const cookies = response.headers['set-cookie'];
    const fbDtsg = extractFbDtsg(response.data);
    const jazoest = extractJazoest(response.data);

    // Préparer les données de connexion
    const data = qs.stringify({
      email,
      pass: password,
      fb_dtsg: fbDtsg,
      jazoest,
      login: 'Se connecter',
    });

    // Configurer les en-têtes pour la requête POST
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
      Cookie: cookies.join('; '),
    };

    // Envoyer la requête de connexion
    const loginResponse = await axios.post(`${BASE_URL}/login/device-based/regular/login/`, data, { headers });

    // Vérifier si la connexion a réussi
    if (loginResponse.data.includes('home_icon')) {
      console.log('Connexion réussie');
    } else {
      console.log('Échec de la connexion');
    }
  } catch (error) {
    console.error('Erreur lors de la tentative de connexion :', error);
  }
}

// Fonctions auxiliaires pour extraire fb_dtsg et jazoest du HTML
function extractFbDtsg(html) {
  const match = html.match(/name="fb_dtsg" value="([^"]+)"/);
  return match ? match[1] : null;
}

function extractJazoest(html) {
  const match = html.match(/name="jazoest" value="([^"]+)"/);
  return match ? match[1] : null;
}

module.exports = login;
