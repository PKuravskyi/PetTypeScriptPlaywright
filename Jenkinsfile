#!groovy

List workers = ['5', '4', '3', '2', '1']

pipeline {
	agent any

	tools { nodejs 'recent node' }

	options {
		buildDiscarder(logRotator(daysToKeepStr: '30', artifactDaysToKeepStr: '14'))
		timeout(time: 24, unit: 'HOURS')
		skipDefaultCheckout(true)
	}

	parameters {
		gitParameter(
			name: 'BRANCH',
			branchFilter: 'origin/(.*)',
			defaultValue: 'main',
			type: 'PT_BRANCH'
		)

		choice(
			name: 'WORKERS',
			choices: workers, 
			description: 'Number of playwright workers. How many tests will be executed in parallel.'
		)

		extendedChoice(
				name: 'PROJECTS',
				defaultValue: 'chromium, Mobile Chrome',
				description: 'Playwright projects (browsers) to use. Please choose at least one.',
				multiSelectDelimiter: ',',
				saveJSONParameterToFile: false,
				type: 'PT_CHECKBOX',
				value: 'chromium, firefox, webkit, Microsoft Edge, Mobile Chrome, Mobile Safari',
				visibleItemCount: 10
		)
	}

	environment {
    ADMIN_USERNAME = credentials('admin-username')
    ADMIN_PASSWORD = credentials('admin-password')
		SELECTED_PROJECTS = params.PROJECTS.split(',').collect { it.trim() }
  }

	stages {
		stage('Validate Parameters') {
			steps {
				script {
					if (SELECTED_PROJECTS.empty) {
							error "No projects selected. Please choose at least one project."
					}
				}
			}
		}

		stage('Clone repository') {
			steps {
        git branch: "${params.BRANCH}", url: 'https://github.com/PKuravskyi/PetTypeScriptPlaywright.git'
			}
		}

		stage('Install dependencies') {
			steps {
					sh '''
					npm ci
					npx playwright install --with-deps
					'''
			}
    }

		stage('Start Shopping Store App') {
			steps {
				script {
					sh '''
						chmod +x './ShoppingStoreApp/shopping-store-linux-amd64'
						./ShoppingStoreApp/shopping-store-linux-amd64 &
					'''
				}
			}
		}

		stage('Run tests') {
      steps {
				script {
					try {
						def projectsArgument = SELECTED_PROJECTS.collect { "'${it}'" }.join(' ')
						sh "npx playwright test --workers=${params.WORKERS} --project ${projectsArgument}"
					} catch (Exception e) {
						echo "Caught exception: ${e.message}"
						currentBuild.result = 'UNSTABLE'
					}
				}
			}
    }

		stage('Generate allure results') {
      steps {
				allure([
					includeProperties: false,
					jdk: '',
					results: [[path: 'allure-results']]
				])
			}
    }
	}

	post {
		always {
			// Send email to requestor
			emailext(recipientProviders: [requestor()],
			subject: "${currentBuild.projectName} - Build # ${currentBuild.id} - ${currentBuild.result}!",
			body: "${currentBuild.projectName} - Build # ${currentBuild.id} - ${currentBuild.result}: Check console output at ${currentBuild.absoluteUrl} to view the results.")
		}
	}
}
