<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { useMemoryStore } from './stores/memory'

const store = useMemoryStore()
</script>

<template>
  <div class="min-vh-100 d-flex flex-column font-sans bg-pattern">
    <header class="navbar navbar-expand-lg shadow-sm sticky-top mb-4 bg-white">
      <div class="container">
        <RouterLink class="navbar-brand d-flex align-items-center gap-2 fw-bold text-primary" to="/">
          <i class="bi bi-layers-fill" aria-hidden="true"></i> 
          <span>MemoryApp</span>
        </RouterLink>
        
        <button class="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Basculer la navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        
        <nav class="collapse navbar-collapse" id="navbarNav" aria-label="Navigation principale">
          <ul class="navbar-nav me-auto">
            <li class="nav-item">
              <RouterLink class="nav-link fw-semibold" to="/" active-class="text-primary">Tableau de bord</RouterLink>
            </li>
          </ul>
          
          <div v-if="store.pseudo" class="d-flex align-items-center gap-3">
             <span class="fw-bold text-dark">{{ store.pseudo }}</span>
             <div class="badge bg-white text-primary px-3 py-2 rounded-pill shadow-sm border" aria-label="Score">
               <i class="bi bi-trophy-fill me-1" style="color: #b8860b;" aria-hidden="true"></i> 
               <span class="fw-bold">{{ store.score }} pts</span>
             </div>
             <button
               @click="store.deconnecterUtilisateur()"
               class="btn btn-danger btn-sm rounded-pill fw-semibold"
               aria-label="Se déconnecter"
             >
               <i class="bi bi-box-arrow-right me-1" aria-hidden="true"></i> Déconnexion
             </button>
          </div>
        </nav>
      </div>
    </header>

    <main class="flex-grow-1 container" id="main-content">
      <RouterView v-slot="{ Component }">
        <component :is="Component" />
      </RouterView>
    </main>

    <footer class="py-4 text-center mt-auto bg-white border-top">
      <div class="container">
        <div class="text-muted fw-bold" style="font-size: 0.9rem;">
          &copy; 2026 MemoryApp • 
          <span class="text-primary">Version Premium</span>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.font-sans {
  font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
}
</style>