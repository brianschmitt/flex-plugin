import { getFeatureFlags } from '../../utils/configuration';
import RecordingCallbackUrlConfig from './types/ServiceConfiguration';
import { replaceStringAttributes } from '../../utils/helpers';
import { ITask } from '@twilio/flex-ui';

const { enabled = false, callback_url = '' } = (getFeatureFlags()?.features?.recording_callback_url as RecordingCallbackUrlConfig) || {};

export const isFeatureEnabled = () => {
  return enabled;
};

export const getCallbackUrl = (task?: ITask) => {
  if (callback_url) {
    return replaceStringAttributes(callback_url, task);
  }
  return '';
};