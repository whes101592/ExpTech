function Point(x, y)        -- "Point" object constructor

  return { x = x, y = y }   -- Creates and returns a new object (table)

end

array = { Point(10, 20), Point(30, 40), Point(50, 60) }   -- Creates array of points

for i = 1,3 do 

  print("point("..array[i].x..","..array[i].y..")")

end
