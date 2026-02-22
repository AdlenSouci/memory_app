<script setup lang="ts">
defineProps<{
  /** Texte du bouton */
  label: string
  /** Variante visuelle */
  variant?: 'primary' | 'success' | 'danger' | 'warning' | 'outline-primary' | 'outline-danger' | 'light'
  /** Taille du bouton */
  size?: 'sm' | 'md' | 'lg'
  /** Icône Bootstrap Icons (ex: 'bi-plus-lg') */
  icon?: string
  /** Désactiver le bouton */
  disabled?: boolean
  /** Afficher un spinner de chargement */
  loading?: boolean
}>()

defineEmits(['click'])
</script>

<template>
  <button
    :class="[
      'btn',
      `btn-${variant || 'primary'}`,
      size === 'sm' ? 'btn-sm' : size === 'lg' ? 'btn-lg' : '',
      { 'disabled': disabled || loading }
    ]"
    :disabled="disabled || loading"
    :aria-disabled="disabled || loading"
    :aria-busy="loading"
    @click="$emit('click', $event)"
  >
    <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
    <i v-if="icon && !loading" :class="['bi', icon, 'me-1']" aria-hidden="true"></i>
    {{ label }}
  </button>
</template>
