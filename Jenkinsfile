#!groovy

List workers = ['5', '4', '3', '2', '1']
List projects = 'chromium, firefox, webkit, Microsoft Edge, Mobile Chrome, Mobile Safari'

pipeline {
	agent any

	tools { nodejs 'recent node' }

	options {
		buildDiscarder(logRotator(daysToKeepStr: '30', artifactDaysToKeepStr: '14'))
		timeout(time: 24, unit: 'HOURS')
		skipDefaultCheckout(true)
	}

	parameters {
		gitParameter(name: 'BRANCH', branchFilter: 'origin/(.*)', defaultValue: 'main', type: 'PT_BRANCH')
		choice(name: 'WORKERS', choices: workers, description: 'Number of playwright workers. How many tests will be executed in parallel.')
		extendedChoice(name: 'PROJECTS', defaultValue: 'chromium, Mobile Chrome', description: 'What playwright projects to use during run.', multiSelectDelimiter: ',', quoteValue: false, saveJSONParameterToFile: false, type: 'PT_CHECKBOX', value: projects, visibleItemCount: 10)
	}

	environment {
    ADMIN_USERNAME = credentials('admin-username')
    ADMIN_PASSWORD = credentials('admin-password')
  }

	stages {
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
						def selectedProjects = params.PROJECTS.split(',').collect { it.trim() }
						def projectsArgument = selectedProjects.collect { "'${it}'" }.join(' ')

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
