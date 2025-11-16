local tasks = {}
local running = false

function lib.task(func)
  table.insert(tasks, func)

  if not running then
    running = true
    CreateThread(function()
      while #tasks > 0 do
        for i = #tasks, 1, -1 do
          local success, result = pcall(tasks[i])
          if not success or result == false then
            table.remove(tasks, i)
          end
        end
        Wait(0)
      end
      running = false
    end)
  end
end