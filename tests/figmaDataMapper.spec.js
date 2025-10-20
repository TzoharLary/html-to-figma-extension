// Integration test for Figma Data Mapping in content script
// Tests that extracted DOM data includes Figma-compatible mappings

// Mock chrome API
global.chrome = {
  runtime: {
    onMessage: {
      addListener: jest.fn()
    }
  }
};

describe('Figma Data Mapper Integration', () => {
  let extractPageData, mapStylesToFigma;
  
  beforeEach(() => {
    // Set up DOM environment
    document.body.innerHTML = `
      <div id="test-container" style="
        display: flex;
        flex-direction: column;
        background-color: rgb(255, 0, 0);
        padding: 20px;
        border: 2px solid rgb(0, 0, 255);
        border-radius: 8px;
        box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.25);
        width: 300px;
        height: 200px;
      ">
        <p style="
          font-family: Arial;
          font-size: 16px;
          font-weight: bold;
          color: rgb(0, 0, 0);
          text-align: center;
        ">Test Text</p>
      </div>
    `;
    
    // Load content script functions
    const contentScript = require('../src/content/content.js');
    extractPageData = contentScript.extractPageData;
    mapStylesToFigma = contentScript.mapStylesToFigma;
  });
  
  test('extracted element includes figmaData', () => {
    const element = document.getElementById('test-container');
    const computedStyle = window.getComputedStyle(element);
    
    const elementData = {
      tagName: 'div',
      styles: {
        display: computedStyle.display,
        flexDirection: computedStyle.flexDirection,
        backgroundColor: computedStyle.backgroundColor,
        padding: {
          top: computedStyle.paddingTop,
          right: computedStyle.paddingRight,
          bottom: computedStyle.paddingBottom,
          left: computedStyle.paddingLeft
        },
        border: {
          width: computedStyle.borderWidth,
          style: computedStyle.borderStyle,
          color: computedStyle.borderColor,
          radius: computedStyle.borderRadius
        },
        width: computedStyle.width,
        height: computedStyle.height
      }
    };
    
    const figmaData = mapStylesToFigma(elementData);
    
    expect(figmaData).toBeDefined();
    expect(figmaData).toHaveProperty('fills');
    expect(figmaData).toHaveProperty('strokes');
    expect(figmaData).toHaveProperty('effects');
    expect(figmaData).toHaveProperty('layout');
    expect(figmaData).toHaveProperty('typography');
    expect(figmaData).toHaveProperty('constraints');
  });
  
  test('figmaData.fills includes background color', () => {
    const elementData = {
      styles: {
        backgroundColor: 'rgb(255, 0, 0)',
        padding: { top: '0px', right: '0px', bottom: '0px', left: '0px' },
        border: { width: '0px', radius: '0px' }
      }
    };
    
    const figmaData = mapStylesToFigma(elementData);
    
    expect(figmaData.fills).toHaveLength(1);
    expect(figmaData.fills[0].type).toBe('SOLID');
    expect(figmaData.fills[0].color.r).toBe(1);
    expect(figmaData.fills[0].color.g).toBe(0);
    expect(figmaData.fills[0].color.b).toBe(0);
  });
  
  test('figmaData.strokes includes border', () => {
    const elementData = {
      styles: {
        backgroundColor: 'transparent',
        border: {
          width: '2px',
          color: 'rgb(0, 0, 255)'
        },
        padding: { top: '0px', right: '0px', bottom: '0px', left: '0px' }
      }
    };
    
    const figmaData = mapStylesToFigma(elementData);
    
    expect(figmaData.strokes).toHaveLength(1);
    expect(figmaData.strokes[0].type).toBe('SOLID');
    expect(figmaData.strokes[0].color.r).toBe(0);
    expect(figmaData.strokes[0].color.g).toBe(0);
    expect(figmaData.strokes[0].color.b).toBe(1);
  });
  
  test('figmaData.layout includes dimensions and spacing', () => {
    const elementData = {
      styles: {
        width: '300px',
        height: '200px',
        padding: {
          top: '20px',
          right: '20px',
          bottom: '20px',
          left: '20px'
        },
        border: { radius: '8px', width: '0px' },
        display: 'flex',
        gap: '10px'
      }
    };
    
    const figmaData = mapStylesToFigma(elementData);
    
    expect(figmaData.layout.width).toBe(300);
    expect(figmaData.layout.height).toBe(200);
    expect(figmaData.layout.padding.top).toBe(20);
    expect(figmaData.layout.padding.left).toBe(20);
    expect(figmaData.layout.cornerRadius).toBe(8);
    expect(figmaData.layout.itemSpacing).toBe(10);
  });
  
  test('figmaData.layout.layoutMode maps flex correctly', () => {
    const elementData = {
      styles: {
        display: 'flex',
        flexDirection: 'column',
        padding: { top: '0px', right: '0px', bottom: '0px', left: '0px' },
        border: { radius: '0px', width: '0px' }
      }
    };
    
    const figmaData = mapStylesToFigma(elementData);
    
    expect(figmaData.layout.layoutMode).toBe('VERTICAL');
  });
  
  test('figmaData.typography includes font properties', () => {
    const elementData = {
      styles: {
        fontFamily: 'Arial',
        fontSize: '16px',
        fontWeight: 'bold',
        fontStyle: 'normal',
        textAlign: 'center',
        color: 'rgb(0, 0, 0)',
        lineHeight: 'normal',
        letterSpacing: '0px',
        padding: { top: '0px', right: '0px', bottom: '0px', left: '0px' },
        border: { radius: '0px', width: '0px' }
      }
    };
    
    const figmaData = mapStylesToFigma(elementData);
    
    expect(figmaData.typography.fontFamily).toBe('Arial');
    expect(figmaData.typography.fontSize).toBe(16);
    expect(figmaData.typography.fontWeight).toBe(700); // bold = 700
    expect(figmaData.typography.textAlign).toBe('CENTER');
    expect(figmaData.typography.color.rgb.r).toBe(0);
    expect(figmaData.typography.color.rgb.g).toBe(0);
    expect(figmaData.typography.color.rgb.b).toBe(0);
  });
  
  test('figmaData.effects includes box-shadow', () => {
    const elementData = {
      styles: {
        boxShadow: '2px 2px 4px rgba(0, 0, 0, 0.25)',
        padding: { top: '0px', right: '0px', bottom: '0px', left: '0px' },
        border: { radius: '0px', width: '0px' }
      }
    };
    
    const figmaData = mapStylesToFigma(elementData);
    
    expect(figmaData.effects).toHaveLength(1);
    expect(figmaData.effects[0].type).toBe('DROP_SHADOW');
    expect(figmaData.effects[0].offset.x).toBe(2);
    expect(figmaData.effects[0].offset.y).toBe(2);
    expect(figmaData.effects[0].radius).toBe(4);
  });
});
