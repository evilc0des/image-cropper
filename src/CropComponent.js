import React, { Component } from "react";
import PropTypes from "prop-types";
import injectSheet from "react-jss";

import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column"
  },
  inputIcon: {
    marginBottom: 16
  },
  filledInput: {
    width: 0.1,
    height: 0.1,
    opacity: 0,
    overflow: "hidden",
    position: "absolute",
    zIndex: -1,

    "& + label": {
      marginBottom: 18
    }
  },
  inputEl: {
    width: 0.1,
    height: 0.1,
    opacity: 0,
    overflow: "hidden",
    position: "absolute",
    zIndex: -1,

    "& + label": {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      width: "70vw",
      height: "60vh",
      color: "white",
      backgroundColor: "#a5d9ff",
      cursor: "pointer",
      outline: "2px dashed #034472",
      outlineOffset: -10
    },
    "&:focus + label": {
      outline: "1px dotted #000",
      outline: "-webkit - focus - ring - color auto 5px"
    },
    "&:focus + label, & + label:hover": {
      backgroundColor: "#8cb1cc"
    }
  },

  primaryBtn: {
    color: "white",
    backgroundColor: "#1f88d3",
    border: "none",
    padding: "10px 16px",
    margin: 8,
    cursor: "pointer",
    "&:disabled": {
      backgroundColor: "#b2d3ea",
      cursor: "auto"
    }
  },
  error: {
    color: "red",
    fontWeight: 700,
    margin: 8
  }
};

function saveImage(imageFile) {
  return Promise.resolve("http://lorempixel.com/800/100/cats/");
}

class CropComponent extends Component {
  constructor(props) {
    super(props);
    // create a ref to store the fileInput DOM element
    this.fileInput = React.createRef();
    this.dragZone = React.createRef();
    this.state = {
      src: null,
      crop: {
        x: 0,
        y: 0,
        width: 100,
        height: 100
      }
    };
  }

