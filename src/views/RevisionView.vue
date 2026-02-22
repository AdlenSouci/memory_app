<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMemoryStore } from '../stores/memory'
import MemoryCard from '../components/MemoryCard.vue'
import ProgressBar from '../components/ProgressBar.vue'

const route = useRoute()
const router = useRouter()
const store = useMemoryStore()

const themeId = route.params.id as string
const theme = computed(() => store.themes.find(t => t.id === themeId))

const cardsToReview = computed(() => {
  if (!theme.value) return []

  const today = new Date().toISOString().split('T')[0] as string
  const allThemeCards = store.cards.filter(c => c.themeId === themeId)

  // Separate due cards by level
  const dueCards = allThemeCards.filter(c => {
    const dateCarte = c.nextReviewDate || ""
    return dateCarte <= today
  })

  // Apply newCardsPerDay limit: cards at level 1 with today's date are "new"
  const newCardsLimit = theme.value.newCardsPerDay || 10
  const newCards = dueCards.filter(c => c.niveau === 1)
  const reviewCards = dueCards.filter(c => c.niveau > 1)

  // Sort by level (highest first as per spec), then limit new cards
  const limitedNewCards = newCards.slice(0, newCardsLimit)
  
  // Start with highest level cards, then add new cards (level 1)
  const sorted = [...reviewCards.sort((a, b) => b.niveau - a.niveau), ...limitedNewCards]
  
  return sorted
})

const currentIndex = ref(0)
const isFinished = ref(false)
const reviewMode = ref(false)

// Statistiques
const successCount = ref(0)
const failCount = ref(0)

const currentCard = computed(() => {
  if (reviewMode.value) {
    // En mode révision, afficher toutes les cartes du thème
    const allCards = store.cards.filter(c => c.themeId === themeId)
    if (currentIndex.value < allCards.length) {
      return allCards[currentIndex.value]
    }
    return null
  }
  
  if (cardsToReview.value.length > 0 && currentIndex.value < cardsToReview.value.length) {
    return cardsToReview.value[currentIndex.value]
  }
  return null
})

const allThemeCards = computed(() => store.cards.filter(c => c.themeId === themeId))
const memorizedCards = computed(() => allThemeCards.value.filter(c => c.niveau >= (theme.value?.maxLevel || 7)))
const remainingCards = computed(() => allThemeCards.value.length - memorizedCards.value.length)

function onAnswer(success: boolean) {
  if (currentCard.value && !reviewMode.value) {
    if (success) {
      store.incrementerNiveau(currentCard.value.id)
      store.gagnerPoints(10)
      successCount.value++
    } else {
      store.echecRevision(currentCard.value.id)
      failCount.value++
    }

    if (currentIndex.value < cardsToReview.value.length - 1) {
      currentIndex.value++
    } else {
      isFinished.value = true
    }
  }
}

function startReviewMode() {
  reviewMode.value = true
  currentIndex.value = 0
}

function continueRevision() {
  isFinished.value = false
  currentIndex.value = 0
  successCount.value = 0
  failCount.value = 0
  // Reload cards to review (in case dates changed)
  window.location.reload()
}

function nextCardInReview() {
  if (currentIndex.value < allThemeCards.value.length - 1) {
    currentIndex.value++
  }
}

function prevCardInReview() {
  if (currentIndex.value > 0) {
    currentIndex.value--
  }
}

function exitReviewMode() {
  reviewMode.value = false
  currentIndex.value = 0
}
</script>

