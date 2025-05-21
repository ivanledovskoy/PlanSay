pipeline {
    agent any

    stages {

        stage('docker compose down') {
            steps {
                sh 'docker compose down || true'
            }
        }

         stage('docker compose up') {
            steps {
                sh 'docker compose up -d --build'
            }
        }
    }
}