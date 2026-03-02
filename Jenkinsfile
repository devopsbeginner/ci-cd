pipeline {
    agent any
    
    environment {
        IMAGE_NAME = "sunil1604/ci-cd-demo"
        IMAGE_TAG = "1.0"
    }
    
    stages {
        stage('Checkout') {
            steps {
                git credentialsId: 'GIT_CRED_ID', url:'https://github.com/devopsbeginner/ci-cd'
            }
        }
        
        stage('Build & Test') {
            steps {
                sh 'npm install'
                sh 'npm test'
            }
        }
        
        stage('Build Docker Image') {
            steps {
                sh "docker build -t ${IMAGE_NAME}:${IMAGE_TAG} ."
            }
        }
        
        stage('Push Docker Image') {
            steps {
                sh "docker login -u <username> -p <password>"
                sh "docker push ${IMAGE_NAME}:${IMAGE_TAG}"
            }
        }
        
        stage('Deploy to Kubernetes') {
            steps {
                sh "kubectl apply -f deployment.yaml"
                sh "kubectl apply -f service.yaml"
            }
        }
    }
}
