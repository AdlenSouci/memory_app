import type { Meta, StoryObj } from '@storybook/vue3'
import MemoryCard from './MemoryCard.vue'

const meta = {
    title: 'Components/MemoryCard',
    component: MemoryCard,
    tags: ['autodocs'],
    argTypes: {
        recto: { control: 'text', description: 'Front side text' },
        verso: { control: 'text', description: 'Back side text' },
        rectoType: {
            control: 'select',
            options: ['text', 'image', 'audio', 'video'],
            description: 'Type of media on front'
        },
        versoType: {
            control: 'select',
            options: ['text', 'image', 'audio', 'video'],
            description: 'Type of media on back'
        }
    }
} satisfies Meta<typeof MemoryCard>

export default meta
type Story = StoryObj<typeof meta>

export const TextOnly: Story = {
    args: {
        recto: 'Que signifie HTML ?',
        verso: 'HyperText Markup Language',
        rectoType: 'text',
        versoType: 'text',
        rectoContent: '',
        versoContent: ''
    }
}

export const LongText: Story = {
    args: {
        recto: 'Expliquez le principe de la répétition espacée',
        verso: 'La répétition espacée est une technique d\'apprentissage qui consiste à réviser l\'information à des intervalles de temps croissants pour optimiser la mémorisation à long terme.',
        rectoType: 'text',
        versoType: 'text',
        rectoContent: '',
        versoContent: ''
    }
}

export const WithImageRecto: Story = {
    args: {
        recto: 'Quel est ce logo ?',
        verso: 'Vue.js',
        rectoType: 'image',
        versoType: 'text',
        rectoContent: 'https://vuejs.org/images/logo.png',
        versoContent: ''
    }
}

export const ShortQuestion: Story = {
    args: {
        recto: 'CSS ?',
        verso: 'Cascading Style Sheets',
        rectoType: 'text',
        versoType: 'text',
        rectoContent: '',
        versoContent: ''
    }
}
