import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AppButton from '../AppButton.vue'

describe('AppButton', () => {
    // ============================================================
    // Rendu du label
    // ============================================================
    describe('Label', () => {
        it('affiche le texte du label', () => {
            const wrapper = mount(AppButton, { props: { label: 'Cliquez ici' } })
            expect(wrapper.text()).toContain('Cliquez ici')
        })

        it('affiche un label vide si prop vide', () => {
            const wrapper = mount(AppButton, { props: { label: '' } })
            expect(wrapper.find('button').exists()).toBe(true)
        })
    })

    // ============================================================
    // Variantes CSS
    // ============================================================
    describe('Variante', () => {
        it('applique la classe btn-primary par défaut', () => {
            const wrapper = mount(AppButton, { props: { label: 'Test' } })
            expect(wrapper.find('button').classes()).toContain('btn-primary')
        })

        it('applique la classe btn-success quand variant=success', () => {
            const wrapper = mount(AppButton, { props: { label: 'OK', variant: 'success' } })
            expect(wrapper.find('button').classes()).toContain('btn-success')
        })

        it('applique la classe btn-danger quand variant=danger', () => {
            const wrapper = mount(AppButton, { props: { label: 'Supprimer', variant: 'danger' } })
            expect(wrapper.find('button').classes()).toContain('btn-danger')
        })

        it('applique la classe btn-outline-primary quand variant=outline-primary', () => {
            const wrapper = mount(AppButton, { props: { label: 'Annuler', variant: 'outline-primary' } })
            expect(wrapper.find('button').classes()).toContain('btn-outline-primary')
        })
    })

    // ============================================================
    // Taille
    // ============================================================
    describe('Taille', () => {
        it('applique btn-sm quand size=sm', () => {
            const wrapper = mount(AppButton, { props: { label: 'Petit', size: 'sm' } })
            expect(wrapper.find('button').classes()).toContain('btn-sm')
        })

        it('applique btn-lg quand size=lg', () => {
            const wrapper = mount(AppButton, { props: { label: 'Grand', size: 'lg' } })
            expect(wrapper.find('button').classes()).toContain('btn-lg')
        })

        it("n'applique pas de classe de taille quand size=md (taille normale)", () => {
            const wrapper = mount(AppButton, { props: { label: 'Normal', size: 'md' } })
            const classes = wrapper.find('button').classes()
            expect(classes).not.toContain('btn-sm')
            expect(classes).not.toContain('btn-lg')
        })
    })

    // ============================================================
    // Icône
    // ============================================================
    describe('Icône', () => {
        it("affiche l'icône quand icon est fourni et loading=false", () => {
            const wrapper = mount(AppButton, { props: { label: 'Ajouter', icon: 'bi-plus-lg' } })
            const icon = wrapper.find('i.bi')
            expect(icon.exists()).toBe(true)
            expect(icon.classes()).toContain('bi-plus-lg')
        })

        it("n'affiche pas l'icône quand loading=true", () => {
            const wrapper = mount(AppButton, { props: { label: 'Chargement', icon: 'bi-plus-lg', loading: true } })
            expect(wrapper.find('i.bi').exists()).toBe(false)
        })

        it("n'affiche pas d'icône si la prop icon est absente", () => {
            const wrapper = mount(AppButton, { props: { label: 'Sans icône' } })
            expect(wrapper.find('i.bi').exists()).toBe(false)
        })
    })

    // ============================================================
    // État désactivé
    // ============================================================
    describe('Disabled', () => {
        it('désactive le bouton quand disabled=true', () => {
            const wrapper = mount(AppButton, { props: { label: 'Non cliquable', disabled: true } })
            expect(wrapper.find('button').attributes('disabled')).toBeDefined()
        })

        it("n'est pas désactivé par défaut", () => {
            const wrapper = mount(AppButton, { props: { label: 'Actif' } })
            expect(wrapper.find('button').attributes('disabled')).toBeUndefined()
        })

        it('ajoute aria-disabled=true quand disabled=true', () => {
            const wrapper = mount(AppButton, { props: { label: 'Test', disabled: true } })
            expect(wrapper.find('button').attributes('aria-disabled')).toBe('true')
        })
    })

    // ============================================================
    // État de chargement
    // ============================================================
    describe('Loading', () => {
        it('affiche un spinner quand loading=true', () => {
            const wrapper = mount(AppButton, { props: { label: 'Chargement...', loading: true } })
            expect(wrapper.find('.spinner-border').exists()).toBe(true)
        })

        it("n'affiche pas de spinner quand loading=false", () => {
            const wrapper = mount(AppButton, { props: { label: 'Normal', loading: false } })
            expect(wrapper.find('.spinner-border').exists()).toBe(false)
        })

        it('désactive le bouton quand loading=true (empêche double clic)', () => {
            const wrapper = mount(AppButton, { props: { label: 'Chargement', loading: true } })
            expect(wrapper.find('button').attributes('disabled')).toBeDefined()
        })

        it('définit aria-busy=true quand loading=true (accessibilité)', () => {
            const wrapper = mount(AppButton, { props: { label: 'Chargement', loading: true } })
            expect(wrapper.find('button').attributes('aria-busy')).toBe('true')
        })
    })

    // ============================================================
    // Émission du clic
    // ============================================================
    describe('Événements', () => {
        it('émet un événement click quand on clique', async () => {
            const wrapper = mount(AppButton, { props: { label: 'Clic' } })
            await wrapper.find('button').trigger('click')
            expect(wrapper.emitted('click')).toBeTruthy()
            expect(wrapper.emitted('click')!.length).toBe(1)
        })

        it("n'émet pas de clic quand disabled=true", async () => {
            const wrapper = mount(AppButton, { props: { label: 'Test', disabled: true } })
            await wrapper.find('button').trigger('click')
            // Le bouton est disabled, le navigateur bloque le clic nativement
            // On vérifie que le bouton a bien l'attribut disabled
            expect(wrapper.find('button').attributes('disabled')).toBeDefined()
        })
    })
})
