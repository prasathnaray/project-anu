const client = require('../utils/conn');

const ALLOWED_ROLES = [99, 101, 102, 103];
const RESOURCE_TYPE = 'CHALLENGE';

const isAllowed = (requester) => ALLOWED_ROLES.includes(Number(requester.role));

const updateProgress = async (userId, resourceId) => {
    await client.query(
        `INSERT INTO progress_data (user_id, resourse_id, is_completed, updated_at)
         VALUES ($1, $2, TRUE, NOW())
         ON CONFLICT (user_id, resourse_id)
         DO UPDATE SET is_completed = TRUE, updated_at = NOW()`,
        [userId, resourceId]
    );
};

const normalizeChosenOption = (chooseOption) => {
    if (Array.isArray(chooseOption)) {
        return chooseOption.map((option) => String(option).trim()).filter(Boolean);
    }

    if (chooseOption === undefined || chooseOption === null) {
        return [];
    }

    return [String(chooseOption).trim()].filter(Boolean);
};

const submitChallengeAnswer = async (requester, payload) => {
    if (!isAllowed(requester)) {
        return {
            status: 'Unauthorized',
            code: 401,
            message: 'You do not have permission to submit challenges.'
        };
    }

    const selectedOptions = normalizeChosenOption(payload.choose_option);
    const optionChosen = selectedOptions.join(', ');
    const questionNo = Number(payload.question_number);
    const isCorrect = payload.isCorrect;
    const answerPayload = {
        selected_options: selectedOptions,
        question_part: payload.question_part ?? null,
        question_text: payload.question_text ?? null,
        correct_answer: payload.correct_answer ?? null,
        feedback_correct: payload.feedback_correct ?? null,
        feedback_wrong: payload.feedback_wrong ?? null,
    };

    const result = await client.query(
        `INSERT INTO activity_submissions
            (session_id, user_id, resource_id, resource_type, question_no, option_chosen,
             is_correct, match_payload, time_taken, total_time_taken, submitted_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW())
         RETURNING *`,
        [
            payload.session_id,
            requester.user_mail,
            payload.resource_id,
            RESOURCE_TYPE,
            questionNo,
            optionChosen,
            isCorrect,
            JSON.stringify(answerPayload),
            payload.time_taken ?? null,
            payload.total_time_taken ?? null,
        ]
    );

    if (payload.mark_completed !== false) {
        await updateProgress(requester.user_mail, payload.resource_id);
    }

    return {
        status: 'Success',
        code: 201,
        message: 'Challenge answer submitted successfully',
        data: result.rows[0],
    };
};

const getChallengeAttemptDetails = async (requester, { resource_id, session_id }) => {
    if (!isAllowed(requester)) {
        return {
            status: 'Unauthorized',
            code: 401,
            message: 'You do not have permission to view challenge attempts.'
        };
    }

    const values = [resource_id, requester.user_mail];
    const conditions = [
        'resource_id = $1',
        'user_id = $2',
        'resource_type = $3',
    ];
    values.push(RESOURCE_TYPE);

    if (session_id) {
        values.push(session_id);
        conditions.push(`session_id = $${values.length}`);
    }

    const result = await client.query(
        `SELECT *
         FROM activity_submissions
         WHERE ${conditions.join(' AND ')}
         ORDER BY submitted_at ASC, question_no ASC`,
        values
    );

    const total = result.rows.length;
    const correct = result.rows.filter((row) => row.is_correct === true).length;

    return {
        status: 'Success',
        code: 200,
        data: result.rows,
        summary: {
            total_questions: total,
            correct_answers: correct,
            wrong_answers: total - correct,
            score_percentage: total > 0 ? Number(((correct / total) * 100).toFixed(2)) : null,
        },
    };
};

