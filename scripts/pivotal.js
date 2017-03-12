const { Client } = require('pivotaltracker')
const { PIVOTAL_API_TOKEN  } = require('./secrets.js')
const tracker = new Client(PIVOTAL_API_TOKEN)

/**
 *  Filters AMS projects by a project name
 *  @param project {string} the project name
 *  @return {Promise<array[], error>}
 */
async function filterProject(projName) {
  return new Promise((resolve, reject) => {
    tracker.projects.all((err, projects) => {
      if(err || !projects) {
        reject('No such project')
      }
      resolve(projects.find(({name}) => projName === name))
    })
  })
}

/**
 * Filters stories a given label
 */
function filterStories(id, label) {
  return new Promise((resolve, reject) => {
    tracker
      .project(id)
      .stories
      .all({
        with_label: label
      }, (err, stories) => {
        if(err || !stories) {
          reject('No such project')
        }
        resolve(stories)
    })
  })
}

module.exports = {
  fetchTickets(project, label) {
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
