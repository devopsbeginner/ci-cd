
pipeline {
    agent any

    environment {
        IMAGE_NAME = 'sunil1604/ci-cd-demo-practice'
        IMAGE_TAG = "${BUILD_NUMBER}"
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Source code checked out by Jenkins SCM.'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh '''
                    docker run --rm \
                        -v "$WORKSPACE:/app" \
                        -w /app \
                        node:24-alpine \
                        npm install
                '''
            }
        }

        stage('Test Application') {
            steps {
                sh '''
                    docker run --rm \
                        -v "$WORKSPACE:/app" \
                        -w /app \
                        node:24-alpine \
                        npm test
                '''
            }
        }

        stage('Build Docker Image') {
            steps {
                sh '''
                    docker build \
                        -t ${IMAGE_NAME}:${IMAGE_TAG} .
                '''
            }
        }

        stage('Push Docker Image') {
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: 'dockerhub-creds',
                        usernameVariable: 'DOCKERHUB_USER',
                        passwordVariable: 'DOCKERHUB_TOKEN'
                    )
                ]) {
                    sh '''
                        set -eu
                        set +x

                        cleanup() {
                            docker logout >/dev/null 2>&1 || true
                        }
                        trap cleanup EXIT

                        printf '%s' "$DOCKERHUB_TOKEN" |
                            docker login \
                                --username "$DOCKERHUB_USER" \
                                --password-stdin

                        docker push "${IMAGE_NAME}:${IMAGE_TAG}"
                    '''
                }
            }
        }
    }
    
    
post {
    always {
        echo "Pipeline finished with status: ${currentBuild.currentResult}"
    }

    success {
        echo 'CI/CD pipeline completed successfully.'

        emailext(
            to: 'podalakurusunil@gmail.com',
            subject: "SUCCESS: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
            body: """The Jenkins CI/CD pipeline succeeded.

Job: ${env.JOB_NAME}
Build: #${env.BUILD_NUMBER}
Status: ${currentBuild.currentResult}

Console output:
${env.BUILD_URL}console"""
        )
    }

    failure {
        echo 'Pipeline failed. Check Console Output.'

        emailext(
            to: 'podalakurusunil@gmail.com',
            subject: "FAILURE: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
            body: """The Jenkins CI/CD pipeline failed.

Job: ${env.JOB_NAME}
Build: #${env.BUILD_NUMBER}
Status: ${currentBuild.currentResult}

Please investigate the failure:
${env.BUILD_URL}console"""
        )
    }
}
    
}
