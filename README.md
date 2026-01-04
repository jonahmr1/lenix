# lenix_jobcenter
Job center for players to get hired with a fun experience system and reputation

## About
### Introduction
Welcome to Job Center.

This script is designed to enhance your server's gameplay by:
* Your player snow can head to the cityhall and get a job, earn points and reputation on each job to level up, grade up and make more points, money and rewards.

### Instructions
* Installation: drag and drop
* Environment: QBox
* Support: available

> Enjoy your improved gaming experience with Job Center!

<img width="1209" height="627" alt="jobcenter" src="https://github.com/user-attachments/assets/8934b405-52e1-4663-a9ae-cb1c199cca01" />

# Imports
## Client
### openJobCenter
```lua
exports.lenix_jobcenter:openJobCenter()
```
### closeJobCenter
```lua
exports.lenix_jobcenter:closeJobCenter()
```
## Server
## givePlayerRep
```lua
exports.lenix_jobcenter:givePlayerRep(source, identifier, jobName, type)
```
### Parameters
* source: `number` The player source
* identifier: `string` The player identifier aka citizenid
* jobName: `string` The job name
* type: `string` The type of rep
  * highend
  * high
  * average
  * low
  * lowend
  check config/shared.lua for more info

### Example
```lua
exports.lenix_jobcenter:givePlayerRep(source, '3R4L5T', 'police', 'low')
```

## getPlayerLevel
```lua
exports.lenix_jobcenter:getPlayerLevel(identifier, jobName)
```
### Parameters
* identifier: `string` The player identifier aka citizenid
* jobName: `string` The job name

### Return
* `number` The player level

### Example
```lua
exports.lenix_jobcenter:getPlayerLevel('3R4L5T', 'police')
```

## getPlayerDiffMultiplier
```lua
exports.lenix_jobcenter:getPlayerDiffMultiplier(identifier, jobName)
```
### Parameters
* identifier: `string` The player identifier aka citizenid
* jobName: `string` The job name

### Return
* `number` The player difficulty multiplier

### Example
```lua
exports.lenix_jobcenter:getPlayerDiffMultiplier('3R4L5T', 'police')
```
# Config
### config/client.lua
```lua
return {
  ui = {
    title = "", ---@field string this it the text you want to put on the top left of the container
    subtitle = "",  ---@field string the text below the title as a caption
    maxWidth = "1200px", ---@field string since this UI is not responsive, you can configure the maxWidth of it
    maxHeight = "80vh",  ---@field string since this UI is not responsive, you can configure the maxheightof it 
    coords = vec3(-553.6, -189.49, 38.12) ---@field vector3 the coordination of the jobcenter
  },
  theme = {
    primary = "214, 136, 51", ---@field string:RGB primary color of your server
    secondary = "132, 96, 58", ---@field string:RGB secondary color of your server
    background = "86 86 86 / 25%", ---@field string:RGB the background color of the UI
    text = "#ffffff", ---@field string:HEX the color of the text
    gradient = 'linear-gradient(0deg,rgba(99, 61, 19, 0.52) 0%, rgba(43, 29, 20, 0.52) 52%, rgba(41, 41, 41, 0.93) 100%)', ---@field params configure the behaviour of the background
    ui_title = '', ---@field string same of ui.title above
    ui_subtitle = '', ---@field string same of ui.subtitle above
    placeholder_h3 = '', ---@field string the default text on the main job details
    placeholder_p = '', ---@field string the text to show if no job was selected
    stats = 'none'
  }
}
```
### config/server.lua
```lua
return {
  job = { ---@field jobName same as in the core/shared
      name = "", ---field string this is the name or label you want to put as a title for the job
      position = "", ---@field string similar to subname
      description = "", ---@field string the description of the job
      category = "", ---@field string category of the job
      icon = "", ---@field string fontawesome icon
      enabled = true, ---@field boolean whether or not to enable the job or not
      repGrades = { -- this is the levels of each grade 
          [0] = 1, -- if he has the grade number 0, he'll have the level 1 as starting
          [1] = 10, -- the minimum level for the grade 1, basically he'll get promoted automatically (not sure if there'll be an error if the job doesn't have enough grades, TODO)
          [2] = 20,
          [3] = 40,
          [4] = 60,
      },
      repMultiplier = 1.1, -- this should be named gradeMultipiler, basically each time he get promoted , he'll get more points on each call/trigger
      difficultyMultiplierThresHold = 25, ---@field number this is the difficulty of the mutliplier
      repTypes = { ---@field object types of trigger's options
          ['highend'] = 6, -- simply player'll need to do this trigger 6 times to level up
          ['high'] = 7,
          ['average'] = 8,
          ['low'] = 9,
          ['lowend'] = 10,
      },
      maxXP = 100, -- maximum points for each level
      location = { x = -322.24, y = -1546.02, z = 30.02 }, ---@field vector3 the coordination of the job HQ
      requirements = { ---@field object the requirements to be able to take the job
          license = true
      },
      image = {
          type = "url", ---@field string type of the content below
          content = "https://r2.fivemanage.com" ---@field string link of an image of the job or the HQ
      },
      -- ignore this for now, join our discord to get updated
      stats = { payment = "", paymentLabel = "", availability = "", availabilityLabel = "" }
  },
  tow = {
      name = "Towing Service",
      position = "Tow Truck Driver",
      description = "Provide roadside assistance and vehicle towing services to help stranded motorists and clear traffic incidents.",
      category = "Emergency Services",
      icon = "fas fa-truck",
      enabled = true,
      repGrades = {
          [0] = 1,
          [1] = 25,
          [2] = 50,
      },
      repMultiplier = 1.1,
      difficultyMultiplierThresHold = 25,
      repTypes = {
          ['highend'] = 6,
          ['high'] = 7,
          ['average'] = 8,
          ['low'] = 9,
          ['lowend'] = 10,
      },
      maxXP = 100,
      location = { x = 909.0, y = -177.4, z = 74.2 },
      requirements = {
          license = true
      },
      image = {
          type = "url",
          content = "https://cdn.discordapp.com/attachments/1406729989084418160/1410006774022406154/image.png?ex=68b0c423&is=68af72a3&hm=36f50af509543740171ccc1969cc74daa396f3d785c8fbcd8cfabb6018bde0f8&"
      },
      stats = { payment = "", paymentLabel = "", availability = "", availabilityLabel = "" }
  },
}
```

# Roadmap
- [ ] add requirements like: license, job fees, a specific job or grade to get hired, etc...
