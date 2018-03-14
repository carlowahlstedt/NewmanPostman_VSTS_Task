![](https://github.com/carlowahlstedt/NewmanPostman_VSTS_Task/blob/master/static/images/logo.png?raw=true)

## Newman the cli Companion for Postman ##

[![Join the chat at https://gitter.im/NewmanPostman_VSTS_Task/Lobby](https://badges.gitter.im/NewmanPostman_VSTS_Task/Lobby.svg)](https://gitter.im/NewmanPostman_VSTS_Task/Lobby?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
![](https://carlo.visualstudio.com/_apis/public/build/definitions/2a4da4b3-df80-44fa-b40f-1f86827ea145/11/badge)
![](https://carlo.vsrm.visualstudio.com/_apis/public/Release/badge/2a4da4b3-df80-44fa-b40f-1f86827ea145/1/1)
[![Badge for version for Visual Studio Code extension naereen.makefiles-support-for-vscode](https://vsmarketplacebadge.apphb.com/version/carlowahlstedt.NewmanPostman.svg)](https://marketplace.visualstudio.com/items?itemName=carlowahlstedt.NewmanPostman)

Using [Newman](https://www.getpostman.com/docs/postman/collection_runs/command_line_integration_with_newman), one can effortlessly run and test a Postman Collections directly from the command-line. Now in a task!

## How to ##

You can include this task to a build & publish pipeline. Here's a quick 'How To'

### Requisites ###

Add a [npm task](https://docs.microsoft.com/fr-fr/vsts/build-release/tasks/package/npm) to install Newman before execution.

Set a display name (eg : 'Install Newman').

Set `custom` as command

As 'Command and arguments' set `install newman -g`

### Execution ###

Configure this task as per your requirements. (see [here](https://github.com/postmanlabs/newman#command-line-options) and [here](#Limitations) for options)

### Report ###

Test report can be integrated in Team Services.

To do so :

- Select **at least** `junit` as a reporter option (others can be added).
- Optionnaly specify path to export junit report.
- Add a 'Publish Test Result' task, to process generated Junit report. Specify format (JUnit) and path and to xml file.

Execution are now reported with test statistics.

![alt text](https://github.com/carlowahlstedt/NewmanPostman_VSTS_Task/blob/master/static/images/testresult.png?raw=true "Test result")

### Limitations ###

Following command line options are **not supported**:

- `-x`,`--suppress-exit-code`
- `-color`
- `--no-color`
- `--disable-unicode`
- `--disable-unicode`
- `--ssl-client-passphrase`
- None of the [CLI option](https://github.com/postmanlabs/newman#cli-reporter-options)

### Known issue(s) ###

- None

### Learn More ###

The [source](https://github.com/carlowahlstedt/NewmanPostman_VSTS_Task/) to this extension is available. Feel free to take, fork, and extend.

[View Notices](https://github.com/carlowahlstedt/NewmanPostman_VSTS_Task/blob/master/ThirdPartyNotices.txt) for third party software included in this extension.

### Minimum supported environments ###

- Visual Studio Team Services
- Team Foundation Server

### Contributors ###

We thank the following contributor(s) for this extension:

- [sunmorgus](https://github.com/sunmorgus)
- [sebcaps](https://github.com/sebcaps)

### Feedback ###

- [Add a review](https://marketplace.visualstudio.com/items?itemName=carlowahlstedt.NewmanPostman#review-details)
- [Post an issue on Github](https://github.com/carlowahlstedt/NewmanPostman_VSTS_Task/issues/new)
- Send us an [email](mailto:carlowahlstedt@gmail.com)
