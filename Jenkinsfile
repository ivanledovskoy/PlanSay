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

        stage('Run Bandit Static Analysis') {
            steps {
                script {
                    sh '''
                        python3 -m venv bandit-venv
                        . bandit-venv/bin/activate
                        pip install bandit
                        bandit -r backend/ -f html -o backend_bandit_report.html || true
                        deactivate
                    '''
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

    post {
        always {
            archiveArtifacts artifacts: 'backend_bandit_report.html', fingerprint: true

            publishHTML(target: [
                allowMissing: false,
                alwaysLinkToLastBuild: false,
                keepAll: true,
                reportDir: '',
                reportFiles: 'backend_bandit_report.html',
                reportName: 'Bandit Report'
            ])
        }
    }
}