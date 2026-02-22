import type { Meta, StoryObj } from '@storybook/vue3'
import AppButton from './AppButton.vue'

const meta = {
    title: 'Components/AppButton',
    component: AppButton,
    tags: ['autodocs'],
    argTypes: {
        label: { control: 'text', description: 'Texte du bouton' },
        variant: {
            control: 'select',
            options: ['primary', 'success', 'danger', 'warning', 'outline-primary', 'outline-danger', 'light'],
            description: 'Variante visuelle du bouton'
        },
        size: {
            control: 'select',
            options: ['sm', 'md', 'lg'],
            description: 'Taille du bouton'
        },
        icon: { control: 'text', description: 'Classe d\'icône Bootstrap Icons' },
        disabled: { control: 'boolean', description: 'Bouton désactivé' },
        loading: { control: 'boolean', description: 'Afficher un spinner de chargement' }
    }
} satisfies Meta<typeof AppButton>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
    args: {
        label: 'Valider',
        variant: 'primary'
    }
}

export const Success: Story = {
    args: {
        label: 'Sauvegarder',
        variant: 'success',
        icon: 'bi-check-lg'
    }
}

export const Danger: Story = {
    args: {
        label: 'Supprimer',
        variant: 'danger',
        icon: 'bi-trash'
    }
}

export const OutlinePrimary: Story = {
    args: {
        label: 'Annuler',
        variant: 'outline-primary'
    }
}

export const WithIcon: Story = {
    args: {
        label: 'Nouvelle Catégorie',
        variant: 'primary',
        icon: 'bi-plus-lg'
    }
}

export const Small: Story = {
    args: {
        label: 'Petit bouton',
        variant: 'primary',
        size: 'sm'
    }
}

export const Large: Story = {
    args: {
        label: 'Grand bouton',
        variant: 'primary',
        size: 'lg'
    }
}

export const Disabled: Story = {
    args: {
        label: 'Désactivé',
        variant: 'primary',
        disabled: true
    }
}

export const Loading: Story = {
    args: {
        label: 'Chargement...',
        variant: 'primary',
        loading: true
    }
}
