
pipeline {
    agent any

    environment {
        IMAGE_NAME = 'sunil1604/ci-cd-demo-practice'
        IMAGE_TAG = '1.0'
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
            echo 'Jenkins pipeline execution finished.'
        }
        success {
            echo 'CI/CD pipeline completed successfully.'
        }
        failure {
            echo 'Pipeline failed. Check Console Output.'
        }
    }
}
