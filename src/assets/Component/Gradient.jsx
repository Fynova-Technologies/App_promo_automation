import { useState } from "react";
import { MockupSection } from "./MockupSection";

export const Gradient = () =>{
    const [color, setColor] = useState('linear-gradient(90deg, rgba(96,93,93,1) 0%, rgba(255,255,255,1) 100%)'); 
    const [activeControl, setActiveControl] = useState(null);

    return (
        <>
        <div className="gradient-container">
            <MockupSection 
                background={color}
                setBackground = {setColor}
                activeControl={activeControl}
                setActiveControl={setActiveControl}
            />     
        </div>
        </>
    );
}