  onSelectFile = e => {
    if (e.target.files && e.target.files.length > 0) {
      if (!e.target.files[0].type.match("image/*")) {
        this.setState({
          err: "Uploaded file is not an image"
        });
        return;
      }

      if (e.target.files[0].size > 1024 * 1024) {
        this.setState({
          err: "Uploaded File Should be less than 1 MB"
        });
        return;
      }

      const reader = new FileReader();
      reader.addEventListener(
        "load",
        () => {
          var img = new Image();
          img.addEventListener(
            "load",
            () => {
              let maxWidth = 100,
                maxHeight = 100;

              //Converting 800x100 in percentages of the image as the Crop library takes percentages
              if (img.naturalWidth > 800) {
                maxWidth = (800 / img.naturalWidth) * 100;
              }

              if (img.naturalHeight > 100) {
                maxHeight = (100 / img.naturalHeight) * 100;
              }

              this.setState({
                src: reader.result,
                err: null,
                crop: {
                  ...this.state.crop,
                  height: maxHeight,
                  width: maxWidth
                },
                maxHeight,
                maxWidth
              });
            },
            false
          );
          img.src = reader.result;
        },
        false
      );
      this.setState({
        srcFile: e.target.files[0]
      });
      console.log(e.target.files[0]);
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  onImageLoaded = async (image, pixelCrop) => {
    this.setState({ image });
    if (pixelCrop) {
      const finalImage = await this.getCroppedImg(
        image,
        pixelCrop,
        this.state.srcFile.name
      );
      this.setState({ finalImage });
    }
  };

  onCropComplete = async (crop, pixelCrop) => {
    const finalImage = await this.getCroppedImg(
      this.state.image,
      pixelCrop,
      this.state.srcFile.name
    );
    this.setState({ finalImage });
  };

  onCropChange = crop => {
    this.setState({ crop });
  };

  getCroppedImg(image, pixelCrop, fileName) {
    const canvas = document.createElement("canvas");
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    this.setState({
      pixelCrop
    });
    const ctx = canvas.getContext("2d");

    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );

    // As Base64 string
    // const base64Image = canvas.toDataURL('image/jpeg');

    // As a blob
    return new Promise((resolve, reject) => {
      canvas.toBlob(file => {
        //file.name = fileName;
        resolve(file);
      }, "image/jpeg");
    });
  }

  handleDone = e => {
    let { onSaveImage } = this.props;
    onSaveImage(this.state.finalImage).then(url => {
      this.setState({
        finalImage: url,
        saved: true
      });
    });
  };

  printPreview = e => {
    let html = `<div style="text-align:center;">
      <img id="final-img" src="${this.state.finalImage}">
    </div>`;

    let wnd = window.open("about:blank", "", "_blank");
    wnd.document.write(html);

    //The image sometimes loads too slowly based on network, we delay print for load
    wnd.document.querySelector("#final-img").onload = function() {
      wnd.print();
      wnd.setTimeout(wnd.close, 0);
    };

    wnd.document.querySelector("#final-img").onerror = function() {
      wnd.alert("Image Failed to load. Try Again.");
      wnd.setTimeout(wnd.close, 0);
    };
  };

  clearImage = e => {
    this.fileInput.current.value = "";
    this.setState({
      src: null,
      srcFile: null,
      finalImage: null,
      saved: null,
      pixelCrop: null,
      image: null,
      crop: {
        x: 0,
        y: 0,
        width: 100,
        height: 100
      },
      err: null,
      minWidth: 100,
      maxWidth: 100
    });
  };

  preventDefaults = e => {
    e.preventDefault();
    e.stopPropagation();
  };

  handleDrop = e => {
    let dt = e.dataTransfer;
    this.fileInput.current.files = dt.files;
    this.onSelectFile({ ...e, target: this.fileInput.current });
  };

  componentDidMount() {
    ["dragenter", "dragover", "dragleave", "drop"].forEach(eventName => {
      this.dragZone.current.addEventListener(
        eventName,
        this.preventDefaults,
        false
      );
    });

    this.dragZone.current.addEventListener("drop", this.handleDrop, false);
  }

  componentWillUnmount() {
    this.dragZone.current.removeEventListener("drop", this.handleDrop);
    ["dragenter", "dragover", "dragleave", "drop"].forEach(eventName => {
      this.dragZone.current.removeEventListener(
        eventName,
        this.preventDefaults,
        false
      );
    });
  }

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.container}>
        <div>
          <input
            ref={this.fileInput}
            className={this.state.src ? classes.filledInput : classes.inputEl}
            accept="image/*"
            type="file"
            name="imageFile"
            id="imageFile"
            onChange={this.onSelectFile}
          />
          <label ref={this.dragZone} htmlFor="imageFile">
            {this.state.src ? (
              <strong>{this.state.srcFile.name}</strong>
            ) : (
              <svg
                className={classes.inputIcon}
                fill="white"
                xmlns="http://www.w3.org/2000/svg"
                width="50"
                height="43"
                viewBox="0 0 50 43"
              >
                <path d="M48.4 26.5c-.9 0-1.7.7-1.7 1.7v11.6h-43.3v-11.6c0-.9-.7-1.7-1.7-1.7s-1.7.7-1.7 1.7v13.2c0 .9.7 1.7 1.7 1.7h46.7c.9 0 1.7-.7 1.7-1.7v-13.2c0-1-.7-1.7-1.7-1.7zm-24.5 6.1c.3.3.8.5 1.2.5.4 0 .9-.2 1.2-.5l10-11.6c.7-.7.7-1.7 0-2.4s-1.7-.7-2.4 0l-7.1 8.3v-25.3c0-.9-.7-1.7-1.7-1.7s-1.7.7-1.7 1.7v25.3l-7.1-8.3c-.7-.7-1.7-.7-2.4 0s-.7 1.7 0 2.4l10 11.6z" />
              </svg>
            )}
            {!this.state.src && (
              <span>
                <strong>Upload an Image </strong>
                or Drag it here.
              </span>
            )}

            {this.state.err && (
              <span className={classes.error}>{this.state.err}</span>
            )}
          </label>
          {this.state.src && (
            <button className={classes.primaryBtn} onClick={this.clearImage}>
              Clear Image
            </button>
          )}
        </div>
        {this.state.src && (
          <ReactCrop
            src={this.state.src}
            crop={this.state.crop}
            onImageLoaded={this.onImageLoaded}
            onComplete={this.onCropComplete}
            onChange={this.onCropChange}
            maxWidth={this.state.maxWidth}
            maxHeight={this.state.maxHeight}
          />
        )}
        <p>
          <em>
            {this.state.pixelCrop &&
              `${this.state.pixelCrop.width} x ${this.state.pixelCrop.height}`}
          </em>
        </p>
        <button className={classes.primaryBtn} onClick={this.handleDone}>
          Save Image
        </button>
        <button
          className={classes.primaryBtn}
          disabled={!this.state.saved}
          onClick={this.printPreview}
        >
          Print Preview
        </button>
      </div>
    );
  }
}

CropComponent.propTypes = {
  classes: PropTypes.object,
  onSaveImage: PropTypes.func
};

CropComponent.defaultProps = {
  onSaveImage: saveImage
};

export default injectSheet(styles)(CropComponent);
