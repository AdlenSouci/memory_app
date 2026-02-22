import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useMemoryStore } from '../memory'

describe('Memory Store - Spaced Repetition Logic', () => {
    beforeEach(() => {
        setActivePinia(createPinia())
        // Clear localStorage to avoid cross-test contamination
        localStorage.clear()
    })

    // ============================================================
    // Card initialization
    // ============================================================
    it('initializes a new card with level 1', () => {
        const store = useMemoryStore()
        store.addTheme('cat1', 'Test Theme')
        store.addCard({
            themeId: store.themes[0].id,
            recto: 'Q', rectoType: 'text',
            verso: 'A', versoType: 'text'
        })
        const card = store.cards[store.cards.length - 1]
        expect(card.niveau).toBe(1)
        expect(typeof card.nextReviewDate).toBe('string')
    })

    // ============================================================
    // incrementerNiveau
    // ============================================================
    it('increments level from 1 to 2', () => {
        const store = useMemoryStore()
        store.addTheme('cat1', 'Test Theme')
        store.addCard({
            themeId: store.themes[0].id,
            recto: 'Q', rectoType: 'text',
            verso: 'A', versoType: 'text'
        })
        const card = store.cards[store.cards.length - 1]
        const cardId = card.id
        const initialDate = card.nextReviewDate

        store.incrementerNiveau(cardId)

        expect(card.niveau).toBe(2)
        expect(card.nextReviewDate).not.toBe(initialDate)
    })

    it('does not exceed maxLevel', () => {
        const store = useMemoryStore()
        store.addTheme('cat1', 'Test Theme', 3) // maxLevel = 3
        const themeId = store.themes[store.themes.length - 1].id
        store.addCard({
            themeId,
            recto: 'Q', rectoType: 'text',
            verso: 'A', versoType: 'text'
        })
        const card = store.cards[store.cards.length - 1]

        // Increment 5 times, should cap at 3
        for (let i = 0; i < 5; i++) {
            store.incrementerNiveau(card.id)
        }

        expect(card.niveau).toBe(3)
    })

    it('sets nextReviewDate further in the future for higher levels', () => {
        const store = useMemoryStore()
        store.addTheme('cat1', 'Test Theme')
        const themeId = store.themes[0].id
        store.addCard({
            themeId,
            recto: 'Q', rectoType: 'text',
            verso: 'A', versoType: 'text'
        })
        const card = store.cards[store.cards.length - 1]

        store.incrementerNiveau(card.id) // Level 2
        const dateLevel2 = card.nextReviewDate

        store.incrementerNiveau(card.id) // Level 3
        const dateLevel3 = card.nextReviewDate

        // Level 3 should have a later date than level 2
        expect(dateLevel3 >= dateLevel2).toBe(true)
    })

    // ============================================================
    // echecRevision
    // ============================================================
    it('resets card to level 1 on failure', () => {
        const store = useMemoryStore()
        store.addTheme('cat1', 'Test Theme')
        const themeId = store.themes[0].id
        store.addCard({
            themeId,
            recto: 'Q', rectoType: 'text',
            verso: 'A', versoType: 'text'
        })
        const card = store.cards[store.cards.length - 1]

        // Increment to level 3
        store.incrementerNiveau(card.id)
        store.incrementerNiveau(card.id)
        expect(card.niveau).toBe(3)

        // Fail: should reset to 1
        store.echecRevision(card.id)
        expect(card.niveau).toBe(1)
    })

    it('sets nextReviewDate to today on failure', () => {
        const store = useMemoryStore()
        store.addTheme('cat1', 'Test Theme')
        const themeId = store.themes[0].id
        store.addCard({
            themeId,
            recto: 'Q', rectoType: 'text',
            verso: 'A', versoType: 'text'
        })
        const card = store.cards[store.cards.length - 1]

        store.incrementerNiveau(card.id) // Push date to the future
        store.echecRevision(card.id)

        const today = new Date().toISOString().split('T')[0]
        expect(card.nextReviewDate).toBe(today)
    })

    // ============================================================
    // CRUD Categories
    // ============================================================
    describe('Categories CRUD', () => {
        it('adds a category', () => {
            const store = useMemoryStore()
            const initialLength = store.categories.length
            store.addCategory('Nouvelle Catégorie')
            expect(store.categories.length).toBe(initialLength + 1)
            expect(store.categories[store.categories.length - 1].name).toBe('Nouvelle Catégorie')
        })

        it('updates a category name', () => {
            const store = useMemoryStore()
            store.addCategory('Ancien Nom')
            const cat = store.categories[store.categories.length - 1]
            store.updateCategory(cat.id, 'Nouveau Nom')
            expect(cat.name).toBe('Nouveau Nom')
        })

        it('deletes a category and its themes/cards', () => {
            const store = useMemoryStore()
            store.addCategory('CatToDelete')
            const catId = store.categories[store.categories.length - 1].id

            store.addTheme(catId, 'Theme1')
            const themeId = store.themes[store.themes.length - 1].id
            store.addCard({
                themeId,
                recto: 'Q', rectoType: 'text',
                verso: 'A', versoType: 'text'
            })

            store.deleteCategory(catId)

            expect(store.categories.find(c => c.id === catId)).toBeUndefined()
            expect(store.themes.find(t => t.categoryId === catId)).toBeUndefined()
            expect(store.cards.find(c => c.themeId === themeId)).toBeUndefined()
        })
    })

    // ============================================================
    // CRUD Themes
    // ============================================================
    describe('Themes CRUD', () => {
        it('adds a theme with default configuration', () => {
            const store = useMemoryStore()
            store.addTheme('cat1', 'Mon Thème')
            const theme = store.themes[store.themes.length - 1]
            expect(theme.titre).toBe('Mon Thème')
            expect(theme.maxLevel).toBe(7)
            expect(theme.newCardsPerDay).toBe(10)
        })

        it('adds a theme with custom configuration', () => {
            const store = useMemoryStore()
            store.addTheme('cat1', 'Custom', 5, 20)
            const theme = store.themes[store.themes.length - 1]
            expect(theme.maxLevel).toBe(5)
            expect(theme.newCardsPerDay).toBe(20)
        })

        it('updates a theme', () => {
            const store = useMemoryStore()
            store.addTheme('cat1', 'Old Title')
            const theme = store.themes[store.themes.length - 1]
            store.updateTheme(theme.id, { titre: 'New Title', maxLevel: 10 })
            expect(theme.titre).toBe('New Title')
            expect(theme.maxLevel).toBe(10)
        })

        it('deletes a theme and its cards', () => {
            const store = useMemoryStore()
            store.addTheme('cat1', 'ThemeToDelete')
            const themeId = store.themes[store.themes.length - 1].id

            store.addCard({
                themeId,
                recto: 'Q', rectoType: 'text',
                verso: 'A', versoType: 'text'
            })

            store.deleteTheme(themeId)

            expect(store.themes.find(t => t.id === themeId)).toBeUndefined()
            expect(store.cards.find(c => c.themeId === themeId)).toBeUndefined()
        })
    })

    // ============================================================
    // CRUD Cards
    // ============================================================
    describe('Cards CRUD', () => {
        it('adds a card with media types', () => {
            const store = useMemoryStore()
            store.addTheme('cat1', 'Test')
            const themeId = store.themes[store.themes.length - 1].id

            store.addCard({
                themeId,
                recto: 'Image question',
                rectoType: 'image',
                rectoContent: 'data:image/png;base64,...',
                verso: 'Audio answer',
                versoType: 'audio',
                versoContent: 'data:audio/mp3;base64,...'
            })

            const card = store.cards[store.cards.length - 1]
            expect(card.rectoType).toBe('image')
            expect(card.versoType).toBe('audio')
            expect(card.rectoContent).toBe('data:image/png;base64,...')
        })

        it('updates a card', () => {
            const store = useMemoryStore()
            store.addTheme('cat1', 'Test')
            const themeId = store.themes[store.themes.length - 1].id

            store.addCard({
                themeId,
                recto: 'Old Q', rectoType: 'text',
                verso: 'Old A', versoType: 'text'
            })

            const card = store.cards[store.cards.length - 1]
            store.updateCard(card.id, { recto: 'New Q', verso: 'New A' })

            expect(card.recto).toBe('New Q')
            expect(card.verso).toBe('New A')
        })

        it('deletes a card', () => {
            const store = useMemoryStore()
            store.addTheme('cat1', 'Test')
            const themeId = store.themes[store.themes.length - 1].id

            store.addCard({
                themeId,
                recto: 'Q', rectoType: 'text',
                verso: 'A', versoType: 'text'
            })

            const cardId = store.cards[store.cards.length - 1].id
            store.deleteCard(cardId)

            expect(store.cards.find(c => c.id === cardId)).toBeUndefined()
        })
    })

    // ============================================================
    // User & Score
    // ============================================================
    describe('User & Score', () => {
        it('sets pseudo', () => {
            const store = useMemoryStore()
            store.definirPseudo('TestUser')
            expect(store.pseudo).toBe('TestUser')
        })

        it('adds points', () => {
            const store = useMemoryStore()
            store.gagnerPoints(10)
            store.gagnerPoints(20)
            expect(store.score).toBe(30)
        })
    })

    // ============================================================
    // Computed properties
    // ============================================================
    describe('Computed properties', () => {
        it('calculates total cards', () => {
            const store = useMemoryStore()
            expect(store.totalCartes).toBeGreaterThanOrEqual(0)
        })

        it('calculates progression percentage', () => {
            const store = useMemoryStore()
            // Clear all cards first
            store.cards.splice(0)

            store.addTheme('cat1', 'Test')
            const themeId = store.themes[store.themes.length - 1].id

            // Add 2 cards
            store.addCard({ themeId, recto: 'Q1', rectoType: 'text', verso: 'A1', versoType: 'text' })
            store.addCard({ themeId, recto: 'Q2', rectoType: 'text', verso: 'A2', versoType: 'text' })

            // Increment one card
            store.incrementerNiveau(store.cards[store.cards.length - 1].id)

            expect(store.pourcentageProgression).toBe(50)
        })
    })

    // ============================================================
    // Import test data
    // ============================================================
    describe('Import test data', () => {
        it('imports test data successfully', () => {
            const store = useMemoryStore()
            store.importTestData()
            expect(store.themes.length).toBeGreaterThan(0)
            expect(store.cards.length).toBeGreaterThan(0)
        })
    })
})
