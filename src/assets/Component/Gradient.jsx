import { useState } from "react";
import { MockupSection } from "./MockupSection";
import CaptionControls from "./CaptionControls";

export const Gradient = () =>{
    const [color, setColor] = useState('linear-gradient(90deg, rgba(96,93,93,1) 0%, rgba(255,255,255,1) 100%)'); 
    const [activeControl, setActiveControl] = useState(null);
    
    // const toggleColorPicker = () =>{
    //     setIsPickerVisible((prev) => (prev === "colorPicker" ? null : "colorPicker"));
    // }

    // Modified toggle function to manage active control
    // const toggleControl = (controlType) => {
    //     // If the clicked control is already active, set to null (close it)
    //     // Otherwise, set it to the new control type
    //     setActiveControl(prevControl => 
    //         prevControl === controlType ? null : controlType
    //     );
    // };

    return (
        <>
        <div className="gradient-container">
            <MockupSection 
                background={color}
                setBackground = {setColor}
                // isPickerVisible={isPickerVisible} 
                // toggleColorPicker={toggleColorPicker}
                activeControl={activeControl}
                    setActiveControl={setActiveControl}
                    // toggleControl={toggleControl}
            />     
        </div>
        </>
    );
}