# Challenges API

Base URL:

```text
http://localhost:4004/api/v1
```

All endpoints require:

```http
Authorization: Bearer <access_token>
```

Allowed roles:
- `99`, `101`, `102` (Admins / Instructors)
- `103` (Trainee)

---

## Endpoint Summary

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/challenges/questions` | Fetch challenge questions, slots, options, correct answers, and feedback. |
| `POST` | `/challenges/submit` | Submit a trainee's answer for a specific challenge question / part. |
| `GET` | `/challenges/attempt-details` | Retrieve attempt submissions and scoring summary for a challenge. |

---

## 1. Get Challenge Questions

Fetch questions and feedback configuration for a challenge.

```http
GET /challenges/questions
```

### Query Parameters

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `resource_id` | UUID string | No | Specific challenge resource ID from `resource_data`. |
| `module_name` | string | No | Module name (e.g., `Probe Movements`). |
| `challenge_number` | number | No | Challenge number (`1` or `2`). |
| `challenge_name` | string | No | Challenge name (e.g., `Probe Selection and Orientation` or `Identify & Perform the probe movements`). |
| `all` | boolean | No | Set to `true` to return all available challenge configurations. |

---

## 2. UFC Module: Probe Movements

### Challenge 1 – Probe Selection and Orientation

- **Module Name:** `Probe Movements`
- **Challenge Number:** `1`
- **Resource Name:** `Probe Selection and Orientations`

#### Question 1
- **Prompt:** `Select the appropriate probe used for a transabdominal obstetric ultrasound scan.`
- **Type:** Probe selection
- **Options:** `["Curvilinear probe", "Linear probe", "Phased array probe", "Transvaginal probe"]`
- **Correct Answer:** `Curvilinear probe`
- **Feedback Correct:** `Great! You selected the curvilinear probe, which is the appropriate probe for a transabdominal obstetric ultrasound examination.`
- **Feedback Incorrect:** `Oops! You have chosen the incorrect probe`

Submit Payload:
```json
{
  "resource_id": "e196c6db-dc0b-4ebd-93b2-10a2125188e5",
  "session_id": "021306f8-580b-4634-a809-7796b5843387",
  "question_number": 1,
  "choose_option": "Curvilinear probe",
  "isCorrect": true,
  "question_text": "Select the appropriate probe used for a transabdominal obstetric ultrasound scan.",
  "correct_answer": "Curvilinear probe",
  "feedback_correct": "Great! You selected the curvilinear probe, which is the appropriate probe for a transabdominal obstetric ultrasound examination.",
  "feedback_wrong": "Oops! You have chosen the incorrect probe"
}
```

#### Question 2
- **Prompt:** `Place the probe on the maternal abdomen in the transverse orientation.`
- **Type:** Probe orientation
- **Options:** `["Transverse orientation (notch facing maternal right)", "Longitudinal orientation (notch facing maternal head)", "Coronal orientation", "Oblique orientation"]`
- **Correct Answer:** `Transverse orientation (notch facing maternal right)`
- **Feedback Correct:** `Great! You have correctly positioned it in the transverse orientation with the notch facing the maternal right.`
- **Feedback Incorrect:** `Oops! Looks like you have placed the probe in an incorrect orientation`

Submit Payload:
```json
{
  "resource_id": "e196c6db-dc0b-4ebd-93b2-10a2125188e5",
  "session_id": "021306f8-580b-4634-a809-7796b5843387",
  "question_number": 2,
  "choose_option": "Transverse orientation (notch facing maternal right)",
  "isCorrect": true,
  "question_text": "Place the probe on the maternal abdomen in the transverse orientation.",
  "correct_answer": "Transverse orientation (notch facing maternal right)",
  "feedback_correct": "Great! You have correctly positioned it in the transverse orientation with the notch facing the maternal right.",
  "feedback_wrong": "Oops! Looks like you have placed the probe in an incorrect orientation"
}
```

#### Question 3
- **Prompt:** `Place the probe on the maternal abdomen in the longitudinal orientation.`
- **Type:** Probe orientation
- **Options:** `["Longitudinal orientation (notch facing maternal head)", "Transverse orientation (notch facing maternal right)", "Coronal orientation", "Oblique orientation"]`
- **Correct Answer:** `Longitudinal orientation (notch facing maternal head)`
- **Feedback Correct:** `Good job! You have correctly positioned it in the longitudinal orientation with the notch facing the maternal head.`
- **Feedback Incorrect:** `Oops! Looks like you have placed the probe in an incorrect orientation`

Submit Payload:
```json
{
  "resource_id": "e196c6db-dc0b-4ebd-93b2-10a2125188e5",
  "session_id": "021306f8-580b-4634-a809-7796b5843387",
  "question_number": 3,
  "choose_option": "Longitudinal orientation (notch facing maternal head)",
  "isCorrect": true,
  "question_text": "Place the probe on the maternal abdomen in the longitudinal orientation.",
  "correct_answer": "Longitudinal orientation (notch facing maternal head)",
  "feedback_correct": "Good job! You have correctly positioned it in the longitudinal orientation with the notch facing the maternal head.",
  "feedback_wrong": "Oops! Looks like you have placed the probe in an incorrect orientation"
}
```

---

### Challenge 2 – Identify & Perform the probe movements

- **Module Name:** `Probe Movements`
- **Challenge Number:** `2`
- **Resource Name:** `Probe Movements`

#### Question 1

##### Question 1a (Identification)
- **Prompt:** `Which probe movement _____ along ____ axis is used to bring the target structure to the centre of the screen.`
- **Slots:**
  - Slot 1: `["Rotation", "Dipping", "Sliding", "Angling"]` -> **Answer:** `Sliding`
  - Slot 2: `["Narrow", "Broad"]` -> **Answer:** `Narrow`
- **Combined Answer:** `["Sliding", "Narrow"]`
- **Feedback Correct:** `Great! Sliding along the narrow axis is used to bring the target structure to the centre of the screen.`
- **Feedback Wrong:** `Oops! The selected movement or axis is incorrect.`

Submit Payload:
```json
{
  "resource_id": "<resource_id>",
  "session_id": "<session_id>",
  "question_number": 1,
  "question_part": "1a",
  "choose_option": ["Sliding", "Narrow"],
  "isCorrect": true,
  "question_text": "Which probe movement _____ along ____ axis is used to bring the target structure to the centre of the screen.",
  "correct_answer": ["Sliding", "Narrow"],
  "feedback_correct": "Great! Sliding along the narrow axis is used to bring the target structure to the centre of the screen.",
  "feedback_wrong": "Oops! The selected movement or axis is incorrect."
}
```

##### Question 1b (Performance)
- **Prompt:** `Perform the required probe movements to bring the target structure to the centre of the screen.`
- **Action:** `Sliding along narrow axis`
- **Feedback Correct:** `Great job! You have correctly performed the sliding movement along the narrow axis to bring the target structure to the centre.`
- **Feedback Wrong:** `Oops! Target structure not centered or incorrect movement performed.`

Submit Payload:
```json
{
  "resource_id": "<resource_id>",
  "session_id": "<session_id>",
  "question_number": 1,
  "question_part": "1b",
  "choose_option": "Sliding along narrow axis",
  "isCorrect": true,
  "question_text": "Perform the required probe movements to bring the target structure to the centre of the screen.",
  "correct_answer": "Sliding along narrow axis",
  "feedback_correct": "Great job! You have correctly performed the sliding movement along the narrow axis to bring the target structure to the centre.",
  "feedback_wrong": "Oops! Target structure not centered or incorrect movement performed."
}
```

---

#### Question 2

##### Question 2a (Identification)
- **Prompt:** `Which probe movement ______ aligns the target structure horizontally within the imaging plane and is often followed by ______ along the narrow axis to centre the target structure on the screen.`
- **Slots:**
  - Slot 1: `["Rotation", "Dipping", "Sliding", "Angling"]` -> **Answer:** `Dipping`
  - Slot 2: `["Narrow", "Broad"]` -> **Answer:** `Narrow`
- **Combined Answer:** `["Dipping", "Narrow"]`
- **Feedback Correct:** `Great! Dipping aligns the target structure horizontally within the imaging plane and is often followed by narrow axis sliding to centre it.`
- **Feedback Wrong:** `Oops! The selected movement or axis is incorrect.`

Submit Payload:
```json
{
  "resource_id": "<resource_id>",
  "session_id": "<session_id>",
  "question_number": 2,
  "question_part": "2a",
  "choose_option": ["Dipping", "Narrow"],
  "isCorrect": true,
  "question_text": "Which probe movement ______ aligns the target structure horizontally within the imaging plane and is often followed by ______ along the narrow axis to centre the target structure on the screen.",
  "correct_answer": ["Dipping", "Narrow"],
  "feedback_correct": "Great! Dipping aligns the target structure horizontally within the imaging plane and is often followed by narrow axis sliding to centre it.",
  "feedback_wrong": "Oops! The selected movement or axis is incorrect."
}
```

##### Question 2b (Performance)
- **Prompt:** `Perform the required probe movements to align the target structure horizontally and position it at the centre of the screen.`
- **Action:** `Dipping and sliding along narrow axis`
- **Feedback Correct:** `Great job! You have correctly aligned the target structure horizontally and centered it.`
- **Feedback Wrong:** `Oops! Probe movements incorrect or structure not aligned horizontally at centre.`

Submit Payload:
```json
{
  "resource_id": "<resource_id>",
  "session_id": "<session_id>",
  "question_number": 2,
  "question_part": "2b",
  "choose_option": "Dipping and sliding along narrow axis",
  "isCorrect": true,
  "question_text": "Perform the required probe movements to align the target structure horizontally and position it at the centre of the screen.",
  "correct_answer": "Dipping and sliding along narrow axis",
  "feedback_correct": "Great job! You have correctly aligned the target structure horizontally and centered it.",
  "feedback_wrong": "Oops! Probe movements incorrect or structure not aligned horizontally at centre."
}
```

---

#### Question 3

##### Question 3a (Identification)
- **Prompt:** `Which probe movement is ______ most commonly used to switch between the long and short axis of a specific structure`
- **Slots:**
  - Slot 1: `["Rotation", "Dipping", "Sliding", "Angling"]` -> **Answer:** `Rotation`
- **Correct Answer:** `Rotation`
- **Feedback Correct:** `Great! Rotation is most commonly used to switch between the long and short axis of a specific structure.`
- **Feedback Wrong:** `Oops! That is incorrect.`

Submit Payload:
```json
{
  "resource_id": "<resource_id>",
  "session_id": "<session_id>",
  "question_number": 3,
  "question_part": "3a",
  "choose_option": "Rotation",
  "isCorrect": true,
  "question_text": "Which probe movement is ______ most commonly used to switch between the long and short axis of a specific structure",
  "correct_answer": "Rotation",
  "feedback_correct": "Great! Rotation is most commonly used to switch between the long and short axis of a specific structure.",
  "feedback_wrong": "Oops! That is incorrect."
}
```

##### Question 3b (Performance)
- **Prompt:** `Perform the required probe movements to align the target structure horizontally and position it at the centre of the screen.`
- **Action:** `Rotation`
- **Feedback Correct:** `Great job! You have correctly rotated the probe to align the structure horizontally and centered it.`
- **Feedback Wrong:** `Oops! Movement incorrect or structure not aligned.`

Submit Payload:
```json
{
  "resource_id": "<resource_id>",
  "session_id": "<session_id>",
  "question_number": 3,
  "question_part": "3b",
  "choose_option": "Rotation",
  "isCorrect": true,
  "question_text": "Perform the required probe movements to align the target structure horizontally and position it at the centre of the screen.",
  "correct_answer": "Rotation",
  "feedback_correct": "Great job! You have correctly rotated the probe to align the structure horizontally and centered it.",
  "feedback_wrong": "Oops! Movement incorrect or structure not aligned."
}
```

---

#### Question 4

##### Question 4a (Identification)
- **Prompt:** `Which probe movement is used to adjust an oblique view to a transverse view for accurate assessment of a targeted structure________ and is always followed by _______ on the _______ axis of the probe, which allows visualisation of multiple cross-sectional images of a structure of interest.`
- **Slots:**
  - Slot 1: `["Rotation", "Dipping", "Sliding", "Angling"]` -> **Answer:** `Angling`
  - Slot 2: `["Dipping", "Rotation", "Sliding", "Angling"]` -> **Answer:** `Sliding`
  - Slot 3: `["Narrow", "Broad"]` -> **Answer:** `Broad`
- **Combined Answer:** `["Angling", "Sliding", "Broad"]`
- **Feedback Correct:** `Great! Angling adjusts an oblique view to a transverse view, followed by sliding on the broad axis to visualize multiple cross-sectional images.`
- **Feedback Wrong:** `Oops! The selected movements or axis are incorrect.`

Submit Payload:
```json
{
  "resource_id": "<resource_id>",
  "session_id": "<session_id>",
  "question_number": 4,
  "question_part": "4a",
  "choose_option": ["Angling", "Sliding", "Broad"],
  "isCorrect": true,
  "question_text": "Which probe movement is used to adjust an oblique view to a transverse view for accurate assessment of a targeted structure________ and is always followed by _______ on the _______ axis of the probe, which allows visualisation of multiple cross-sectional images of a structure of interest.",
  "correct_answer": ["Angling", "Sliding", "Broad"],
  "feedback_correct": "Great! Angling adjusts an oblique view to a transverse view, followed by sliding on the broad axis to visualize multiple cross-sectional images.",
  "feedback_wrong": "Oops! The selected movements or axis are incorrect."
}
```

##### Question 4b (Performance)
- **Prompt:** `Perform the required probe movements to convert the oblique view into a true transverse view, then do the follow-up movement to visualize multiple cross-sectional images of a structure of interest`
- **Action:** `Angling followed by broad-axis sliding`
- **Feedback Correct:** `Great job! You converted the oblique view into a true transverse view and visualised multiple cross-sectional images.`
- **Feedback Wrong:** `Oops! Movement incorrect or transverse view/cross-sections not achieved.`

Submit Payload:
```json
{
  "resource_id": "<resource_id>",
  "session_id": "<session_id>",
  "question_number": 4,
  "question_part": "4b",
  "choose_option": "Angling followed by broad-axis sliding",
  "isCorrect": true,
  "question_text": "Perform the required probe movements to convert the oblique view into a true transverse view, then do the follow-up movement to visualize multiple cross-sectional images of a structure of interest",
  "correct_answer": "Angling followed by broad-axis sliding",
  "feedback_correct": "Great job! You converted the oblique view into a true transverse view and visualised multiple cross-sectional images.",
  "feedback_wrong": "Oops! Movement incorrect or transverse view/cross-sections not achieved."
}
```

---

## 3. UFC Module: Knobology

### Challenge 1 – Find the Optimised Image

- **Module Name:** `Knobology`
- **Challenge Number:** `1`
- **Resource Name:** `Find the Optimal Image`
- **Images Drive Folder:** [Knobology Images Folder](https://drive.google.com/drive/folders/17EQZ8hkz0rNWIq1ZHCO8C8A0pGFo3jP8?usp=drive_link)

#### Question 1 (Gain)
- **Prompt:** `Identify the image with optimised gain`
- **Parameter:** `gain`
- **Options:** `["Image A", "Image B", "Image C"]`
- **Correct Answer:** `Image A`
- **Feedback:**
  - **Correct:** `Great! You have correctly identified the image with optimised gain.`
  - **Incorrect:** `Oops! The selected image does not have optimised gain.`

Submit Payload:
```json
{
  "resource_id": "<resource_id>",
  "session_id": "<session_id>",
  "question_number": 1,
  "choose_option": "Image A",
  "isCorrect": true,
  "question_text": "Identify the image with optimised gain",
  "correct_answer": "Image A",
  "feedback_correct": "Great! You have correctly identified the image with optimised gain.",
  "feedback_wrong": "Oops! The selected image does not have optimised gain."
}
```

#### Question 2 (Depth)
- **Prompt:** `Identify the image with optimised depth`
- **Parameter:** `depth`
- **Options:** `["Image B", "Image C", "Image A"]`
- **Correct Answer:** `Image C`
- **Feedback:**
  - **Correct:** `Great! You have correctly identified the image with optimised depth.`
  - **Incorrect:** `Oops! The selected image does not have optimised depth.`

Submit Payload:
```json
{
  "resource_id": "<resource_id>",
  "session_id": "<session_id>",
  "question_number": 2,
  "choose_option": "Image C",
  "isCorrect": true,
  "question_text": "Identify the image with optimised depth",
  "correct_answer": "Image C",
  "feedback_correct": "Great! You have correctly identified the image with optimised depth.",
  "feedback_wrong": "Oops! The selected image does not have optimised depth."
}
```

#### Question 3 (TGC)
- **Prompt:** `Identify the image with optimised TGC`
- **Parameter:** `tgc`
- **Options:** `["Image B", "Image C", "Image A"]`
- **Correct Answer:** `Image A`
- **Feedback:**
  - **Correct:** `Great! You have correctly identified the image with optimised TGC.`
  - **Incorrect:** `Oops! The selected image does not have optimised TGC.`

Submit Payload:
```json
{
  "resource_id": "<resource_id>",
  "session_id": "<session_id>",
  "question_number": 3,
  "choose_option": "Image A",
  "isCorrect": true,
  "question_text": "Identify the image with optimised TGC",
  "correct_answer": "Image A",
  "feedback_correct": "Great! You have correctly identified the image with optimised TGC.",
  "feedback_wrong": "Oops! The selected image does not have optimised TGC."
}
```

#### Question 4 (Zoom)
- **Prompt:** `Identify the image with optimised zoom`
- **Parameter:** `zoom`
- **Options & Asset References (Ordered):**
  - **Image A (Increased zoom):** `Increased Zoom.jpg` — [View Link](http://localhost:3000/assets/knobology/Increased%20Zoom.jpg) / [Drive Link](https://drive.google.com/file/d/1W-F84aV4mB3gMgzSZtWE-iIHwJnOza15/view?usp=sharing)
  - **Image B (Less zoom):** `Less Zomm.jpg` — [View Link](http://localhost:3000/assets/knobology/Less%20Zomm.jpg) / [Drive Link](https://drive.google.com/file/d/1P9YFjPfI47_eTefC_EJVdZVP4kqfLTSn/view?usp=sharing)
  - **Image C (Optimum zoom):** `Optimum Zoom.jpg` — [View Link](http://localhost:3000/assets/knobology/Optimum%20Zoom.jpg) / [Drive Link](https://drive.google.com/file/d/1H9-XF8GzqYk3L5-XIZnFOPgnbRZwodII/view?usp=sharing)
- **Correct Answer:** `Image C`
- **Feedback:**
  - **Correct:** `Great! You have correctly identified the image with optimised zoom.`
  - **Incorrect:** `Oops! The selected image does not have optimised zoom.`

Submit Payload:
```json
{
  "resource_id": "<resource_id>",
  "session_id": "<session_id>",
  "question_number": 4,
  "choose_option": "Image C",
  "isCorrect": true,
  "question_text": "Identify the image with optimised zoom",
  "correct_answer": "Image C",
  "feedback_correct": "Great! You have correctly identified the image with optimised zoom.",
  "feedback_wrong": "Oops! The selected image does not have optimised zoom."
}
```

---

### Challenge 2 – The Image Optimization Challenge

- **Module Name:** `Knobology`
- **Challenge Number:** `2`
- **Resource Name:** `Image Optimization`
- **Description:** Tasks (Set 1): Adjust controls to optimize ultrasound image parameters.

#### Task 1 - Depth
- **Prompt:** `The target is there, but I can’t see the whole picture. What will you adjust?`
- **Control:** `Depth`
- **Options:** `["Depth", "Gain", "Zoom", "Near Gain", "Far Gain", "Focus", "Freeze"]`
- **Correct Answer:** `Depth`
- **Feedback:**
  - **Correct:** `Great! Adjusting depth allows you to see the entire target structure within the imaging field.`
  - **Incorrect:** `Oops! That control will not adjust the field of view depth.`

Submit Payload:
```json
{
  "resource_id": "<resource_id>",
  "session_id": "<session_id>",
  "question_number": 1,
  "choose_option": "Depth",
  "isCorrect": true,
  "question_text": "The target is there, but I can’t see the whole picture. What will you adjust?",
  "correct_answer": "Depth",
  "feedback_correct": "Great! Adjusting depth allows you to see the entire target structure within the imaging field.",
  "feedback_wrong": "Oops! That control will not adjust the field of view depth."
}
```

#### Task 2 - Gain
- **Prompt:** `Everything looks dim. Give the entire image a brightness boost.`
- **Control:** `Gain`
- **Options:** `["Depth", "Gain", "Zoom", "Near Gain", "Far Gain", "Focus", "Freeze"]`
- **Correct Answer:** `Gain`
- **Feedback:**
  - **Correct:** `Great! Adjusting overall gain boosts the brightness across the entire image.`
  - **Incorrect:** `Oops! That control will not adjust the overall brightness.`

Submit Payload:
```json
{
  "resource_id": "<resource_id>",
  "session_id": "<session_id>",
  "question_number": 2,
  "choose_option": "Gain",
  "isCorrect": true,
  "question_text": "Everything looks dim. Give the entire image a brightness boost.",
  "correct_answer": "Gain",
  "feedback_correct": "Great! Adjusting overall gain boosts the brightness across the entire image.",
  "feedback_wrong": "Oops! That control will not adjust the overall brightness."
}
```

#### Task 3 - Zoom
- **Prompt:** `The target is too small. Bring it closer without moving the probe.`
- **Control:** `Zoom`
- **Options:** `["Depth", "Gain", "Zoom", "Near Gain", "Far Gain", "Focus", "Freeze"]`
- **Correct Answer:** `Zoom`
- **Feedback:**
  - **Correct:** `Great! Adjusting zoom magnifies the target structure without moving the probe.`
  - **Incorrect:** `Oops! That control will not magnify the structure.`

Submit Payload:
```json
{
  "resource_id": "<resource_id>",
  "session_id": "<session_id>",
  "question_number": 3,
  "choose_option": "Zoom",
  "isCorrect": true,
  "question_text": "The target is too small. Bring it closer without moving the probe.",
  "correct_answer": "Zoom",
  "feedback_correct": "Great! Adjusting zoom magnifies the target structure without moving the probe.",
  "feedback_wrong": "Oops! That control will not magnify the structure."
}
```

#### Task 4 - Near Gain
- **Prompt:** `The structures near the probe need more brightness. Which control?`
- **Control:** `Near Gain`
- **Options:** `["Depth", "Gain", "Zoom", "Near Gain", "Far Gain", "Focus", "Freeze"]`
- **Correct Answer:** `Near Gain`
- **Feedback:**
  - **Correct:** `Great! Near gain (TGC) adjusts the brightness of structures closer to the probe.`
  - **Incorrect:** `Oops! That control will not adjust near-field brightness.`

Submit Payload:
```json
{
  "resource_id": "<resource_id>",
  "session_id": "<session_id>",
  "question_number": 4,
  "choose_option": "Near Gain",
  "isCorrect": true,
  "question_text": "The structures near the probe need more brightness. Which control?",
  "correct_answer": "Near Gain",
  "feedback_correct": "Great! Near gain (TGC) adjusts the brightness of structures closer to the probe.",
  "feedback_wrong": "Oops! That control will not adjust near-field brightness."
}
```

#### Task 5 - Far Gain
- **Prompt:** `The structures deeper in the abdomen need more brightness. Which control?`
- **Control:** `Far Gain`
- **Options:** `["Depth", "Gain", "Zoom", "Near Gain", "Far Gain", "Focus", "Freeze"]`
- **Correct Answer:** `Far Gain`
- **Feedback:**
  - **Correct:** `Great! Far gain (TGC) adjusts the brightness of structures deeper in the abdomen.`
  - **Incorrect:** `Oops! That control will not adjust far-field brightness.`

Submit Payload:
```json
{
  "resource_id": "<resource_id>",
  "session_id": "<session_id>",
  "question_number": 5,
  "choose_option": "Far Gain",
  "isCorrect": true,
  "question_text": "The structures deeper in the abdomen need more brightness. Which control?",
  "correct_answer": "Far Gain",
  "feedback_correct": "Great! Far gain (TGC) adjusts the brightness of structures deeper in the abdomen.",
  "feedback_wrong": "Oops! That control will not adjust far-field brightness."
}
```

#### Task 6 - Focus
- **Prompt:** `The target structure needs better detail at its depth.`
- **Control:** `Focus`
- **Options:** `["Depth", "Gain", "Zoom", "Near Gain", "Far Gain", "Focus", "Freeze"]`
- **Correct Answer:** `Focus`
- **Feedback:**
  - **Correct:** `Great! Adjusting focus optimizes resolution and detail at the specific depth of interest.`
  - **Incorrect:** `Oops! That control will not adjust the focal zone.`

Submit Payload:
```json
{
  "resource_id": "<resource_id>",
  "session_id": "<session_id>",
  "question_number": 6,
  "choose_option": "Focus",
  "isCorrect": true,
  "question_text": "The target structure needs better detail at its depth.",
  "correct_answer": "Focus",
  "feedback_correct": "Great! Adjusting focus optimizes resolution and detail at the specific depth of interest.",
  "feedback_wrong": "Oops! That control will not adjust the focal zone."
}
```

#### Task 7 - Freeze
- **Prompt:** `That’s the image! Hold it before it changes.`
- **Control:** `Freeze`
- **Options:** `["Depth", "Gain", "Zoom", "Near Gain", "Far Gain", "Focus", "Freeze"]`
- **Correct Answer:** `Freeze`
- **Feedback:**
  - **Correct:** `Great! Freezing captures and holds the optimal image frame.`
  - **Incorrect:** `Oops! That control will not freeze/hold the frame.`

Submit Payload:
```json
{
  "resource_id": "<resource_id>",
  "session_id": "<session_id>",
  "question_number": 7,
  "choose_option": "Freeze",
  "isCorrect": true,
  "question_text": "That’s the image! Hold it before it changes.",
  "correct_answer": "Freeze",
  "feedback_correct": "Great! Freezing captures and holds the optimal image frame.",
  "feedback_wrong": "Oops! That control will not freeze/hold the frame."
}
```

---

## 4. UFC Module: Morphology

### Challenge 1 – Sector Orientation and Directional Terms

- **Module Name:** `Morphology`
- **Challenge Number:** `1`
- **Resource Name:** `Sector Orientation and Directional Terms`
- **Description:** Position the transducer on the virtual patient and maneuver it to acquire a cross-sectional view of the structure that matches the reference image, then identify the corresponding directional term for the indicated position.

#### Question 1 (Position 3)
- **Action Instruction:** `Position the transducer on the virtual patient and maneuver it to acquire a cross-sectional view of the structure that matches the reference image.`
- **Prompt:** `Which directional term corresponds to Position 3 in the given imaging sector?`
- **Options:** `["Anterior", "Left", "Posterior", "Right"]`
- **Correct Answer:** `Posterior`
- **Feedback:**
  - **Correct:** `Good! You correctly selected Posterior, which is the directional term corresponding to Position 3 in the ultrasound image.`
  - **Incorrect:** `Incorrect. Position 3 corresponds to the posterior aspect of the structure.`

Submit Payload:
```json
{
  "resource_id": "<resource_id>",
  "session_id": "<session_id>",
  "question_number": 1,
  "choose_option": "Posterior",
  "isCorrect": true,
  "question_text": "Which directional term corresponds to Position 3 in the given imaging sector?",
  "correct_answer": "Posterior",
  "feedback_correct": "Good! You correctly selected Posterior, which is the directional term corresponding to Position 3 in the ultrasound image.",
  "feedback_wrong": "Incorrect. Position 3 corresponds to the posterior aspect of the structure."
}
```

#### Question 2 (Position 1)
- **Action Instruction:** `Position the transducer on the virtual patient and maneuver it to acquire a cross-sectional view of the structure that matches the reference image.`
- **Prompt:** `Which part of the ultrasound image corresponds to Position 1 within the imaging sector?`
- **Options:** `["Superior", "Left", "Inferior", "Right"]`
- **Correct Answer:** `Right`
- **Feedback:**
  - **Correct:** `Good! You correctly selected Right, which is the directional term corresponding to Position 1 in the ultrasound image.`
  - **Incorrect:** `Incorrect. Position 1 corresponds to the Right side of the structure.`

Submit Payload:
```json
{
  "resource_id": "<resource_id>",
  "session_id": "<session_id>",
  "question_number": 2,
  "choose_option": "Right",
  "isCorrect": true,
  "question_text": "Which part of the ultrasound image corresponds to Position 1 within the imaging sector?",
  "correct_answer": "Right",
  "feedback_correct": "Good! You correctly selected Right, which is the directional term corresponding to Position 1 in the ultrasound image.",
  "feedback_wrong": "Incorrect. Position 1 corresponds to the Right side of the structure."
}
```

#### Question 3 (Position 4)
- **Action Instruction:** `Position the transducer on the virtual patient and maneuver it to acquire a cross-sectional view of the structure that matches the reference image.`
- **Prompt:** `Which part of the ultrasound image corresponds to Position 4 within the imaging sector?`
- **Options:** `["Inferior", "Superior", "Posterior", "Anterior"]`
- **Correct Answer:** `Superior`
- **Feedback:**
  - **Correct:** `Good! You correctly selected Superior, which is the directional term corresponding to Position 4 in the ultrasound image.`
  - **Incorrect:** `Incorrect. Position 4 corresponds to the Superior portion of the structure.`

Submit Payload:
```json
{
  "resource_id": "<resource_id>",
  "session_id": "<session_id>",
  "question_number": 3,
  "choose_option": "Superior",
  "isCorrect": true,
  "question_text": "Which part of the ultrasound image corresponds to Position 4 within the imaging sector?",
  "correct_answer": "Superior",
  "feedback_correct": "Good! You correctly selected Superior, which is the directional term corresponding to Position 4 in the ultrasound image.",
  "feedback_wrong": "Incorrect. Position 4 corresponds to the Superior portion of the structure."
}
```

### Challenge 2 – Ultrasound Spatial Visualization

- **Module Name:** `Morphology`
- **Challenge Number:** `2`
- **Resource Name:** `Ultrasound Spatial Visualization`
- **Resource ID:** `47ca0026-c6a0-46bf-975f-e3be1b9f7291`
- **Description:** Scan the maternal abdomen to identify structures located beneath the surface, count geometric features, recognize shapes, and identify what the structures resemble.

#### Question 1 (Count Squares)
- **Action Instruction:** `Place the probe on the maternal abdomen and scan to identify the structure located beneath the abdominal surface.`
- **Prompt:** `Select the number of squares visible in the ultrasound image.`
- **Options:** `["6", "8", "4", "5"]`
- **Correct Answer:** `6`
- **Feedback:**
  - **Correct:** `Great job! You have correctly identified the number of squares.`
  - **Incorrect:** `Not quite! The number of squares selected is incorrect.`

Submit Payload:
```json
{
  "resource_id": "47ca0026-c6a0-46bf-975f-e3be1b9f7291",
  "session_id": "<session_id>",
  "question_number": 1,
  "choose_option": "6",
  "isCorrect": true,
  "question_text": "Select the number of squares visible in the ultrasound image.",
  "correct_answer": "6",
  "feedback_correct": "Great job! You have correctly identified the number of squares.",
  "feedback_wrong": "Not quite! The number of squares selected is incorrect."
}
```

#### Question 2 (Identify Shapes)
- **Action Instruction:** `Place the probe on the maternal abdomen and scan to identify the structure located beneath the abdominal surface.`
- **Prompt:** `Select the shapes identified during the ultrasound examination.`
- **Options:** `["Circle, Arc", "Square, Cylinder, Triangle", "Rectangle, Dotted line"]`
- **Correct Answer:** `Circle, Arc`
- **Feedback:**
  - **Correct:** `Good job! You have correctly identified the structures.`
  - **Incorrect:** `Not quite! The structures you have identified are wrong.`

Submit Payload:
```json
{
  "resource_id": "47ca0026-c6a0-46bf-975f-e3be1b9f7291",
  "session_id": "<session_id>",
  "question_number": 2,
  "choose_option": "Circle, Arc",
  "isCorrect": true,
  "question_text": "Select the shapes identified during the ultrasound examination.",
  "correct_answer": "Circle, Arc",
  "feedback_correct": "Good job! You have correctly identified the structures.",
  "feedback_wrong": "Not quite! The structures you have identified are wrong."
}
```

#### Question 3 (Structure Resemblance 1)
- **Action Instruction:** `Place the probe on the maternal abdomen and scan to identify the structure located beneath the abdominal surface.`
- **Prompt:** `What does the scanned structure resemble?`
- **Options:** `["Metal Box", "Smiley face", "Coil"]`
- **Correct Answer:** `Smiley face`
- **Feedback:**
  - **Correct:** `Good job! You have correctly identified the structure.`
  - **Incorrect:** `Not quite! The structure you have identified are wrong.`

Submit Payload:
```json
{
  "resource_id": "47ca0026-c6a0-46bf-975f-e3be1b9f7291",
  "session_id": "<session_id>",
  "question_number": 3,
  "choose_option": "Smiley face",
  "isCorrect": true,
  "question_text": "What does the scanned structure resemble?",
  "correct_answer": "Smiley face",
  "feedback_correct": "Good job! You have correctly identified the structure.",
  "feedback_wrong": "Not quite! The structure you have identified are wrong."
}
```

#### Question 4 (Structure Resemblance 2)
- **Action Instruction:** `Place the probe on the maternal abdomen and scan to identify the structure located beneath the abdominal surface.`
- **Prompt:** `What does the scanned structure resemble?`
- **Options:** `["Leaf", "Spear", "Arrow"]`
- **Correct Answer:** `Arrow`
- **Feedback:**
  - **Correct:** `Good job! You have correctly identified the structure.`
  - **Incorrect:** `Not quite! The selected option is incorrect.`

Submit Payload:
```json
{
  "resource_id": "47ca0026-c6a0-46bf-975f-e3be1b9f7291",
  "session_id": "<session_id>",
  "question_number": 4,
  "choose_option": "Arrow",
  "isCorrect": true,
  "question_text": "What does the scanned structure resemble?",
  "correct_answer": "Arrow",
  "feedback_correct": "Good job! You have correctly identified the structure.",
  "feedback_wrong": "Not quite! The selected option is incorrect."
}
```

---

## 5. Submit Challenge Answer

```http
POST /challenges/submit
Content-Type: application/json
```

### Request Body Fields

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `resource_id` | UUID string | Yes | Challenge resource ID from `resource_data`. |
| `session_id` | UUID string | Yes | Same session ID for all answers within one attempt. |
| `question_number` | number | Yes | Challenge question number (`1`, `2`, `3`, `4`). |
| `question_part` | string | No | Optional sub-part identifier (e.g., `"1a"`, `"1b"`). |
| `choose_option` | string or array | Yes | Selected option(s) or performed action string. |
| `isCorrect` | boolean | Yes | Whether the selected answer is correct. |
| `question_text` | string | No | Question prompt snapshot. |
| `correct_answer` | string or array | No | Correct answer snapshot. |
| `feedback_correct` | string | No | Positive feedback message. |
| `feedback_wrong` | string | No | Corrective feedback message. |
| `time_taken` | number | No | Time taken for this question in seconds. |
| `total_time_taken` | number | No | Total elapsed attempt time in seconds. |
| `mark_completed` | boolean | No | Defaults to `true`. Sets resource completion in `progress_data`. |

### Success Response (201 Created)

```json
{
  "status": "Success",
  "code": 201,
  "message": "Challenge answer submitted successfully",
  "data": {
    "session_id": "021306f8-580b-4634-a809-7796b5843387",
    "user_id": "trainee@example.com",
    "resource_id": "e196c6db-dc0b-4ebd-93b2-10a2125188e5",
    "resource_type": "CHALLENGE",
    "question_no": 1,
    "option_chosen": "Sliding, Narrow",
    "is_correct": true,
    "match_payload": {
      "selected_options": ["Sliding", "Narrow"],
      "question_part": "1a",
      "question_text": "Which probe movement _____ along ____ axis is used to bring the target structure to the centre of the screen.",
      "correct_answer": ["Sliding", "Narrow"],
      "feedback_correct": "Great! Sliding along the narrow axis is used to bring the target structure to the centre of the screen.",
      "feedback_wrong": "Oops! The selected movement or axis is incorrect."
    },
    "submitted_at": "2026-09-30T10:00:00.000Z"
  }
}
```

---

## 6. Get Challenge Attempt Details

```http
GET /challenges/attempt-details?resource_id=<resource_id>&session_id=<session_id>
```

---

## 7. cURL Examples

### Fetch Challenge 2 Questions (Probe Movements)
```bash
curl -X GET "http://localhost:4004/api/v1/challenges/questions?module_name=Probe%20Movements&challenge_number=2" \
  -H "Authorization: Bearer <access_token>"
