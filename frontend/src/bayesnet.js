function bayesian() {
  // Main simulation
  const mlt_risk = [[0.2, 0.2, 0.1, 0.5], []];
  const mqnt_risk = [
    [0.3, 0.3, 0.4],
    [0, 0, 1],
  ];
  const mqlt_risk = [
    [0.1, 0.05, 0.25, 0.4, 0.2],
    [0, 0, 0, 0, 1],
  ];

  var output, rand, failure, l, u, i, probs;

  output = [];

  // First random probability value (Material Lead Time)
  rand = Math.random();
  failure = 0;
  l = 0;
  u = 0;
  i = 0;
  probs = mlt_risk[failure];
  for (let index = 0; index < probs.length; index++) {
    u += probs[index];
    if (l < rand && rand <= u) {
      if (i == 0 || i == 1 || i == 2) {
        failure = 1;
      }
      if (i == 0) {
        output.push("Fail due to Material Lead Time Risk: Transport Issue");
        break;
      } else if (i == 1) {
        output.push("Fail due to Material Lead Time Risk: Demand Surge");
        break;
      } else if (i == 2) {
        output.push(
          "Fail due to Material Lead Time Risk: Product Design Change"
        );
        break;
      } else if (i == 3) {
        output.push("No errors in Material Lead Time");
        break;
      }
    }
    i++;
    l = u;
  }

  // Second random probability value (Material Quantity)
  rand = Math.random();
  l = 0;
  u = 0;
  i = 0;
  probs = mqnt_risk[failure];
  for (let index = 0; index < probs.length; index++) {
    u += probs[index];
    if (l < rand && rand <= u) {
      if (i == 0 || i == 1) {
        failure = 1;
      }
      if (i == 0) {
        output.push("Fail due to Material Quantity: Yield Issue");
        break;
      } else if (i == 1) {
        output.push("Fail due to Material Quantity: Scrap due to ECO");
        break;
      } else if (i == 2) {
        output.push("No errors in Material Quantity");
        break;
      }
    }
    i++;
    l = u;
  }

  // Last random probability value (Material Quality)
  rand = Math.random();
  l = 0;
  u = 0;
  i = 0;
  probs = mqlt_risk[failure];
  for (let index = 0; index < probs.length; index++) {
    u += probs[index];
    if (l < rand && rand <= u) {
      if (i == 0 || i == 1 || i == 2 || i == 3) {
        failure = 1;
      }
      if (i == 0) {
        output.push("Fail due to Material Quality: Manufacturing Issue");
        break;
      } else if (i == 1) {
        output.push("Fail due to Material Quality: Design Issue");
        break;
      } else if (i == 2) {
        output.push("Fail due to Material Quality: Process Issue");
        break;
      } else if (i == 3) {
        output.push("Fail due to Material Quality: Training Issue ");
        break;
      } else if (i == 4) {
        output.push("No errors in Material Quality");
        break;
      }
    }
    i++;
    l = u;
  }

  output.push(Boolean(failure));

  return output;
}

function dataPerPeriod() {
  //Count of problems obtained computing bayesian
  var mlt_count_ti = 0;
  var mlt_count_ds = 0;
  var mlt_count_pdc = 0;
  var mqnt_count_yi = 0;
  var mqnt_count_se = 0;
  var mqlt_count_mi = 0;
  var mqlt_count_di = 0;
  var mqlt_count_pi = 0;
  var mqlt_count_ti = 0;

  for (var i = 0; i < 420; i++) {
    values = [];
    values = bayesian();

    switch (values[0]) {
      case "Fail due to Material Lead Time Risk: Transport Issue":
        mlt_count_ti++;
        break;
      case "Fail due to Material Lead Time Risk: Demand Surge":
        mlt_count_ds++;
        break;
      case "Fail due to Material Lead Time Risk: Product Design Change":
        mlt_count_pdc++;
        break;
    }
    switch (values[1]) {
      case "Fail due to Material Quantity: Yield Issue":
        mqnt_count_yi++;
        break;
      case "Fail due to Material Quantity: Scrap due to ECO":
        mqnt_count_se++;
        break;
    }
    switch (values[2]) {
      case "Fail due to Material Quality: Manufacturing Issue":
        mqlt_count_mi++;
        break;
      case "Fail due to Material Quality: Design Issue":
        mqlt_count_di++;
        break;
      case "Fail due to Material Quality: Process Issue":
        mqlt_count_pi++;
        break;
      case "Fail due to Material Quality: Training Issue":
        mqlt_count_ti++;
        break;
    }
  }

  return [
    mlt_count_ti,
    mlt_count_ds,
    mlt_count_pdc,
    mqnt_count_yi,
    mqnt_count_se,
    mqlt_count_mi,
    mqlt_count_di,
    mqlt_count_pi,
    mqlt_count_ti,
  ];
}

