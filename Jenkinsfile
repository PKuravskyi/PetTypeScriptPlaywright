#!groovy

pipeline {
	agent any

	tools { nodejs 'recent node' }

	options {
		buildDiscarder(logRotator(daysToKeepStr: '30', artifactDaysToKeepStr: '14'))
		timeout(time: 24, unit: 'HOURS')
	}

	environment {
    ADMIN_USERNAME = ''
    ADMIN_PASSWORD = ''
  }

	stages {
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
				withCredentials([usernamePassword(credentialsId: 'admin-credentials', usernameVariable: 'ADMIN_USERNAME', passwordVariable: 'ADMIN_PASSWORD')]) {
        	script {
						sh 'npm run test'
					}
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
}
