pipeline {
    agent any

    stages {
        stage('Checkout new revision') {
            steps {
                checkout scm
                script {
                    echo "Repository URL: ${scm.getUserRemoteConfigs()[0].getUrl()}"
                    echo "Branch: ${scm.branches[0].name}"
                }
            }
        }


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