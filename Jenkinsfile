#!groovy

List workers = ['5', '4', '3', '2', '1']

pipeline {
	agent any

	tools { nodejs 'recent node' }

	options {
		buildDiscarder(logRotator(daysToKeepStr: '30', artifactDaysToKeepStr: '14'))
		timeout(time: 24, unit: 'HOURS')
	}

	parameters {
		gitParameter branchFilter: 'origin/(.*)', defaultValue: 'main', name: 'BRANCH', type: 'PT_BRANCH'
		choice(name: 'WORKERS', choices: workers, description: 'Number of playwright workers. How many tests will be executed in parallel.')
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
					sh "npx playwright test --workers=${params.WORKERS}"
				}
			}
    }

    stage('Generate allure report') {
      steps {
				allure([
					includeProperties: false,
					jdk: '/opt/java/openjdk',
					results: [[path: 'allure-results']]
				])
      }
    }
	}

	post {
		always {
			emailext body: "${currentBuild.projectName} - Build # ${currentBuild.id} - ${currentBuild.result}: Check console output at ${currentBuild.absoluteUrl} to view the results.",
			recipientProviders: [requestor()],
			subject: "${currentBuild.projectName} - Build # ${currentBuild.id} - ${currentBuild.result}!"
		}
	}
}
