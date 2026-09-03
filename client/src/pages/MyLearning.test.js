jest.mock('react-router-dom', () => ({ Navigate: () => null }), { virtual: true });
jest.mock('../components/navBar', () => () => null);
jest.mock('../components/sideBar', () => () => null);

import { buildTopicGroups, transformApiData } from './MyLearning';

describe('FL Imaging the Plane resources', () => {
  test('shows Imaging the plane and Mind Sparks - Probe Movements together', () => {
    const certificateId = 'btc-certificate';
    const learningModuleId = 'fl-module';
    const baseRow = {
      certificate_id: certificateId,
      certificate_name: 'BTC',
      learning_module_id: learningModuleId,
      course_name: 'Second Trimester',
      module_name: 'Biometry',
      unit_name: 'FL',
      resource_type: 'Learning Resource',
      resource_topic: 'Imaging the Plane',
      is_hidden: false,
      is_completed: false,
    };

    const transformed = transformApiData(
      {
        data: [
          {
            ...baseRow,
            resource_id: 'fl-imaging-plane',
            resource_name: 'Imaging the plane',
            display_order: 7,
          },
          {
            ...baseRow,
            resource_id: 'fl-probe-movements',
            resource_name: 'MindSparks - Probe movements',
            display_order: 8,
          },
        ],
        reAttempts: [],
        moduleCompletion: [],
      },
      {
        certIds: [certificateId],
        certById: { [certificateId]: 'BTC' },
      },
      [certificateId],
      []
    );

    const flResources = transformed.resources[learningModuleId];
    expect(flResources).toHaveLength(2);
    expect(flResources.map(resource => resource.name)).toEqual([
      'Imaging the plane',
      'Mind Sparks - Probe Movements',
    ]);

    const { accordions } = buildTopicGroups(flResources, 'FL');
    expect(accordions).toHaveLength(1);
    expect(accordions[0].topic).toBe('Imaging the Plane');
    expect(accordions[0].items.map(resource => resource.name)).toEqual([
      'Imaging the plane',
      'Mind Sparks - Probe Movements',
    ]);
  });
});
