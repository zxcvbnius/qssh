# qssh
A package to allow one to store SSH connection information and open on click

# Build binary file

 - Git clone project
 - Run `npm install`
 - Install nexe, [See info](https://github.com/nexe/nexe)
 - Install glup, [See info](https://www.npmjs.com/package/gulp)
 - Run **npm run-script build**

### Command script
Before generating binary file **qssh** and move into **/usr/bin**, adding the following script into your `.zshrc` or `.bashrc`

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

Then, run `source` command

### Test

> qssh --ping
