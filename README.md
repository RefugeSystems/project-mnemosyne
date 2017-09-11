# Project Mnemosyne
This project focuses on providing hooks into various systems for aggregating and reporting on code repositories to give consistent feedback regarding the status of things like sprint items from JIRA by cross referencing their information with unit test results from testing processes such as JUnit.

# As a Library

This project is written to ideally be used as a library in another program, providing classes to use for interacting with different systems so that developers can easily link to other systems for automating things like updates and data synchronization.

# As a Script

This code base additionally provides a `quickScan` script to do simply tasks quickly without needing to write a program to use it.

## Running quickScan
```nodejs
./app/quickscan [JIRA Board ID] ([Task] )*
```

### Quick Scan Tasks

[ Pending ]
