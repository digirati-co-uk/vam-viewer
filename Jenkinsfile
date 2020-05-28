runBuild{
    stage('Build') {
        sh 'yarn && yarn build'
    }
    stage('Test') {
        sh 'yarn test'
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
