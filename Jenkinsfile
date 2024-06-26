#!groovy

List workers = ['5', '4', '3', '2', '1']
def failedTests = []

pipeline {
    agent any

    tools { nodejs 'recent node' }

    options {
        buildDiscarder(logRotator(daysToKeepStr: '30', artifactDaysToKeepStr: '14'))
        timeout(time: 2, unit: 'HOURS')
        skipDefaultCheckout(true)
    }

    parameters {
        gitParameter(
            name: 'BRANCH',
            branchFilter: 'origin/(.*)',
            defaultValue: 'main',
            type: 'PT_BRANCH'
        )

        extendedChoice(
                name: 'PROJECTS',
                defaultValue: 'Google Chrome, Mobile Chrome',
                description: 'Playwright projects (browsers) to use. Please choose at least one.',
                multiSelectDelimiter: ',',
                saveJSONParameterToFile: false,
                type: 'PT_CHECKBOX',
                value: 'Google Chrome, Microsoft Edge, Mobile Chrome, Mobile Safari',
                visibleItemCount: 10
        )

        string(
            name: 'TAGS_TO_INCLUDE',
            description: 'Run tests that include specific tags.<br>Example: @smoke @ui',
            trim: true
        )

        string(
            name: 'TAGS_TO_EXCLUDE',
            description: 'Run tests that do not include specific tags.<br>Example: @wip @flaky',
            trim: true
        )

        text(
            name: 'TESTS_LIST',
            description: '''List of tests to run. You can specify folder with tests, one test file, or one specific test from suite. Each item should begin on new line.<br>
                Examples:<br>
                <div style='color:green'>
                ui<br>
                ui/checkout.spec.ts<br>
                ui/my_account.spec.ts:11<br>
                </div>
            ''' )

        choice(
            name: 'WORKERS',
            choices: workers,
            description: 'Number of playwright workers. How many tests will be executed in parallel.'
        )
    }

    environment {
        CI = true
        ADMIN_USERNAME = credentials('admin-username')
        ADMIN_PASSWORD = credentials('admin-password')
    }

    stages {
        stage('Validate Parameters') {
            steps {
                script {
                    if (params.PROJECTS.trim() == '') {
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

        stage('Prepare data') {
            steps {
                sh '''
                    rm -rf allure-results
                    rm -rf test-results
                '''
            }
        }

        stage('Install dependencies') {
            steps {
                sh '''
                npm ci
                npx playwright install --with-deps
                npx playwright install chrome
                '''
            }
        }

        stage('Start Shopping Store App') {
            steps {
                sh '''
                    chmod +x './ShoppingStoreApp/shopping-store-linux-amd64'
                    ./ShoppingStoreApp/shopping-store-linux-amd64 &
                '''
            }
        }

        stage('Run tests') {
            steps {
                script {
                    def projects = getSelectedProjects()

                    def testCommand = 'npx playwright test'

                    if (params.TESTS_LIST) {
                        def tests = params.TESTS_LIST
                                        .split('\n')
                                        .collect { it.trim().replace('\\', '/') }
                                        .join(' ')
                        testCommand += " tests/${tests}"
                    }

                    if (params.TAGS_TO_INCLUDE) {
                        testCommand += " --grep ${params.TAGS_TO_INCLUDE}"
                    }

                    if (params.TAGS_TO_EXCLUDE) {
                        testCommand += " --grep-invert ${params.TAGS_TO_EXCLUDE}"
                    }

                    testCommand += " --workers=${params.WORKERS} --project ${projects}"

                    try {
                        sh testCommand
                    } catch (error) {
                        currentBuild.result = 'UNSTABLE'
                    }

                    def testResults = readJSON file: 'summary.json'
                    failedTests = testResults.failed
                    echo "Failed tests: ${failedTests}"
                }
            }
        }

        stage('Rerun failed tests') {
            when { expression { failedTests.size() > 0 } }
            steps {
                script {
                    def projects = getSelectedProjects()

                    try {
                        sh "npx playwright test ${failedTests.toList().join(' ')} --workers=${params.WORKERS} --project ${projects}"
                    } catch (error) {
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
        success {
            sendEmailToRequestor()
        }
        unstable {
            sendEmailToRequestor()
        }
        failure {
            sendEmailToRequestor()
        }
    }
}

def getSelectedProjects() {
    def selectedProjects = params.PROJECTS
                                    .split(',')
                                    .collect { it.trim() }

    def projects = selectedProjects.collect { "'${it}'" }
                                .join(' ')

    return projects
}

def sendEmailToRequestor() {
    emailext(recipientProviders: [requestor()],
    subject: "${currentBuild.projectName} - Build # ${currentBuild.id} - ${currentBuild.result}!",
    body: "${currentBuild.projectName} - Build # ${currentBuild.id} - ${currentBuild.result}: Check console output at ${currentBuild.absoluteUrl} to view the results.")
}
