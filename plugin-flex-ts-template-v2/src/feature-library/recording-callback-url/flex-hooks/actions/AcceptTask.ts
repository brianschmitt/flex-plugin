import * as Flex from '@twilio/flex-ui';
import { FlexActionEvent, FlexAction } from '../../../../types/feature-loader';
import { getCallbackUrl } from '../../config';
import logger from '../../../../utils/logger';

export const actionEvent = FlexActionEvent.before;
export const actionName = FlexAction.AcceptTask;
export const actionHook = function setRecordingStatusCallback(flex: typeof Flex) {
  flex.Actions.addListener(`${actionEvent}${actionName}`, async (payload) => {
    if (!payload.task || !Flex.TaskHelper.isCallTask(payload.task)) {
      return;
    }

    const callbackUrl = getCallbackUrl(payload.task);
    if (callbackUrl) {
        logger.info(`[recording-status-callback] Setting recordingStatusCallback for ${payload.task.sid}: ${callbackUrl}`);
        if (!payload.conferenceOptions) {
            payload.conferenceOptions = {};
        }
        payload.conferenceOptions.conferenceRecordingStatusCallback = callbackUrl;
        payload.conferenceOptions.conferenceRecordingStatusCallbackMethod = 'POST';
    }
  });
};