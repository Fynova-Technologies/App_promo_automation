import ColorPicker from "react-best-gradient-color-picker";
import CaptionControls from "./CaptionControls";
import { FrameSelector } from "./FrameSelector";

export const ControlPanel = (props) => {

    return (
        <div className="controls-panel">
            {props.activeControl === "colorPicker" && (
                <div className="color-picker">
                    <ColorPicker value={props.background} onChange={props.setBackground} hideColorTypeBtns={false} />
                </div>
            )}
        
            {props.activeControl === "captionControls" && props.showCaptionControls && (
                <div className="caption-controls">
                    <CaptionControls
                        fontColor={props.fontColor}
                        setFontColor={props.setFontColor}
                        fontFamily={props.fontFamily}
                        setFontFamily={props.setFontFamily}
                        fontSize={props.fontSize}
                        setFontSize={props.setFontSize}
                        setShowCaptionBox={props.setShowCaptionBox}
                        showCaptionBox={props.showCaptionBox}
                        handleCaptionDeleted={props.handleCaptionDeleted}
                    />
                </div>
            )}
        
            {props.activeControl === "frameSelector" && props.showFrameSelector && (
                <div className="external-frame-selector">
                    <FrameSelector
                        selectedFrame={props.mobileFrame}
                        onFrameSelect={(frameData) => {
                            props.setMobileFrame(frameData.image);
                            props.setCurrentFrameConfig(frameData.config);
                        }}
                    />
                </div>
            )}
        </div>
    )
}