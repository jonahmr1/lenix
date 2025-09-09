exports.interact:AddInteraction({
  coords = UIConfig.coords,
  distance = 8.0,
  interactDst = 2.0,
  id = 'Job',
  options = {
    {
      label = 'Search For A Job',
      action = function()
        OpenJobCenter()
      end
    },
    {
      label = 'Cityhall Service',
      action = function()
        exports.tr_smallresources:OpenCityhallMenu()
      end
    }
  }
})
