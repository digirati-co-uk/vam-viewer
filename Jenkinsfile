 node('linux') {
  container('buildkit') {
    checkout(scm)
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
}
