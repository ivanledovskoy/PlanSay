pipeline {
    agent any

    options {
        skipDefaultCheckout(true)  // Отключаем стандартный checkout для ручного управления
        buildDiscarder(logRotator(numToKeepStr: '5'))  // Храним только последние 5 сборок
        timeout(time: 30, unit: 'MINUTES')  // Таймаут для всей сборки
        disableConcurrentBuilds()  // Запрещаем параллельные сборки
    }

    stages {
        stage('Clean Workspace') {
            steps {
                cleanWs(cleanWhenAborted: true, cleanWhenFailure: true, cleanWhenNotBuilt: true, cleanWhenUnstable: true, deleteDirs: true)
            }
        }

        stage('Checkout') {
            steps {
                checkout([
                    $class: 'GitSCM',
                    branches: scm.branches,
                    extensions: [
                        [$class: 'CloneOption', depth: 1, shallow: true, noTags: true],  // Поверхностный клон (только последний коммит)
                        [$class: 'CleanBeforeCheckout'],  // Очистка перед checkout
                        [$class: 'LocalBranch']  // Создает локальную ветку
                    ],
                    userRemoteConfigs: scm.userRemoteConfigs
                ])
            }
        }

        stage('Bandit Static Analysis') {
            steps {
                script {
                    try {
                        sh '''
                            python3 -m venv bandit-venv --clear
                            . bandit-venv/bin/activate
                            pip install --quiet --no-cache-dir bandit
                            bandit -r backend/ -f html -o backend_bandit_report.html
                            deactivate
                            rm -rf bandit-venv  # Удаляем виртуальное окружение сразу после использования
                        '''
                    } catch (e) {
                        echo "Bandit analysis failed, but continuing: ${e}"
                    }
                }
            }
        }

        stage('Docker Cleanup') {
            steps {
                sh '''
                    # Удаляем все неиспользуемые контейнеры, сети, образы и volumes
                    docker system prune -a -f --volumes || true
                    # Удаляем все остановленные контейнеры
                    docker container prune -f || true
                    # Удаляем все неиспользуемые образы
                    docker image prune -a -f || true
                '''
            }
        }

        stage('Docker Compose Down') {
            steps {
                sh 'docker-compose down --remove-orphans --rmi local -v || true'
            }
        }

        stage('Docker Compose Build') {
            steps {
                sh 'docker-compose build --no-cache --pull'
            }
        }

        stage('Docker Compose Up') {
            steps {
                sh 'docker-compose up -d'
            }
        }
    }

    post {
        always {
            script {
                // Сохраняем отчет Bandit только если он существует
                if (fileExists('backend_bandit_report.html')) {
                    archiveArtifacts artifacts: 'backend_bandit_report.html', fingerprint: true
                    publishHTML(target: [
                        allowMissing: false,
                        alwaysLinkToLastBuild: false,
                        keepAll: false,
                        reportDir: '',
                        reportFiles: 'backend_bandit_report.html',
                        reportName: 'Bandit Report'
                    ])
                }

                // Очистка Docker после сборки
                sh '''
                    docker container prune -f || true
                    docker image prune -f || true
                    docker builder prune -f || true
                '''
            }
        }

        success {
            script {
                // Максимальная очистка при успешной сборке
                cleanWs(cleanWhenAborted: false, cleanWhenFailure: false, cleanWhenNotBuilt: false, cleanWhenUnstable: false, deleteDirs: true)
                sh '''
                    # Удаляем все неиспользуемые Docker-ресурсы
                    docker system prune -a -f --volumes || true
                '''
            }
        }

        cleanup {
            // Дополнительная очистка в любом случае
            sh '''
                rm -rf backend_bandit_report.html || true
                find . -type d -name "__pycache__" -exec rm -rf {} + || true
                find . -type d -name ".pytest_cache" -exec rm -rf {} + || true
            '''
        }
    }
}