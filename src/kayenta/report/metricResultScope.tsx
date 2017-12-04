import * as React from 'react';
import { connect } from 'react-redux';

import { ICanaryState } from 'kayenta/reducers/index';
import { IMetricSetPair, ICanaryMetricConfig } from 'kayenta/domain';
import { runSelector, selectedMetricConfigSelector } from 'kayenta/selectors';
import metricStoreConfigService from 'kayenta/metricStore/metricStoreConfig.service';
import { ICanaryExecutionStatusResult } from '../domain/ICanaryExecutionStatusResult';

export interface IMetricResultScopeStateProps {
  metricConfig: ICanaryMetricConfig
  metricSetPair: IMetricSetPair;
  // Scope lives in stages named `stackdriverFetch` or `atlasFetch`.
  // Let the delegates resolve scope for themselves.
  run: ICanaryExecutionStatusResult;
  service: string;
}

/*
* A component for rendering metric scope & result details.
* Should be implemented per metric store.
* */
const MetricResultScope = ({ metricConfig, metricSetPair, run, service }: IMetricResultScopeStateProps) => {
  const delegate = metricStoreConfigService.getDelegate(service);
  if (!delegate || !delegate.metricResultScope) {
    return <p>Metric result scope component not implemented for {service}</p>;
  }

  const MetricResultScopeDelegate = delegate.metricResultScope;
  return (
    <MetricResultScopeDelegate
      metricConfig={metricConfig}
      metricSetPair={metricSetPair}
      run={run}
    />
  );
};

const mapStateToProps = (state: ICanaryState): IMetricResultScopeStateProps => ({
  metricConfig: selectedMetricConfigSelector(state),
  metricSetPair: state.selectedRun.metricSetPair.pair,
  run: runSelector(state),
  service: selectedMetricConfigSelector(state).query.type
});

export default connect(mapStateToProps)(MetricResultScope);