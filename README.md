Preparing svg files for svg sprites
=====================
This script will delete headers and metadata,
styles that are set by classes be converted to attributes
***
# how to use it 

Move the file "index.js " to the folder where you store images in svg format
***

    node index.js nameFile             | running the script by image name
    ***
    node index.js nameFile newNameFile | running the script by image name and renaming it
    ***
    node index.js --all                | running the script for all images