function regression(dataHistory, periods) {
  let xiti = 0;

  for (let index = 0; index < dataHistory.length; index++) {
    xiti += dataHistory[index] * index;
  }

  let xi = 0;

  for (let index = 0; index < dataHistory.length; index++) {
    xi += dataHistory[index];
  }

  let ti = 0;

  for (let index = 0; index < dataHistory.length; index++) {
    ti += index;
  }

  let t2i = 0;

  for (let index = 0; index < dataHistory.length; index++) {
    t2i += index * index;
  }

  let ti2 = ti * ti;

  let b =
    (dataHistory.length * xiti - xi * ti) / (dataHistory.length * t2i - ti2);

  let xAverage = 0;

  for (let index = 0; index < dataHistory.length; index++) {
    xAverage += dataHistory[index];
  }

  xAverage = xAverage / dataHistory.length;

  let tAverage = 0;

  for (let index = 0; index < dataHistory.length; index++) {
    tAverage += index;
  }

  tAverage = tAverage / dataHistory.length;

  let a = xAverage - b * tAverage;

  results = [];

  for (let index = 11; index < periods + 11; index++) {
    results.push(a + b * index);
  }

  return results;
}

export default function simluate() {
  weeks = 10;

  //Getting 10 periods of calculations
  var mlt_count_ti_periods = [];
  var mlt_count_ds_periods = [];
  var mlt_count_pdc_periods = [];
  var mqnt_count_yi_periods = [];
  var mqnt_count_se_periods = [];
  var mqlt_count_mi_periods = [];
  var mqlt_count_di_periods = [];
  var mqlt_count_pi_periods = [];
  var mqlt_count_ti_periods = [];

  for (let i = 0; i < 10; i++) {
    values = dataPerPeriod();
    mlt_count_ti_periods.push(values[0]);
    mlt_count_ds_periods.push(values[1]);
    mlt_count_pdc_periods.push(values[2]);
    mqnt_count_yi_periods.push(values[3]);
    mqnt_count_se_periods.push(values[4]);
    mqlt_count_mi_periods.push(values[5]);
    mqlt_count_di_periods.push(values[6]);
    mqlt_count_pi_periods.push(values[7]);
    mqlt_count_ti_periods.push(values[8]);
  }

  console.log(mlt_count_ti_periods);
  console.log(mlt_count_ds_periods);
  console.log(mlt_count_pdc_periods);
  console.log(mqnt_count_yi_periods);
  console.log(mqnt_count_se_periods);
  console.log(mqlt_count_mi_periods);
  console.log(mqlt_count_di_periods);
  console.log(mqlt_count_pi_periods);
  console.log(mqlt_count_ti_periods);

  var mlt_count_ti_results = regression(mlt_count_ti_periods, weeks);
  var mlt_count_ds_results = regression(mlt_count_ds_periods, weeks);
  var mlt_count_pdc_results = regression(mlt_count_pdc_periods, weeks);
  var mqnt_count_yi_results = regression(mqnt_count_yi_periods, weeks);
  var mqnt_count_se_results = regression(mqnt_count_se_periods, weeks);
  var mqlt_count_mi_results = regression(mqlt_count_mi_periods, weeks);
  var mqlt_count_di_results = regression(mqlt_count_di_periods, weeks);
  var mqlt_count_pi_results = regression(mqlt_count_pi_periods, weeks);
  var mqlt_count_ti_results = regression(mqlt_count_ti_periods, weeks);

  for (let index = 0; index < mlt_count_ti_results.length; index++) {
    console.log(mlt_count_ti_results[index]);
    0;
  }

  for (let index = 0; index < mlt_count_ds_results.length; index++) {
    console.log(mlt_count_ds_results[index]);
  }

  for (let index = 0; index < mlt_count_pdc_results.length; index++) {
    console.log(mlt_count_pdc_results[index]);
  }

  for (let index = 0; index < mqnt_count_yi_results.length; index++) {
    console.log(mqnt_count_yi_results[index]);
  }

  for (let index = 0; index < mqnt_count_se_results.length; index++) {
    console.log(mqnt_count_se_results[index]);
  }

  for (let index = 0; index < mqlt_count_mi_results; index++) {
    console.log(mqlt_count_mi_results[index]);
  }

  for (let index = 0; index < mqlt_count_di_results.length; index++) {
    console.log(mqlt_count_di_results[index]);
  }

  for (let index = 0; index < mqlt_count_pi_results.length; index++) {
    console.log(mqlt_count_pi_results[index]);
  }

  for (let index = 0; index < mqlt_count_ti_results.length; index++) {
    console.log(mqlt_count_ti_results[index]);
  }
}
