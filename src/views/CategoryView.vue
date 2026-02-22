<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMemoryStore } from '../stores/memory'

const route = useRoute()
const router = useRouter()
const store = useMemoryStore()

const categoryId = route.params.id as string
const category = computed(() => store.categories.find(c => c.id === categoryId))

// Création du thème
const newThemeTitle = ref('')
const showAddTheme = ref(false)

function createTheme() {
  if (newThemeTitle.value.trim()) {
    store.addTheme(categoryId, newThemeTitle.value)
    newThemeTitle.value = ''
    showAddTheme.value = false
  }
}

// Édition du thème
const editingThemeId = ref<string | null>(null)
const editThemeTitle = ref('')

function startEditTheme(id: string, currentTitle: string) {
  editingThemeId.value = id
  editThemeTitle.value = currentTitle
}

function saveEditTheme(id: string) {
  if (editThemeTitle.value.trim()) {
    store.updateTheme(id, { titre: editThemeTitle.value.trim() })
  }
  editingThemeId.value = null
}

function cancelEditTheme() {
  editingThemeId.value = null
}

function deleteThisCategory() {
  if (confirm('Voulez-vous vraiment supprimer cette catégorie et tous ses thèmes ?')) {
    store.deleteCategory(categoryId)
    router.push('/')
  }
}
</script>

<template>
  <div class="container py-5">
    
    <div v-if="category">
      <!-- En-tête -->
      <div class="d-flex justify-content-between align-items-center mb-5 flex-wrap gap-3">
        <div class="d-flex align-items-center gap-3">
          <RouterLink to="/" class="btn btn-white shadow-sm rounded-circle p-2 text-dark border-0" style="width: 40px; height: 40px; display: grid; place-items: center;" aria-label="Retour à l'accueil">
            <i class="bi bi-arrow-left" aria-hidden="true"></i>
          </RouterLink>
          <h1 class="h2 mb-0 fw-bold text-dark">{{ category.name }}</h1>
        </div>
        
        <div class="btn-group shadow-sm">
           <button @click="showAddTheme = !showAddTheme" class="btn btn-primary" aria-label="Ajouter un nouveau thème">
             <i class="bi bi-plus-lg me-2" aria-hidden="true"></i>Nouveau Thème
           </button>
           <button @click="deleteThisCategory" class="btn btn-white text-danger border" aria-label="Supprimer cette catégorie">
             <i class="bi bi-trash" aria-hidden="true"></i>
           </button>
        </div>
      </div>

      <!-- Formulaire d'ajout de thème -->
      <Transition name="slide-up">
        <div v-if="showAddTheme" class="card mb-4 border-0 shadow-sm">
          <div class="card-body p-4">
            <label for="new-theme-title" class="form-label text-muted fw-bold text-uppercase" style="font-size: 0.9rem;">Titre du nouveau thème</label>
            <div class="input-group">
              <input id="new-theme-title" v-model="newThemeTitle" type="text" class="form-control form-control-lg border-0 bg-light" placeholder="Ex: Verbes irréguliers..." @keyup.enter="createTheme">
              <button @click="createTheme" class="btn btn-success px-4" aria-label="Ajouter le thème">Ajouter</button>
            </div>
          </div>
        </div>
      </Transition>

      <!-- Grille des thèmes -->
      <div v-if="store.themes.filter(t => t.categoryId === categoryId).length > 0" class="row g-4">
        <div v-for="theme in store.themes.filter(t => t.categoryId === categoryId)" :key="theme.id" class="col-md-6 col-lg-4">
          <div class="card h-100 border-0 shadow-sm hover-elevate transition-all">
            <div class="card-body d-flex flex-column p-4">
              <div class="d-flex justify-content-between align-items-start mb-3">
                <!-- Inline editing -->
                <div v-if="editingThemeId === theme.id" class="flex-grow-1 me-2">
                  <div class="input-group input-group-sm">
                    <label :for="'edit-theme-' + theme.id" class="visually-hidden">Modifier le titre</label>
                    <input 
                      :id="'edit-theme-' + theme.id"
                      v-model="editThemeTitle" 
                      type="text" 
                      class="form-control" 
                      @keyup.enter="saveEditTheme(theme.id)"
                      @keyup.escape="cancelEditTheme"
                      autofocus
                    >
                    <button @click="saveEditTheme(theme.id)" class="btn btn-success btn-sm" aria-label="Enregistrer">
                      <i class="bi bi-check-lg" aria-hidden="true"></i>
                    </button>
                    <button @click="cancelEditTheme" class="btn btn-outline-secondary btn-sm" aria-label="Annuler">
                      <i class="bi bi-x-lg" aria-hidden="true"></i>
                    </button>
                  </div>
                </div>
                <h2 v-else class="h5 card-title mb-0 fw-bold text-dark">{{ theme.titre }}</h2>
                
                <div v-if="editingThemeId !== theme.id" class="dropdown">
                  <button class="btn btn-link text-muted p-0" type="button" data-bs-toggle="dropdown" :aria-label="'Actions pour ' + theme.titre">
                    <i class="bi bi-three-dots-vertical" aria-hidden="true"></i>
                  </button>
                  <ul class="dropdown-menu dropdown-menu-end shadow-sm border-0">
                    <li><button class="dropdown-item" @click="startEditTheme(theme.id, theme.titre)"><i class="bi bi-pencil me-2" aria-hidden="true"></i>Modifier</button></li>
                    <li><button class="dropdown-item text-danger" @click="store.deleteTheme(theme.id)"><i class="bi bi-trash me-2" aria-hidden="true"></i>Supprimer</button></li>
                  </ul>
                </div>
              </div>

              <p class="text-muted mb-4" style="font-size: 0.9rem;">
                <span class="badge bg-light text-dark border py-2 px-3 rounded-pill" style="font-size: 0.9rem;">
                    {{ store.cards.filter(c => c.themeId === theme.id).length }} cartes
                </span>
              </p>

              <div class="mt-auto d-flex gap-2">
                <RouterLink :to="{ name: 'revision', params: { id: theme.id } }" class="btn btn-primary flex-grow-1 shadow-sm" :aria-label="'Réviser ' + theme.titre">
                  <i class="bi bi-play-fill me-1" aria-hidden="true"></i> Réviser
                </RouterLink>
                <RouterLink :to="{ name: 'theme', params: { id: theme.id } }" class="btn btn-light text-primary border" :aria-label="'Gérer ' + theme.titre">
                   Gérer
                </RouterLink>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-5 bg-white rounded-3 shadow-sm text-muted">
        <i class="bi bi-journal-album display-4 mb-3 d-block" style="color:#888;" aria-hidden="true"></i>
        <p class="lead">Aucun thème dans cette catégorie.</p>
        <button @click="showAddTheme = true" class="btn btn-outline-primary mt-2">Ajouter un premier thème</button>
      </div>
    </div>
    
    <div v-else class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Chargement...</span>
      </div>
      <p class="mt-3 text-muted">Chargement...</p>
      <RouterLink to="/" class="btn btn-link">Retour à l'accueil</RouterLink>
    </div>
  </div>
</template>

<style scoped>
.hover-elevate:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-lg) !important;
}
.transition-all {
    transition: all 0.3s ease;
}
</style>
