import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { Stage } from 'amazon-ivs-web-broadcast';
import TraineeStreamPanel from './TraineeStreamPanel';
import { createSelfViewerSession } from '../../API/streamingAPI';

let mockStageInstance;

jest.mock('../../API/streamingAPI', () => ({
  createSelfViewerSession: jest.fn()
}));

jest.mock('amazon-ivs-web-broadcast', () => ({
  Stage: jest.fn(),
  StageConnectionState: { CONNECTED: 'CONNECTED', ERRORED: 'ERRORED' },
  StageEvents: {
    STAGE_CONNECTION_STATE_CHANGED: 'connection',
    STAGE_PARTICIPANT_STREAMS_ADDED: 'streams-added',
    STAGE_PARTICIPANT_STREAMS_REMOVED: 'streams-removed',
    STAGE_PARTICIPANT_LEFT: 'participant-left',
    ERROR: 'error'
  },
  SubscribeType: { AUDIO_VIDEO: 'AUDIO_VIDEO', NONE: 'NONE' }
}));

describe('TraineeStreamPanel', () => {
  beforeEach(() => {
    Stage.mockImplementation(() => {
      const handlers = {};
      mockStageInstance = {
        handlers,
        on: jest.fn((event, handler) => { handlers[event] = handler; }),
        join: jest.fn(() => Promise.resolve()),
        leave: jest.fn()
      };
      return mockStageInstance;
    });
    createSelfViewerSession.mockResolvedValue({
      token: 'self-view-token',
      publisherUserId: 'trainee:person-1'
    });
    Object.defineProperty(navigator, 'mediaDevices', {
      configurable: true,
      value: { getUserMedia: jest.fn() }
    });
  });

  test('connects as a viewer and never requests the browser camera or microphone', async () => {
    render(<TraineeStreamPanel />);

    expect(await screen.findByText('Waiting for the VR application to start streaming…')).toBeInTheDocument();
    expect(createSelfViewerSession).toHaveBeenCalledTimes(1);
    expect(mockStageInstance.join).toHaveBeenCalledTimes(1);
    expect(navigator.mediaDevices.getUserMedia).not.toHaveBeenCalled();
  });

  test('subscribes only to the authenticated trainee publisher ID', async () => {
    render(<TraineeStreamPanel />);
    await waitFor(() => expect(mockStageInstance).toBeDefined());

    const strategy = Stage.mock.calls[0][1];
    expect(strategy.shouldSubscribeToParticipant({ userId: 'trainee:person-1' })).toBe('AUDIO_VIDEO');
    expect(strategy.shouldSubscribeToParticipant({ userId: 'trainee:someone-else' })).toBe('NONE');
  });
});