const findDbResource = async (resourceId) => {
    if (!resourceId) return null;
    try {
        const queryWithResourseId = 'SELECT * FROM public.resource_data WHERE resourse_id = $1 LIMIT 1';
        const res = await client.query(queryWithResourseId, [resourceId]);
        if (res.rows.length > 0) return res.rows[0];
    } catch {
        // column may be resource_id in some schemas
    }

    try {
        const queryWithResourceId = 'SELECT * FROM public.resource_data WHERE resource_id = $1 LIMIT 1';
        const res = await client.query(queryWithResourceId, [resourceId]);
        if (res.rows.length > 0) return res.rows[0];
    } catch {
        // ignore error
    }

    return null;
};

const UFC_CHALLENGES = [
    {
        id: 'probe-selection-and-orientation',
        module_name: 'Probe Movements',
        challenge_number: 1,
        challenge_name: 'Probe Selection and Orientation',
        resource_name: 'Probe Selection and Orientations',
        aliases: [
            'probe selection and orientation',
            'probe selection and orientations',
            'probe-selection-and-orientation',
            '1'
        ],
        description: 'Challenge 1: Probe selection and maternal abdomen orientation (transverse and longitudinal).',
        total_questions: 3,
        questions: [
            {
                question_number: 1,
                question_type: 'probe_selection',
                question_text: 'Select the appropriate probe used for a transabdominal obstetric ultrasound scan.',
                options: [
                    'Curvilinear probe',
                    'Linear probe',
                    'Phased array probe',
                    'Transvaginal probe'
                ],
                correct_answer: 'Curvilinear probe',
                feedback_correct: 'Great! You selected the curvilinear probe, which is the appropriate probe for a transabdominal obstetric ultrasound examination.',
                feedback_wrong: 'Oops! You have chosen the incorrect probe'
            },
            {
                question_number: 2,
                question_type: 'probe_orientation',
                question_text: 'Place the probe on the maternal abdomen in the transverse orientation.',
                options: [
                    'Transverse orientation (notch facing maternal right)',
                    'Longitudinal orientation (notch facing maternal head)',
                    'Coronal orientation',
                    'Oblique orientation'
                ],
                correct_answer: 'Transverse orientation (notch facing maternal right)',
                feedback_correct: 'Great! You have correctly positioned it in the transverse orientation with the notch facing the maternal right.',
                feedback_wrong: 'Oops! Looks like you have placed the probe in an incorrect orientation'
            },
            {
                question_number: 3,
                question_type: 'probe_orientation',
                question_text: 'Place the probe on the maternal abdomen in the longitudinal orientation.',
                options: [
                    'Longitudinal orientation (notch facing maternal head)',
                    'Transverse orientation (notch facing maternal right)',
                    'Coronal orientation',
                    'Oblique orientation'
                ],
                correct_answer: 'Longitudinal orientation (notch facing maternal head)',
                feedback_correct: 'Good job! You have correctly positioned it in the longitudinal orientation with the notch facing the maternal head.',
                feedback_wrong: 'Oops! Looks like you have placed the probe in an incorrect orientation'
            }
        ]
    },
    {
        id: 'identify-and-perform-probe-movements',
        module_name: 'Probe Movements',
        challenge_number: 2,
        challenge_name: 'Identify & Perform the probe movements',
        resource_name: 'Probe Movements',
        aliases: [
            'identify & perform the probe movements',
            'identify and perform the probe movements',
            'identify & perform probe movements',
            'identify and perform probe movements',
            'probe movements',
            'probe-movements',
            '2'
        ],
        description: 'Challenge 2: Identify probe movements and axes, then perform required movements.',
        total_questions: 4,
        total_sub_questions: 8,
        questions: [
            {
                question_number: 1,
                question_part: '1a',
                question_type: 'fill_in_the_blanks',
                question_text: 'Which probe movement _____ along ____ axis is used to bring the target structure to the centre of the screen.',
                slots: [
                    {
                        slot_number: 1,
                        options: ['Rotation', 'Dipping', 'Sliding', 'Angling'],
                        correct_answer: 'Sliding'
                    },
                    {
                        slot_number: 2,
                        options: ['Narrow', 'Broad'],
                        correct_answer: 'Narrow'
                    }
                ],
                options: [
                    ['Rotation', 'Dipping', 'Sliding', 'Angling'],
                    ['Narrow', 'Broad']
                ],
                correct_answer: ['Sliding', 'Narrow'],
                feedback_correct: 'Great! Sliding along the narrow axis is used to bring the target structure to the centre of the screen.',
                feedback_wrong: 'Oops! The selected movement or axis is incorrect.'
            },
            {
                question_number: 1,
                question_part: '1b',
                question_type: 'probe_movement_performance',
                question_text: 'Perform the required probe movements to bring the target structure to the centre of the screen.',
                action: 'Sliding along narrow axis',
                correct_answer: 'Sliding along narrow axis',
                feedback_correct: 'Great job! You have correctly performed the sliding movement along the narrow axis to bring the target structure to the centre.',
                feedback_wrong: 'Oops! Target structure not centered or incorrect movement performed.'
            },
            {
                question_number: 2,
                question_part: '2a',
                question_type: 'fill_in_the_blanks',
                question_text: 'Which probe movement ______ aligns the target structure horizontally within the imaging plane and is often followed by ______ along the narrow axis to centre the target structure on the screen.',
                slots: [
                    {
                        slot_number: 1,
                        options: ['Rotation', 'Dipping', 'Sliding', 'Angling'],
                        correct_answer: 'Dipping'
                    },
                    {
                        slot_number: 2,
                        options: ['Narrow', 'Broad'],
                        correct_answer: 'Narrow'
                    }
                ],
                options: [
                    ['Rotation', 'Dipping', 'Sliding', 'Angling'],
                    ['Narrow', 'Broad']
                ],
                correct_answer: ['Dipping', 'Narrow'],
                feedback_correct: 'Great! Dipping aligns the target structure horizontally within the imaging plane and is often followed by narrow axis sliding to centre it.',
                feedback_wrong: 'Oops! The selected movement or axis is incorrect.'
            },
            {
                question_number: 2,
                question_part: '2b',
                question_type: 'probe_movement_performance',
                question_text: 'Perform the required probe movements to align the target structure horizontally and position it at the centre of the screen.',
                action: 'Dipping to align horizontally followed by sliding along narrow axis to centre',
                correct_answer: 'Dipping and sliding along narrow axis',
                feedback_correct: 'Great job! You have correctly aligned the target structure horizontally and centered it.',
                feedback_wrong: 'Oops! Probe movements incorrect or structure not aligned horizontally at centre.'
            },
            {
                question_number: 3,
                question_part: '3a',
                question_type: 'single_select',
                question_text: 'Which probe movement is ______ most commonly used to switch between the long and short axis of a specific structure',
                slots: [
                    {
                        slot_number: 1,
                        options: ['Rotation', 'Dipping', 'Sliding', 'Angling'],
                        correct_answer: 'Rotation'
                    }
                ],
                options: ['Rotation', 'Dipping', 'Sliding', 'Angling'],
                correct_answer: 'Rotation',
                feedback_correct: 'Great! Rotation is most commonly used to switch between the long and short axis of a specific structure.',
                feedback_wrong: 'Oops! The selected movement is incorrect.'
            },
            {
                question_number: 3,
                question_part: '3b',
                question_type: 'probe_movement_performance',
                question_text: 'Perform the required probe movements to align the target structure horizontally and position it at the centre of the screen.',
                action: 'Rotation movement to switch between long and short axis and centre structure',
                correct_answer: 'Rotation',
                feedback_correct: 'Great job! You have correctly rotated the probe to align the structure horizontally and centered it.',
                feedback_wrong: 'Oops! Movement incorrect or structure not aligned.'
            },
            {
                question_number: 4,
                question_part: '4a',
                question_type: 'fill_in_the_blanks',
                question_text: 'Which probe movement is used to adjust an oblique view to a transverse view for accurate assessment of a targeted structure________ and is always followed by _______ on the _______ axis of the probe, which allows visualisation of multiple cross-sectional images of a structure of interest.',
                slots: [
                    {
                        slot_number: 1,
                        options: ['Rotation', 'Dipping', 'Sliding', 'Angling'],
                        correct_answer: 'Angling'
                    },
                    {
                        slot_number: 2,
                        options: ['Dipping', 'Rotation', 'Sliding', 'Angling'],
                        correct_answer: 'Sliding'
                    },
                    {
                        slot_number: 3,
                        options: ['Narrow', 'Broad'],
                        correct_answer: 'Broad'
                    }
                ],
                options: [
                    ['Rotation', 'Dipping', 'Sliding', 'Angling'],
                    ['Dipping', 'Rotation', 'Sliding', 'Angling'],
                    ['Narrow', 'Broad']
                ],
                correct_answer: ['Angling', 'Sliding', 'Broad'],
                feedback_correct: 'Great! Angling adjusts an oblique view to a transverse view, followed by sliding on the broad axis to visualize multiple cross-sectional images.',
                feedback_wrong: 'Oops! The selected movements or axis are incorrect.'
            },
            {
                question_number: 4,
                question_part: '4b',
                question_type: 'probe_movement_performance',
                question_text: 'Perform the required probe movements to convert the oblique view into a true transverse view, then do the follow-up movement to visualize multiple cross-sectional images of a structure of interest',
                action: 'Angling to convert oblique to transverse view followed by sliding on broad axis',
                correct_answer: 'Angling followed by broad-axis sliding',
                feedback_correct: 'Great job! You converted the oblique view into a true transverse view and visualised multiple cross-sectional images.',
                feedback_wrong: 'Oops! Movement incorrect or transverse view/cross-sections not achieved.'
            }
        ]
    },
    {
        id: 'knobology-find-the-optimal-image',
        module_name: 'Knobology',
        challenge_number: 1,
        challenge_name: 'Find the Optimised Image',
        resource_name: 'Find the Optimal Image',
        aliases: [
            'find the optimal image',
            'find the optimised image',
            'find-the-optimal-image',
            'find-the-optimised-image',
            'knobology',
            'knobology - challenge 1',
            'knobology 1'
        ],
        folder_link: 'https://drive.google.com/drive/folders/17EQZ8hkz0rNWIq1ZHCO8C8A0pGFo3jP8?usp=drive_link',
        description: 'Knobology Challenge 1: Identify ultrasound images with optimised gain, depth, TGC, and zoom.',
        total_questions: 4,
        questions: [
            {
                question_number: 1,
                question_type: 'image_selection',
                parameter: 'gain',
                question_text: 'Identify the image with optimised gain',
                options: [
                    'Image A',
                    'Image B',
                    'Image C'
                ],
                correct_answer: 'Image A',
                feedback_correct: 'Great! You have correctly identified the image with optimised gain.',
                feedback_wrong: 'Oops! The selected image does not have optimised gain.'
            },
            {
                question_number: 2,
                question_type: 'image_selection',
                parameter: 'depth',
                question_text: 'Identify the image with optimised depth',
                options: [
                    'Image B',
                    'Image C',
                    'Image A'
                ],
                correct_answer: 'Image C',
                feedback_correct: 'Great! You have correctly identified the image with optimised depth.',
                feedback_wrong: 'Oops! The selected image does not have optimised depth.'
            },
            {
                question_number: 3,
                question_type: 'image_selection',
                parameter: 'tgc',
                question_text: 'Identify the image with optimised TGC',
                options: [
                    'Image B',
                    'Image C',
                    'Image A'
                ],
                correct_answer: 'Image A',
                feedback_correct: 'Great! You have correctly identified the image with optimised TGC.',
                feedback_wrong: 'Oops! The selected image does not have optimised TGC.'
            },
            {
                question_number: 4,
                question_type: 'image_selection',
                parameter: 'zoom',
                question_text: 'Identify the image with optimised zoom',
                options: [
                    'Image A',
                    'Image B',
                    'Image C'
                ],
                assets: [
                    {
                        option: 'Image A',
                        label: 'Increased zoom',
                        filename: 'Increased Zoom.jpg',
                        local_path: 'client/src/Images/Increased Zoom.jpg',
                        url: 'http://localhost:3000/assets/knobology/Increased%20Zoom.jpg',
                        drive_url: 'https://drive.google.com/file/d/1W-F84aV4mB3gMgzSZtWE-iIHwJnOza15/view?usp=sharing'
                    },
                    {
                        option: 'Image B',
                        label: 'Less zoom',
                        filename: 'Less Zomm.jpg',
                        local_path: 'client/src/Images/Less Zomm.jpg',
                        url: 'http://localhost:3000/assets/knobology/Less%20Zomm.jpg',
                        drive_url: 'https://drive.google.com/file/d/1P9YFjPfI47_eTefC_EJVdZVP4kqfLTSn/view?usp=sharing'
                    },
                    {
                        option: 'Image C',
                        label: 'Optimum zoom',
                        filename: 'Optimum Zoom.jpg',
                        local_path: 'client/src/Images/Optimum Zoom.jpg',
                        url: 'http://localhost:3000/assets/knobology/Optimum%20Zoom.jpg',
                        drive_url: 'https://drive.google.com/file/d/1H9-XF8GzqYk3L5-XIZnFOPgnbRZwodII/view?usp=sharing'
                    }
                ],
                correct_answer: 'Image C',
                feedback_correct: 'Great! You have correctly identified the image with optimised zoom.',
                feedback_wrong: 'Oops! The selected image does not have optimised zoom.'
            }
        ]
    },
    {
        id: 'knobology-the-image-optimization-challenge',
        module_name: 'Knobology',
        challenge_number: 2,
        challenge_name: 'The Image Optimization Challenge',
        resource_name: 'Image Optimization',
        aliases: [
            'the image optimization challenge',
            'image optimization',
            'image-optimization',
            'the-image-optimization-challenge',
            'knobology - challenge 2',
            'knobology 2'
        ],
        description: 'Knobology Challenge 2 (Tasks - Set 1): Identify and adjust ultrasound controls (Depth, Gain, Zoom, Near Gain, Far Gain, Focus, Freeze).',
        total_questions: 7,
        questions: [
            {
                question_number: 1,
                task_name: 'Task 1 - Depth',
                parameter: 'depth',
                question_type: 'control_selection',
                question_text: 'The target is there, but I can’t see the whole picture. What will you adjust?',
                options: [
                    'Depth',
                    'Gain',
                    'Zoom',
                    'Near Gain',
                    'Far Gain',
                    'Focus',
                    'Freeze'
                ],
                correct_answer: 'Depth',
                feedback_correct: 'Great! Adjusting depth allows you to see the entire target structure within the imaging field.',
                feedback_wrong: 'Oops! That control will not adjust the field of view depth.'
            },
            {
                question_number: 2,
                task_name: 'Task 2 - Gain',
                parameter: 'gain',
                question_type: 'control_selection',
                question_text: 'Everything looks dim. Give the entire image a brightness boost.',
                options: [
                    'Depth',
                    'Gain',
                    'Zoom',
                    'Near Gain',
                    'Far Gain',
                    'Focus',
                    'Freeze'
                ],
                correct_answer: 'Gain',
                feedback_correct: 'Great! Adjusting overall gain boosts the brightness across the entire image.',
                feedback_wrong: 'Oops! That control will not adjust the overall brightness.'
            },
            {
                question_number: 3,
                task_name: 'Task 3 - Zoom',
                parameter: 'zoom',
                question_type: 'control_selection',
                question_text: 'The target is too small. Bring it closer without moving the probe.',
                options: [
                    'Depth',
                    'Gain',
                    'Zoom',
                    'Near Gain',
                    'Far Gain',
                    'Focus',
                    'Freeze'
                ],
                correct_answer: 'Zoom',
                feedback_correct: 'Great! Adjusting zoom magnifies the target structure without moving the probe.',
                feedback_wrong: 'Oops! That control will not magnify the structure.'
            },
            {
                question_number: 4,
                task_name: 'Task 4 - Near Gain',
                parameter: 'near_gain',
                question_type: 'control_selection',
                question_text: 'The structures near the probe need more brightness. Which control?',
                options: [
                    'Depth',
                    'Gain',
                    'Zoom',
                    'Near Gain',
                    'Far Gain',
                    'Focus',
                    'Freeze'
                ],
                correct_answer: 'Near Gain',
                feedback_correct: 'Great! Near gain (TGC) adjusts the brightness of structures closer to the probe.',
                feedback_wrong: 'Oops! That control will not adjust near-field brightness.'
            },
            {
                question_number: 5,
                task_name: 'Task 5 - Far Gain',
                parameter: 'far_gain',
                question_type: 'control_selection',
                question_text: 'The structures deeper in the abdomen need more brightness. Which control?',
                options: [
                    'Depth',
                    'Gain',
                    'Zoom',
                    'Near Gain',
                    'Far Gain',
                    'Focus',
                    'Freeze'
                ],
                correct_answer: 'Far Gain',
                feedback_correct: 'Great! Far gain (TGC) adjusts the brightness of structures deeper in the abdomen.',
                feedback_wrong: 'Oops! That control will not adjust far-field brightness.'
            },
            {
                question_number: 6,
                task_name: 'Task 6 - Focus',
                parameter: 'focus',
                question_type: 'control_selection',
                question_text: 'The target structure needs better detail at its depth.',
                options: [
                    'Depth',
                    'Gain',
                    'Zoom',
                    'Near Gain',
                    'Far Gain',
                    'Focus',
                    'Freeze'
                ],
                correct_answer: 'Focus',
                feedback_correct: 'Great! Adjusting focus optimizes resolution and detail at the specific depth of interest.',
                feedback_wrong: 'Oops! That control will not adjust the focal zone.'
            },
            {
                question_number: 7,
                task_name: 'Task 7 - Freeze',
                parameter: 'freeze',
                question_type: 'control_selection',
                question_text: 'That’s the image! Hold it before it changes.',
                options: [
                    'Depth',
                    'Gain',
                    'Zoom',
                    'Near Gain',
                    'Far Gain',
                    'Focus',
                    'Freeze'
                ],
                correct_answer: 'Freeze',
                feedback_correct: 'Great! Freezing captures and holds the optimal image frame.',
                feedback_wrong: 'Oops! That control will not freeze/hold the frame.'
            }
        ]
    },
    {
        id: 'morphology-sector-orientation-and-directional-terms',
        module_name: 'Morphology',
        challenge_number: 1,
        challenge_name: 'Sector Orientation and Directional Terms',
        resource_name: 'Sector Orientation and Directional Terms',
        aliases: [
            'sector orientation and directional terms',
            'sector-orientation-and-directional-terms',
            'morphology',
            'morphology - challenge 1',
            'morphology 1'
        ],
        description: 'Morphology Challenge 1: Maneuver transducer to acquire cross-sectional view and identify directional terms corresponding to sector positions.',
        total_questions: 3,
        questions: [
            {
                question_number: 1,
                question_type: 'directional_terms',
                target_position: 'Position 3',
                action_instruction: 'Position the transducer on the virtual patient and maneuver it to acquire a cross-sectional view of the structure that matches the reference image.',
                question_text: 'Which directional term corresponds to Position 3 in the given imaging sector?',
                full_prompt: 'Position the transducer on the virtual patient and maneuver it to acquire a cross-sectional view of the structure that matches the reference image.\n\nWhich directional term corresponds to Position 3 in the given imaging sector?',
                options: [
                    'Anterior',
                    'Left',
                    'Posterior',
                    'Right'
                ],
                correct_answer: 'Posterior',
                feedback_correct: 'Good! You correctly selected Posterior, which is the directional term corresponding to Position 3 in the ultrasound image.',
                feedback_wrong: 'Incorrect. Position 3 corresponds to the posterior aspect of the structure.'
            },
            {
                question_number: 2,
                question_type: 'directional_terms',
                target_position: 'Position 1',
                action_instruction: 'Position the transducer on the virtual patient and maneuver it to acquire a cross-sectional view of the structure that matches the reference image.',
                question_text: 'Which part of the ultrasound image corresponds to Position 1 within the imaging sector?',
                full_prompt: 'Position the transducer on the virtual patient and maneuver it to acquire a cross-sectional view of the structure that matches the reference image.\n\nWhich part of the ultrasound image corresponds to Position 1 within the imaging sector?',
                options: [
                    'Superior',
                    'Left',
                    'Inferior',
                    'Right'
                ],
                correct_answer: 'Right',
                feedback_correct: 'Good! You correctly selected Right, which is the directional term corresponding to Position 1 in the ultrasound image.',
                feedback_wrong: 'Incorrect. Position 1 corresponds to the Right side of the structure.'
            },
            {
                question_number: 3,
                question_type: 'directional_terms',
                target_position: 'Position 4',
                action_instruction: 'Position the transducer on the virtual patient and maneuver it to acquire a cross-sectional view of the structure that matches the reference image.',
                question_text: 'Which part of the ultrasound image corresponds to Position 4 within the imaging sector?',
                full_prompt: 'Position the transducer on the virtual patient and maneuver it to acquire a cross-sectional view of the structure that matches the reference image.\n\nWhich part of the ultrasound image corresponds to Position 4 within the imaging sector?',
                options: [
                    'Inferior',
                    'Superior',
                    'Posterior',
                    'Anterior'
                ],
                correct_answer: 'Superior',
                feedback_correct: 'Good! You correctly selected Superior, which is the directional term corresponding to Position 4 in the ultrasound image.',
                feedback_wrong: 'Incorrect. Position 4 corresponds to the Superior portion of the structure.'
            }
        ]
    },
    {
        id: 'morphology-ultrasound-spatial-visualization',
        module_name: 'Morphology',
        challenge_number: 2,
        challenge_name: 'Ultrasound Spatial Visualization',
        resource_name: 'Ultrasound Spatial Visualization',
        aliases: [
            'ultrasound spatial visualization',
            'ultrasound-spatial-visualization',
            'ultrasound spatial visualization challenge',
            'morphology challenge 2',
            'morphology 2'
        ],
        description: 'Morphology Challenge 2: Scan maternal abdomen to identify structures beneath the surface, count geometric features, recognize shapes, and identify what structures resemble.',
        total_questions: 4,
        questions: [
            {
                question_number: 1,
                question_type: 'spatial_visualization',
                action_instruction: 'Place the probe on the maternal abdomen and scan to identify the structure located beneath the abdominal surface.',
                question_text: 'Select the number of squares visible in the ultrasound image.',
                full_prompt: 'Place the probe on the maternal abdomen and scan to identify the structure located beneath the abdominal surface. Select the number of squares visible in the ultrasound image.',
                options: [
                    '6',
                    '8',
                    '4',
                    '5'
                ],
                correct_answer: '6',
                feedback_correct: 'Great job! You have correctly identified the number of squares.',
                feedback_wrong: 'Not quite! The number of squares selected is incorrect.'
            },
            {
                question_number: 2,
                question_type: 'spatial_visualization',
                action_instruction: 'Place the probe on the maternal abdomen and scan to identify the structure located beneath the abdominal surface.',
                question_text: 'Select the shapes identified during the ultrasound examination.',
                full_prompt: 'Place the probe on the maternal abdomen and scan to identify the structure located beneath the abdominal surface. Select the shapes identified during the ultrasound examination.',
                options: [
                    'Circle, Arc',
                    'Square, Cylinder, Triangle',
                    'Rectangle, Dotted line'
                ],
                correct_answer: 'Circle, Arc',
                feedback_correct: 'Good job! You have correctly identified the structures.',
                feedback_wrong: 'Not quite! The structures you have identified are wrong.'
            },
            {
                question_number: 3,
                question_type: 'spatial_visualization',
                action_instruction: 'Place the probe on the maternal abdomen and scan to identify the structure located beneath the abdominal surface.',
                question_text: 'What does the scanned structure resemble?',
                full_prompt: 'What does the scanned structure resemble?',
                options: [
                    'Metal Box',
                    'Smiley face',
                    'Coil'
                ],
                correct_answer: 'Smiley face',
                feedback_correct: 'Good job! You have correctly identified the structure.',
                feedback_wrong: 'Not quite! The structure you have identified are wrong.'
            },
            {
                question_number: 4,
                question_type: 'spatial_visualization',
                action_instruction: 'Place the probe on the maternal abdomen and scan to identify the structure located beneath the abdominal surface.',
                question_text: 'What does the scanned structure resemble?',
                full_prompt: 'Place the probe on the maternal abdomen and scan to identify the structure located beneath the abdominal surface. What does the scanned structure resemble?',
                options: [
                    'Leaf',
                    'Spear',
                    'Arrow'
                ],
                correct_answer: 'Arrow',
                feedback_correct: 'Good job! You have correctly identified the structure.',
                feedback_wrong: 'Not quite! The selected option is incorrect.'
            }
        ]
    }
];

