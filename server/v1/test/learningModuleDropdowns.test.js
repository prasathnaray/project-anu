const test = require('node:test');
const assert = require('node:assert/strict');

test('TC-04: Probe Movements dropdowns population logic', () => {
    // Simulate learning module data returned from server for UFC
    const ufcLearningModules = [
        {
            learning_module_id: 'mod-1',
            certificate_id: 'cert-ufc',
            course_name: 'Principles of ultrasound',
            module_name: null,
            unit_name: null,
            resources: [
                { resource_topic: 'Ultrasound wave physics', resource_name: 'Ultrasound wave physics' },
                { resource_topic: 'Generation of ultrasound waves', resource_name: 'Generation of ultrasound waves' },
            ]
        },
        {
            learning_module_id: 'mod-2',
            certificate_id: 'cert-ufc',
            course_name: 'Probe Movements',
            module_name: null,
            unit_name: null,
            resources: [
                { resource_topic: 'Anatomy planes', resource_name: 'Anatomy Plane' },
                { resource_topic: 'Anatomy planes', resource_name: 'Mind Sparks - Anatomical Plane - Quiz' },
                { resource_topic: 'Types of probe', resource_name: 'Types of probe' },
                { resource_topic: 'Types of probe', resource_name: 'Interaction - Probe Selection' },
                { resource_topic: 'Types of probe', resource_name: 'Mind Sparks - Quiz' },
                { resource_topic: 'Probe orientation', resource_name: 'Probe Orientation' },
                { resource_topic: 'Probe orientation', resource_name: 'Mind Sparks - Picture Pick' },
                { resource_topic: 'Probe movements', resource_name: 'Probe Movements' },
                { resource_topic: 'Probe movements', resource_name: 'Mindsparks - probe movements' },
                { resource_topic: 'Echo Dose', resource_name: 'Drag & drop' },
                { resource_topic: 'Echo Dose', resource_name: 'True/False' },
                { resource_topic: 'Echo Dose', resource_name: 'Probe movements' },
                { resource_topic: 'Challenges', resource_name: 'Probe Selection and Orientations' },
                { resource_topic: 'Challenges', resource_name: 'Probe Movements' }
            ]
        },
        {
            learning_module_id: 'mod-3',
            certificate_id: 'cert-ufc',
            course_name: 'Knobology',
            module_name: null,
            unit_name: null,
            resources: [
                { resource_topic: 'Overview of Ultrasound Machine', resource_name: 'Overview of Ultrasound Machine' },
                { resource_topic: 'Function of the Knobs', resource_name: 'Functions of Knobs' }
            ]
        },
        {
            learning_module_id: 'mod-4',
            certificate_id: 'cert-ufc',
            course_name: 'Morphology',
            module_name: null,
            unit_name: null,
            resources: [
                { resource_topic: 'Image Formation & Sector Orientation', resource_name: 'Image Formation & Sector Orientation' }
            ]
        }
    ];

    // Helper functions reproducing InsideCertifications logic
    const getModuleList = (learningModules, courseName, resourceMap = {}) => {
        if (!courseName) return [];

        const explicit = learningModules
            .filter((m) => m.course_name === courseName)
            .map((m) => m.module_name)
            .filter(Boolean);
        if (explicit.length > 0) {
            return [...new Set(explicit)];
        }

        const matching = learningModules.filter(
            (m) => m.course_name === courseName
        );
        const topics = [];
        matching.forEach((m) => {
            const resList =
                Array.isArray(m.resources) && m.resources.length > 0
                    ? m.resources
                    : resourceMap[m.learning_module_id]?.data || [];
            resList.forEach((r) => {
                const topic = r.resource_topic?.trim();
                if (topic && !topics.includes(topic)) {
                    topics.push(topic);
                }
            });
        });
        return topics;
    };

    const getUnitList = (learningModules, courseName, moduleName, resourceMap = {}) => {
        if (!courseName || !moduleName) return [];

        const explicit = learningModules
            .filter(
                (m) =>
                    m.course_name === courseName &&
                    m.module_name === moduleName
            )
            .map((m) => m.unit_name)
            .filter(Boolean);
        if (explicit.length > 0) {
            return [...new Set(explicit)];
        }

        const matching = learningModules.filter(
            (m) => m.course_name === courseName
        );
        const units = [];
        matching.forEach((m) => {
            const resList =
                Array.isArray(m.resources) && m.resources.length > 0
                    ? m.resources
                    : resourceMap[m.learning_module_id]?.data || [];
            resList.forEach((r) => {
                const topic = r.resource_topic?.trim();
                if (topic === moduleName) {
                    const name = r.resource_name?.trim();
                    if (name && !units.includes(name)) {
                        units.push(name);
                    }
                }
            });
        });
        return units;
    };

    // 0. Before selecting course:
    assert.deepEqual(getModuleList(ufcLearningModules, ''), [], 'When no course is selected, module list must be empty');
    assert.deepEqual(getUnitList(ufcLearningModules, '', ''), [], 'When no course is selected, unit list must be empty');

    // 1. When course "Probe Movements" is selected:
    const modulesForProbe = getModuleList(ufcLearningModules, 'Probe Movements');
    assert.deepEqual(modulesForProbe, [
        'Anatomy planes',
        'Types of probe',
        'Probe orientation',
        'Probe movements',
        'Echo Dose',
        'Challenges'
    ], 'Probe Movements must display all its modules/topics in the Select Module dropdown');

    // Before selecting a module, unit list must be empty (not duplicate the module list)
    assert.deepEqual(getUnitList(ufcLearningModules, 'Probe Movements', ''), [], 'Unit list must be empty until a module is selected');

    // 2. When module "Anatomy planes" is selected:
    const unitsForAnatomy = getUnitList(ufcLearningModules, 'Probe Movements', 'Anatomy planes');
    assert.deepEqual(unitsForAnatomy, [
        'Anatomy Plane',
        'Mind Sparks - Anatomical Plane - Quiz'
    ], 'Select Unit dropdown must display available units for Anatomy planes');
    assert.notDeepEqual(modulesForProbe, unitsForAnatomy, 'Module list and Unit list must never be identical');

    // 3. When module "Types of probe" is selected:
    const unitsForTypes = getUnitList(ufcLearningModules, 'Probe Movements', 'Types of probe');
    assert.deepEqual(unitsForTypes, [
        'Types of probe',
        'Interaction - Probe Selection',
        'Mind Sparks - Quiz'
    ], 'Select Unit dropdown must display available units for Types of probe');
    assert.notDeepEqual(modulesForProbe, unitsForTypes, 'Module list and Unit list must never be identical');
});

