import type { Meta, StoryObj } from '@storybook/vue3'
import ProgressBar from './ProgressBar.vue'

const meta = {
    title: 'Components/ProgressBar',
    component: ProgressBar,
    tags: ['autodocs'],
    argTypes: {
        value: { control: { type: 'range', min: 0, max: 100, step: 1 }, description: 'Valeur actuelle' },
        max: { control: 'number', description: 'Valeur maximale' },
        label: { control: 'text', description: 'Label affiché au-dessus de la barre' },
        variant: {
            control: 'select',
            options: ['primary', 'success', 'danger', 'warning', 'info'],
            description: 'Couleur de la barre'
        },
        showText: { control: 'boolean', description: 'Afficher le pourcentage' },
        height: { control: 'number', description: 'Hauteur en pixels' }
    }
} satisfies Meta<typeof ProgressBar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    args: {
        value: 50,
        label: 'Progression',
        showText: true
    }
}

export const Empty: Story = {
    args: {
        value: 0,
        label: 'Pas encore commencé',
        showText: true
    }
}

export const Full: Story = {
    args: {
        value: 100,
        label: 'Complété !',
        showText: true,
        variant: 'success'
    }
}

export const CustomMax: Story = {
    args: {
        value: 7,
        max: 20,
        label: '7 cartes sur 20',
        showText: true,
        variant: 'info'
    }
}

export const Danger: Story = {
    args: {
        value: 15,
        label: 'Faible progression',
        showText: true,
        variant: 'danger'
    }
}

export const Thin: Story = {
    args: {
        value: 65,
        label: 'Barre fine',
        showText: true,
        height: 6
    }
}

export const Thick: Story = {
    args: {
        value: 80,
        label: 'Barre épaisse',
        showText: true,
        height: 24,
        variant: 'warning'
    }
}

export const NoLabel: Story = {
    args: {
        value: 42,
        variant: 'primary'
    }
}
