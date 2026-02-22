<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  /** Valeur actuelle (0-100) */
  value: number
  /** Valeur maximale */
  max?: number
  /** Libellé à afficher */
  label?: string
  /** Variante de couleur */
  variant?: 'primary' | 'success' | 'danger' | 'warning' | 'info'
  /** Afficher le texte du pourcentage */
  showText?: boolean
  /** Hauteur en pixels */
  height?: number
}>()

const percentage = computed(() => {
  const max = props.max || 100
  return Math.min(Math.max((props.value / max) * 100, 0), 100)
})
</script>

<template>
  <div class="progress-wrapper">
    <div v-if="label" class="d-flex justify-content-between align-items-center mb-1">
      <span class="small fw-bold text-muted">{{ label }}</span>
      <span v-if="showText" class="small fw-bold text-muted">{{ Math.round(percentage) }}%</span>
    </div>
    <div 
      class="progress shadow-sm" 
      :style="{ height: (height || 12) + 'px', borderRadius: '10px', backgroundColor: '#e9ecef' }"
      role="progressbar" 
      :aria-valuenow="Math.round(percentage)" 
      aria-valuemin="0" 
      aria-valuemax="100"
      :aria-label="label || 'Progression'"
    >
      <div 
        class="progress-bar"
        :class="`bg-${variant || 'primary'}`" 
        :style="{ width: percentage + '%', borderRadius: '10px', transition: 'width 0.5s ease' }"
      ></div>
    </div>
  </div>
</template>
