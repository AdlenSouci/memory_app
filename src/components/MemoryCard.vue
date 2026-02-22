<script setup lang="ts">
import { ref, watch } from 'vue'
import type { MediaType } from '../stores/memory'

const props = defineProps<{
  recto: string
  rectoType: MediaType
  rectoContent?: string
  verso: string
  versoType: MediaType
  versoContent?: string
}>()

const emit = defineEmits(['answer'])

const isFlipped = ref(false)

// Réinitialiser l'état quand la carte change
watch(() => props.recto, () => {
  isFlipped.value = false
})

const handleAnswer = (success: boolean) => {
  emit('answer', success)
  isFlipped.value = false
}
</script>

<template>
  <div class="memory-card-container mx-auto" style="max-width: 500px;" role="region" aria-label="Carte de révision">
    <!-- RECTO (Question) -->
    <div 
      v-if="!isFlipped" 
      class="card shadow-sm h-100 p-4 d-flex flex-column align-items-center justify-content-center bg-white" 
      @click="isFlipped = true"
      @keydown.enter="isFlipped = true"
      @keydown.space.prevent="isFlipped = true"
      tabindex="0"
      role="button"
      aria-label="Carte question - cliquez pour révéler la réponse"
    >
      <h5 class="text-uppercase text-muted small mb-3">Question</h5>
      
      <!-- Afficher le texte si présent -->
      <h3 v-if="recto" class="text-center display-6 mb-3">{{ recto }}</h3>
      
      <!-- Show media if type is not 'text' -->
      <img v-if="rectoType === 'image' && rectoContent" :src="rectoContent" :alt="recto || 'Image de la question'" class="img-fluid rounded mb-3" style="max-height: 300px;">
      
      <div v-if="rectoType === 'audio' && rectoContent" @click.stop class="w-100 text-center mb-3">
         <audio controls :src="rectoContent" class="w-100" aria-label="Audio de la question">Votre navigateur ne supporte pas l'audio.</audio>
      </div>
      
      <div v-if="rectoType === 'video' && rectoContent" @click.stop class="w-100 text-center mb-3">
         <video controls :src="rectoContent" class="w-100 rounded" style="max-height: 300px;" aria-label="Vidéo de la question">Votre navigateur ne supporte pas la vidéo.</video>
      </div>

      <div class="mt-auto text-muted small">
        <i class="bi bi-hand-index-thumb" aria-hidden="true"></i> Cliquez pour voir la réponse
      </div>
    </div>

    <!-- VERSO (Réponse) -->
    <div v-else class="card shadow h-100 p-4 d-flex flex-column align-items-center justify-content-center bg-light border-primary" role="region" aria-label="Réponse de la carte">
      <h5 class="text-uppercase text-success small mb-3">Réponse</h5>
      
      <!-- Afficher le texte si présent -->
      <h3 v-if="verso" class="text-center display-6 mb-3">{{ verso }}</h3>
      
      <!-- Show media if type is not 'text' -->
      <img v-if="versoType === 'image' && versoContent" :src="versoContent" :alt="verso || 'Image de la réponse'" class="img-fluid rounded mb-3" style="max-height: 300px;">
      
      <div v-if="versoType === 'audio' && versoContent" @click.stop class="w-100 text-center mb-3">
         <audio controls :src="versoContent" class="w-100" aria-label="Audio de la réponse">Votre navigateur ne supporte pas l'audio.</audio>
      </div>
      
      <div v-if="versoType === 'video' && versoContent" @click.stop class="w-100 text-center mb-3">
         <video controls :src="versoContent" class="w-100 rounded" style="max-height: 300px;" aria-label="Vidéo de la réponse">Votre navigateur ne supporte pas la vidéo.</video>
      </div>

      <div class="d-flex gap-3 mt-auto w-100">
        <button @click.stop="handleAnswer(false)" class="btn btn-outline-danger flex-grow-1" aria-label="Je n'ai pas su la réponse">
          <i class="bi bi-x-lg" aria-hidden="true"></i> Pas su
        </button>
        <button @click.stop="handleAnswer(true)" class="btn btn-success flex-grow-1" aria-label="J'ai su la réponse">
          <i class="bi bi-check-lg" aria-hidden="true"></i> Su
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.memory-card-container {
  min-height: 400px;
  cursor: pointer;
}
</style>