pipeline {
    agent any
    
    tools {
        nodejs 'node-14'
    }
    
    environment {
        DOCKER_IMAGE = 'message-app'
        DOCKER_TAG = "${BUILD_NUMBER}"
        CONTAINER_NAME = 'message-app-container'
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
                echo 'Code checked out successfully'
            }
        }
        
        stage('Install Dependencies') {
            steps {
                sh 'npm install'
                echo 'Dependencies installed'
            }
        }
        
        stage('Create Directories') {
            steps {
                sh '''
                    mkdir -p public message page temp
                    echo 'Directories created'
                '''
            }
        }
        
        stage('Build Docker Image') {
            steps {
                script {
                    docker.build("${DOCKER_IMAGE}:${DOCKER_TAG}")
                    docker.build("${DOCKER_IMAGE}:latest")
                }
                echo 'Docker image built successfully'
            }
        }
        
        stage('Stop and Remove Old Container') {
            steps {
                script {
                    try {
                        sh "docker stop ${CONTAINER_NAME} || true"
                        sh "docker rm ${CONTAINER_NAME} || true"
                    } catch (Exception e) {
                        echo 'No existing container to remove'
                    }
                }
            }
        }
        
        stage('Run Docker Container') {
            steps {
                script {
                    docker.image("${DOCKER_IMAGE}:${DOCKER_TAG}").run([
                        '-d',
                        '--name', "${CONTAINER_NAME}",
                        '-p', '3000:3000',
                        '-v', "${WORKSPACE}/message:/app/message"
                    ])
                }
                echo 'Container started successfully'
            }
        }
        
        stage('Verify Application') {
            steps {
                script {
                    sh 'sleep 5'
                    
                    def status = sh(
                        script: 'curl -s -o /dev/null -w "%{http_code}" http://localhost:3000',
                        returnStdout: true
                    ).trim()
                    
                    if (status == '200') {
                        echo 'Application is running successfully!'
                    } else {
                        error "Application returned status: ${status}"
                    }
                }
            }
        }
        
        stage('Show Container Logs') {
            steps {
                sh "docker logs ${CONTAINER_NAME} --tail 20"
            }
        }
    }
    
    post {
        success {
            echo '''
                Pipeline executed successfully!
                Application is running at: http://localhost:3000
                Docker Image: ${DOCKER_IMAGE}:${DOCKER_TAG}
                Container Name: ${CONTAINER_NAME}
            '''
        }
        
        failure {
            echo '''
                Pipeline failed!
                
            '''
        }
        
        always {
            script {
                try {
                    sh "docker system prune -f"
                } catch (Exception e) {
                    echo 'Could not prune Docker system'
                }
            }
        }
    }
}