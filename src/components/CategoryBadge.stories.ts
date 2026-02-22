import type { Meta, StoryObj } from '@storybook/vue3'
import CategoryBadge from './CategoryBadge.vue'

const meta = {
    title: 'Components/CategoryBadge',
    component: CategoryBadge,
    tags: ['autodocs'],
    argTypes: {
        name: { control: 'text', description: 'Nom de la catégorie' },
        count: { control: 'number', description: 'Nombre de thèmes' },
        variant: {
            control: 'select',
            options: ['light', 'primary', 'success', 'warning', 'info'],
            description: 'Variante de couleur'
        },
        icon: { control: 'text', description: 'Classe d\'icône Bootstrap Icons' }
    }
} satisfies Meta<typeof CategoryBadge>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    args: {
        name: 'Informatique',
        count: 4
    }
}

export const WithIcon: Story = {
    args: {
        name: 'Sciences',
        count: 3,
        icon: 'bi-book',
        variant: 'primary'
    }
}

export const Success: Story = {
    args: {
        name: 'Complété',
        count: 10,
        variant: 'success',
        icon: 'bi-check-circle'
    }
}

export const Warning: Story = {
    args: {
        name: 'En cours',
        count: 2,
        variant: 'warning',
        icon: 'bi-clock'
    }
}

export const NoCount: Story = {
    args: {
        name: 'Culture Générale',
        variant: 'info'
    }
}

export const LongName: Story = {
    args: {
        name: 'Développement Web et Applications Mobiles',
        count: 15,
        variant: 'primary'
    }
}