<template>
  <div class="container py-5 text-center">
    
    <div v-if="currentCard && !isFinished">
      <div class="mb-5">
        <h2 class="h3 fw-bold text-dark mb-3">Révision : {{ theme?.titre }}</h2>
        
        <!-- Barre de progression -->
        <div class="mx-auto" style="max-width: 600px;">
          <ProgressBar 
            :value="currentIndex" 
            :max="cardsToReview.length" 
            label="Progression" 
            :show-text="false" 
            variant="primary"
            :height="12"
          />
        </div>
        <p class="text-muted mt-2 fw-bold" style="font-size: 0.95rem;">{{ currentIndex + 1 }} / {{ cardsToReview.length }} cartes</p>
      </div>
      
      <div class="row justify-content-center">
        <div class="col-md-8 col-lg-6">
           <MemoryCard 
            :recto="currentCard.recto" 
            :recto-type="currentCard.rectoType"
            :recto-content="currentCard.rectoContent"
            :verso="currentCard.verso"
            :verso-type="currentCard.versoType"
            :verso-content="currentCard.versoContent"
            @answer="onAnswer" 
            class="shadow-lg border-0"
          />
        </div>
      </div>
    </div>

    <!-- Session terminée avec Statistiques -->
    <div v-else-if="isFinished" class="card bg-white mx-auto p-5 shadow-lg border-0" style="max-width: 700px;" role="alert">
      <div class="mb-4">
        <i :class="remainingCards === 0 ? 'bi bi-trophy-fill text-warning' : 'bi bi-check-circle-fill text-success'" class="display-1" aria-hidden="true"></i>
      </div>
      <h2 :class="remainingCards === 0 ? 'text-warning' : 'text-success'" class="mb-3 fw-bold">
        {{ remainingCards === 0 ? '🎉 Thème complété !' : 'Session terminée !' }}
      </h2>
      
      <!-- Statistiques -->
      <div class="row g-3 mb-4">
        <div class="col-6">
          <div class="card bg-success bg-opacity-10 border-success border-2">
            <div class="card-body text-center py-3">
              <h3 class="h1 fw-bold text-success mb-0">{{ successCount }}</h3>
              <p class="text-muted mb-0" style="font-size: 0.9rem;">Réussies</p>
            </div>
          </div>
        </div>
        <div class="col-6">
          <div class="card bg-danger bg-opacity-10 border-danger border-2">
            <div class="card-body text-center py-3">
              <h3 class="h1 fw-bold text-danger mb-0">{{ failCount }}</h3>
              <p class="text-muted mb-0" style="font-size: 0.9rem;">À revoir</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Infos de progression -->
      <div class="alert alert-info mb-4" role="status">
        <div class="d-flex align-items-center gap-2">
          <i class="bi bi-info-circle-fill" aria-hidden="true"></i>
          <div>
            <strong>Progression du thème :</strong><br>
            <span v-if="remainingCards > 0">
              Il vous reste <strong>{{ remainingCards }} carte(s)</strong> à mémoriser complètement.
            </span>
            <span v-else class="text-success">
              🎉 <strong>Félicitations !</strong> Toutes les cartes sont mémorisées !
            </span>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="d-flex gap-2 flex-wrap justify-content-center">
        <!-- Si des cartes restent à mémoriser -->
        <template v-if="remainingCards > 0">
          <button @click="continueRevision" class="btn btn-success px-4" aria-label="Continuer la révision">
            <i class="bi bi-arrow-repeat me-2" aria-hidden="true"></i>Continuer la révision
          </button>
          <button @click="startReviewMode" class="btn btn-outline-primary px-4" aria-label="Consulter les cartes">
            <i class="bi bi-eye me-2" aria-hidden="true"></i>Consulter les cartes
          </button>
        </template>
        
        <!-- Si tout est mémorisé -->
        <template v-else>
          <button @click="startReviewMode" class="btn btn-primary px-4" aria-label="Consulter les cartes">
            <i class="bi bi-eye me-2" aria-hidden="true"></i>Consulter les cartes
          </button>
        </template>
        
        <button @click="router.push('/')" class="btn btn-outline-secondary px-4" aria-label="Retour à l'accueil">
          <i class="bi bi-house me-2" aria-hidden="true"></i>Retour à l'accueil
        </button>
      </div>
    </div>

    <!-- Mode Consultation -->
    <div v-else-if="reviewMode && currentCard" class="review-mode">
      <div class="mb-4">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h2 class="h3 fw-bold text-dark mb-0">Consultation : {{ theme?.titre }}</h2>
          <button @click="exitReviewMode" class="btn btn-sm btn-outline-secondary" aria-label="Fermer la consultation">
            <i class="bi bi-x-lg" aria-hidden="true"></i> Fermer
          </button>
        </div>
        
        <div class="d-flex align-items-center gap-3 justify-content-center">
          <button @click="prevCardInReview" :disabled="currentIndex === 0" class="btn btn-outline-primary" aria-label="Carte précédente">
            <i class="bi bi-chevron-left" aria-hidden="true"></i>
          </button>
          <span class="fw-bold">{{ currentIndex + 1 }} / {{ allThemeCards.length }}</span>
          <button @click="nextCardInReview" :disabled="currentIndex === allThemeCards.length - 1" class="btn btn-outline-primary" aria-label="Carte suivante">
            <i class="bi bi-chevron-right" aria-hidden="true"></i>
          </button>
        </div>
      </div>
      
      <div class="row justify-content-center">
        <div class="col-md-8 col-lg-6">
          <div class="card shadow-lg border-0 p-4">
            <div class="mb-3">
              <span class="badge bg-primary">Niveau {{ currentCard.niveau }}</span>
            </div>
            <div class="text-uppercase text-muted fw-bold mb-2" style="font-size: 0.9rem;">Question</div>
            <h3 class="h4 mb-4">{{ currentCard.recto }}</h3>
            <div class="text-uppercase text-success fw-bold mb-2" style="font-size: 0.9rem;">Réponse</div>
            <h3 class="h4 text-success">{{ currentCard.verso }}</h3>
          </div>
        </div>
      </div>

      <!-- Actions en mode consultation -->
      <div class="text-center mt-4">
        <button v-if="remainingCards > 0" @click="exitReviewMode" class="btn btn-success px-4 me-2" aria-label="Continuer la révision">
          <i class="bi bi-arrow-repeat me-2" aria-hidden="true"></i>Continuer la révision
        </button>
        <button @click="router.push('/')" class="btn btn-outline-secondary px-4" aria-label="Retour à l'accueil">
          <i class="bi bi-house me-2" aria-hidden="true"></i>Retour à l'accueil
        </button>
      </div>
    </div>

    <!-- Aucune carte à réviser -->
    <div v-else class="card bg-white mx-auto p-5 shadow-sm border-0" style="max-width: 600px;">
      <div class="mb-4">
         <i class="bi bi-check-circle-fill text-success display-1" aria-hidden="true"></i>
      </div>
      <h2 class="mb-3 fw-bold text-dark">Rien à réviser</h2>
      <p class="mb-4 text-muted">Toutes vos cartes sont à jour pour ce thème. Revenez demain !</p>
      <div class="d-flex gap-2 justify-content-center">
        <button @click="startReviewMode" class="btn btn-outline-primary px-4" aria-label="Consulter les cartes">
          <i class="bi bi-eye me-2" aria-hidden="true"></i>Consulter les cartes
        </button>
        <RouterLink to="/" class="btn btn-primary px-4">Retour</RouterLink>
      </div>
    </div>

  </div>
</template>

<style scoped>
/* Scoped styles removed as we use global utility classes */
</style>
