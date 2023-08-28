const Pixel = ({ color, webGPU}) => {
    const defaultColor = "#FFFFFF"; 
    const borderStyle = webGPU == "yes" ? '1px solid black' : '1px solid #EEE';
    return (
      <div
        style={{
          width: '20px',
          height: '20px',
          backgroundColor: color || defaultColor,
          border: borderStyle
        }}
      />
    );
  };

export default Pixel;
  