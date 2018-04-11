import fs         from 'fs'
import path       from 'path'
import _          from 'lodash'
import {exec}     from 'child_process'
import {prompt, Separator} from 'inquirer'
import {ArgumentParser}    from 'argparse'

const ver = '1.0.1'
const log = console.log
const pretty = (obj) => { return JSON.stringify(obj, null, 2) }

const CONFIG_DIR      = path.resolve(`${process.env.HOME}/.qssh`)
const LIST_FILE_PATH  = path.resolve(`${CONFIG_DIR}/server-list`)

const script_path = process.env.NODE_SCRIPT

const parser = new ArgumentParser({
  version: ver,
  addHelp: true,
  description: 'ssh-connet command message',
  epilog: "See License at http://opensource.org/licenses/MIT"
})

parser.addArgument([ '-ls', '--list' ], {
  nargs: '0',
  action: 'storeTrue',
  help: 'list all servers'
})
parser.addArgument([ '-y', '--yes' ], {
  nargs: '0',
  action: 'storeTrue',
  help: 'automatic yes to prompts'
})
parser.addArgument([ '-p', '--ping' ], {
  nargs: '0',
  action: 'storeTrue',
  help: 'test if qssh works well'
})
parser.addArgument(['--add' ], {
  nargs: '0',
  action: 'storeTrue',
  help: 'add new server'
})

if(!fs.existsSync(CONFIG_DIR)) {
  fs.mkdirSync(CONFIG_DIR, '0755')
}
if(!fs.existsSync(LIST_FILE_PATH)) {
  const obj = {'Development': [], 'Staging': [], 'Production': []}
  fs.writeFileSync(LIST_FILE_PATH, pretty(obj), 'utf8')
}

const args = parser.parseArgs()
if(args.ping) { // ssh-connet --ping
  log('PONG')
  process.exit(0)
} else if(args.add) { // qssh --add
  const obj = JSON.parse(fs.readFileSync(LIST_FILE_PATH, 'utf8')) // XXX: race condition if multiple contributors to edit
  prompt([
    {
      type: 'list',
      message: 'Server Type',
      name: 'type',
      pageSize: _.keys(obj).length,
      choices: _.keys(obj)
    }, {
      type: 'input',
      name: 'name',
      message: 'Sever displayname?'
    }, {
      type: 'input',
      name: 'url',
      message: 'Server ip or domain name?'
    },{
      type: 'input',
      name: 'user',
      message: 'Type ssh username',
      default: 'ubuntu'
    }, {
      type: 'input',
      name: 'private_key',
      message: 'Server private key path?',
      default: '~/.ssh/my-private.pem'
    }
  ]).then((res) => {
    const s = {
      name: res.name,
      value: `${res.user}@${res.url}`,
      private_key: res.private_key
    }
    obj[res.type] = (obj[res.type] || [])
    obj[res.type].push(s)
    fs.writeFileSync(LIST_FILE_PATH, pretty(obj))
    process.exit(0)
  }).catch(log)
} else if(args.list) { // list all servers
  const servers = JSON.parse(fs.readFileSync(LIST_FILE_PATH, 'utf8'))
  log('')
  _.keys(servers).forEach((c) => {
    log('\x1b[36m%s\x1b[0m', c)
    servers[c].forEach((s) => {
      log(`${s.name.padEnd(20)} ${s.value.padEnd(70)} ${s.private_key.padEnd(10)}`)
    })
    log(`\n${'-'.repeat(10)}\n`)
  })
  process.exit(0)
} else {    // connect
  let server = {}, servers = []
  const obj = JSON.parse(fs.readFileSync(LIST_FILE_PATH, 'utf8'))
  const types = _.keys(obj)
  const items = []
  _.forEach(types, (t) => {
    items.push(new Separator(`${t} Server`))
    _.forEach(obj[t], s => {
      items.push(s)
      servers.push(_.merge(s, {type: t}))
    })
    items.push(new Separator('\t'))
  })
  prompt([
    {
      type: 'list',
      name: 'name',
      message: 'Which server do you want to connect to?',
      choices: items,
      pageSize: items.length
    }
  ]).then((res) => {
    server = _.find(servers, {value: res.name}) // XXX: kind of hack here
    return prompt([
      {
        when: () => {
          return !args.yes
        },
        type: 'confirm',
        name: 'confirm',
        message: `Do you want to connect to "${server.name} (${server.value})"`,
        default: 'Yes'
      }
    ])
  }).then((res) => {
    if(!args.yes && !res.confirm) {
      process.exit(1)
    }
    exec(`echo "ssh -i ${server.private_key}  -o StrictHostKeyChecking=no ${server.value}" > ${script_path}`, (err, stdout, stderr) => {
      if(err) {
        log(err)
        process.exit(1)
      }
      log('Connect to', server.value)
    })
  })
}
