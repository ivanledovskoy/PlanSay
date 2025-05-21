pipeline {
    agent any

    environment {
        DOCKER_COMPOSE = 'docker compose'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
                script {
                    echo "Repository URL: ${scm.getUserRemoteConfigs()[0].getUrl()}"
                    echo "Branch: ${scm.branches[0].name}"
                }
            }
        }

        stage('Docker compose build') {
            steps {
                script {
                    if (!fileExists('docker-compose.yml')) {
                        error('docker-compose.yml not found!')
                    }

                    sh "sudo docker compose down || true"

                    sh "sudo docker compose up -d --build"
                }
            }
        }
    }

    post {
        always {
            echo 'Pipeline completed - cleanup'
            sh "sudo docker compose down || true"
        }
        success {
            echo 'Pipeline succeeded!'
        }
        failure {
            echo 'Pipeline failed!'
        }
    }
}