import { defineStore } from 'pinia'
import { ref, watch, computed } from 'vue'
import sourceData from '../data.json'

export interface Category {
  id: string
  name: string
}

export interface Theme {
  id: string
  categoryId: string
  titre: string
  maxLevel: number
  newCardsPerDay: number
}

export type MediaType = 'text' | 'image' | 'audio' | 'video'

export interface Card {
  id: string
  themeId: string
  recto: string
  rectoType: MediaType
  rectoContent?: string
  verso: string
  versoType: MediaType
  versoContent?: string
  niveau: number
  nextReviewDate: string
}

export const useMemoryStore = defineStore('memory', () => {
  const categories = ref<Category[]>([])
  const themes = ref<Theme[]>([])
  const cards = ref<Card[]>([])
  const pseudo = ref('')
  const score = ref(0)

  // Logique d'initialisation
  const init = () => {
    // 1. Charger les données utilisateur depuis le localStorage
    const savedCategories = localStorage.getItem('memory_categories')
    const savedThemes = localStorage.getItem('memory_themes')
    const savedCards = localStorage.getItem('memory_cards')
    const savedUser = localStorage.getItem('memory_user')

    // Fonction utilitaire pour parser le JSON de manière sécurisée
    const safeParse = <T>(data: string, fallback: () => T, keyName: string): T => {
      try {
        return JSON.parse(data) as T
      } catch (e) {
        console.warn(`[MemoryStore] Données corrompues pour ${keyName}, nettoyage...`, e)
        localStorage.removeItem(keyName)
        return fallback()
      }
    }

    // 2. Charger les catégories
    if (savedCategories) {
      categories.value = safeParse<Category[]>(
        savedCategories,
        () => [{ id: 'default', name: 'Mes Thèmes' }],
        'memory_categories'
      )
    } else {
      categories.value = [{ id: 'default', name: 'Mes Thèmes' }]
    }

    // 3. Load themes - charge depuis localStorage si présent, sinon depuis data.json
    if (savedThemes) {
      themes.value = safeParse<Theme[]>(
        savedThemes,
        () => sourceData.themes.map((t: any) => ({
          id: String(t.id),
          categoryId: t.categoryId || 'default',
          titre: t.titre,
          maxLevel: t.maxLevel || 7,
          newCardsPerDay: t.newCardsPerDay || 10
        })),
        'memory_themes'
      )
    } else {
      // Pas de clé dans localStorage = premier lancement, charger data.json
      themes.value = sourceData.themes.map((t: any) => ({
        id: String(t.id),
        categoryId: t.categoryId || 'default',
        titre: t.titre,
        maxLevel: t.maxLevel || 7,
        newCardsPerDay: t.newCardsPerDay || 10
      }))
    }

    // 4. Load cards - charge depuis localStorage si présent, sinon depuis data.json
    if (savedCards) {
      cards.value = safeParse<Card[]>(
        savedCards,
        () => sourceData.cards.map((c: any) => ({
          id: String(c.id),
          themeId: String(c.themeId),
          recto: c.recto,
          rectoType: c.rectoType || 'text',
          rectoContent: c.rectoContent || '',
          verso: c.verso,
          versoType: c.versoType || 'text',
          versoContent: c.versoContent || '',
          niveau: c.niveau || 1,
          nextReviewDate: c.nextReviewDate || new Date().toISOString().split('T')[0]
        })) as Card[],
        'memory_cards'
      )
    } else {
      // Pas de clé dans localStorage = premier lancement, charger data.json
      cards.value = sourceData.cards.map((c: any) => ({
        id: String(c.id),
        themeId: String(c.themeId),
        recto: c.recto,
        rectoType: c.rectoType || 'text',
        rectoContent: c.rectoContent || '',
        verso: c.verso,
        versoType: c.versoType || 'text',
        versoContent: c.versoContent || '',
        niveau: c.niveau || 1,
        nextReviewDate: c.nextReviewDate || new Date().toISOString().split('T')[0]
      })) as Card[]
    }

    // 5. Charger les données utilisateur
    if (savedUser) {
      const parsed = safeParse<{ pseudo?: string, score?: number }>(
        savedUser,
        () => ({ pseudo: '', score: 0 }),
        'memory_user'
      )
      pseudo.value = parsed.pseudo || ''
      score.value = parsed.score || 0
    }
  }

  // Initialize immediately
  init()

  // Observateurs pour la persistance
  watch([categories, themes, cards], () => {
    localStorage.setItem('memory_categories', JSON.stringify(categories.value))
    localStorage.setItem('memory_themes', JSON.stringify(themes.value))
    localStorage.setItem('memory_cards', JSON.stringify(cards.value))
  }, { deep: true })

  watch([pseudo, score], () => {
    localStorage.setItem('memory_user', JSON.stringify({ pseudo: pseudo.value, score: score.value }))
  })

  // Propriétés calculées
  const totalCartes = computed(() => cards.value.length)
  const cartesMemorisees = computed(() => cards.value.filter(c => c.niveau > 1).length)
  const pourcentageProgression = computed(() => {
    if (totalCartes.value === 0) return 0
    return Math.round((cartesMemorisees.value / totalCartes.value) * 100)
  })

  // Actions
  function definirPseudo(nom: string) {
    pseudo.value = nom
  }

  function deconnecterUtilisateur() {
    pseudo.value = ''
    score.value = 0
  }

  function gagnerPoints(points: number) {
    score.value += points
  }

  function addCategory(name: string) {
    categories.value.push({ id: crypto.randomUUID(), name })
  }

  function updateCategory(id: string, name: string) {
    const cat = categories.value.find(c => c.id === id)
    if (cat) cat.name = name
  }

  function deleteCategory(id: string) {
    categories.value = categories.value.filter(c => c.id !== id)
    const themesToDelete = themes.value.filter(t => t.categoryId === id)
    themesToDelete.forEach(t => deleteTheme(t.id))
  }

  function addTheme(categoryId: string, title: string, maxLevel = 7, newCardsPerDay = 10) {
    themes.value.push({
      id: crypto.randomUUID(),
      categoryId,
      titre: title,
      maxLevel,
      newCardsPerDay
    })
  }

  function updateTheme(id: string, updates: Partial<Theme>) {
    const theme = themes.value.find(t => t.id === id)
    if (theme) Object.assign(theme, updates)
  }

  function deleteTheme(id: string) {
    themes.value = themes.value.filter(t => t.id !== id)
    cards.value = cards.value.filter(c => c.themeId !== id)
  }

  function addCard(card: Omit<Card, 'id' | 'niveau' | 'nextReviewDate'>) {
    cards.value.push({
      ...card,
      id: crypto.randomUUID(),
      niveau: 1,
      nextReviewDate: new Date().toISOString().split('T')[0] as string
    })
  }

  function updateCard(id: string, updates: Partial<Card>) {
    const card = cards.value.find(c => c.id === id)
    if (card) Object.assign(card, updates)
  }

  function deleteCard(id: string) {
    cards.value = cards.value.filter(c => c.id !== id)
  }

  function incrementerNiveau(cardId: string) {
    const card = cards.value.find(c => c.id === cardId)
    if (card) {
      const theme = themes.value.find(t => t.id === card.themeId)
      const maxLevel = theme?.maxLevel || 7
      if (card.niveau < maxLevel) card.niveau++

      const jours = Math.pow(2, card.niveau - 1)
      const date = new Date()
      date.setDate(date.getDate() + jours)
      card.nextReviewDate = date.toISOString().split('T')[0] as string
    }
  }

  function echecRevision(cardId: string) {
    const card = cards.value.find(c => c.id === cardId)
    if (card) {
      card.niveau = 1
      card.nextReviewDate = new Date().toISOString().split('T')[0] as string
    }
  }

  function importTestData() {
    // Vider le localStorage
    localStorage.removeItem('memory_categories')
    localStorage.removeItem('memory_themes')
    localStorage.removeItem('memory_cards')

    // Charger depuis data.json
    // @ts-ignore
    const data = sourceData as { categories: Category[], themes: any[], cards: any[] }

    if (data.categories) {
      categories.value = data.categories.map(c => ({
        id: String(c.id),
        name: c.name
      }))
    } else {
      categories.value = [{ id: 'default', name: 'Mes Thèmes' }]
    }

    themes.value = data.themes.map((t: any) => ({
      id: String(t.id),
      categoryId: t.categoryId || 'default',
      titre: t.titre,
      maxLevel: t.maxLevel || 7,
      newCardsPerDay: t.newCardsPerDay || 10
    }))

    cards.value = data.cards.map((c: any) => ({
      id: String(c.id),
      themeId: String(c.themeId),
      recto: c.recto,
      rectoType: c.rectoType || 'text',
      rectoContent: c.rectoContent || '',
      verso: c.verso,
      versoType: c.versoType || 'text',
      versoContent: c.versoContent || '',
      niveau: c.niveau || 1,
      nextReviewDate: c.nextReviewDate || new Date().toISOString().split('T')[0]
    })) as Card[]
  }

  return {
    categories, themes, cards, pseudo, score,
    totalCartes, cartesMemorisees, pourcentageProgression,
    definirPseudo, deconnecterUtilisateur, gagnerPoints,
    addCategory, updateCategory, deleteCategory,
    addTheme, updateTheme, deleteTheme,
    addCard, updateCard, deleteCard,
    incrementerNiveau, echecRevision,
    importTestData
  }
})
