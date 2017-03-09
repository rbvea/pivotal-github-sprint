const { Client } = require('pivotaltracker')
const { PIVOTAL_API_TOKEN  } = require('./secrets.js')
const pify = require('pify')
const tracker = new Client(PIVOTAL_API_TOKEN)

/**
 *  Filters AMS projects by a project name
 *  @param project {string} the project name
 *  @return {Promise<array[], error>}
 */
async function filterProject(project) {
  return new Promise((resolve, reject) => {
    tracker.projects.all((err, projects) => {
      if(err || !projects) {
        reject('No such project')
      }
      resolve(projects.find(proj => proj.name === project))
    })
  })
}

/**
 * Filters stories a given label
 */
async function filterStories(id, label) {
  return new Promise((resolve, reject) => {
    tracker.project(id).stories.all((err, stories) => {
      if(err || !stories) {
        reject('No such project')
      }
      resolve(stories.filter(story => {
        return story.labels.find(label => label.name === label)
      }))
    })
  })
}

module.exports = {
  async fetchTickets(project, label) {
    return new Promise(async (resolve, reject) => {
      try {
        const filteredProject = await filterProject(project)
        const stories = await filterStories(filteredProject.id, label)
        if(!stories) {
          reject('no stories')
        }
        resolve(stories)
      } catch(err) {
        reject(err)
      }
    })
  }
}
