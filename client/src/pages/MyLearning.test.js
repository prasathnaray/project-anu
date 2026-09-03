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

describe('UFC Principles of Ultrasound ordering', () => {
  test('places Image Optimization and its activity between Echogenicity and Artifacts', () => {
    const certificateId = 'ufc-certificate';
    const learningModuleId = 'principles-module';
    const resources = [
      ['echogenicity', 'Echogenicity', 'Echogenicity', 9],
      ['image-optimization', 'Image Optimization', 'Image Optimization', 10],
      ['image-optimization-activity', 'Interaction', 'Image Otimization Activity', 11],
      ['artifacts', 'Artifacts', 'Artifacts', 12],
    ].map(([resourceId, resourceName, resourceTopic, displayOrder]) => ({
      certificate_id: certificateId,
      certificate_name: 'UFC',
      learning_module_id: learningModuleId,
      course_name: 'Principles of ultrasound',
      module_name: '',
      unit_name: '',
      resource_id: resourceId,
      resource_type: 'Learning Resource',
      resource_topic: resourceTopic,
      resource_name: resourceName,
      display_order: displayOrder,
      is_hidden: false,
      is_completed: false,
    }));

    const transformed = transformApiData(
      { data: resources, reAttempts: [], moduleCompletion: [] },
      {
        certIds: [certificateId],
        certById: { [certificateId]: 'UFC' },
      },
      [certificateId],
      []
    );

    const principlesResources = transformed.resources[learningModuleId];
    expect(principlesResources.map(resource => [resource.topic, resource.name])).toEqual([
      ['Echogenicity', 'Echogenicity'],
      ['Image Optimization', 'Image Optimization'],
      ['Image Otimization Activity', 'Interaction'],
      ['Artifacts', 'Artifacts'],
    ]);

    const { accordions } = buildTopicGroups(principlesResources, 'Principles of ultrasound');
    expect(accordions.map(group => group.topic)).toEqual([
      'Echogenicity',
      'Image Optimization',
      'Image Otimization Activity',
      'Artifacts',
    ]);
  });
});

describe('UFC Knobology structure', () => {
  test('groups the nine requested resources under the four Knobology topics', () => {
    const certificateId = 'ufc-certificate';
    const learningModuleId = 'knobology-module';
    const resources = [
      ['overview', 'Ultrasound machine', 'Overview of ultrasound machine', 1],
      ['functions', 'Functions of knobs', 'Functions of knobs', 1],
      ['machine-interaction', 'Interaction - Ultrasound Machine Interaction', 'Function of the Knobs', 2],
      ['optimization', 'Mindsparks - Drag & Drop', 'Function of the Knobs', 3],
      ['quiz', 'Mindsparks - Quiz', 'Functions of knobs', 4],
      ['modes', 'Imaging modes', 'Imaging modes', 1],
      ['true-false', 'Mindsparks - True/False', 'Imaging modes', 2],
      ['match', 'Echo Dose - Match', 'Echo Dose', 1],
      ['crossword', 'Echo Dose - Crossword', 'Echo Dose', 2],
    ].map(([resourceId, resourceName, resourceTopic, displayOrder]) => ({
      certificate_id: certificateId,
      certificate_name: 'UFC',
      learning_module_id: learningModuleId,
      course_name: 'Knobology',
      module_name: '',
      unit_name: '',
      resource_id: resourceId,
      resource_type: 'Learning Resource',
      resource_topic: resourceTopic,
      resource_name: resourceName,
      display_order: displayOrder,
      is_hidden: false,
      is_completed: false,
    }));

    const transformed = transformApiData(
      { data: resources, reAttempts: [], moduleCompletion: [] },
      {
        certIds: [certificateId],
        certById: { [certificateId]: 'UFC' },
      },
      [certificateId],
      []
    );

    const { accordions } = buildTopicGroups(transformed.resources[learningModuleId], 'Knobology');
    expect(accordions.map(group => [
      group.topic,
      group.items.map(resource => resource.name),
    ])).toEqual([
      ['Overview of Ultrasound Machine', ['Overview of Ultrasound Machine']],
      ['Function of the Knobs', [
        'Functions of Knobs',
        'Interaction - Ultrasound Machine Interaction',
        'Interaction - Knobology Optimization Activity',
        'Mind Sparks - Quiz',
      ]],
      ['Imaging Modes', ['Imaging Modes', 'MindSparks - True / False']],
      ['Echo Dose', ['Match', 'Crossword']],
    ]);
  });
});

describe('UFC Morphology structure', () => {
  test('groups the nine requested resources under the four Morphology topics', () => {
    const certificateId = 'ufc-certificate';
    const learningModuleId = 'morphology-module';
    const resources = [
      ['formation', 'Image Formation and Sector Orientation', 'Image Formation & Sector Orientation', 1],
      ['mcqs', 'Mind Sparks - MCQ', 'Image Formation & Sector Orientation', 2],
      ['3d-to-2d', '3D to 2D Imaging', '3D to 2D Imaging', 1],
      ['scanning', 'Mind Sparks - Scanning', '3D to 2D Imaging', 2],
      ['2d-to-3d', '2D to 3D Imaging', '2D to 3D Imaging', 1],
      ['spin-wheel', 'Interaction - Spin Wheel', '2D to 3D Imaging', 2],
      ['picture-pick', 'Mind Sparks - Picture Pick', '2D to 3D Imaging', 3],
      ['chatbot', 'Mind Sparks - ChatBot', 'Image Formation & Sector Orientation', 1],
      ['prediction', '3D to 2D Prediction', 'Echo Dose', 2],
    ].map(([resourceId, resourceName, resourceTopic, displayOrder]) => ({
      certificate_id: certificateId,
      certificate_name: 'UFC',
      learning_module_id: learningModuleId,
      course_name: 'Morphology',
      module_name: '',
      unit_name: '',
      resource_id: resourceId,
      resource_type: 'Learning Resource',
      resource_topic: resourceTopic,
      resource_name: resourceName,
      display_order: displayOrder,
      is_hidden: false,
      is_completed: false,
    }));

    const transformed = transformApiData(
      { data: resources, reAttempts: [], moduleCompletion: [] },
      {
        certIds: [certificateId],
        certById: { [certificateId]: 'UFC' },
      },
      [certificateId],
      []
    );

    const { accordions } = buildTopicGroups(transformed.resources[learningModuleId], 'Morphology');
    expect(accordions.map(group => [
      group.topic,
      group.items.map(resource => resource.name),
    ])).toEqual([
      ['Image Formation & Sector Orientation', [
        'Image Formation & Sector Orientation',
        'Mind Sparks - MCQs',
      ]],
      ['3D to 2D Imaging', ['3D to 2D Imaging', 'Mind Sparks - Scanning']],
      ['2D to 3D Imaging', [
        '2D to 3D Imaging',
        'Interaction - Spin Wheel',
        'Mind Sparks - Picture Pick',
      ]],
      ['Echo Dose', ['Chatbot', '3D to 2D Prediction']],
    ]);
  });
});
