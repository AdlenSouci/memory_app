import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import MemoryCard from '../MemoryCard.vue'

/** Props de base pour une carte texte simple */
const baseProps = {
    recto: 'Quelle est la capitale de la France ?',
    rectoType: 'text' as const,
    verso: 'Paris',
    versoType: 'text' as const,
}

describe('MemoryCard', () => {
    // ============================================================
    // Rendu initial (recto = question)
    // ============================================================
    describe('Affichage initial (côté question)', () => {
        it('affiche le texte du recto au démarrage', () => {
            const wrapper = mount(MemoryCard, { props: baseProps })
            expect(wrapper.text()).toContain('Quelle est la capitale de la France ?')
        })

        it('affiche le label "Question" au démarrage', () => {
            const wrapper = mount(MemoryCard, { props: baseProps })
            expect(wrapper.text()).toContain('Question')
        })

        it("n'affiche pas la réponse (verso) avant le flip", () => {
            const wrapper = mount(MemoryCard, { props: baseProps })
            expect(wrapper.text()).not.toContain('Paris')
        })

        it('affiche le message "Cliquez pour voir la réponse"', () => {
            const wrapper = mount(MemoryCard, { props: baseProps })
            expect(wrapper.text()).toContain('Cliquez pour voir la réponse')
        })

        it("n'affiche pas les boutons Su/Pas su avant le flip", () => {
            const wrapper = mount(MemoryCard, { props: baseProps })
            expect(wrapper.text()).not.toContain('Su')
            expect(wrapper.text()).not.toContain('Pas su')
        })
    })

    // ============================================================
    // Flip de la carte (côté réponse)
    // ============================================================
    describe('Flip de la carte (affichage verso)', () => {
        it('affiche le verso après un clic sur la carte', async () => {
            const wrapper = mount(MemoryCard, { props: baseProps })
            await wrapper.find('[role="button"]').trigger('click')
            expect(wrapper.text()).toContain('Paris')
        })

        it('affiche le label "Réponse" après le flip', async () => {
            const wrapper = mount(MemoryCard, { props: baseProps })
            await wrapper.find('[role="button"]').trigger('click')
            expect(wrapper.text()).toContain('Réponse')
        })

        it('masque la question après le flip', async () => {
            const wrapper = mount(MemoryCard, { props: baseProps })
            await wrapper.find('[role="button"]').trigger('click')
            expect(wrapper.text()).not.toContain('Cliquez pour voir la réponse')
        })

        it('affiche les boutons "Su" et "Pas su" après le flip', async () => {
            const wrapper = mount(MemoryCard, { props: baseProps })
            await wrapper.find('[role="button"]').trigger('click')
            expect(wrapper.text()).toContain('Su')
            expect(wrapper.text()).toContain('Pas su')
        })

        it('peut être retourné via la touche Enter (accessibilité clavier)', async () => {
            const wrapper = mount(MemoryCard, { props: baseProps })
            await wrapper.find('[role="button"]').trigger('keydown.enter')
            expect(wrapper.text()).toContain('Paris')
        })

        it('peut être retourné via la barre espace (accessibilité clavier)', async () => {
            const wrapper = mount(MemoryCard, { props: baseProps })
            await wrapper.find('[role="button"]').trigger('keydown.space')
            expect(wrapper.text()).toContain('Paris')
        })
    })

    // ============================================================
    // Émission de réponse
    // ============================================================
    describe("Émission de l'événement answer", () => {
        it('émet answer(true) quand on clique "Su"', async () => {
            const wrapper = mount(MemoryCard, { props: baseProps })
            await wrapper.find('[role="button"]').trigger('click')
            const buttons = wrapper.findAll('button')
            const suBtn = buttons.find(b => b.text().includes('Su') && !b.text().includes('Pas'))
            await suBtn!.trigger('click')
            expect(wrapper.emitted('answer')).toBeTruthy()
            expect(wrapper.emitted('answer')![0]).toEqual([true])
        })

        it('émet answer(false) quand on clique "Pas su"', async () => {
            const wrapper = mount(MemoryCard, { props: baseProps })
            await wrapper.find('[role="button"]').trigger('click')
            const buttons = wrapper.findAll('button')
            const passuBtn = buttons.find(b => b.text().includes('Pas su'))
            await passuBtn!.trigger('click')
            expect(wrapper.emitted('answer')).toBeTruthy()
            expect(wrapper.emitted('answer')![0]).toEqual([false])
        })

        it('revient au recto (question) après avoir répondu "Su"', async () => {
            const wrapper = mount(MemoryCard, { props: baseProps })
            await wrapper.find('[role="button"]').trigger('click')
            const buttons = wrapper.findAll('button')
            const suBtn = buttons.find(b => b.text().includes('Su') && !b.text().includes('Pas'))
            await suBtn!.trigger('click')
            expect(wrapper.text()).toContain('Question')
            expect(wrapper.text()).not.toContain('Réponse')
        })

        it('revient au recto (question) après avoir répondu "Pas su"', async () => {
            const wrapper = mount(MemoryCard, { props: baseProps })
            await wrapper.find('[role="button"]').trigger('click')
            const buttons = wrapper.findAll('button')
            const passuBtn = buttons.find(b => b.text().includes('Pas su'))
            await passuBtn!.trigger('click')
            expect(wrapper.text()).toContain('Question')
        })
    })

    // ============================================================
    // Réinitialisation automatique quand la prop recto change
    // ============================================================
    describe('Réinitialisation automatique', () => {
        it('revient au recto quand la question change (watcher)', async () => {
            const wrapper = mount(MemoryCard, { props: baseProps })
            // Flip la carte
            await wrapper.find('[role="button"]').trigger('click')
            expect(wrapper.text()).toContain('Réponse')

            // Changer la question (simule la carte suivante dans la session)
            await wrapper.setProps({ recto: 'Nouvelle question', verso: 'Nouvelle réponse' })

            // Doit revenir au recto
            expect(wrapper.text()).toContain('Question')
            expect(wrapper.text()).not.toContain('Réponse')
        })
    })

    // ============================================================
    // Support multimédia
    // ============================================================
    describe('Contenu multimédia', () => {
        it("affiche une image au recto quand rectoType='image'", () => {
            const wrapper = mount(MemoryCard, {
                props: {
                    ...baseProps,
                    recto: 'Quel logo est-ce ?',
                    rectoType: 'image' as const,
                    rectoContent: 'https://vuejs.org/images/logo.png',
                }
            })
            const img = wrapper.find('img')
            expect(img.exists()).toBe(true)
            expect(img.attributes('src')).toBe('https://vuejs.org/images/logo.png')
        })

        it("affiche un audio au recto quand rectoType='audio'", () => {
            const wrapper = mount(MemoryCard, {
                props: {
                    ...baseProps,
                    recto: 'Écoutez',
                    rectoType: 'audio' as const,
                    rectoContent: 'data:audio/mp3;base64,...',
                }
            })
            const audio = wrapper.find('audio')
            expect(audio.exists()).toBe(true)
        })

        it("affiche une vidéo au recto quand rectoType='video'", () => {
            const wrapper = mount(MemoryCard, {
                props: {
                    ...baseProps,
                    recto: 'Regardez',
                    rectoType: 'video' as const,
                    rectoContent: 'data:video/mp4;base64,...',
                }
            })
            const video = wrapper.find('video')
            expect(video.exists()).toBe(true)
        })

        it("n'affiche pas d'image si rectoContent est vide", () => {
            const wrapper = mount(MemoryCard, {
                props: {
                    ...baseProps,
                    rectoType: 'image' as const,
                    rectoContent: '',
                }
            })
            expect(wrapper.find('img').exists()).toBe(false)
        })
    })

    // ============================================================
    // Accessibilité ARIA
    // ============================================================
    describe('Accessibilité', () => {
        it('le conteneur a role="region"', () => {
            const wrapper = mount(MemoryCard, { props: baseProps })
            expect(wrapper.find('[role="region"]').exists()).toBe(true)
        })

        it('le côté question a role="button" et tabindex=0', () => {
            const wrapper = mount(MemoryCard, { props: baseProps })
            const btn = wrapper.find('[role="button"]')
            expect(btn.exists()).toBe(true)
            expect(btn.attributes('tabindex')).toBe('0')
        })
    })
})
