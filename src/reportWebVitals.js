const reportWebVitals = (onPerfEntry) => {
  if (onPerfEntry && typeof onPerfEntry === "function") {
    import("web-vitals").then(
      ({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
        getCLS(onPerfEntry);
        getFID(onPerfEntry);
        getFCP(onPerfEntry);
        getLCP(onPerfEntry);
        getTTFB(onPerfEntry);
      }
    );
  }
};

// Example: log results in a more readable way
const logWebVitals = (metric) => {
  console.log(
    `[Web Vitals] ${metric.name}: ${metric.value} (${metric.id})`
  );

  // Example: send to backend or analytics
  /*
  fetch('/analytics', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(metric),
  });
  */
};

export default reportWebVitals;
export { logWebVitals };
