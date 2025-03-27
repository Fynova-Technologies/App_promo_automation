import '../Style/captionControls.css'
import '../Style/fonts.css'

const CaptionControls = ({ fontColor, setFontColor, fontFamily, setFontFamily, fontSize, setFontSize }) => {
    return (
      <div className="caption-controls-container">
        <label className='font-container' style={{color: "white", textDecoration: 'none'}}>
          Font Style
          <select value={fontFamily} onChange={(e) => setFontFamily(e.target.value)} style={{ fontFamily: fontFamily }}>
            <option value="Baloo 2" style={{fontFamily: 'Baloo 2'}}>Baloo 2</option>
            <option value="Poppins" style={{fontFamily: 'Poppins'}}>Poppins</option>
            <option value="Roboto" style={{fontFamily: 'Roboto'}}>Roboto</option>
            <option value="Lora" style={{fontFamily: 'Lora'}}>Lora</option>
            <option value="Open Sans" style={{fontFamily: 'Open Sans'}}>Open Sans</option>
            <option value="Snickles" style={{fontFamily: 'Snickles'}}>Snickles</option>
          </select>
        </label>

        <label className='font-size'  style={{color: "white"}} >
          Font Size
          <select value={fontSize} onChange={(e) => setFontSize(e.target.value)}>
            <option value="12" >12 px</option>
            <option value="14" >14 px</option>
            <option value="16" >16 px</option>
            <option value="18" >18 px</option>
            <option value="24" >24 px</option>
            <option value="28" >28 px</option>
            <option value="32" >32 px</option>
            <option value="36" >36 px</option>
            
          </select>
        </label>

        <label className='color-container' style={{color: "white"}}>
          Font Color
          <input type="color" value={fontColor} onChange={(e) => setFontColor(e.target.value)} />
        </label>
      </div>
    );
  };
  
  export default CaptionControls;
  