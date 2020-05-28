runBuild{
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

void runBuild(Closure pipeline) {
    node('linux') {
        container('buildkit') {
            checkout(scm)

            pipeline()
        }
    }
}

boolean publish() {
  return env.BRANCH_NAME == 'master' || env.TAG_NAME
}
