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
  }

	parameters {
    gitParameter
						branchFilter: 'origin/(.*)',
            defaultValue: 'main',
            name: 'GIT_BRANCH',
            type: 'PT_BRANCH',
            useRepository: 'https://github.com/PKuravskyi/PetTypeScriptPlaywright.git'
  }

	stages {
		stage('Run tests') {
      steps {
				withCredentials([usernamePassword(credentialsId: 'admin-credentials', usernameVariable: 'ADMIN_USERNAME', passwordVariable: 'ADMIN_PASSWORD')]) {
				sh 'npm ci'
        sh '''
					chmod +x './ShoppingStoreApp/shopping-store-linux-amd64'
					./ShoppingStoreApp/shopping-store-linux-amd64 &
					npm run test
				'''
				}
      }
    }
  }
}	