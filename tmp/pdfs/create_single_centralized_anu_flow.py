from pathlib import Path
from reportlab.lib import colors
from reportlab.lib.colors import HexColor
from reportlab.lib.pagesizes import A3, landscape
from reportlab.pdfgen import canvas
from reportlab.pdfbase.pdfmetrics import stringWidth

OUT = Path('output/pdf/project-anu-single-centralized-technical-flowchart.pdf')
OUT.parent.mkdir(parents=True, exist_ok=True)
W, H = landscape(A3)

BG = HexColor('#F6FAFC'); INK = HexColor('#17313B'); MUTED = HexColor('#5B737B')
GREEN = HexColor('#DFF2D0'); GREEN_D = HexColor('#4B7D2E')
BLUE = HexColor('#DCEFF7'); BLUE_D = HexColor('#17677C')
PURPLE = HexColor('#EAE1F7'); PURPLE_D = HexColor('#684396')
AMBER = HexColor('#FFF0CE'); AMBER_D = HexColor('#986300')
RED = HexColor('#F8DEDE'); RED_D = HexColor('#9A3030')
WHITE = colors.white


def wrap(text, font, size, width):
    result = []
    for para in text.split('\n'):
        line = ''
        for word in para.split():
            candidate = word if not line else line + ' ' + word
            if stringWidth(candidate, font, size) <= width:
                line = candidate
            else:
                if line: result.append(line)
                line = word
        if line: result.append(line)
    return result


def box(c, x, y, w, h, title, body, fill, stroke, fs=10):
    c.saveState(); c.setFillColor(fill); c.setStrokeColor(stroke); c.setLineWidth(1.4)
    c.roundRect(x, y, w, h, 10, fill=1, stroke=1)
    c.setFillColor(stroke); c.setFont('Helvetica-Bold', fs)
    c.drawCentredString(x+w/2, y+h-18, title)
    c.setFillColor(INK); c.setFont('Helvetica', 8.2)
    lines = wrap(body, 'Helvetica', 8.2, w-16)
    top = y+h-34
    for i, line in enumerate(lines[:max(1, int((h-38)/10))]):
        c.drawCentredString(x+w/2, top-i*10, line)
    c.restoreState()


def arrow(c, x1, y1, x2, y2, label='', color=BLUE_D, dashed=False):
    import math
    c.saveState(); c.setStrokeColor(color); c.setFillColor(color); c.setLineWidth(1.3)
    if dashed: c.setDash(4, 3)
    c.line(x1, y1, x2, y2); angle = math.atan2(y2-y1, x2-x1); size = 7
    p = c.beginPath(); p.moveTo(x2, y2)
    p.lineTo(x2-size*math.cos(angle-.45), y2-size*math.sin(angle-.45))
    p.lineTo(x2-size*math.cos(angle+.45), y2-size*math.sin(angle+.45)); p.close()
    c.drawPath(p, fill=1, stroke=0)
    if label:
        c.setDash(); c.setFont('Helvetica-Bold', 7.5)
        c.drawCentredString((x1+x2)/2, (y1+y2)/2+4, label)
    c.restoreState()


def lane(c, x, y, w, h, title, color):
    c.setFillColor(color); c.setStrokeColor(color); c.setLineWidth(1)
    c.roundRect(x, y, w, h, 12, fill=0, stroke=1)
    c.setFillColor(color); c.setFont('Helvetica-Bold', 11); c.drawString(x+12, y+h-20, title)


