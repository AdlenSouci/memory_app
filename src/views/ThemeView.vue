<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMemoryStore } from '../stores/memory'
import type { MediaType } from '../stores/memory'

const route = useRoute()
const router = useRouter()
const store = useMemoryStore()
const themeId = route.params.id as string

const theme = computed(() => store.themes.find(t => t.id === themeId))

// Configuration du thème du thème
const showConfig = ref(false)

// Création de cartes de cartes
const form = ref({
  recto: '',
  rectoType: 'text' as MediaType,
  rectoContent: '',
  verso: '',
  versoType: 'text' as MediaType,
  versoContent: ''
})

function onAjouter() {
  if (form.value.recto && form.value.verso) {
    store.addCard({
      themeId,
      recto: form.value.recto,
      rectoType: form.value.rectoType,
      rectoContent: form.value.rectoContent,
      verso: form.value.verso,
      versoType: form.value.versoType,
      versoContent: form.value.versoContent
    })
    // Reset basic fields but keep types
    form.value.recto = ''
    form.value.verso = ''
    form.value.rectoContent = ''
    form.value.versoContent = ''
  }
}

function handleFileUpload(event: Event, side: 'recto' | 'verso') {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      if (side === 'recto') {
        form.value.rectoContent = result
      } else {
        form.value.versoContent = result
      }
    }
    reader.readAsDataURL(file)
  }
}

// Édition de cartes
const editingCardId = ref<string | null>(null)
const editCardRecto = ref('')
const editCardVerso = ref('')

function startEditCard(id: string, recto: string, verso: string) {
  editingCardId.value = id
  editCardRecto.value = recto
  editCardVerso.value = verso
}

function saveEditCard(id: string) {
  if (editCardRecto.value.trim() && editCardVerso.value.trim()) {
    store.updateCard(id, {
      recto: editCardRecto.value.trim(),
      verso: editCardVerso.value.trim()
    })
  }
  editingCardId.value = null
}

function cancelEditCard() {
  editingCardId.value = null
}
</script>

