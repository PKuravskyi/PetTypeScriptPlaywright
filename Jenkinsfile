#!groovy

pipeline {
	options {
		buildDiscarder(logRotator(daysToKeepStr: '30', artifactDaysToKeepStr: '14'))
		timeout(time: 24, unit: 'HOURS')
	}

	agent { 
		docker { 
			image 'mcr.microsoft.com/playwright:next' 
		} 
	}

	environment {
    ADMIN_USERNAME = ''
    ADMIN_PASSWORD = ''
		JAVA_HOME = '/opt/java/openjdk'
  }

	stages {
		stage('Install dependencies') {
			steps {
					sh 'npm ci'
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
