# Tech Stack

## Frontend
### Plain HTML, CSS, and JavaScript (no framework)
We briefly deliberated on using React due to the ability to reuse
components and that once you are familiar with it, it becomes significantly
easier than plain JavaScript, CSS, and HTML, since the Javascript
and HTML can be in the same file, but given the workload of this semester
and that some of our members hadn't used React before, we decided against
it.

All of us are familiar with JavaScript, HTML, and CSS, whether that was through
our COMS modules, or through personal projects, so we saw it as the best fit
given all our experiences. It is more admin and tedious, but it gives us less 
technology to have to learn in a semester.

### [Leaflet.js](https://leafletjs.com/) + OpenStreetMap tiles for the interactive campus map
It is a simple library to use and doesn't require you to dedicate hours upon
hours to get a basic working version.

We tried google maps API, but the limits were too strict, which we feared would
require us to either pay or find alternatives midway through the project.

## Backend
### [Node.js](https://nodejs.org/) with [Express](https://expressjs.com/) 5
We chose Node.js for the same reasons we chose plain JS, HTML, and CSS for our frontend.
Some of us are experienced with PHP, but that would require others to either ask for assistance
on every difficulty from those already experience with it, or contribute work that they themselves
would be unable to both debug an understand.

There is also the fact that it is a tried and tested alternative with a large amount of documentation
and a fairly healthy (as in abundant) library selection. The syntax is easy to understand given it
is JS based and the errors are typically in the same format, or line. Given we are already using
plain Javascript, it seemed like the more natural choice for our backend.

### [MySQL](https://www.mysql.com/) via `mysql2/promise` (local or Aiven-hosted)
We learnt MySQL during our 2nd year for DBF, so most of use would be either comfortable
revisiting it, or are simply already familiar with it enough to where adjusting would be
seamless. 

### [Better Auth](https://www.better-auth.com/)
For email/password + Google OAuth.

It is the one that seems recommended the most and is open-source, too and works well
with Node.js.

## Tooling
### [Jest](https://jestjs.io/)
For frontend and backend unit tests.

We went with jest due to our familiarity with it from the previous
semesters module Software Design, as most of our members
decided to use it for testing during the semester long projects for
that semester.

It also helps that it is appropriately documented when something
is unclear and that setting it up for running is easy to do
in a node based project.

The only struggle was getting it to support ESM instead of
CommonJS.

### [Prettier](https://prettier.io/)
For code formatting.

One of the team members already has familiarity with it and the necessary configuration files
that we could simply copy and paste, so it would require little to no research to add it to the
repo.

We were under the assumption that the gitea server provided would come with Actions enabled so we
could add it as a check before any PRs are made, but, upon testing, they were broken. So this isn't 
as heavily used unless the commiter remembers to do it themselves, or the person reviewing the PR remembers to.

### [Taiga](https://taiga.io/)
For task management via Taiga (Kanban).

A team member had experience using it and claimed it was easier to use than Notion, so we decided
to use it. It's simple and provides exactly what we need, and not much more than that, which
suits our needs for it reasonably well.

It also allows subtasks, which is a plus for when an individual team member would like to break
their task/requirement into more granular tasks for themselves.
