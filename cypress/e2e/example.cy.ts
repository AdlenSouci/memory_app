describe('Memory App - Parcours utilisateur complet', () => {
    beforeEach(() => {
        cy.visit('/')
        cy.window().then(win => {
            win.localStorage.setItem('memory_categories', JSON.stringify([]))
            win.localStorage.setItem('memory_themes', JSON.stringify([]))
            win.localStorage.setItem('memory_cards', JSON.stringify([]))
            win.localStorage.setItem('memory_user', JSON.stringify({ pseudo: '', score: 0 }))

            if ('serviceWorker' in win.navigator) {
                win.navigator.serviceWorker.getRegistrations().then(registrations => {
                    for (const registration of registrations) {
                        registration.unregister()
                    }
                })
            }
        })
        cy.reload(true)
    })

    describe('Création de contenu', () => {
        it('permet de définir un pseudo et accéder au dashboard', () => {
            cy.get('input[placeholder="Votre pseudo..."]').type('TestUser')
            cy.get('button').contains('Se connecter').click()
            cy.contains('Bonjour').should('be.visible')
            cy.contains('TestUser').should('be.visible')
            cy.screenshot('01-login-dashboard')
        })

        it('permet de créer une catégorie', () => {
            cy.get('input[placeholder="Votre pseudo..."]').type('TestUser')
            cy.get('button').contains('Se connecter').click()
            cy.get('button').contains('Nouvelle Catégorie').click()
            cy.get('input[placeholder="Ex: Histoire, Langues..."]').type('Ma Catégorie E2E')
            cy.get('button').contains('Créer').click()
            cy.contains('Ma Catégorie E2E').should('be.visible')
            cy.screenshot('02-categorie-creee')
        })

        it('permet de créer un thème dans une catégorie', () => {
            cy.get('input[placeholder="Votre pseudo..."]').type('TestUser')
            cy.get('button').contains('Se connecter').click()
            cy.get('button').contains('Nouvelle Catégorie').click()
            cy.get('input[placeholder="Ex: Histoire, Langues..."]').type('Catégorie Test')
            cy.get('button').contains('Créer').click()
            cy.contains('Explorer').click()
            cy.get('button').contains('Nouveau Thème').click()
            cy.get('input[placeholder="Ex: Verbes irréguliers..."]').type('Mon Thème E2E')
            cy.get('button').contains('Ajouter').click()
            cy.contains('Mon Thème E2E').should('be.visible')
            cy.screenshot('03-theme-cree')
        })

        it('permet de créer une carte de révision', () => {
            cy.get('input[placeholder="Votre pseudo..."]').type('TestUser')
            cy.get('button').contains('Se connecter').click()
            cy.get('button').contains('Nouvelle Catégorie').click()
            cy.get('input[placeholder="Ex: Histoire, Langues..."]').type('Cat')
            cy.get('button').contains('Créer').click()
            cy.contains('Explorer').click()
            cy.get('button').contains('Nouveau Thème').click()
            cy.get('input[placeholder="Ex: Verbes irréguliers..."]').type('Theme')
            cy.get('button').contains('Ajouter').click()
            cy.contains('Gérer').click()
            cy.get('input[placeholder="Question..."]').type('Quoi ?')
            cy.get('input[placeholder="Réponse..."]').type('Ceci !')
            cy.get('button').contains('Ajouter la Carte').click()
            cy.contains('Quoi ?').should('be.visible')
            cy.contains('Ceci !').should('be.visible')
            cy.screenshot('04-carte-creee')
        })
    })

    describe('Parcours de révision', () => {
        it('permet de faire une session de révision complète', () => {
            cy.get('input[placeholder="Votre pseudo..."]').type('TestUser')
            cy.get('button').contains('Se connecter').click()
            cy.get('button').contains('Nouvelle Catégorie').click()
            cy.get('input[placeholder="Ex: Histoire, Langues..."]').type('RevCat')
            cy.get('button').contains('Créer').click()
            cy.contains('Explorer').click()
            cy.get('button').contains('Nouveau Thème').click()
            cy.get('input[placeholder="Ex: Verbes irréguliers..."]').type('RevTheme')
            cy.get('button').contains('Ajouter').click()
            cy.contains('Gérer').click()
            cy.get('input[placeholder="Question..."]').type('1+1?')
            cy.get('input[placeholder="Réponse..."]').type('2')
            cy.get('button').contains('Ajouter la Carte').click()
            cy.go('back')
            cy.contains('Réviser').click()
            cy.contains('Question').should('be.visible')
            cy.contains('1+1?').should('be.visible')
            cy.screenshot('05-revision-recto')
            cy.contains('Cliquez pour voir la réponse').click()
            cy.contains('2').should('be.visible')
            cy.screenshot('06-revision-verso')
            cy.get('button').contains('Su').click()
            cy.contains('Session terminée').should('be.visible')
            cy.screenshot('07-session-terminee')
        })
    })

    describe('Import des données de test', () => {
        it("permet d'importer les données de test", () => {
            cy.on('window:confirm', () => true)
            cy.get('input[placeholder="Votre pseudo..."]').type('TestUser')
            cy.get('button').contains('Se connecter').click()
            cy.get('button').contains('Importer données de test').click()
            cy.contains('Informatique').should('be.visible')
            cy.screenshot('08-import-donnees-test')
        })
    })
})