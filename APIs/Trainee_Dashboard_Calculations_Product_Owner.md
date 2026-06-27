# Trainee Dashboard Calculations - Product Owner Guide

This document explains, in simple terms, how the trainee dashboard numbers are calculated and what each number means.

The dashboard is meant to answer four product questions:

1. How much learning has the trainee completed?
2. How well is the trainee performing?
3. Which skills are strong or weak?
4. Is the trainee improving over time?

## 1. Learning Progress

### What it means

Learning progress shows how much of the assigned course content the trainee has completed.

### How it is calculated

The system checks:

- How many learning resources are available in the course
- How many of those resources the trainee has completed

Then it calculates:

```text
Progress percentage = completed resources / total resources
```

### Example

If a course has 20 resources and the trainee completed 10:

```text
10 / 20 = 50%
```

So the dashboard shows 50% progress.

### What product owners should know

This is a completion metric, not a performance metric. A trainee can complete many resources but still perform poorly in tests.

## 2. Last Score

### What it means

Last score shows how the trainee performed in their most recent attempt for a learning activity or quiz.

### How it is calculated

The system checks the latest submitted session for each resource and counts:

- Total questions answered
- Correct answers
- Wrong answers

Then it calculates:

```text
Score percentage = correct answers / total answered questions
```

### Example

If the trainee answered 8 out of 10 questions correctly:

```text
8 / 10 = 80%
```

So the dashboard shows 80%.

### What product owners should know

This shows the latest attempt only. It does not average all past attempts.

## 3. Reattempts

### What it means

Reattempts show whether the trainee has tried the same activity more than once.

### How it is calculated today

The current backend counts the submitted activity records for each resource.

### Product note

Today this count may behave more like "submission count" than "unique attempt count" because one attempt can contain multiple submitted answers.

If the product requirement is "how many times did the trainee retry this resource?", the backend should count unique sessions instead.

## 4. Performance Metrics

Performance metrics summarize how accurately and efficiently the trainee performs in Practice 3, Practice 4, Test 1, and Test 2.

These are the main dashboard cards:

- Accuracy
- Time per task
- Error rate
- Consistency

## 5. Accuracy

### What it means

Accuracy is the overall quality score for a trainee's practical performance.

It combines several important behaviors:

- How close their measurements are to the expected value
- Whether they placed calipers correctly
- Whether they acquired the correct plane
- Whether they handled the probe correctly
- Whether they completed the task efficiently

### How it is calculated

The system gives more importance to measurement accuracy, because this is the most critical part of the task.

Current weighting:

```text
Measurement accuracy: 40%
Landmark/caliper accuracy: 20%
Plane accuracy: 20%
Probe handling: 10%
Time efficiency: 10%
```

### Example

If a trainee is strong in measurement and plane acquisition but slow in time, their accuracy can still be good because time has a smaller weight.

### What product owners should know

Accuracy is not a simple quiz score. It is a weighted practical performance score.

## 6. Measurement Accuracy

### What it means

Measurement accuracy checks how close the trainee's measured value is to the expected expert value.

### How it is calculated

The system looks at the measurement error in millimeters.

Current scoring bands:

```text
0 to 1 mm error = 100
1 to 2 mm error = 85
2 to 3 mm error = 70
3 to 5 mm error = 50
More than 5 mm error = 20
```

### Example

If the trainee's measurement is 2.5 mm away from the expected value, the system gives 70 for measurement accuracy.

### What product owners should know

Smaller measurement error means a higher score.

## 7. Landmark / Caliper Accuracy

### What it means

This checks whether the trainee placed the calipers or markers in the correct location.

### How it is calculated

The trainee gets points for correct caliper placement. The dashboard converts that into a percentage.

### Example

If the trainee scored 4 out of 5 for caliper placement:

```text
4 / 5 = 80%
```

## 8. Plane Accuracy

### What it means

Plane accuracy estimates whether the trainee acquired the correct ultrasound plane.

### How it is calculated today

The current system uses a proxy because direct image similarity is not stored yet.

It combines:

- Measurement correctness
- Overall session score

### Product note

This is a practical approximation. If future versions store direct plane/image matching data, this metric can become more precise.

## 9. Probe Handling

### What it means

Probe handling checks whether the trainee positioned and rotated the probe correctly.

### How it is calculated

The system combines:

- Probe position score
- Probe rotation score

Then it converts the result into a percentage.

### Example

If the trainee gets 7 out of 10 combined points:

```text
7 / 10 = 70%
```

## 10. Time Per Task

### What it means

Time per task shows how long the trainee takes to complete a task.

### How it is calculated

The system takes the recorded task time in seconds and converts it to minutes.

```text
Time per task = recorded seconds / 60
```

### Example

If the task took 180 seconds:

```text
180 / 60 = 3 minutes
```

## 11. Time Efficiency

### What it means

Time efficiency checks whether the trainee completed the task within the expected time.

### How it is calculated

The trainee gets a time score compared with the maximum possible time score.

### Product note

Time affects the final accuracy score, but only with 10% weight. This means being accurate is more important than being fast.

## 12. Error Rate

### What it means

Error rate is the opposite of accuracy.

### How it is calculated

```text
Error rate = 100 - accuracy
```

### Example

If accuracy is 78%:

