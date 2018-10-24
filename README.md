# Image-Cropper

React based component to select, crop and upload an Image.


## Usage

Follow these steps to Get Started:

 - Clone the Repository
 `git clone https://github.com/evilc0des/image-cropper.git`
 
 - Install Dependency
    `npm install`
    
 - Start the App
	`npm start`
	Runs the app in the development mode with hot-reloading and linting.  
	Open  [http://localhost:3000](http://localhost:3000/)  to view it in the browser.

### Other Available Commands

#### `npm test`

Launches the test runner in the interactive watch mode.  
See the section about  [running tests](https://facebook.github.io/create-react-app/docs/running-tests)  for more information.

#### [](https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/template/README.md#npm-run-build)`npm run build`

Builds the app for production to the  `build`  folder.  
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.  
Your app is ready to be deployed!

## Component API

The component can be used as follows.

 - Import the component
 `import  CropComponent  from  "./CropComponent";`
 
 - Use the Component in your Render method
  `<CropComponent/>`

The Component optionally takes a prop **onSaveImage**
`<CropComponent onSaveImage={saveImage} />`

**onSaveImage** expects a function which takes the final cropped image as input and returns a promise that resolves to the uploaded URL.

If this prop is missing, the following function is used by default to show the image.
`function saveImage(imageFile) {`
&ensp;&ensp;&ensp;`	return Promise.resolve("http://lorempixel.com/800/100/cats/");` 
`}`


## Additional Notes

 - The given image from lorempixel.com takes a long time to load and sometimes fails. Thus we look for the onload and onerror events in the print preview new tab to print and close the window. It may take a long time to see any result.
