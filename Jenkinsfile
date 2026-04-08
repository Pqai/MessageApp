pipeline {
    agent any
    
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
                bat 'npm install'
                echo 'Dependencies installed'
            }
        }
        
        stage('Create Directories') {
            steps {
                bat '''
                    if not exist public mkdir public
                    if not exist message mkdir message
                    if not exist page mkdir page
                    if not exist temp mkdir temp
                    echo Directories created
                '''
            }
        }
        
        stage('Build Docker Image') {
            steps {
                script {
                    bat "docker build -t %DOCKER_IMAGE%:%DOCKER_TAG% ."
                    bat "docker tag %DOCKER_IMAGE%:%DOCKER_TAG% %DOCKER_IMAGE%:latest"
                }
                echo 'Docker image built successfully'
            }
        }
        
        stage('Stop and Remove Old Container') {
            steps {
                script {
                    try {
                        bat "docker stop %CONTAINER_NAME% 2>nul || exit 0"
                        bat "docker rm %CONTAINER_NAME% 2>nul || exit 0"
                    } catch (Exception e) {
                        echo 'No existing container to remove'
                    }
                }
            }
        }
        
        stage('Run Docker Container') {
            steps {
                script {
                    bat "docker run -d --name %CONTAINER_NAME% -p 3000:3000 -v %WORKSPACE%\\message:/app/message %DOCKER_IMAGE%:%DOCKER_TAG%"
                }
                echo 'Container started successfully'
            }
        }
        
        stage('Verify Application') {
            steps {
                script {
                    bat 'timeout /t 5 /nobreak > nul'
                    def status = bat(
                        script: 'curl -s -o nul -w "%%{http_code}" http://localhost:3000',
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
                bat "docker logs %CONTAINER_NAME% --tail 20"
            }
        }
    }
    
    post {
        success {
            echo '''
                Pipeline executed successfully!
                Application is running at: http://localhost:3000
            '''
        }
        
        failure {
            echo 'Pipeline failed! Check the logs above.'
        }
    }
}