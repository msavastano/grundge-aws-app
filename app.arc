@app
freespeculativefiction

@http
/*
  method any
  src server

@static

@tables
user
  pk *String

password
  pk *String # userId

note
  pk *String  # userId
  sk **String # noteId

magstorytag      #MAG          #STORY               #STORYTAG
  pk *String   # mag#magId    mag#mag             #story#storyId
  sk **String  # meta#magId   story#storyId       #tag#tagId
  type String

@tables-indexes
magstorytag
  sk *String
  pk **String
  projection all
  name tagstories

magstorytag
  type *String
  projection all
  name byType  

@aws
region us-east-1