```text
100 - 78 = 22%
```

So the error rate is 22%.

## 13. Consistency

### What it means

Consistency shows whether the trainee performs steadily across attempts.

### How it is calculated

The system checks how much the trainee's accuracy changes between attempts.

- If scores are stable, consistency is high
- If scores jump up and down, consistency is lower

### Example

A trainee scoring 78%, 80%, 79%, and 81% is consistent.

A trainee scoring 95%, 40%, 88%, and 50% is not consistent.

### Consistency labels

```text
Low
Medium
High
```

## 14. Current vs Previous Performance

### What it means

The dashboard compares recent performance with older performance.

### How it is calculated

For accuracy, error rate, and time per task:

```text
Current value = average of the last 5 attempts
Previous value = average of attempts before the last 5
```

### Example

If the trainee's last 5 attempts average 82%, and older attempts averaged 70%, the dashboard can show improvement.

### What product owners should know

The dashboard focuses more on recent performance than lifetime performance.

## 15. Skill Competency

Skill competency explains how strong the trainee is in each skill area.

Current skill areas:

- Probe Handling
- Plane Acquisition
- Image Optimisation
- Interpretation and Emotional Intelligence

## 16. Skill Score

### What it means

Each skill gets a score from 0 to 100.

### How it is calculated

The system looks at:

- Recent performance
- Overall historical performance

Recent performance is given more importance.

Current logic:

```text
Skill score = 70% recent average + 30% historical average
```

### Example

If the trainee's recent average is 80 and historical average is 70:

```text
(80 x 70%) + (70 x 30%) = 77
```

So the skill score is 77.

### What product owners should know

This makes the dashboard responsive to improvement. If a trainee gets better recently, their skill score improves faster.

## 17. Competency Levels

The numeric skill score is converted into a simple level.

```text
0 to 49 = Beginner
50 to 69 = Basic
70 to 84 = Intermediate
85 to 94 = Advanced
95 to 100 = Expert
```

### Example

If a trainee's Plane Acquisition score is 88, the dashboard shows Advanced.

## 18. Skill Trend

### What it means

Skill trend shows whether the trainee is improving, declining, or staying the same.

### How it is calculated

The system compares recent average performance with historical average performance.

```text
Recent average is more than 3 points higher = Up
Recent average is more than 3 points lower = Down
Difference within 3 points = Neutral
```

### Example

If historical average is 70 and recent average is 76:

```text
76 - 70 = +6
```

Trend is Up.

## 19. Overall Competency

### What it means

Overall competency gives one summary score for the trainee's practical skills.

### How it is calculated

The system averages all available skill scores.

### Example

If the trainee has these skill scores:

```text
Probe Handling = 80
Plane Acquisition = 70
Image Optimisation = 75
Interpretation = 65
```

Overall competency:

```text
(80 + 70 + 75 + 65) / 4 = 72.5
```

Rounded score is 73, which is Intermediate.

## 20. Weakest Skill

### What it means

Weakest skill shows the area where the trainee needs the most attention.

### How it is calculated

The system picks the skill with the lowest score.

### Example

If Interpretation has the lowest score, the dashboard can recommend more interpretation-focused practice.

## 21. Confidence Level

### What it means

Confidence tells us how reliable the skill score is.

The score is more reliable when:

- The trainee has more attempts
- The trainee's scores are stable

### How it is calculated

The system combines:

- Attempt count
- Score stability

### Confidence labels

```text
Low
Medium
High
```

### Example

A trainee with only 1 attempt may show a skill score, but confidence will be low.

A trainee with 10 attempts and stable scores will have higher confidence.

### What product owners should know

Confidence is not the trainee's performance. It is the system's reliability indicator for the performance score.

## 22. Dashboard Metric Mapping

| Dashboard metric | Simple meaning |
| --- | --- |
| Progress | How much content the trainee completed |
| Last score | Latest quiz/activity performance |
| Reattempts | Whether the trainee repeated an activity |
| Accuracy | Overall practical performance quality |
| Error rate | Remaining gap after accuracy |
| Time per task | How long the trainee takes |
| Consistency | How stable the trainee's results are |
| Skill score | Strength in one skill area |
| Skill level | Plain-language level for the skill score |
| Skill trend | Whether the skill is improving or declining |
| Weakest skill | Skill that needs the most attention |
| Confidence | How reliable the score is based on data volume and stability |

## 23. Important Product Notes

- Progress means completion, not mastery.
- Accuracy is weighted. Measurement accuracy matters most.
- Recent attempts matter more than older attempts for skill scores.
- Current performance cards use the last 5 attempts.
- Skill confidence should be shown when attempts are low.
- Plane accuracy is currently a proxy, not a direct image-matching score.
- Reattempt count may need refinement if the product wants unique retry count.

## 24. Suggested Product Copy

### Accuracy

Shows how closely the trainee performed compared with expected expert results, including measurement, landmarks, plane acquisition, probe handling, and time.

### Consistency

Shows whether the trainee performs steadily across attempts or has large variation between attempts.

### Competency

Shows the trainee's current skill level based on recent and historical performance.

### Confidence

Shows how reliable the competency score is based on how many attempts are available and how stable the scores are.

### Weakest Skill

Shows the skill area where the trainee needs the most improvement.
