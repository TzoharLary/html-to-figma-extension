// Tests for Phase 7: Layout Engine (Flexbox/Grid)
// Tests advanced layout features: Grid, absolute positioning, z-index

// Mock chrome API
global.chrome = {
  runtime: {
    onMessage: {
      addListener: jest.fn()
    }
  }
};

const {
  mapLayout,
  mapConstraints,
  mapPositioning,
  mapLayoutMode
} = require('../src/content/content.js');

describe('Phase 7: Layout Engine - Grid Support', () => {
  test('mapLayoutMode handles CSS Grid', () => {
    const styles = {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 1fr',
      gridTemplateRows: '100px 200px'
    };
    
    const result = mapLayoutMode(styles);
    expect(result).toBe('HORIZONTAL'); // 3 cols > 2 rows
  });
  
  test('mapLayoutMode prefers vertical for more rows', () => {
    const styles = {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gridTemplateRows: '100px 200px 150px'
    };
    
    const result = mapLayoutMode(styles);
    expect(result).toBe('VERTICAL'); // 3 rows > 2 cols
  });
  
  test('mapLayout includes grid properties', () => {
    const styles = {
      display: 'grid',
      gridTemplateColumns: '1fr 2fr 1fr',
      gridTemplateRows: 'auto 100px',
      gridGap: '20px',
      gridAutoFlow: 'row',
      width: '800px',
      height: '600px',
      padding: { top: '10px', right: '10px', bottom: '10px', left: '10px' },
      border: { radius: '0px', width: '0px' },
      position: 'static',
      zIndex: '0'
    };
    
    const result = mapLayout(styles);
    
    expect(result.gridProperties).toBeDefined();
    expect(result.gridProperties.templateColumns).toBe('1fr 2fr 1fr');
    expect(result.gridProperties.templateRows).toBe('auto 100px');
    expect(result.gridProperties.gap).toBe('20px');
    expect(result.gridProperties.autoFlow).toBe('row');
  });
});

describe('Phase 7: Layout Engine - Absolute Positioning', () => {
  test('mapPositioning handles absolute position', () => {
    const styles = { position: 'absolute' };
    const result = mapPositioning(styles);
    expect(result).toBe('ABSOLUTE');
  });
  
  test('mapPositioning handles fixed position', () => {
    const styles = { position: 'fixed' };
    const result = mapPositioning(styles);
    expect(result).toBe('ABSOLUTE');
  });
  
  test('mapPositioning handles relative position', () => {
    const styles = { position: 'relative' };
    const result = mapPositioning(styles);
    expect(result).toBe('AUTO');
  });
  
  test('mapPositioning handles static position', () => {
    const styles = { position: 'static' };
    const result = mapPositioning(styles);
    expect(result).toBe('AUTO');
  });
  
  test('mapLayout includes absolute position coordinates', () => {
    const styles = {
      display: 'block',
      position: 'absolute',
      top: '50px',
      left: '100px',
      right: '200px',
      bottom: '150px',
      width: '300px',
      height: '200px',
      padding: { top: '0px', right: '0px', bottom: '0px', left: '0px' },
      border: { radius: '0px', width: '0px' },
      zIndex: '10'
    };
    
    const result = mapLayout(styles);
    
    expect(result.positioning).toBe('ABSOLUTE');
    expect(result.absolutePosition).toBeDefined();
    expect(result.absolutePosition.top).toBe(50);
    expect(result.absolutePosition.left).toBe(100);
    expect(result.absolutePosition.right).toBe(200);
    expect(result.absolutePosition.bottom).toBe(150);
  });
  
  test('mapLayout includes z-index', () => {
    const styles = {
      display: 'block',
      position: 'absolute',
      zIndex: '999',
      width: '100px',
      height: '100px',
      padding: { top: '0px', right: '0px', bottom: '0px', left: '0px' },
      border: { radius: '0px', width: '0px' }
    };
    
    const result = mapLayout(styles);
    expect(result.zIndex).toBe(999);
  });
});

