import React from 'react';
import { act, render, screen, waitFor } from '@testing-library/react';
import { Stage } from 'amazon-ivs-web-broadcast';
import AdminStreamPanel from './AdminStreamPanel';
import { createViewerSession } from '../../API/streamingAPI';

let mockStageInstance;
const OriginalMediaStream = global.MediaStream;

jest.mock('../../API/streamingAPI', () => ({
  createViewerSession: jest.fn()
}));

jest.mock('amazon-ivs-web-broadcast', () => ({
  InitialLayerPreference: { LOWEST_QUALITY: 'LOWEST_QUALITY' },
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

describe('AdminStreamPanel', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(HTMLMediaElement.prototype, 'play').mockResolvedValue();
    Stage.mockImplementation(() => {
      const handlers = {};
      mockStageInstance = {
        handlers,
        on: jest.fn((event, handler) => { handlers[event] = handler; }),
        join: jest.fn(() => Promise.resolve()),
        leave: jest.fn(),
        refreshStrategy: jest.fn()
      };
      return mockStageInstance;
    });
    createViewerSession.mockResolvedValue({
      token: 'center-viewer-token',
      trainees: [{ userId: 'trainee:person-1', name: 'Asha' }]
    });
  });

  afterEach(() => {
    global.MediaStream = OriginalMediaStream;
    jest.restoreAllMocks();
  });

  test('joins the center stage and subscribes only to trainees in the admin directory', async () => {
    render(<AdminStreamPanel />);
    await waitFor(() => expect(mockStageInstance).toBeDefined());

    const strategy = Stage.mock.calls[0][1];
    expect(strategy.shouldSubscribeToParticipant({ userId: 'trainee:person-1' })).toBe('AUDIO_VIDEO');
    expect(strategy.shouldSubscribeToParticipant({ userId: 'trainee:another-center' })).toBe('NONE');
    expect(mockStageInstance.join).toHaveBeenCalledTimes(1);
  });

  test('shows the trainee tile when IVS adds a video stream from the center stage', async () => {
    render(<AdminStreamPanel />);
    await waitFor(() => expect(mockStageInstance).toBeDefined());

    const track = { id: 'video-1', stop: jest.fn() };
    const tracks = [];
    const mediaStream = {
      addTrack: jest.fn((newTrack) => tracks.push(newTrack)),
      getTracks: jest.fn(() => tracks),
      removeTrack: jest.fn()
    };
    global.MediaStream = jest.fn(() => mediaStream);

    await act(async () => {
      mockStageInstance.handlers['streams-added'](
        { id: 'participant-1', userId: 'trainee:person-1' },
        [{ mediaStreamTrack: track }]
      );
    });

    expect(await screen.findByText('Asha')).toBeInTheDocument();
    expect(screen.getByText('1 live')).toBeInTheDocument();
  });
});
