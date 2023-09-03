### Technical Setup Guide 
Andrew Yuan

## Background

Since there is no explicit setup guides in the code base, I am writing on how I was able to 
get the project to run on both MacOS and Windows. I don't think what I did was the shortest 
path of setting things up, so I will come back and update some steps as I help other team 
members get onboarded as well. 

## Windows Setup

1. Download Visual Studio (NOT Visual Studio Code). 
2. In the Visual Studio Installer, make sure that the Azure Development Workload is selected. 
This is the most important step as authentication (to the SQL databases) will require that this workload was selected in the installation. 
I personally left everything else as default and it works.
3. Pull the codebase by hitting "clone". There should be the option to "Generate Git Credentials". 
I personally use Github Desktop, and it will require an username and password. You should use the displayed
username and password when you hit "Generate Git Credentials". 
4. For Windows, just open TeamRiverRunner.sln and then hit the green arrow button to run.

## MacOS Setup
1. Download Visual Studio For Mac.
2. Pull the codebase by hitting "clone". There should be the option to "Generate Git Credentials". 
I personally use Github Desktop, and it will require an username and password. You should use the displayed
username and password when you hit "Generate Git Credentials". 
3. Personally, I had to click "Visual Studio" > "Log In" to log in to my Microsoft account 
that was granted access to this repo. I also had to download Azure CLI and log in to avoid any 
SQL.InvalidCredential.Exceptions. I did so through "brew update && brew install azure-cli" and then "az login".
4. Afterwards, hit the green arrow button and you should be good.
