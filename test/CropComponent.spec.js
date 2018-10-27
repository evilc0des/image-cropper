import React from "react";
import { mount, shallow } from "enzyme";
import CropComponent from "../src/CropComponentonent";

describe("CropComponent", () => {
    let props;
    let mountedCropComponent;
    const cropComponent = () => {
      if (!mountedCropComponent) {
        mountedCropComponent = mount(
          <CropComponent {...props} />
        );
      }
      return mountedCropComponent;
    }
  
    beforeEach(() => {
      props = {
        onSaveImage: undefined,
      };
      mountedCropComponent = undefined;
    });
    
    it("always renders a div", () => {
        const divs = cropComponent().find("div");
        expect(divs.length).toBeGreaterThan(0);
    });

    describe("the rendered div", () => {
        it("contains everything else that gets rendered", () => {
          const divs = cropComponent().find("div");
          const wrappingDiv = divs.first();
      
          expect(cropComponent().children().children().children()).toEqual(wrappingDiv.children());
        });
    });

    it("always renders a `Save Image` button", () => {
        expect(cropComponent().find('.save-img-btn').length).toBe(1);
    });

    describe("rendered `Save Image` button", () => {
        it("should call handleDone function on click", () => {
          
          //const mock = jest.fn();
          const spy = jest.spyOn(shallow(<CropComponent />).get(0).type.prototype, "handleDone");
          const saveImgBtn = cropComponent().childAt(0).find('.save-img-btn');
          expect(spy).not.toBeCalled();
          saveImgBtn.simulate("click");
          expect(spy).toBeCalled();
          spy.mockRestore();
        });

        it("should enable 'Print Preview' button on click", () => {
            const saveImgBtn = cropComponent().childAt(0).find('.save-img-btn');
            const printPreviewBtn = cropComponent().childAt(0).find('.print-preview-btn');
            expect(printPreviewBtn.props().disabled).toBe(true);
            saveImgBtn.simulate("click");
            setTimeout( () => {
                expect(printPreviewBtn.props().disabled).toBe(false);
            },0);
        });
    });

    it("always renders a `Print preview` button", () => {
        expect(cropComponent().find('.print-preview-btn').length).toBe(1);
    });

    describe("rendered `Print preview` button", () => {
        it("should call printPreview function on click if enabled", () => {
        
          const spy = jest.spyOn(shallow(<CropComponent />).get(0).type.prototype, "printPreview");
          const printPreviewBtn = cropComponent().childAt(0).find('.print-preview-btn');
          printPreviewBtn.props().disabled = false;
          cropComponent().update();
          expect(printPreviewBtn.props().disabled).toBe(false);
          printPreviewBtn.simulate("click");
          setTimeout( () => {
              expect(spy).toBeCalled();
          }, 0);
          spy.mockRestore();
        });

        it("should not call printPreview function on click if disabled", () => {
        
            const spy = jest.spyOn(shallow(<CropComponent />).get(0).type.prototype, "printPreview");
            const printPreviewBtn = cropComponent().childAt(0).find('.print-preview-btn');
            printPreviewBtn.props().disabled = true;
            cropComponent().update();
            expect(printPreviewBtn.props().disabled).toBe(true);
            printPreviewBtn.simulate("click");
            setTimeout( () => {
                expect(spy).not.toBeCalled();
            }, 0);
            spy.mockRestore();
          });
    });

  });

  