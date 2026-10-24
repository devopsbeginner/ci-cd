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
        withCredentials([
            usernamePassword(
                credentialsId: 'dockerhub-creds',
                usernameVariable: 'DOCKERHUB_USER',
                passwordVariable: 'DOCKERHUB_TOKEN'
            )
        ]) {
            sh '''
                set +x
                printf '%s' "$DOCKERHUB_TOKEN" |
                    docker login --username "$DOCKERHUB_USER" --password-stdin
                docker push "${IMAGE_NAME}:${IMAGE_TAG}"
                docker logout
            '''
        }
    }
}

        
        stage('Deploy to Kubernetes') {
            steps { 
                sh 'export KUBECONFIG=/var/lib/jenkins/.kube/config'
                sh "kubectl apply -f deployment.yaml"
                sh "kubectl apply -f service.yaml"
            }
        }
    }
}