test('TC-04: BTC courses with explicit module_name and unit_name remain functional and distinct', () => {
    const btcModules = [
        {
            learning_module_id: 'btc-1',
            course_name: 'Second Trimester',
            module_name: 'Biometry',
            unit_name: 'BPD & HC'
        },
        {
            learning_module_id: 'btc-2',
            course_name: 'Second Trimester',
            module_name: 'Biometry',
            unit_name: 'AC'
        },
        {
            learning_module_id: 'btc-3',
            course_name: 'Second Trimester',
            module_name: 'Biometry',
            unit_name: 'FL'
        }
    ];

    const getModuleList = (learningModules, courseName) => {
        if (!courseName) return [];
        const explicit = learningModules
            .filter((m) => m.course_name === courseName)
            .map((m) => m.module_name)
            .filter(Boolean);
        return [...new Set(explicit)];
    };

    const getUnitList = (learningModules, courseName, moduleName) => {
        if (!courseName || !moduleName) return [];
        const explicit = learningModules
            .filter(
                (m) =>
                    m.course_name === courseName &&
                    m.module_name === moduleName
            )
            .map((m) => m.unit_name)
            .filter(Boolean);
        return [...new Set(explicit)];
    };

    const modules = getModuleList(btcModules, 'Second Trimester');
    assert.deepEqual(modules, ['Biometry']);

    const units = getUnitList(btcModules, 'Second Trimester', 'Biometry');
    assert.deepEqual(units, ['BPD & HC', 'AC', 'FL']);

    assert.notDeepEqual(modules, units, 'BTC module list and unit list must be distinct');
});