```

### Fetch Challenge 1 Questions (Knobology)
```bash
curl -X GET "http://localhost:4004/api/v1/challenges/questions?module_name=Knobology&challenge_number=1" \
  -H "Authorization: Bearer <access_token>"
```

### Submit Knobology Question 1 (Gain)
```bash
curl -X POST "http://localhost:4004/api/v1/challenges/submit" \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "resource_id": "<resource_id>",
    "session_id": "<session_id>",
    "question_number": 1,
    "choose_option": "Image A",
    "isCorrect": true,
    "question_text": "Identify the image with optimised gain",
    "correct_answer": "Image A",
    "feedback_correct": "Great! You have correctly identified the image with optimised gain.",
    "feedback_wrong": "Oops! The selected image does not have optimised gain."
  }'
```

### Submit Knobology Question 4 (Zoom)
```bash
curl -X POST "http://localhost:4004/api/v1/challenges/submit" \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "resource_id": "<resource_id>",
    "session_id": "<session_id>",
    "question_number": 4,
    "choose_option": "Image C",
    "isCorrect": true,
    "question_text": "Identify the image with optimised zoom",
    "correct_answer": "Image C",
    "feedback_correct": "Great! You have correctly identified the image with optimised zoom.",
    "feedback_wrong": "Oops! The selected image does not have optimised zoom."
  }'
