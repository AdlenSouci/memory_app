<script setup lang="ts">
defineProps<{
  /** Nom de la catégorie */
  name: string
  /** Nombre de thèmes */
  count?: number
  /** Variante de couleur */
  variant?: 'primary' | 'success' | 'warning' | 'info' | 'light'
  /** Icône optionnelle */
  icon?: string
}>()
</script>

<template>
  <span 
    :class="[
      'badge rounded-pill d-inline-flex align-items-center gap-1 px-3 py-2',
      variant === 'light' || !variant ? 'bg-light text-dark border' : `bg-${variant} bg-opacity-10 text-${variant} border border-${variant}`
    ]"
  >
    <i v-if="icon" :class="['bi', icon]" aria-hidden="true"></i>
    <span>{{ name }}</span>
    <span v-if="count !== undefined" class="ms-1 fw-bold">({{ count }})</span>
  </span>
</template>