const getChallengeQuestions = async (requester, filters = {}) => {
    if (!isAllowed(requester)) {
        return {
            status: 'Unauthorized',
            code: 401,
            message: 'You do not have permission to view challenge questions.'
        };
    }

    const { resource_id, module_name, challenge_number, challenge_name, all } = filters;

    const isExplicitlyFalse = all === false || all === 'false' || all === '0';
    const isExplicitlyAll = all === true || all === 'true' || all === '1' || challenge_number === 'all';

    if (isExplicitlyAll || (!isExplicitlyFalse && !resource_id && !module_name && !challenge_number && !challenge_name)) {
        return {
            status: 'Success',
            code: 200,
            data: UFC_CHALLENGES,
        };
    }

    let matchedChallenge = null;

    if (resource_id) {
        const dbResource = await findDbResource(resource_id);
        if (dbResource && dbResource.resource_name) {
            const normalizedDbName = String(dbResource.resource_name).trim().toLowerCase();
            matchedChallenge = UFC_CHALLENGES.find((c) =>
                c.resource_name.toLowerCase() === normalizedDbName
            ) || UFC_CHALLENGES.find((c) =>
                c.aliases.some((alias) => normalizedDbName === alias)
            ) || UFC_CHALLENGES.find((c) =>
                c.aliases.some((alias) => normalizedDbName.includes(alias) || alias.includes(normalizedDbName))
            );
        }
    }

    if (!matchedChallenge) {
        if (module_name && challenge_number) {
            const mod = String(module_name).trim().toLowerCase();
            const num = Number(challenge_number);
            matchedChallenge = UFC_CHALLENGES.find((c) =>
                c.module_name.toLowerCase().includes(mod) && c.challenge_number === num
            );
        } else if (challenge_name) {
            const target = String(challenge_name).trim().toLowerCase();
            matchedChallenge = UFC_CHALLENGES.find((c) =>
                c.challenge_name.toLowerCase() === target
            ) || UFC_CHALLENGES.find((c) =>
                c.resource_name.toLowerCase() === target
            ) || UFC_CHALLENGES.find((c) =>
                c.aliases.some((alias) => target === alias)
            ) || UFC_CHALLENGES.find((c) =>
                c.aliases.some((alias) => target.includes(alias) || alias.includes(target))
            );
        } else if (module_name) {
            const mod = String(module_name).trim().toLowerCase();
            const matches = UFC_CHALLENGES.filter((c) => c.module_name.toLowerCase().includes(mod));
            if (matches.length > 0) {
                return {
                    status: 'Success',
                    code: 200,
                    data: matches,
                };
            }
            matchedChallenge = null;
        } else if (challenge_number) {
            const num = Number(challenge_number);
            matchedChallenge = UFC_CHALLENGES.find((c) => c.challenge_number === num);
        } else {
            // Default to Challenge 1
            matchedChallenge = UFC_CHALLENGES[0];
        }
    }

    if (!matchedChallenge) {
        return {
            status: 'Not Found',
            code: 404,
            message: 'Requested challenge questions not found.'
        };
    }

    return {
        status: 'Success',
        code: 200,
        data: {
            ...matchedChallenge,
            resource_id: resource_id || null,
        }
    };
};

module.exports = {
    submitChallengeAnswer,
    getChallengeAttemptDetails,
    getChallengeQuestions,
    UFC_CHALLENGES,
};