```

### Fetch Challenge 2 Questions (Knobology)
```bash
curl -X GET "http://localhost:4004/api/v1/challenges/questions?module_name=Knobology&challenge_number=2" \
  -H "Authorization: Bearer <access_token>"
```

### Submit Knobology Challenge 2 Task 1 (Depth)
```bash
curl -X POST "http://localhost:4004/api/v1/challenges/submit" \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "resource_id": "<resource_id>",
    "session_id": "<session_id>",
    "question_number": 1,
    "choose_option": "Depth",
    "isCorrect": true,
    "question_text": "The target is there, but I can’t see the whole picture. What will you adjust?",
    "correct_answer": "Depth",
    "feedback_correct": "Great! Adjusting depth allows you to see the entire target structure within the imaging field.",
    "feedback_wrong": "Oops! That control will not adjust the field of view depth."
  }'
```

### Fetch Challenge 1 Questions (Morphology)
```bash
curl -X GET "http://localhost:4004/api/v1/challenges/questions?module_name=Morphology&challenge_number=1" \
  -H "Authorization: Bearer <access_token>"
```

### Submit Morphology Challenge 1 Question 1 (Position 3)
```bash
curl -X POST "http://localhost:4004/api/v1/challenges/submit" \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "resource_id": "<resource_id>",
    "session_id": "<session_id>",
    "question_number": 1,
    "choose_option": "Posterior",
    "isCorrect": true,
    "question_text": "Which directional term corresponds to Position 3 in the given imaging sector?",
    "correct_answer": "Posterior",
    "feedback_correct": "Good! You correctly selected Posterior, which is the directional term corresponding to Position 3 in the ultrasound image.",
    "feedback_wrong": "Incorrect. Position 3 corresponds to the posterior aspect of the structure."
  }'
```