describe('Phase 7: Layout Engine - Smart Constraints', () => {
  test('mapConstraints detects horizontal STRETCH (left + right)', () => {
    const styles = {
      position: 'absolute',
      left: '20px',
      right: '20px',
      top: 'auto',
      bottom: 'auto'
    };
    
    const result = mapConstraints(styles);
    expect(result.horizontal).toBe('STRETCH');
  });
  
  test('mapConstraints detects horizontal MAX (right only)', () => {
    const styles = {
      position: 'absolute',
      left: 'auto',
      right: '20px',
      top: 'auto',
      bottom: 'auto'
    };
    
    const result = mapConstraints(styles);
    expect(result.horizontal).toBe('MAX');
  });
  
  test('mapConstraints detects horizontal MIN (left only)', () => {
    const styles = {
      position: 'absolute',
      left: '20px',
      right: 'auto',
      top: 'auto',
      bottom: 'auto'
    };
    
    const result = mapConstraints(styles);
    expect(result.horizontal).toBe('MIN');
  });
  
  test('mapConstraints detects horizontal CENTER (neither left nor right)', () => {
    const styles = {
      position: 'absolute',
      left: 'auto',
      right: 'auto',
      top: '50px',
      bottom: 'auto'
    };
    
    const result = mapConstraints(styles);
    expect(result.horizontal).toBe('CENTER');
  });
  
  test('mapConstraints detects vertical STRETCH (top + bottom)', () => {
    const styles = {
      position: 'absolute',
      left: 'auto',
      right: 'auto',
      top: '20px',
      bottom: '20px'
    };
    
    const result = mapConstraints(styles);
    expect(result.vertical).toBe('STRETCH');
  });
  
  test('mapConstraints detects vertical MAX (bottom only)', () => {
    const styles = {
      position: 'absolute',
      left: 'auto',
      right: 'auto',
      top: 'auto',
      bottom: '20px'
    };
    
    const result = mapConstraints(styles);
    expect(result.vertical).toBe('MAX');
  });
  
  test('mapConstraints detects vertical MIN (top only)', () => {
    const styles = {
      position: 'absolute',
      left: 'auto',
      right: 'auto',
      top: '20px',
      bottom: 'auto'
    };
    
    const result = mapConstraints(styles);
    expect(result.vertical).toBe('MIN');
  });
  
  test('mapConstraints handles fixed position same as absolute', () => {
    const styles = {
      position: 'fixed',
      left: '10px',
      right: '10px',
      top: '5px',
      bottom: '5px'
    };
    
    const result = mapConstraints(styles);
    expect(result.horizontal).toBe('STRETCH');
    expect(result.vertical).toBe('STRETCH');
  });
  
  test('mapConstraints defaults to MIN for static position', () => {
    const styles = {
      position: 'static',
      left: 'auto',
      right: 'auto',
      top: 'auto',
      bottom: 'auto'
    };
    
    const result = mapConstraints(styles);
    expect(result.horizontal).toBe('MIN');
    expect(result.vertical).toBe('MIN');
  });
});

describe('Phase 7: Layout Engine - Complex Scenarios', () => {
  test('flexbox with absolute child positioning', () => {
    const parentStyles = {
      display: 'flex',
      flexDirection: 'row',
      position: 'relative',
      width: '1000px',
      height: '500px',
      padding: { top: '20px', right: '20px', bottom: '20px', left: '20px' },
      border: { radius: '10px', width: '0px' },
      zIndex: '1'
    };
    
    const childStyles = {
      display: 'block',
      position: 'absolute',
      top: '50px',
      left: '50px',
      width: '200px',
      height: '100px',
      padding: { top: '0px', right: '0px', bottom: '0px', left: '0px' },
      border: { radius: '5px', width: '0px' },
      zIndex: '10'
    };
    
    const parentLayout = mapLayout(parentStyles);
    const childLayout = mapLayout(childStyles);
    
    expect(parentLayout.layoutMode).toBe('HORIZONTAL');
    expect(parentLayout.positioning).toBe('AUTO');
    expect(childLayout.positioning).toBe('ABSOLUTE');
    expect(childLayout.zIndex).toBe(10);
    expect(childLayout.absolutePosition.top).toBe(50);
  });
  
  test('grid with z-index stacking', () => {
    const styles = {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gridTemplateRows: 'auto',
      gridGap: '15px',
      gridAutoFlow: 'row',
      position: 'relative',
      zIndex: '5',
      width: '900px',
      height: '600px',
      padding: { top: '10px', right: '10px', bottom: '10px', left: '10px' },
      border: { radius: '0px', width: '0px' }
    };
    
    const result = mapLayout(styles);
    
    expect(result.layoutMode).toBe('HORIZONTAL');
    expect(result.gridProperties.templateColumns).toBe('repeat(3, 1fr)');
    expect(result.zIndex).toBe(5);
  });
});