def build():
    c = canvas.Canvas(str(OUT), pagesize=landscape(A3))
    c.setTitle('Project ANU Single Centralized Technical Flowchart')
    c.setAuthor('Codex')
    c.setFillColor(BG); c.rect(0, 0, W, H, fill=1, stroke=0)
    c.setFillColor(GREEN_D); c.rect(0, H-12, W, 12, fill=1, stroke=0)
    c.setFillColor(INK); c.setFont('Helvetica-Bold', 22)
    c.drawString(35, H-50, 'Project ANU - Single centralized technical flowchart')
    c.setFillColor(MUTED); c.setFont('Helvetica', 10)
    c.drawString(35, H-69, 'Admin, Instructor, Trainee and VR headset flow through authentication, LMS services, simulation, storage, streaming and analytics')

    # Swimlane frames
    lane(c, 30, 300, 250, 390, 'A. USERS / CLIENTS', PURPLE_D)
    lane(c, 300, 300, 400, 390, 'B. ANU APPLICATION / API SERVICES', BLUE_D)
    lane(c, 720, 300, 440, 390, 'C. VR DEVICE, CLOUD DATA AND COMMUNICATION', GREEN_D)

    # Left role entry points
    box(c, 50, 600, 210, 65, 'Super Admin (99)', 'Institutions, administrators, curriculum, certifications, global volumes, mappings and audit.', PURPLE, PURPLE_D, 9)
    box(c, 50, 510, 210, 65, 'Institution Admin (101)', 'Batches, instructors, trainees, schedules, approvals, institutional streams and reports.', BLUE, BLUE_D, 9)
    box(c, 50, 420, 210, 65, 'Instructor (102)', 'Assigned batches, volume and recording upload, trainee review, supervision and feedback.', AMBER, AMBER_D, 9)
    box(c, 50, 330, 210, 65, 'Trainee (103)', 'Assigned courses, theory, MindSpark, VR practice/tests, results, queries and feedback.', GREEN, GREEN_D, 9)

    # Application services central spine
    box(c, 325, 595, 350, 75, '1. Login and security gateway', 'POST /api/v1/login -> device detection -> protected email lookup -> password verification -> session + JWT access/refresh tokens -> role and institution scope.', PURPLE, PURPLE_D, 10)
    box(c, 325, 495, 350, 75, '2. RBAC and route authorization', 'JWT/session middleware checks role 99/101/102/103, account status, institution/batch scope and allowed route before every protected request.', BLUE, BLUE_D, 10)
    box(c, 325, 395, 350, 75, '3. LMS and administration services', 'Institutions -> batches -> enrollments -> curriculum -> certifications -> courses -> chapters -> modules -> resources -> schedules and content access.', GREEN, GREEN_D, 10)
    box(c, 325, 315, 350, 55, '4. Assessment and progress services', 'MindSpark, challenges, attempts, completion, scores, feedback, queries and role-specific dashboards.', AMBER, AMBER_D, 9)

    # Right technical flow
    box(c, 745, 595, 185, 75, 'VR client / headset', 'Authenticated REST calls; load assigned scenario; probe movement; plane acquisition; freeze; annotation; labelling; measurement.', GREEN, GREEN_D, 9)
    box(c, 950, 595, 185, 75, 'Web browser clients', 'React portal for admins/instructors/trainees; REST API calls; dashboards; progress; schedules; review and feedback.', BLUE, BLUE_D, 9)
    box(c, 745, 495, 185, 75, 'IIVR simulation service', 'Start/end test, task validation, scoring, measurement offset, error counts, attempt history and result submission.', AMBER, AMBER_D, 9)
    box(c, 950, 495, 185, 75, 'Live monitoring', 'Headset publishes video/audio; Amazon IVS stage; instructor/admin receives viewer token and subscribes to trainee stream.', PURPLE, PURPLE_D, 9)
    box(c, 745, 395, 185, 75, 'Volume pipeline', 'Upload .vol -> approval -> Python conversion -> .nii/.nii.gz -> placement calibration -> expert recording -> course mapping.', AMBER, AMBER_D, 9)
    box(c, 950, 395, 185, 75, 'Realtime events', 'Socket.IO activity/status events for session state, learner activity, stream status and dashboard updates.', BLUE, BLUE_D, 9)
    box(c, 745, 315, 185, 55, 'Analytics engine', 'Competency, accuracy, benchmark, readiness, remediation and reattempt recommendations.', GREEN, GREEN_D, 9)
    box(c, 950, 315, 185, 55, 'Cost points', 'API compute, database, storage, conversion CPU, downloads, IVS minutes, realtime events, logs and data transfer.', RED, RED_D, 9)

    # Connect role flows to gateway
    for y in (632, 542, 452, 362): arrow(c, 260, y, 325, 632, 'HTTPS / login', color=PURPLE_D if y == 632 else BLUE_D)
    arrow(c, 500, 595, 500, 570, 'JWT + RBAC', color=PURPLE_D)
    arrow(c, 500, 495, 500, 470, 'authorized', color=BLUE_D)
    arrow(c, 500, 395, 500, 370, 'learning data', color=GREEN_D)
    arrow(c, 675, 632, 745, 632, 'VR token / scenario', color=GREEN_D)
    arrow(c, 675, 532, 745, 532, 'simulation API', color=AMBER_D)
    arrow(c, 675, 432, 745, 432, 'volume APIs', color=AMBER_D)
    arrow(c, 675, 342, 745, 342, 'progress events', color=GREEN_D)
    arrow(c, 930, 632, 950, 632, 'browser / REST', color=BLUE_D, dashed=True)
    arrow(c, 930, 532, 950, 532, 'WebRTC / IVS', color=PURPLE_D, dashed=True)
    arrow(c, 930, 432, 950, 432, 'status events', color=BLUE_D, dashed=True)

    # Cloud/data band
    lane(c, 30, 60, 1130, 200, 'D. PERSISTENCE, PROCESSING AND OUTPUT', AMBER_D)
    box(c, 55, 155, 200, 75, 'Supabase PostgreSQL', 'Users, roles, institutions, batches, enrollments, courses, sessions, attempts, scores, logs and queries.', BLUE, BLUE_D, 9)
    box(c, 280, 155, 200, 75, 'Object storage', 'Raw .vol, converted NIfTI, images, expert recordings, submitted media and reports.', GREEN, GREEN_D, 9)
    box(c, 505, 155, 200, 75, 'Python conversion worker', 'Reads raw .vol, extracts voxel data, resamples, writes NIfTI and updates conversion status.', AMBER, AMBER_D, 9)
    box(c, 730, 155, 200, 75, 'Amazon IVS Real-Time', 'WebRTC stage, publisher token, viewer token, live headset stream and instructor monitoring.', PURPLE, PURPLE_D, 9)
    box(c, 955, 155, 180, 75, 'Dashboards / output', 'Role-specific progress, review, reports, recommendations, feedback and audit trail.', RED, RED_D, 9)
    arrow(c, 837, 395, 380, 230, color=GREEN_D, dashed=True)
    arrow(c, 837, 432, 380, 230, color=AMBER_D, dashed=True)
    arrow(c, 592, 395, 605, 230, color=AMBER_D, dashed=True)
    arrow(c, 1042, 495, 830, 230, color=PURPLE_D, dashed=True)
    arrow(c, 837, 342, 1045, 230, color=GREEN_D, dashed=True)
    arrow(c, 605, 230, 1045, 230, color=GREEN_D, dashed=True)
    arrow(c, 155, 230, 1045, 230, color=BLUE_D, dashed=True)

    c.setFillColor(MUTED); c.setFont('Helvetica', 8.5)
    c.drawString(38, 35, 'Primary flow: user role -> secure API -> authorized service -> database/object storage -> analytics/dashboard. VR flow adds headset scenario download, task submission and optional IVS live supervision.')
    c.drawRightString(W-35, 35, 'Project ANU | Single centralized technical flowchart')
    c.save(); print(OUT.resolve())


if __name__ == '__main__': build()
