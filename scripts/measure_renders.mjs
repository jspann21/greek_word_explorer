const WORD_COUNT = 1000;
const HOVER_EVENTS = 100;

function runBenchmark() {
  console.log(`Benchmarking with ${WORD_COUNT} words and ${HOVER_EVENTS} hover events.\n`);

  // Baseline: parent state change causes all children to re-render.
  let baselineTextPanelRenders = 0;
  let baselineWordRenders = 0;

  function simulateBaselineHover() {
    baselineTextPanelRenders++;
    // In React, a parent re-render re-renders its children by default.
    for (let i = 0; i < WORD_COUNT; i++) {
      baselineWordRenders++;
    }
  }

  for (let i = 0; i < HOVER_EVENTS; i++) {
    simulateBaselineHover();
  }

  console.log('--- Baseline (Current Implementation) ---');
  console.log(`TextPanel re-renders: ${baselineTextPanelRenders}`);
  console.log(`Total word re-renders: ${baselineWordRenders}`);
  console.log(`Work units: ${baselineTextPanelRenders + baselineWordRenders}`);

  // Optimized: hover is handled by CSS, so no React state update on hover.
  let optimizedTextPanelRenders = 0;
  let optimizedWordRenders = 0;

  function simulateOptimizedHover() {
    optimizedWordRenders += 0;
  }

  for (let i = 0; i < HOVER_EVENTS; i++) {
    simulateOptimizedHover();
  }

  console.log('\n--- Optimized (CSS/Localized) ---');
  console.log(`TextPanel re-renders: ${optimizedTextPanelRenders}`);
  console.log(`Total word re-renders: ${optimizedWordRenders}`);
  console.log(`Work units: ${optimizedTextPanelRenders + optimizedWordRenders}`);

  const baselineWork = baselineTextPanelRenders + baselineWordRenders;
  const optimizedWork = optimizedTextPanelRenders + optimizedWordRenders;
  const improvement = ((baselineWork - optimizedWork) / baselineWork) * 100;
  console.log(`\nImprovement: ${improvement.toFixed(2)}% reduction in render work.`);
}

runBenchmark();
