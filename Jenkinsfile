pipeline {
    agent "linux"

    stages {
        stage('Build') {
            steps {
              sh 'yarn && yarn build'
            }
        }
        stage('Test') {
            steps {
                sh 'yarn test'
            }
        }
        stage('Deploy') {
            steps {
                sh 'yarn deploy'
            }
        }
    }
}
