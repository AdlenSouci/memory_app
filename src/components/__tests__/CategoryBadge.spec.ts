import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import CategoryBadge from '../CategoryBadge.vue'

describe('CategoryBadge', () => {
    // ============================================================
    // Rendu du nom
    // ============================================================
    describe('Nom de la catégorie', () => {
        it('affiche le nom de la catégorie', () => {
            const wrapper = mount(CategoryBadge, { props: { name: 'Langues' } })
            expect(wrapper.text()).toContain('Langues')
        })

        it('affiche un nom long correctement', () => {
            const wrapper = mount(CategoryBadge, { props: { name: 'Histoire de l\'art médiéval' } })
            expect(wrapper.text()).toContain('Histoire de l\'art médiéval')
        })
    })

    // ============================================================
    // Compteur de thèmes
    // ============================================================
    describe('Compteur (prop count)', () => {
        it('affiche le nombre de thèmes quand count est fourni', () => {
            const wrapper = mount(CategoryBadge, { props: { name: 'Maths', count: 5 } })
            expect(wrapper.text()).toContain('(5)')
        })

        it("n'affiche pas le compteur si count n'est pas fourni", () => {
            const wrapper = mount(CategoryBadge, { props: { name: 'Science' } })
            expect(wrapper.text()).not.toContain('(')
        })

        it('affiche (0) quand count vaut 0', () => {
            const wrapper = mount(CategoryBadge, { props: { name: 'Vide', count: 0 } })
            expect(wrapper.text()).toContain('(0)')
        })
    })

    // ============================================================
    // Variante de couleur
    // ============================================================
    describe('Variante de couleur', () => {
        it("applique les classes light/bg-light par défaut si variant n'est pas fourni", () => {
            const wrapper = mount(CategoryBadge, { props: { name: 'Defaut' } })
            expect(wrapper.find('span.badge').classes()).toContain('bg-light')
        })

        it('applique les classes de couleur pour variant=primary', () => {
            const wrapper = mount(CategoryBadge, { props: { name: 'Principal', variant: 'primary' } })
            const badge = wrapper.find('span.badge')
            expect(badge.classes().some(c => c.includes('primary'))).toBe(true)
        })

        it('applique les classes de couleur pour variant=success', () => {
            const wrapper = mount(CategoryBadge, { props: { name: 'Succès', variant: 'success' } })
            const badge = wrapper.find('span.badge')
            expect(badge.classes().some(c => c.includes('success'))).toBe(true)
        })

        it('applique les classes de couleur pour variant=warning', () => {
            const wrapper = mount(CategoryBadge, { props: { name: 'Attention', variant: 'warning' } })
            const badge = wrapper.find('span.badge')
            expect(badge.classes().some(c => c.includes('warning'))).toBe(true)
        })

        it('applique les classes de couleur pour variant=info', () => {
            const wrapper = mount(CategoryBadge, { props: { name: 'Info', variant: 'info' } })
            const badge = wrapper.find('span.badge')
            expect(badge.classes().some(c => c.includes('info'))).toBe(true)
        })
    })

    // ============================================================
    // Icône
    // ============================================================
    describe('Icône', () => {
        it("affiche une icône quand la prop icon est fournie", () => {
            const wrapper = mount(CategoryBadge, { props: { name: 'Avec icône', icon: 'bi-star' } })
            const icon = wrapper.find('i.bi')
            expect(icon.exists()).toBe(true)
            expect(icon.classes()).toContain('bi-star')
        })

        it("n'affiche pas d'icône si la prop icon est absente", () => {
            const wrapper = mount(CategoryBadge, { props: { name: 'Sans icône' } })
            expect(wrapper.find('i.bi').exists()).toBe(false)
        })

        it("l'icône a aria-hidden=true (accessibilité)", () => {
            const wrapper = mount(CategoryBadge, { props: { name: 'Test', icon: 'bi-tag' } })
            expect(wrapper.find('i').attributes('aria-hidden')).toBe('true')
        })
    })

    // ============================================================
    // Structure HTML (badge pill)
    // ============================================================
    describe('Structure HTML', () => {
        it('est un élément <span>', () => {
            const wrapper = mount(CategoryBadge, { props: { name: 'Span' } })
            expect(wrapper.element.tagName).toBe('SPAN')
        })

        it('possède la classe "badge"', () => {
            const wrapper = mount(CategoryBadge, { props: { name: 'Badge' } })
            expect(wrapper.classes()).toContain('badge')
        })

        it('possède la classe "rounded-pill"', () => {
            const wrapper = mount(CategoryBadge, { props: { name: 'Pill' } })
            expect(wrapper.classes()).toContain('rounded-pill')
        })
    })
})