<template>
  <div class="container py-5">
    <div v-if="theme">
      <!-- En-tête -->
      <div class="d-flex justify-content-between align-items-center mb-5 flex-wrap gap-3">
        <div class="d-flex align-items-center gap-3">
          <RouterLink :to="{ name: 'category', params: { id: theme.categoryId } }" class="btn btn-white shadow-sm rounded-circle p-2 text-dark border-0" style="width: 40px; height: 40px; display: grid; place-items: center;" aria-label="Retour à la catégorie">
            <i class="bi bi-arrow-left" aria-hidden="true"></i>
          </RouterLink>
          <div>
            <h1 class="h2 mb-0 fw-bold text-dark">{{ theme.titre }}</h1>
            <div class="d-flex gap-3 align-items-center mt-1">
                <span class="badge bg-white text-muted border"><i class="bi bi-bar-chart-fill me-1" aria-hidden="true"></i>Max Niv: {{ theme.maxLevel }}</span>
                <span class="badge bg-white text-muted border"><i class="bi bi-plus-circle-fill me-1" aria-hidden="true"></i>{{ theme.newCardsPerDay }} new/jour</span>
            </div>
          </div>
        </div>
        <button @click="showConfig = !showConfig" class="btn btn-white shadow-sm text-primary fw-medium" aria-label="Configurer le thème">
          <i class="bi bi-gear-fill me-1" aria-hidden="true"></i> Config
        </button>
      </div>

      <!-- Panneau de configuration -->
      <Transition name="slide-up">
        <div v-if="showConfig" class="card mb-4 border-0 shadow-sm">
          <div class="card-body p-4">
            <h2 class="h5 card-title fw-bold mb-3">Configurer le Thème</h2>
            <div class="row g-3">
              <div class="col-md-6">
                <label for="config-max-level" class="form-label text-muted fw-bold" style="font-size: 0.9rem;">Niveau Max</label>
                <input id="config-max-level" v-model.number="theme.maxLevel" type="number" class="form-control" min="1" max="10">
              </div>
              <div class="col-md-6">
                <label for="config-new-cards" class="form-label text-muted fw-bold" style="font-size: 0.9rem;">Nouvelles cartes / jour</label>
                <input id="config-new-cards" v-model.number="theme.newCardsPerDay" type="number" class="form-control" min="1">
              </div>
            </div>
          </div>
        </div>
      </Transition>

      <div class="row g-4">
        <!-- Colonne d'ajout de carte -->
        <div class="col-lg-4">
          <div class="card border-0 shadow-sm sticky-top" style="top: 100px; z-index: 1;">
            <div class="card-header bg-primary text-white border-0 py-3">
              <h2 class="h5 mb-0 fw-bold"><i class="bi bi-plus-square me-2" aria-hidden="true"></i>Nouvelle Carte</h2>
            </div>
            <div class="card-body p-4">
              <div class="mb-3">
                <label for="recto-type" class="form-label fw-bold text-muted" style="font-size: 0.9rem;">RECTO (Question)</label>
                <div class="input-group mb-2">
                  <select id="recto-type" v-model="form.rectoType" class="form-select bg-light border-0" style="max-width: 90px;" aria-label="Type du recto">
                    <option value="text">Txt</option>
                    <option value="image">Img</option>
                    <option value="audio">Aud</option>
                    <option value="video">Vid</option>
                  </select>
                  <input v-if="form.rectoType === 'text'" v-model="form.recto" type="text" class="form-control bg-light border-0" placeholder="Question..." aria-label="Question">
                  <input v-else type="file" @change="(e) => handleFileUpload(e, 'recto')" class="form-control" aria-label="Fichier recto">
                </div>
                <input v-if="form.rectoType !== 'text'" v-model="form.recto" type="text" class="form-control form-control-sm mt-2 bg-light border-0" placeholder="Description (optionnel)" aria-label="Description recto">
              </div>

              <div class="mb-3">
                <label for="verso-type" class="form-label fw-bold text-muted" style="font-size: 0.9rem;">VERSO (Réponse)</label>
                <div class="input-group mb-2">
                  <select id="verso-type" v-model="form.versoType" class="form-select bg-light border-0" style="max-width: 90px;" aria-label="Type du verso">
                    <option value="text">Txt</option>
                    <option value="image">Img</option>
                    <option value="audio">Aud</option>
                    <option value="video">Vid</option>
                  </select>
                  <input v-if="form.versoType === 'text'" v-model="form.verso" type="text" class="form-control bg-light border-0" placeholder="Réponse..." aria-label="Réponse">
                  <input v-else type="file" @change="(e) => handleFileUpload(e, 'verso')" class="form-control" aria-label="Fichier verso">
                </div>
                <input v-if="form.versoType !== 'text'" v-model="form.verso" type="text" class="form-control form-control-sm mt-2 bg-light border-0" placeholder="Description (optionnel)" aria-label="Description verso">
              </div>

              <button @click="onAjouter" class="btn btn-success w-100 fw-bold shadow-sm py-2 text-white" aria-label="Ajouter la carte">
                Ajouter la Carte
              </button>
            </div>
          </div>
        </div>

        <!-- Colonne Liste des cartes -->
        <div class="col-lg-8">
          <div class="d-flex justify-content-between align-items-center mb-3">
             <h2 class="h5 fw-bold text-muted mb-0">Cartes existantes</h2>
             <span class="badge bg-white text-primary border shadow-sm" style="font-size: 0.9rem;">{{ store.cards.filter(c => c.themeId === themeId).length }} cartes</span>
          </div>

          <div class="list-group shadow-sm border-0 rounded-3 overflow-hidden">
            <div v-for="card in store.cards.filter(c => c.themeId === themeId)" :key="card.id" 
                 class="list-group-item d-flex justify-content-between align-items-center p-3 border-0 border-bottom bg-white">
              
              <!-- Mode Édition -->
              <div v-if="editingCardId === card.id" class="flex-grow-1">
                <div class="row g-2 mb-2">
                  <div class="col-6">
                    <label :for="'edit-recto-' + card.id" class="form-label text-muted fw-bold mb-1" style="font-size: 0.9rem;">Recto</label>
                    <input 
                      :id="'edit-recto-' + card.id"
                      v-model="editCardRecto" 
                      type="text" 
                      class="form-control form-control-sm"
                      @keyup.escape="cancelEditCard"
                    >
                  </div>
                  <div class="col-6">
                    <label :for="'edit-verso-' + card.id" class="form-label text-muted fw-bold mb-1" style="font-size: 0.9rem;">Verso</label>
                    <input 
                      :id="'edit-verso-' + card.id"
                      v-model="editCardVerso" 
                      type="text" 
                      class="form-control form-control-sm"
                      @keyup.enter="saveEditCard(card.id)"
                      @keyup.escape="cancelEditCard"
                    >
                  </div>
                </div>
                <div class="d-flex gap-2">
                  <button @click="saveEditCard(card.id)" class="btn btn-sm btn-success" aria-label="Enregistrer la carte">
                    <i class="bi bi-check-lg" aria-hidden="true"></i> Enregistrer
                  </button>
                  <button @click="cancelEditCard" class="btn btn-sm btn-outline-secondary" aria-label="Annuler la modification">
                    <i class="bi bi-x-lg" aria-hidden="true"></i> Annuler
                  </button>
                </div>
              </div>

              <!-- Mode Affichage -->
              <div v-else class="d-flex align-items-center gap-3 flex-grow-1">
                
                <div style="width: 45%">
                  <div class="text-uppercase text-muted fw-bold mb-1" style="font-size: 0.85rem;">Recto</div>
                  <div class="fw-medium text-dark">{{ card.recto }}</div>
                  <i v-if="card.rectoType !== 'text'" class="bi ms-2 text-primary" aria-hidden="true" :class="{
                    'bi-image': card.rectoType === 'image',
                    'bi-music-note-beamed': card.rectoType === 'audio',
                    'bi-camera-video': card.rectoType === 'video'
                  }"></i>
                </div>

                <div class="vr opacity-25"></div>

                <div style="width: 45%">
                  <div class="text-uppercase text-muted fw-bold mb-1" style="font-size: 0.85rem;">Verso</div>
                  <div class="text-muted">{{ card.verso }}</div>
                   <i v-if="card.versoType !== 'text'" class="bi ms-2 text-info" aria-hidden="true" :class="{
                    'bi-image': card.versoType === 'image',
                    'bi-music-note-beamed': card.versoType === 'audio',
                    'bi-camera-video': card.versoType === 'video'
                  }"></i>
                </div>
              </div>

              <div v-if="editingCardId !== card.id" class="d-flex align-items-center gap-2">
                <span class="badge bg-light text-dark border me-2">Niv. {{ card.niveau }}</span>
                <button @click="startEditCard(card.id, card.recto, card.verso)" class="btn btn-sm btn-primary fw-bold" aria-label="Modifier la carte">
                  <i class="bi bi-pencil me-1" aria-hidden="true"></i> Modifier
                </button>
                <button @click="store.deleteCard(card.id)" class="btn btn-sm btn-danger fw-bold" aria-label="Supprimer la carte">
                  <i class="bi bi-x-circle me-1" aria-hidden="true"></i> Supprimer
                </button>
              </div>
            </div>
            
            <div v-if="store.cards.filter(c => c.themeId === themeId).length === 0" class="list-group-item text-center py-5 text-muted border-0 bg-white">
              <i class="bi bi-card-list display-6 mb-2 d-block" style="color:#888;" aria-hidden="true"></i>
              Aucune carte. Utilisez le formulaire à gauche pour en ajouter.
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.hover-danger:hover {
    background-color: var(--color-accent) !important;
    color: white !important;
    border-color: var(--color-accent) !important;
}
</style>
