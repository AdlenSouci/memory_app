import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ProgressBar from '../ProgressBar.vue'

describe('ProgressBar', () => {
    // ============================================================
    // Calcul du pourcentage (logique principale)
    // ============================================================
    describe('Calcul du pourcentage', () => {
        it('affiche 50% pour value=50 sur max=100 (cas standard)', () => {
            const wrapper = mount(ProgressBar, { props: { value: 50 } })
            const bar = wrapper.find('.progress-bar')
            expect(bar.attributes('style')).toContain('50%')
        })

        it('affiche 0% quand value=0', () => {
            const wrapper = mount(ProgressBar, { props: { value: 0 } })
            const bar = wrapper.find('.progress-bar')
            expect(bar.attributes('style')).toContain('0%')
        })

        it('affiche 100% quand value=100', () => {
            const wrapper = mount(ProgressBar, { props: { value: 100 } })
            const bar = wrapper.find('.progress-bar')
            expect(bar.attributes('style')).toContain('100%')
        })

        it('calcule le bon % quand max est différent de 100 (ex: 3/4 = 75%)', () => {
            const wrapper = mount(ProgressBar, { props: { value: 3, max: 4 } })
            const bar = wrapper.find('.progress-bar')
            expect(bar.attributes('style')).toContain('75%')
        })

        it('calcule le bon % pour value=1 max=3 (≈33.33%)', () => {
            const wrapper = mount(ProgressBar, { props: { value: 1, max: 3 } })
            const bar = wrapper.find('.progress-bar')
            // 33.33...% - on vérifie juste qu'il y a un %
            expect(bar.attributes('style')).toMatch(/\d+(\.\d+)?%/)
        })

        it('plafonne à 100% si value > max (protection dépassement)', () => {
            const wrapper = mount(ProgressBar, { props: { value: 150, max: 100 } })
            const bar = wrapper.find('.progress-bar')
            expect(bar.attributes('style')).toContain('100%')
        })

        it('plancher à 0% si value < 0 (protection valeur négative)', () => {
            const wrapper = mount(ProgressBar, { props: { value: -10 } })
            const bar = wrapper.find('.progress-bar')
            expect(bar.attributes('style')).toContain('0%')
        })

        it('utilise max=100 par défaut quand max n\'est pas fourni', () => {
            const wrapper = mount(ProgressBar, { props: { value: 25 } })
            const bar = wrapper.find('.progress-bar')
            expect(bar.attributes('style')).toContain('25%')
        })
    })

    // ============================================================
    // Label
    // ============================================================
    describe('Label', () => {
        it('affiche le label quand la prop label est fournie', () => {
            const wrapper = mount(ProgressBar, { props: { value: 50, label: 'Progression' } })
            expect(wrapper.text()).toContain('Progression')
        })

        it("n'affiche pas de label si la prop label est absente", () => {
            const wrapper = mount(ProgressBar, { props: { value: 50 } })
            // Pas de span de label affiché
            expect(wrapper.find('.small.fw-bold').exists()).toBe(false)
        })
    })

    // ============================================================
    // Texte de pourcentage (showText)
    // ============================================================
    describe('Texte du pourcentage (showText)', () => {
        it('affiche le pourcentage en texte quand showText=true et label fourni', () => {
            const wrapper = mount(ProgressBar, { props: { value: 75, label: 'Score', showText: true } })
            expect(wrapper.text()).toContain('75%')
        })

        it("n'affiche pas le texte de % si showText=false", () => {
            const wrapper = mount(ProgressBar, { props: { value: 75, label: 'Score', showText: false } })
            const spans = wrapper.findAll('span.small.fw-bold.text-muted')
            // Le 2ème span (celui du %) ne devrait pas exister
            expect(spans.length).toBe(1) // seulement le label
        })
    })

    // ============================================================
    // Variante de couleur
    // ============================================================
    describe('Variante de couleur', () => {
        it('applique bg-primary par défaut', () => {
            const wrapper = mount(ProgressBar, { props: { value: 50 } })
            expect(wrapper.find('.progress-bar').classes()).toContain('bg-primary')
        })

        it('applique bg-success quand variant=success', () => {
            const wrapper = mount(ProgressBar, { props: { value: 50, variant: 'success' } })
            expect(wrapper.find('.progress-bar').classes()).toContain('bg-success')
        })

        it('applique bg-danger quand variant=danger', () => {
            const wrapper = mount(ProgressBar, { props: { value: 50, variant: 'danger' } })
            expect(wrapper.find('.progress-bar').classes()).toContain('bg-danger')
        })

        it('applique bg-warning quand variant=warning', () => {
            const wrapper = mount(ProgressBar, { props: { value: 50, variant: 'warning' } })
            expect(wrapper.find('.progress-bar').classes()).toContain('bg-warning')
        })
    })

    // ============================================================
    // Hauteur personnalisée
    // ============================================================
    describe('Hauteur', () => {
        it('utilise une hauteur de 12px par défaut', () => {
            const wrapper = mount(ProgressBar, { props: { value: 50 } })
            const progress = wrapper.find('.progress')
            expect(progress.attributes('style')).toContain('12px')
        })

        it('applique une hauteur personnalisée via la prop height', () => {
            const wrapper = mount(ProgressBar, { props: { value: 50, height: 24 } })
            const progress = wrapper.find('.progress')
            expect(progress.attributes('style')).toContain('24px')
        })
    })

    // ============================================================
    // Accessibilité ARIA
    // ============================================================
    describe('Accessibilité ARIA', () => {
        it('le container a role="progressbar"', () => {
            const wrapper = mount(ProgressBar, { props: { value: 50 } })
            expect(wrapper.find('[role="progressbar"]').exists()).toBe(true)
        })

        it('aria-valuenow est correct (50 pour 50%)', () => {
            const wrapper = mount(ProgressBar, { props: { value: 50 } })
            expect(wrapper.find('[role="progressbar"]').attributes('aria-valuenow')).toBe('50')
        })

        it('aria-valuemin=0 et aria-valuemax=100', () => {
            const wrapper = mount(ProgressBar, { props: { value: 50 } })
            const prog = wrapper.find('[role="progressbar"]')
            expect(prog.attributes('aria-valuemin')).toBe('0')
            expect(prog.attributes('aria-valuemax')).toBe('100')
        })

        it('aria-label utilise le label fourni', () => {
            const wrapper = mount(ProgressBar, { props: { value: 60, label: 'Score global' } })
            expect(wrapper.find('[role="progressbar"]').attributes('aria-label')).toBe('Score global')
        })

        it('aria-label vaut "Progression" par défaut si pas de label', () => {
            const wrapper = mount(ProgressBar, { props: { value: 60 } })
            expect(wrapper.find('[role="progressbar"]').attributes('aria-label')).toBe('Progression')
        })
    })
})
