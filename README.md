![](https://github.com/carlowahlstedt/NewmanPostman_VSTS_Task/blob/master/static/images/logo.png?raw=true)

## Newman the cli Companion for Postman ##
### ** Not an official task **

[![Join the chat at https://gitter.im/NewmanPostman_VSTS_Task/Lobby](https://badges.gitter.im/NewmanPostman_VSTS_Task/Lobby.svg)](https://gitter.im/NewmanPostman_VSTS_Task/Lobby?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
![](https://carlo.visualstudio.com/_apis/public/build/definitions/2a4da4b3-df80-44fa-b40f-1f86827ea145/11/badge)
![](https://carlo.vsrm.visualstudio.com/_apis/public/Release/badge/2a4da4b3-df80-44fa-b40f-1f86827ea145/1/1)
[![Badge for version for Visual Studio Code extension naereen.makefiles-support-for-vscode](https://vsmarketplacebadge.apphb.com/version/carlowahlstedt.NewmanPostman.svg)](https://marketplace.visualstudio.com/items?itemName=carlowahlstedt.NewmanPostman)

Using [Newman](https://www.getpostman.com/docs/postman/collection_runs/command_line_integration_with_newman), one can effortlessly run and test a Postman Collections directly from the command-line. Now in a task!

## How to ##

You can include this task in a build or release pipeline. Here's a quick 'How To'

### Requisites ###

1. Add a [npm task](https://docs.microsoft.com/fr-fr/vsts/build-release/tasks/package/npm) to install Newman before execution.

1. Set a display name (eg : 'Install Newman').

1. Set `custom` as command

1. As 'Command and arguments' set `install newman -g`

### Execution ###

Configure this task as per your requirements. (see [here](https://github.com/postmanlabs/newman#command-line-options) and [here](#Limitations) for options)

### Report ###

Test report can be integrated in Team Services.

To do so :

- Select **at least** `junit` as a reporter option (others can be added).
- Optionaly specify path to export junit report.
- Add a 'Publish Test Result' task, to process generated Junit report. Specify format (JUnit) and path and to xml file.

Execution is now reported with test statistics.

![alt text](https://github.com/carlowahlstedt/NewmanPostman_VSTS_Task/blob/master/static/images/testresult.png?raw=true "Test result")

### Report - HTML Extra ###

1. Add a [npm task](https://docs.microsoft.com/fr-fr/vsts/build-release/tasks/package/npm) to install Newman-reporter-htmlextra before execution.

1. Set a display name (eg : 'Install Newman-reporter-htmlextra').

1. Set `custom` as command

1. As 'Command and arguments' set `install -g newman-reporter-htmlextra`

1. Select "htmlextra" from the reports list

### Limitations ###

Following command line options are **not supported**:

- `-x`,`--suppress-exit-code`
- `-color`
- `--ssl-client-passphrase`
- None of the [CLI option](https://github.com/postmanlabs/newman#cli-reporter-options)

### Breaking change(s) ###

#### Version 4.x ####

* The `sslStrict` parameter is renamed as `sslInsecure` in order to better match with the actual behavior of the parameter: setting it to `true` will use newman `--insecure` option to disable the strict SSL verification.

### Known issue(s) ###

- None

### Learn More ###

The [source](https://github.com/carlowahlstedt/NewmanPostman_VSTS_Task/) to this extension is available. Feel free to take, fork, and extend.

[View Notices](https://github.com/carlowahlstedt/NewmanPostman_VSTS_Task/blob/master/ThirdPartyNotices.txt) for third party software included in this extension.

If you use a [Postman Enterprise](https://www.getpostman.com/enterprise) account workspace check out [this task](https://marketplace.visualstudio.com/items?itemName=OneLuckiDev.getPostmanJSON) to use in a pipeline. Here's [the post explaining it](http://blog.oneluckidev.com/post/using-postman-and-newman-in-your-azure-devops-pipeline) from the tasks author.

### Minimum supported environments ###

- Azure DevOps Services
- Team Foundation Server

### Contributors ###

We thank the following contributor(s) for this extension:

- [sunmorgus](https://github.com/sunmorgus)
- [sebcaps](https://github.com/sebcaps)
- [jeffpriz](https://github.com/jeffpriz)
- [esbenbach](https://github.com/esbenbach)
- [Scott-Emberson](https://github.com/Scott-Emberson)
- [afeblot](https://github.com/afeblot)

### Feedback ###

- [Add a review](https://marketplace.visualstudio.com/items?itemName=carlowahlstedt.NewmanPostman#review-details)
- [Post an issue on Github](https://github.com/carlowahlstedt/NewmanPostman_VSTS_Task/issues/new)
- Send us an [email](mailto:carlowahlstedt@gmail.com)
