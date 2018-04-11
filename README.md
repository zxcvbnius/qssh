# qssh
A command tool to help users manage ssh servers easier

# How to build qssh
Follow the following steps,

 - Git clone project first, repo: `http://github.com/zxcvbnius/qssh`
 - Run `npm install`
 - Install nexe, [See info](https://github.com/nexe/nexe)
 - Install glup, [See info](https://www.npmjs.com/package/gulp)
 - Run **npm run-script build**

You will find there are a binary file **qssh** in current folder.

## Move qssh into /usr/bin
Then, we have to move **qssh** this binary into **/usr/bin**

```
$ sudo mv ./qssh /usr/bin/
```

## Add command into `.zshrc` or `.bashrc`
Add the following scripts into `.zshrc` or `.bashrc`

```
qssh() {
  script=$HOME/.qssh-tmp-$((RANDOM % 100))
  NODE_SCRIPT="$script" /usr/bin/qssh $@
  if [ -f "$script" ]
  then
    connect=`cat ${script}`
    rm -f ${script}
    eval "${connect}"
  else
    echo "Bye!"
  fi
}
```

## Active qssh command
Final, run `source` command to reload commands from file.

```
$ source ~/.zshrc
```

## How to add a server
Type `qssh --add` in terminal and answer the following questions.
Default categories are **Development**, **Staging**, and **Production**

![](https://raw.githubusercontent.com/zxcvbnius/qssh/master/doc/add-new-server.png)


## List all servers

![](https://raw.githubusercontent.com/zxcvbnius/qssh/master/doc/list-all-servers.png)

## Connect to a ssh server
Select the server you want to connect to

![](https://raw.githubusercontent.com/zxcvbnius/qssh/master/doc/select-server.png)

Enter again (default is Yes)

![](https://raw.githubusercontent.com/zxcvbnius/qssh/master/doc/prompt-selection.png)

Then it will connect to the ssh server!

## Get help with qssh
Use `qssh --help` to see more detail.

```
> qssh --help
usage: qssh.js [-h] [-v] [-ls] [-y] [-p] [--add]

ssh-connet command message

Optional arguments:
  -h, --help     Show this help message and exit.
  -v, --version  Show program's version number and exit.
  -ls, --list    list all servers
  -y, --yes      automatic yes to prompts
  -p, --ping     test if qssh works well
  --add          add new server

See License at http://opensource.org/licenses/MIT
Bye!
```

## Issue Report
If there is any issues occur, feel feel free to [contact me](zxcvbnius@gmail.com)
