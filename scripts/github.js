const GithubAPI= require('github')
const { GITHUB_TOKEN } = require('./secrets.js')

const github = new GithubAPI({
  debug: false
})

github.authenticate({
  type: 'token',
  token: GITHUB_TOKEN
})

module.exports = {
  async createPr(repo, stories) {
    return new Promise((resolve, reject) => {
      const date = new Date();
      const body =
        stories
          .map(story => {
            return '' +
              `## [ ] ${story.name} [#${story.projectId}](${story.url})\n` +
              `${story.description}`
          })
        .join('\n')

      github.pullRequests.create({
        owner: 'AtlanticMediaStrategies',
        title: `Sprint ${date.getMonth()}/${date.getDate()}`,
        head: 'nav', // TODO: get this from options
        base: 'master', // TODO: get this from options
        repo,
        body
      }, (err, result) => {
        if(err) {
          reject(err)
        }
        resolve(result)
      })
    })
  }
}
