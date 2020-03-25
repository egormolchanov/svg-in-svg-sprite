preparing svg files for svg sprites
=====================
this script will delete headers and metadata,
styles that are set by classes be converted to attributes
***
# how to use it 

Move the file "index.js " to the folder where you store images in svg format
***

dir /node index.js nameFile             | running the script by image name
dir /node index.js nameFile newNameFile | running the script by image name and renaming it
dir /node index.js --all                | running the script for all images
