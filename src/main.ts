import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import './assets/main.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// Ajout d'une sécurité globale contre les pages blanches en cas d'erreur de cache ou de chargement
window.addEventListener('error', (e) => {
    if (e.message && (e.message.includes('Failed to fetch dynamically imported') || e.message.includes('Importing a module script failed'))) {
        console.warn('Erreur de chargement détectée (probablement due au cache). Rafraîchissement automatique de la page...')
        window.location.reload()
    }
})

app.config.errorHandler = (err, instance, info) => {
    console.error("Erreur critique capturée par Vue:", err, info)
    // En cas d'erreur fatale au montage, on force aussi un rechargement propre
    if (info === 'render function' || info === 'mounted hook') {
        // Éviter des boucles de rechargement infinies avec sessionStorage
        if (!sessionStorage.getItem('vue_reloaded_once')) {
            sessionStorage.setItem('vue_reloaded_once', 'true')
            window.location.reload()
        }
    }
}

app.mount('#app')