<script setup lang="ts">
import { ref, computed } from 'vue'
import { useMemoryStore } from '../stores/memory'

const store = useMemoryStore()
const pseudoInput = ref('')

const isPseudoSet = computed(() => store.pseudo.length > 0)

function validerPseudo() {
  if (pseudoInput.value.trim()) {
    store.definirPseudo(pseudoInput.value)
  }
}

const newCategoryName = ref('')
const showAddCategory = ref(false)

function createCategory() {
  if (newCategoryName.value.trim()) {
    store.addCategory(newCategoryName.value)
    newCategoryName.value = ''
    showAddCategory.value = false
  }
}

const editingCategoryId = ref<string | null>(null)
const editCategoryName = ref('')

function startEditCategory(id: string, currentName: string) {
  editingCategoryId.value = id
  editCategoryName.value = currentName
}

function saveEditCategory(id: string) {
  if (editCategoryName.value.trim()) {
    store.updateCategory(id, editCategoryName.value.trim())
  }
  editingCategoryId.value = null
}

function cancelEditCategory() {
  editingCategoryId.value = null
}

function handleImportTestData() {
  if (confirm('Cela va réinitialiser toutes vos données avec les données de test. Continuer ?')) {
    store.importTestData()
  }
}
</script>

<template>
  <div class="container py-5">
    
    <div v-if="!isPseudoSet" class="row justify-content-center">
      <div class="col-md-5">
        <div class="card shadow border-0">
          <div class="card-body p-5 text-center">
            
            <div class="mb-4">
              <span class="d-inline-flex align-items-center justify-content-center rounded-circle bg-primary bg-opacity-10" style="width:72px;height:72px;">
                <i class="bi bi-person-circle text-primary" style="font-size:2.5rem;" aria-hidden="true"></i>
              </span>
            </div>
            <h1 class="h3 mb-1 fw-bold text-dark">Bienvenue sur MemoryApp</h1>
            <p class="text-muted mb-4">Entrez votre pseudo pour commencer vos révisions.</p>

            <label for="pseudo-input" class="visually-hidden">Votre pseudo</label>
            <div class="input-group input-group-lg mb-3">
              <span class="input-group-text bg-light border-0">
                <i class="bi bi-person-fill text-primary" aria-hidden="true"></i>
              </span>
              <input 
                id="pseudo-input"
                v-model="pseudoInput" 
                type="text" 
                class="form-control bg-light border-0" 
                placeholder="Votre pseudo..." 
                @keyup.enter="validerPseudo"
              >
            </div>
            <button
              class="btn btn-primary btn-lg w-100 rounded-pill fw-bold"
              @click="validerPseudo"
              aria-label="Valider le pseudo et se connecter"
            >
              <i class="bi bi-box-arrow-in-right me-2" aria-hidden="true"></i> Se connecter
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-else>
      <div class="d-flex justify-content-between align-items-center mb-5 flex-wrap gap-3">
        <div>
          <h1 class="h2 fw-bold" style="color:#1a1a2e;">Bonjour, <span class="text-primary">{{ store.pseudo }}</span> 👋</h1>
          <p class="mb-0 text-muted">Prêt pour votre session de répétition espacée ?</p>
        </div>
        
        <button @click="handleImportTestData" class="btn btn-warning rounded-pill shadow-sm" aria-label="Importer les données de test">
          <i class="bi bi-download me-1" aria-hidden="true"></i> Importer données de test
        </button>
      </div>

      <div class="d-flex justify-content-between align-items-center mb-4">
         <h2 class="h4 fw-bold mb-0 text-dark">Vos Catégories</h2>
         <button @click="showAddCategory = !showAddCategory" class="btn btn-primary rounded-pill shadow-sm" aria-label="Ajouter une nouvelle catégorie">
           <i class="bi bi-plus-lg me-1" aria-hidden="true"></i> Nouvelle Catégorie
         </button>
      </div>

      <Transition name="slide-up">
        <div v-if="showAddCategory" class="card mb-4 border-0 shadow-sm">
          <div class="card-body">
            <label for="new-category-name" class="form-label text-muted fw-bold text-uppercase" style="font-size: 0.9rem;">Nom de la catégorie</label>
            <div class="input-group">
              <input id="new-category-name" v-model="newCategoryName" type="text" class="form-control" placeholder="Ex: Histoire, Langues..." @keyup.enter="createCategory">
              <button @click="createCategory" class="btn btn-success text-white" aria-label="Créer la catégorie">
                <i class="bi bi-check-lg" aria-hidden="true"></i> Créer
              </button>
            </div>
          </div>
        </div>
      </Transition>

      <div v-if="store.categories.length > 0" class="row g-4">
        <div v-for="category in store.categories" :key="category.id" class="col-md-6 col-lg-4">
          <div class="card h-100 border-0 shadow-sm hover-scale transition-all">
            <div class="card-body d-flex flex-column p-4">
              <div class="d-flex justify-content-between align-items-start mb-3">
                
                <div v-if="editingCategoryId === category.id" class="flex-grow-1 me-2">
                  <div class="input-group input-group-sm">
                    <label :for="'edit-cat-' + category.id" class="visually-hidden">Modifier le nom</label>
                    <input 
                      :id="'edit-cat-' + category.id"
                      v-model="editCategoryName" 
                      type="text" 
                      class="form-control" 
                      @keyup.enter="saveEditCategory(category.id)"
                      @keyup.escape="cancelEditCategory"
                      autofocus
                    >
                    <button @click="saveEditCategory(category.id)" class="btn btn-success btn-sm text-white" aria-label="Enregistrer">
                      <i class="bi bi-check-lg" aria-hidden="true"></i>
                    </button>
                    <button @click="cancelEditCategory" class="btn btn-outline-secondary btn-sm" aria-label="Annuler">
                      <i class="bi bi-x-lg" aria-hidden="true"></i>
                    </button>
                  </div>
                </div>
                <h3 v-else class="h5 card-title fw-bold text-dark mb-0">
                  <i class="bi bi-folder2-open me-2 text-warning" aria-hidden="true"></i>{{ category.name }}
                </h3>
                
                <div v-if="editingCategoryId !== category.id" class="dropdown">
                  <button class="btn btn-link text-muted p-0" type="button" data-bs-toggle="dropdown" :aria-label="'Actions pour ' + category.name">
                    <i class="bi bi-three-dots-vertical" aria-hidden="true"></i>
                  </button>
                  <ul class="dropdown-menu dropdown-menu-end shadow-sm border-0">
                    <li><button class="dropdown-item" @click="startEditCategory(category.id, category.name)"><i class="bi bi-pencil me-2" aria-hidden="true"></i>Modifier</button></li>
                    <li><button class="dropdown-item text-danger" @click="store.deleteCategory(category.id)"><i class="bi bi-trash me-2" aria-hidden="true"></i>Supprimer</button></li>
                  </ul>
                </div>
                
                <span v-if="editingCategoryId !== category.id" class="badge bg-light text-dark rounded-pill border ms-2" style="font-size: 0.9rem;">
                   {{ store.themes.filter(t => t.categoryId === category.id).length }}
                </span>
              </div>
              
              <p class="card-text text-muted mb-4 flex-grow-1" style="font-size: 0.95rem;">
                {{ store.themes.filter(t => t.categoryId === category.id).length }} thèmes de révision.
              </p>
              
              <RouterLink 
                :to="{ name: 'category', params: { id: category.id } }" 
                class="btn btn-primary fw-bold w-100 mt-auto"
              >
                Explorer <i class="bi bi-arrow-right ms-1" aria-hidden="true"></i>
              </RouterLink>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-5 bg-white rounded-3 shadow-sm">
        <i class="bi bi-inbox display-4 text-secondary mb-3 d-block" aria-hidden="true"></i>
        <p class="lead text-dark" style="font-size: 1.1rem;">Aucune catégorie pour le moment.</p>
        <button @click="showAddCategory = true" class="btn btn-outline-primary mt-2">
            Créer votre première catégorie
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.hover-scale:hover {
    transform: translateY(-5px);
    transition: transform 0.3s ease;
}
.transition-all {
    transition: all 0.3s ease;
}
</style>